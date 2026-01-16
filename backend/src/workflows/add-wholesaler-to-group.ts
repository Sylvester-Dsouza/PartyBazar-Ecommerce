import { 
  createCustomersWorkflow,
  linkCustomersToCustomerGroupWorkflow 
} from "@medusajs/medusa/core-flows"

const WHOLESALE_GROUP_ID = "cusgroup_01KESGNQJK6Y40FA8HFJX8RXD2"

// Hook into the createCustomersWorkflow to add wholesalers to the group
createCustomersWorkflow.hooks.customersCreated(
  async ({ customers }, { container }) => {
    console.log("🎯 Customer creation hook triggered for", customers.length, "customer(s)")
    
    for (const customer of customers) {
      console.log(`Checking customer ${customer.id}:`, {
        email: customer.email,
        metadata: customer.metadata
      })
      
      // Check if customer has wholesaler metadata flag
      if (customer.metadata?.is_wholesaler === true) {
        console.log(`✅ Customer ${customer.id} is a wholesaler, adding to Wholesale group...`)
        
        try {
          // Use the built-in workflow to link customer to customer group
          await linkCustomersToCustomerGroupWorkflow(container).run({
            input: {
              id: WHOLESALE_GROUP_ID,
              add: [customer.id],
            },
          })

          console.log(`✅ Successfully added customer ${customer.id} to Wholesale group`)
        } catch (error) {
          console.error(`❌ Failed to add customer ${customer.id} to Wholesale group:`, error)
        }
      } else {
        console.log(`ℹ️ Customer ${customer.id} is not a wholesaler (metadata.is_wholesaler = ${customer.metadata?.is_wholesaler})`)
      }
    }
  }
)
