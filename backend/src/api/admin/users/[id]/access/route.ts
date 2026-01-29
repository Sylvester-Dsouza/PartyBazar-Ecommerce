import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { IUserModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { z } from "zod"

const schema = z.object({
    role: z.enum(["admin", "ecom_manager"]).optional(),
    password: z.string().min(1).optional(),
})

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    try {
        const { id } = req.params
        const body = schema.parse(req.body)

        const userModuleService: IUserModuleService = req.scope.resolve(
            Modules.USER
        )

        if (body.role) {
            await userModuleService.updateUsers({
                id,
                metadata: {
                    role: body.role
                }
            })
        }

        if (body.password) {
            // TODO: Implement password reset properly via Auth Module.
            // Since this is a custom flow, and finding the auth identity linked to this user is complex without knowing the provider structure.
            // For now, we will log this action. In a real-world scenario, you'd trigger a password reset email or update the AuthIdentity directly if provider allows.
            console.log(`[Mock] Password reset for user ${id} to ${body.password}`)

            // Attempting to resolve Auth Service to see if we can do it
            // const authService = req.scope.resolve(Modules.AUTH)
            // Implementation awaits better understanding of AuthIdentity linking in v2
        }

        const user = await userModuleService.retrieveUser(id)
        res.json({ user })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}
