import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { z } from "zod"
import { VENDOR_MODULE } from "../../../../modules/vendor"
import VendorModuleService from "../../../../modules/vendor/service"

const UpdateVendorSchema = z.object({
    name: z.string().min(1).optional(),
    handle: z.string().min(1).regex(/^[a-z0-9-]+$/).optional(),
    description: z.string().nullable().optional(),
    logo: z.string().nullable().optional(),
    website: z.string().nullable().optional(),
    email: z.string().email().nullable().optional(),
    phone: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    is_active: z.boolean().optional(),
})

/**
 * GET /admin/vendors/:id
 * Get a single vendor
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const { id } = req.params
    const vendorService: VendorModuleService = req.scope.resolve(VENDOR_MODULE)

    const vendor = await vendorService.retrieveVendor(id)

    if (!vendor) {
        throw new MedusaError(MedusaError.Types.NOT_FOUND, `Vendor ${id} not found`)
    }

    res.json({
        vendor,
    })
}

/**
 * PUT /admin/vendors/:id
 * Update a vendor
 */
export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
    const { id } = req.params
    const validated = UpdateVendorSchema.parse(req.body)
    const vendorService: VendorModuleService = req.scope.resolve(VENDOR_MODULE)

    const vendor = await vendorService.updateVendors({ id, ...validated })

    res.json({
        vendor,
    })
}

/**
 * DELETE /admin/vendors/:id
 * Delete a vendor
 */
export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
    const { id } = req.params
    const vendorService: VendorModuleService = req.scope.resolve(VENDOR_MODULE)

    await vendorService.deleteVendors(id)

    res.status(200).json({
        id,
        deleted: true,
    })
}
