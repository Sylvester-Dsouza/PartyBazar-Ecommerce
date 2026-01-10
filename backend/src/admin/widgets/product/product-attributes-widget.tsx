import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Button, Text, toast, Drawer, IconButton, Input, Label } from "@medusajs/ui"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { PencilSquare } from "@medusajs/icons"

const ProductAttributesWidget = () => {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState<any>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  
  // Current saved values
  const [attributes, setAttributes] = useState({
    color: "",
    size: "",
    material: "",
    gas: "",
    country_of_origin: "",
    gas_cost: "",
  })
  
  // Temporary values in drawer
  const [tempAttributes, setTempAttributes] = useState({
    color: "",
    size: "",
    material: "",
    gas: "",
    country_of_origin: "",
    gas_cost: "",
  })

  // Fetch product data to get existing attributes
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/admin/products/${id}`, {
          credentials: "include",
        })
        const data = await response.json()
        
        setProduct(data.product)
        
        const attrs = {
          color: (data.product?.metadata?.color as string) || "",
          size: (data.product?.metadata?.size as string) || "",
          material: (data.product?.metadata?.material as string) || "",
          gas: (data.product?.metadata?.gas as string) || "",
          country_of_origin: (data.product?.metadata?.country_of_origin as string) || "",
          gas_cost: (data.product?.metadata?.gas_cost as string) || "",
        }
        
        setAttributes(attrs)
        setTempAttributes(attrs)
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  const handleOpenDrawer = () => {
    setTempAttributes(attributes)
    setDrawerOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)

    try {
      const currentMetadata = product?.metadata || {}

      const response = await fetch(`/admin/products/${id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metadata: {
            ...currentMetadata,
            color: tempAttributes.color || null,
            size: tempAttributes.size || null,
            material: tempAttributes.material || null,
            gas: tempAttributes.gas || null,
            country_of_origin: tempAttributes.country_of_origin || null,
            gas_cost: tempAttributes.gas_cost || null,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save product attributes")
      }

      setAttributes(tempAttributes)
      setDrawerOpen(false)
      
      toast.success("Success", {
        description: "Product attributes saved successfully",
      })
    } catch (error) {
      console.error("Error saving product attributes:", error)
      toast.error("Error", {
        description: "Failed to save product attributes. Please try again.",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setTempAttributes(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  if (loading) {
    return (
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h2">Product Attributes</Heading>
        </div>
        <div className="px-6 py-4">
          <Text className="text-ui-fg-subtle">Loading...</Text>
        </div>
      </Container>
    )
  }

  const hasAttributes = Object.values(attributes).some(val => val !== "")

  return (
    <>
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h2">Product Attributes</Heading>
          <IconButton onClick={handleOpenDrawer} variant="transparent">
            <PencilSquare />
          </IconButton>
        </div>
        <div className="px-6 py-4">
          {hasAttributes ? (
            <div className="grid grid-cols-2 gap-4">
              {attributes.color && (
                <div>
                  <Text className="text-ui-fg-subtle text-xs">Color</Text>
                  <Text className="text-sm">{attributes.color}</Text>
                </div>
              )}
              {attributes.size && (
                <div>
                  <Text className="text-ui-fg-subtle text-xs">Size</Text>
                  <Text className="text-sm">{attributes.size}</Text>
                </div>
              )}
              {attributes.material && (
                <div>
                  <Text className="text-ui-fg-subtle text-xs">Material</Text>
                  <Text className="text-sm">{attributes.material}</Text>
                </div>
              )}
              {attributes.gas && (
                <div>
                  <Text className="text-ui-fg-subtle text-xs">Gas</Text>
                  <Text className="text-sm">{attributes.gas}</Text>
                </div>
              )}
              {attributes.country_of_origin && (
                <div>
                  <Text className="text-ui-fg-subtle text-xs">Country of Origin</Text>
                  <Text className="text-sm">{attributes.country_of_origin}</Text>
                </div>
              )}
              {attributes.gas_cost && (
                <div>
                  <Text className="text-ui-fg-subtle text-xs">Gas Cost</Text>
                  <Text className="text-sm">{attributes.gas_cost}</Text>
                </div>
              )}
            </div>
          ) : (
            <Text className="text-ui-fg-subtle">-</Text>
          )}
        </div>
      </Container>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Edit Product Attributes</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  type="text"
                  placeholder="Enter color"
                  value={tempAttributes.color}
                  onChange={(e) => handleInputChange("color", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="size">Size</Label>
                <Input
                  id="size"
                  type="text"
                  placeholder="Enter size"
                  value={tempAttributes.size}
                  onChange={(e) => handleInputChange("size", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="material">Material</Label>
                <Input
                  id="material"
                  type="text"
                  placeholder="Enter material"
                  value={tempAttributes.material}
                  onChange={(e) => handleInputChange("material", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gas">Gas</Label>
                <Input
                  id="gas"
                  type="text"
                  placeholder="Enter gas type"
                  value={tempAttributes.gas}
                  onChange={(e) => handleInputChange("gas", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country_of_origin">Country of Origin</Label>
                <Input
                  id="country_of_origin"
                  type="text"
                  placeholder="Enter country of origin"
                  value={tempAttributes.country_of_origin}
                  onChange={(e) => handleInputChange("country_of_origin", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gas_cost">Gas Cost</Label>
                <Input
                  id="gas_cost"
                  type="text"
                  placeholder="Enter gas cost"
                  value={tempAttributes.gas_cost}
                  onChange={(e) => handleInputChange("gas_cost", e.target.value)}
                />
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
  zone: "product.details.after",
})

export default ProductAttributesWidget
