import { model } from "@medusajs/framework/utils"

const Vendor = model.define("vendor", {
    id: model.id().primaryKey(),
    name: model.text(),
    handle: model.text().unique(),
    description: model.text().nullable(),
    logo: model.text().nullable(),
    website: model.text().nullable(),
    email: model.text().nullable(),
    phone: model.text().nullable(),
    address: model.text().nullable(),
    is_active: model.boolean().default(true),
})

export default Vendor
