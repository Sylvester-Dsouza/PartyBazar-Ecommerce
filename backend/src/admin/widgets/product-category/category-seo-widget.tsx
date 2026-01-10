import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Button, Text, toast, Drawer, IconButton, Input, Textarea, Label } from "@medusajs/ui"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { PencilSquare } from "@medusajs/icons"

const CategorySEOWidget = () => {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<any>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  
  // Current saved values
  const [metaTitle, setMetaTitle] = useState<string>("")
  const [metaDescription, setMetaDescription] = useState<string>("")
  
  // Temporary values in drawer
  const [tempMetaTitle, setTempMetaTitle] = useState<string>("")
  const [tempMetaDescription, setTempMetaDescription] = useState<string>("")

  // Fetch category data to get existing SEO metadata
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`/admin/product-categories/${id}`, {
          credentials: "include",
        })
        const data = await response.json()
        
        setCategory(data.product_category)
        
        const meta_title = (data.product_category?.metadata?.meta_title as string) || ""
        const meta_description = (data.product_category?.metadata?.meta_description as string) || ""
        
        setMetaTitle(meta_title)
        setMetaDescription(meta_description)
        setTempMetaTitle(meta_title)
        setTempMetaDescription(meta_description)
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
    setTempMetaTitle(metaTitle)
    setTempMetaDescription(metaDescription)
    setDrawerOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)

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
            meta_title: tempMetaTitle || null,
            meta_description: tempMetaDescription || null,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save SEO metadata")
      }

      setMetaTitle(tempMetaTitle)
      setMetaDescription(tempMetaDescription)
      setDrawerOpen(false)
      
      toast.success("Success", {
        description: "SEO metadata saved successfully",
      })
    } catch (error) {
      console.error("Error saving SEO metadata:", error)
      toast.error("Error", {
        description: "Failed to save SEO metadata. Please try again.",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h2">SEO</Heading>
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
          <Heading level="h2">SEO</Heading>
          <IconButton onClick={handleOpenDrawer} variant="transparent">
            <PencilSquare />
          </IconButton>
        </div>
        <div className="px-6 py-4 space-y-2">
          <div>
            <Text className="text-ui-fg-subtle text-xs">Meta Title</Text>
            <Text className="text-sm">
              {metaTitle || "-"}
            </Text>
          </div>
          <div>
            <Text className="text-ui-fg-subtle text-xs">Meta Description</Text>
            <Text className="text-sm">
              {metaDescription || "-"}
            </Text>
          </div>
        </div>
      </Container>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Edit SEO</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="meta-title">Meta Title</Label>
                <Input
                  id="meta-title"
                  type="text"
                  placeholder="Enter meta title"
                  value={tempMetaTitle}
                  onChange={(e) => setTempMetaTitle(e.target.value)}
                  maxLength={60}
                />
                <Text className="text-ui-fg-subtle text-xs">
                  {tempMetaTitle.length}/60 characters
                </Text>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta-description">Meta Description</Label>
                <Textarea
                  id="meta-description"
                  placeholder="Enter meta description"
                  value={tempMetaDescription}
                  onChange={(e) => setTempMetaDescription(e.target.value)}
                  maxLength={160}
                  rows={4}
                />
                <Text className="text-ui-fg-subtle text-xs">
                  {tempMetaDescription.length}/160 characters
                </Text>
              </div>
            </div>
          </Drawer.Body>
          <Drawer.Footer>
            <div className="flex items-center gap-2 justify-end">
              <Button 
                variant="secondary" 
                onClick={() => setDrawerOpen(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>
    </>
  )
}

export const config = defineWidgetConfig({
  zone: "product_category.details.after",
})

export default CategorySEOWidget
