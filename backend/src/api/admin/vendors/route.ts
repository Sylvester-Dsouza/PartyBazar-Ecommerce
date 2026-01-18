import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { VENDOR_MODULE } from "../../../modules/vendor"
import VendorModuleService from "../../../modules/vendor/service"

const CreateVendorSchema = z.object({
    name: z.string().min(1, "Name is required"),
    handle: z.string().min(1, "Handle is required").regex(/^[a-z0-9-]+$/, "Handle must be lowercase with hyphens only"),
    description: z.string().nullable().optional(),
    logo: z.string().nullable().optional(),
    website: z.string().nullable().optional(),
    email: z.string().email().nullable().optional().or(z.literal("")),
    phone: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    is_active: z.boolean().optional().default(true),
})

/**
 * GET /admin/vendors
 * List all vendors
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const vendorService: VendorModuleService = req.scope.resolve(VENDOR_MODULE)

    const vendors = await vendorService.listVendors({})

    res.json({
        vendors,
    })
}

/**
 * POST /admin/vendors
 * Create a new vendor
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const validated = CreateVendorSchema.parse(req.body)
    const vendorService: VendorModuleService = req.scope.resolve(VENDOR_MODULE)

    const vendor = await vendorService.createVendors(validated)

    res.status(201).json({
        vendor,
    })
}
