const domain = 'phases-handcrafted.myshopify.com';
const token = 'a2bd8a33968841707321d99868f3a3de';

async function run() {
  const query = `
    query getProducts {
      products(first: 10) {
        edges {
          node {
            id
            title
            productType
            tags
          }
        }
      }
    }
  `;
  const endpoint = `https://${domain}/api/2024-01/graphql.json`;
  const result = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token
    },
    body: JSON.stringify({ query })
  });
  const body = await result.json();
  console.log(JSON.stringify(body, null, 2));
}
run();
