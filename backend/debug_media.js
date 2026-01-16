const axios = require('axios');

const MEDUSA_API_URL = 'http://localhost:9000';
const EMAIL = 'migration@partybazar.com';
const PASSWORD = 'migration123';

async function run() {
    try {
        // 1. Auth
        console.log('Authenticating...');
        const authRes = await axios.post(`${MEDUSA_API_URL}/auth/user/emailpass`, {
            email: EMAIL,
            password: PASSWORD
        });

        const token = authRes.data.access_token || authRes.data.token;
        if (!token) return console.error("No token");

        // 2. Fetch Images directly
        console.log('Fetching Images to check metadata capability...');
        const prodRes = await axios.get(`${MEDUSA_API_URL}/admin/products?limit=1&fields=id,images.*`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const product = prodRes.data.products[0];
        if (product?.images?.length > 0) {
            console.log('First Image Object:', JSON.stringify(product.images[0], null, 2));
        } else {
            console.log('No products with images found to inspect.');
        }
    } catch (e) {
        if (e.response) {
            console.error('Status:', e.response.status);
            console.error('Data:', JSON.stringify(e.response.data, null, 2));
        } else {
            console.error('Error:', e.message);
            console.error(e.stack);
        }
    }
}

run();
