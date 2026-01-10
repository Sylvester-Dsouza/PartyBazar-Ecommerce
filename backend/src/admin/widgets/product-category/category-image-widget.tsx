import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Button, Text, toast, Drawer, IconButton } from "@medusajs/ui"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { PencilSquare, Trash } from "@medusajs/icons"

const CategoryImageWidget = () => {
  const { id } = useParams()
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<any>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null)

  // Fetch category data to get existing image
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`/admin/product-categories/${id}`, {
          credentials: "include",
        })
        const data = await response.json()
        
        setCategory(data.product_category)
        if (data.product_category?.metadata?.image_url) {
          const url = data.product_category.metadata.image_url as string
          setImageUrl(url)
          setTempImageUrl(url)
        }
      } catch (error) {
        console.error("Error fetching category:", error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCategory()
    }
  }, [id])

  const handleOpenDrawer = () => {
    setTempImageUrl(imageUrl)
    setDrawerOpen(true)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Error", {
        description: "Please upload an image file",
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Error", {
        description: "Image size should be less than 5MB",
      })
      return
    }

    setUploading(true)

    try {
      // Step 1: Upload file using Medusa's file service
      const formData = new FormData()
      formData.append("files", file)

      const uploadResponse = await fetch("/admin/uploads", {
        method: "POST",
        credentials: "include",
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file to storage")
      }

      const uploadData = await uploadResponse.json()
      console.log("Upload response:", uploadData)

      // Extract URL from response - try different possible formats
      let uploadedImageUrl = null
      
      if (uploadData.uploads && Array.isArray(uploadData.uploads) && uploadData.uploads.length > 0) {
        uploadedImageUrl = uploadData.uploads[0].url
      } else if (uploadData.files && Array.isArray(uploadData.files) && uploadData.files.length > 0) {
        uploadedImageUrl = uploadData.files[0].url
      } else if (uploadData.url) {
        uploadedImageUrl = uploadData.url
      }

      if (!uploadedImageUrl) {
        console.error("Upload response structure:", uploadData)
        throw new Error("Could not find image URL in upload response")
      }

      // Step 2: Get current category metadata
      const currentMetadata = category?.metadata || {}

      // Step 3: Update category with image URL in metadata
      const updateResponse = await fetch(`/admin/product-categories/${id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metadata: {
            ...currentMetadata,
            image_url: uploadedImageUrl,
          },
        }),
      })

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json().catch(() => ({}))
        console.error("Update error:", errorData)
        throw new Error("Failed to update category metadata")
      }

      setImageUrl(uploadedImageUrl)
      toast.success("Success", {
        description: "Category image uploaded successfully",
      })
    } catch (error) {
      console.error("Error uploading image:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to upload image. Please try again."
      toast.error("Error", {
        description: errorMessage,
      })
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    if (!tempImageUrl) {
      toast.error("Error", {
        description: "Please upload an image first",
      })
      return
    }

    try {
      const currentMetadata = category?.metadata || {}

      const response = await fetch(`/admin/product-categories/${id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metadata: {
            ...currentMetadata,
            image_url: tempImageUrl,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save image")
      }

      setImageUrl(tempImageUrl)
      setDrawerOpen(false)
      toast.success("Success", {
        description: "Category image saved successfully",
      })
    } catch (error) {
      console.error("Error saving image:", error)
      toast.error("Error", {
        description: "Failed to save image. Please try again.",
      })
    }
  }

  const handleRemoveImage = async () => {
    try {
      const currentMetadata = category?.metadata || {}

      const response = await fetch(`/admin/product-categories/${id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metadata: {
            ...currentMetadata,
            image_url: null,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to remove image")
      }

      setImageUrl(null)
      setTempImageUrl(null)
      toast.success("Success", {
        description: "Category image removed successfully",
      })
    } catch (error) {
      console.error("Error removing image:", error)
      toast.error("Error", {
        description: "Failed to remove image. Please try again.",
      })
    }
  }

  if (loading) {
    return (
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h2">Category Image</Heading>
        </div>
        <div className="px-6 py-4">
          <Text className="text-ui-fg-subtle">Loading...</Text>
        </div>
      </Container>
    )
  }

  return (
    <>
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h2">Category Image</Heading>
          <IconButton onClick={handleOpenDrawer} variant="transparent">
            <PencilSquare />
          </IconButton>
        </div>
        <div className="px-6 py-4">
          {imageUrl ? (
            <div className="flex items-center gap-4">
              <img
                src={imageUrl}
                alt="Category"
                className="w-16 h-16 object-cover rounded-lg border border-ui-border-base"
              />
              <Text className="text-ui-fg-subtle text-sm">Image uploaded</Text>
            </div>
          ) : (
            <Text className="text-ui-fg-subtle">-</Text>
          )}
        </div>
      </Container>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Edit Category Image</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body className="p-6">
            <div className="space-y-6">
              {tempImageUrl ? (
                <div className="space-y-4">
                  <div className="relative w-full">
                    <img
                      src={tempImageUrl}
                      alt="Category"
                      className="w-full h-64 object-cover rounded-lg border border-ui-border-base"
                    />
                  </div>
                  <div className="flex gap-2">
                    <label htmlFor="drawer-image-upload" className="flex-1">
                      <Button variant="secondary" className="w-full" asChild disabled={uploading}>
                        <span>
                          {uploading ? "Uploading..." : "Change Image"}
                        </span>
                      </Button>
                      <input
                        id="drawer-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                    <Button
                      variant="danger"
                      onClick={handleRemoveImage}
                      disabled={uploading}
                    >
                      <Trash />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Text className="text-ui-fg-subtle">
                    Upload an image for this category. Recommended size: 800x800px
                  </Text>
                  <label htmlFor="drawer-image-upload">
                    <Button variant="secondary" asChild disabled={uploading}>
                      <span>
                        {uploading ? "Uploading..." : "Upload Image"}
                      </span>
                    </Button>
                    <input
                      id="drawer-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>
              )}
            </div>
          </Drawer.Body>
          <Drawer.Footer>
            <div className="flex items-center gap-2 justify-end">
              <Button variant="secondary" onClick={() => setDrawerOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={uploading || !tempImageUrl}>
                Save
              </Button>
            </div>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>
    </>
  )
}

export const config = defineWidgetConfig({
  zone: "product_category.details.side.after",
})

export default CategoryImageWidget
