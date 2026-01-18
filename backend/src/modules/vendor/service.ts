import { MedusaService } from "@medusajs/framework/utils"
import { Vendor } from "./models"

class VendorModuleService extends MedusaService({
    Vendor,
}) {
    /**
     * Get vendor by handle
     */
    async getVendorByHandle(handle: string) {
        const [vendor] = await this.listVendors({ handle }) as any[]
        return vendor || null
    }

    /**
     * Get all active vendors
     */
    async getActiveVendors() {
        return this.listVendors({ is_active: true })
    }
}

export default VendorModuleService
