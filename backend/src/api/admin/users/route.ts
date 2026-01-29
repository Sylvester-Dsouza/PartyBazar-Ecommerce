import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { IUserModuleService, IAuthModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { z } from "zod"

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "Password is required"),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    role: z.enum(["admin", "ecom_manager"]).optional().default("ecom_manager"),
})

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    try {
        console.log("Received payload:", req.body)
        const body = schema.parse(req.body)

        const userModuleService: IUserModuleService = req.scope.resolve(
            Modules.USER
        )
        const authModuleService: IAuthModuleService = req.scope.resolve(
            Modules.AUTH
        )

        // 1. Create User Profile
        const userData = {
            email: body.email,
            first_name: body.first_name,
            last_name: body.last_name,
            metadata: {
                role: body.role
            }
        }
        const user = await userModuleService.createUsers(userData)

        // 2. Create Auth Identity via Register
        // This handles hashing and provider logic
        try {
            const authResponse = await authModuleService.register("emailpass", {
                body: {
                    email: body.email,
                    password: body.password
                }
            })

            if (!authResponse.success || !authResponse.authIdentity) {
                throw new Error(authResponse.error || "Failed to create auth identity")
            }

            // 3. Link Auth Identity to User
            // In v2, we store the user_id in app_metadata to link them
            await authModuleService.updateAuthIdentities([{
                id: authResponse.authIdentity.id,
                app_metadata: {
                    user_id: user.id
                }
            }])

            console.log(`Created user ${user.id} and linked auth identity ${authResponse.authIdentity.id}`)

        } catch (authError: any) {
            console.error("Failed to create auth identity:", authError)
            // Rollback user creation? For now, we return error but user might persist.
            // Ideally we should delete the user if auth creation fails.
            await userModuleService.deleteUsers([user.id])
            throw new Error(`Failed to create password login: ${authError.message}`)
        }

        res.json({ user })
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            console.error("Validation error:", JSON.stringify(error.errors, null, 2))
            res.status(400).json({
                message: "Validation error: " + error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', '),
                errors: error.errors
            })
            return
        }
        console.error("Server error:", error)
        res.status(500).json({ message: error.message })
    }
}
