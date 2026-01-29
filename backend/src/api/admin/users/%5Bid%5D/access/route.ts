import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { IUserModuleService, IAuthModuleService } from "@medusajs/framework/types"
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
            const authModuleService: IAuthModuleService = req.scope.resolve(
                Modules.AUTH
            )

            const user = await userModuleService.retrieveUser(id)
            const email = user.email.toLowerCase() // Force lowercase for consistency

            try {
                console.log(`Attempting password reset for ${email}`)
                let success = false

                // 1. Try generic update first (cleanest)
                const updateRes = await authModuleService.updateProvider("emailpass", {
                    entity_id: email,
                    password: body.password
                })

                // 2. Verify immediately
                try {
                    const authRes = await authModuleService.authenticate("emailpass", {
                        body: { email, password: body.password }
                    })
                    if (authRes.success) {
                        success = true
                        console.log("Password updated and verified via updateProvider")
                    }
                } catch (e) {
                    console.log("Verification failed after update, trying register...")
                }

                // 3. If update failed (likely identity missing), Register
                if (!success) {
                    console.log("Identity missing or update failed, registering new...")
                    // Cleanup any partial state?
                    const existing = await authModuleService.listAuthIdentities({
                        provider_identities: { entity_id: email, provider: "emailpass" }
                    })
                    if (existing.length) {
                        await authModuleService.deleteAuthIdentities(existing.map(i => i.id))
                    }

                    const regRes = await authModuleService.register("emailpass", {
                        body: { email, password: body.password }
                    })

                    if (!regRes.success) throw new Error(regRes.error || "Registration failed")
                    console.log("Registered new identity")
                }

                // 4. Final Link Check
                // Get the identity again cleanly to ensure link
                const finalAuthRes = await authModuleService.authenticate("emailpass", {
                    body: { email, password: body.password }
                })

                if (!finalAuthRes.success || !finalAuthRes.authIdentity) {
                    throw new Error("Final verification failed. Password was not set correctly.")
                }

                const identity = finalAuthRes.authIdentity
                if (identity.app_metadata?.user_id !== user.id) {
                    console.log("Repairing User Link...")
                    await authModuleService.updateAuthIdentities([{
                        id: identity.id,
                        app_metadata: { user_id: user.id }
                    }])
                }

                console.log(`Password reset and linked successfully for ${email}`)

            } catch (authError: any) {
                console.error("Failed to reset password:", authError)
                throw new Error(`Failed to reset password: ${authError.message}`)
            }
        }

        const user = await userModuleService.retrieveUser(id)
        res.json({ user })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}
