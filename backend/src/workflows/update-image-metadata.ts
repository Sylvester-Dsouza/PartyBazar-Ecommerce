
import {
    createStep,
    createWorkflow,
    WorkflowResponse,
    StepResponse
} from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

// Step 1: Update File Metadata
// We use the 'file' module (or 'link' module?).
// In Medusa V2, 'Image' is often part of the Product Module (ProductImage) OR
// it's a File in the File Module.
// But the Product Service holds the relation.
// If we want the Alt Text to show up on the Product, we typically update the ProductImage.
// Let's assume we are updating the 'ProductImage' metadata via the Product Module.

type UpdateImageInput = {
    file_url: string
    alt_text: string
}

export const updateImageMetadataStep = createStep(
    "update-image-metadata-step",
    async (input: UpdateImageInput, { container }) => {
        const remoteQuery = container.resolve("remoteQuery")
        const productModuleService = container.resolve(Modules.PRODUCT)

        // 1. Find all products using this image URL
        // We need to query products that have this image.
        const query = {
            entryPoint: "product",
            fields: ["id", "images.id", "images.url", "images.metadata"],
            variables: {
                filters: {
                    images: {
                        url: input.file_url
                    }
                }
            }
        };

        const result = await remoteQuery(query);
        const products = result.rows || result;

        const updates = []

        for (const product of products) {
            // Find specific image object to update
            const imageToUpdate = product.images.find((img: any) => img.url === input.file_url)

            if (imageToUpdate) {
                // We update the product BUT only modifying one of its images.
                // The Product Module 'update' method handles images.
                // If we pass 'images' array with 'id' and 'metadata', it SHOULD update the existing image metadata without duplicating.
                // We need to confirm this behavior, but it's standard relation handling.

                // Construct the new images array for the product
                // We must keep other images intact. 
                // Ideally we just send the one we want to update if the module supports partial update of collections?
                // Usually it's safer to send existing IDs.

                const updatedImages = product.images.map((img: any) => {
                    if (img.id === imageToUpdate.id) {
                        return {
                            id: img.id,
                            metadata: {
                                ...(img.metadata || {}),
                                alt_text: input.alt_text
                            }
                        }
                    }
                    return { id: img.id } // Just ID keeps the others
                })

                updates.push(
                    productModuleService.updateProducts(product.id, {
                        images: updatedImages
                    })
                )
            }
        }

        await Promise.all(updates)

        return new StepResponse({ count: updates.length })
    }
)

export const updateImageMetadataWorkflow = createWorkflow(
    "update-image-metadata",
    (input: UpdateImageInput) => {
        const result = updateImageMetadataStep(input)
        return new WorkflowResponse(result)
    }
)
