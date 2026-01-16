import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { S3Client, ListObjectsV2Command, DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_REGION, S3_BUCKET, S3_ENDPOINT, S3_FILE_URL } from "../../../lib/constants";

// Initialize S3 Client
const s3Client = new S3Client({
    region: S3_REGION,
    endpoint: S3_ENDPOINT,
    credentials: {
        accessKeyId: S3_ACCESS_KEY_ID || '',
        secretAccessKey: S3_SECRET_ACCESS_KEY || '',
    },
    forcePathStyle: true, // Required for Supabase/MinIO
});

import { updateImageMetadataWorkflow } from "../../../workflows/update-image-metadata";

export async function GET(
    req: MedusaRequest,
    res: MedusaResponse
) {
    try {
        const command = new ListObjectsV2Command({
            Bucket: S3_BUCKET,
            // Optional: Add Prefix based on query param for folders
            Prefix: req.query.prefix as string || '',
        });

        const data = await s3Client.send(command);

        // Map contents to a friendlier format
        const files = data.Contents?.map(item => ({
            key: item.Key,
            url: `${S3_FILE_URL}/${item.Key}`, // Construct public URL
            last_modified: item.LastModified,
            size: item.Size,
            etag: item.ETag,
            usage: [] as any[] // Initialize usage
        })).sort((a, b) => {
            const dateA = a.last_modified ? new Date(a.last_modified).getTime() : 0;
            const dateB = b.last_modified ? new Date(b.last_modified).getTime() : 0;
            return dateB - dateA; // Descending order (Newest first)
        }) || [];

        // -- Usage Tracking (Products) --
        if (files.length > 0) {
            try {
                const remoteQuery = req.scope.resolve("remoteQuery");
                const urls = files.map(f => f.url);

                const query = {
                    entryPoint: "product",
                    fields: ["id", "title", "handle", "images.url"],
                    variables: {
                        take: 5000,
                        filters: {
                            id: { $ne: null }
                        }
                    }
                };

                const result = await remoteQuery(query);
                // Handle different return shapes: { rows: [] }, { product: [] }, or just []
                const products = Array.isArray(result) ? result : (result.rows || result.product || []);

                // Fetch Categories
                const catQuery = {
                    entryPoint: "product_category",
                    fields: ["id", "name", "handle", "metadata"],
                    variables: {
                        take: 5000,
                        filters: {
                            id: { $ne: null }
                        }
                    }
                };
                const catResult = await remoteQuery(catQuery);
                const categories = Array.isArray(catResult) ? catResult : (catResult.rows || catResult.product_category || []);

                console.log(`[MediaRoute] Fetched ${products?.length} products, ${categories?.length} categories.`);

                // Map usages back to files
                if (products || categories) {
                    files.forEach(file => {
                        // Product Usage
                        const matchedProducts = products?.filter((p: any) =>
                            p.images?.some((img: any) => {
                                if (!img.url) return false;

                                const imgUrl = decodeURIComponent(img.url);
                                const fileUrl = decodeURIComponent(file.url);
                                const fileKey = decodeURIComponent(file.key);

                                return imgUrl === fileUrl ||
                                    (fileKey && imgUrl.includes(fileKey)) ||
                                    (imgUrl && fileUrl.includes(imgUrl));
                            })
                        ) || [];

                        // Category Usage (metadata.image_url)
                        const matchedCategories = categories?.filter((c: any) => {
                            const imgUrl = c.metadata?.image_url as string;
                            if (!imgUrl) return false;

                            const decodedImgUrl = decodeURIComponent(imgUrl);
                            const fileUrl = decodeURIComponent(file.url);
                            const fileKey = decodeURIComponent(file.key);

                            return decodedImgUrl === fileUrl ||
                                (fileKey && decodedImgUrl.includes(fileKey)) ||
                                (decodedImgUrl && fileUrl.includes(decodedImgUrl));
                        }) || [];

                        if (matchedProducts.length > 0 || matchedCategories.length > 0) {
                            file.usage = [
                                ...matchedProducts.map((p: any) => ({
                                    type: 'product',
                                    id: p.id,
                                    title: p.title,
                                    handle: p.handle,
                                    link: `/products/${p.id}`
                                })),
                                ...matchedCategories.map((c: any) => ({
                                    type: 'category',
                                    id: c.id,
                                    title: c.name, // Categories have 'name', products have 'title'
                                    handle: c.handle,
                                    link: `/categories/${c.id}`
                                }))
                            ];
                        }
                    });
                }

            } catch (err) {
                console.error("Usage Tracking Error:", err);
            }
        }

        res.json({
            files,
            count: data.KeyCount,
            prefix: data.Prefix
        });
    } catch (error: any) {
        console.error("S3 List Error:", error);
        res.status(500).json({ message: "Failed to list files", error: error.message });
    }
}

export async function DELETE(
    req: MedusaRequest,
    res: MedusaResponse
) {
    const { key } = req.body as { key: string };

    if (!key) {
        res.status(400).json({ message: "File key is required" });
        return;
    }

    try {
        const command = new DeleteObjectCommand({
            Bucket: S3_BUCKET,
            Key: key,
        });

        await s3Client.send(command);

        res.json({ message: "File deleted successfully", key });
    } catch (error) {
        console.error("S3 Delete Error:", error);
        res.status(500).json({ message: "Failed to delete file", error: error.message });
    }
}

export async function PUT(
    req: MedusaRequest,
    res: MedusaResponse
) {
    const { key, url, alt } = req.body as { key: string, url: string, alt: string };

    if (!key || !url) {
        res.status(400).json({ message: "File key and url are required" });
        return;
    }

    try {
        console.log(`[Media] Updating Alt Text for ${key} -> ${alt}`);

        // 1. Update S3 Object Metadata (Optional, good for persistence)
        // Note: S3 requires CopyObject to update metadata. We'll skip this heavy op to be fast 
        // and rely on Medusa DB for the active usage. 
        // If we strictly wanted S3 persistence, we'd do a CopyObject to self with new Metadata.

        // 2. Update Medusa Image Service
        // We need to find all Image entities with this URL and update their metadata.
        const remoteQuery = req.scope.resolve("remoteQuery");

        // 2. Execute Workflow to Persist
        // Switched to static import to avoid runtime resolution issues
        const { result: workflowResult } = await updateImageMetadataWorkflow(req.scope).run({
            input: {
                file_url: url,
                alt_text: alt
            }
        });

        res.json({ message: "Alt text updated", count: workflowResult.count });
    } catch (error: any) {
        console.error("Metadata Update Error:", error);
        res.status(500).json({ message: "Failed to update metadata", error: error.message });
    }
}
