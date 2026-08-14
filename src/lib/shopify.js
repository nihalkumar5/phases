const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export async function shopifyFetch({ query, variables }) {
  const endpoint = `https://${domain}/api/2024-01/graphql.json`;
  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken
      },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store' // Ensure dynamic data for cart operations
    });

    const body = await result.json();

    if (body.errors) {
      console.error(body.errors);
      throw new Error(body.errors[0].message);
    }
    return { status: result.status, body };
  } catch (error) {
    console.error('Error:', error);
    return { status: 500, error: 'Error receiving data' };
  }
}

export async function getProducts() {
  const query = `
    query getProducts {
      products(first: 100) {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            tags
            productType
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  availableForSale
                }
              }
            }
          }
        }
      }
    }
  `;
  const response = await shopifyFetch({ query });
  return response.body?.data?.products?.edges || [];
}

export async function getProduct(handle) {
  const query = `
    query getProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        descriptionHtml
        priceRange {
          maxVariantPrice { amount currencyCode }
        }
        variants(first: 1) {
          edges {
            node {
              id
              availableForSale
            }
          }
        }
        images(first: 5) {
          edges {
            node { url altText }
          }
        }
      }
    }
  `;
  const response = await shopifyFetch({ query, variables: { handle } });
  return response.body?.data?.product;
}

export async function createCart(linesInput) {
  const query = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                attributes {
                  key
                  value
                }
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price { amount currencyCode }
                    product { title handle }
                    image { url }
                  }
                }
              }
            }
          }
          estimatedCost {
            totalAmount { amount currencyCode }
          }
        }
      }
    }
  `;
  
  let lines = [];
  if (Array.isArray(linesInput)) {
    lines = linesInput.map(l => ({
      merchandiseId: l.merchandiseId || l.variantId,
      quantity: l.quantity,
      attributes: l.attributes || []
    }));
  } else {
    // linesInput is variantId, second arg is quantity (default 1)
    const quantity = arguments[1] || 1;
    lines = [{ merchandiseId: linesInput, quantity }];
  }

  const variables = {
    input: { lines }
  };
  const response = await shopifyFetch({ query, variables });
  return response.body?.data?.cartCreate?.cart;
}

export async function addToExistingCart(cartId, variantId, quantity) {
  const query = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                attributes {
                  key
                  value
                }
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price { amount currencyCode }
                    product { title handle }
                    image { url }
                  }
                }
              }
            }
          }
          estimatedCost {
            totalAmount { amount currencyCode }
          }
        }
      }
    }
  `;
  const variables = {
    cartId,
    lines: [{ merchandiseId: variantId, quantity }]
  };
  const response = await shopifyFetch({ query, variables });
  return response.body?.data?.cartLinesAdd?.cart;
}

export async function addMultipleLinesToCart(cartId, linesInput) {
  const query = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                attributes {
                  key
                  value
                }
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price { amount currencyCode }
                    product { title handle }
                    image { url }
                  }
                }
              }
            }
          }
          estimatedCost {
            totalAmount { amount currencyCode }
          }
        }
      }
    }
  `;
  const variables = {
    cartId,
    lines: linesInput.map(l => ({
      merchandiseId: l.merchandiseId || l.variantId,
      quantity: l.quantity,
      attributes: l.attributes || []
    }))
  };
  const response = await shopifyFetch({ query, variables });
  return response.body?.data?.cartLinesAdd?.cart;
}

export async function updateCartLines(cartId, lines) {
  const query = `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                attributes {
                  key
                  value
                }
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price { amount currencyCode }
                    product { title handle }
                    image { url }
                  }
                }
              }
            }
          }
          estimatedCost {
            totalAmount { amount currencyCode }
          }
        }
      }
    }
  `;
  const variables = { cartId, lines };
  const response = await shopifyFetch({ query, variables });
  return response.body?.data?.cartLinesUpdate?.cart;
}

export async function getCart(cartId) {
  const query = `
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              attributes {
                key
                value
              }
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price { amount currencyCode }
                  product { title handle }
                  image { url }
                }
              }
            }
          }
        }
        estimatedCost {
          totalAmount { amount currencyCode }
        }
      }
    }
  `;
  const response = await shopifyFetch({ query, variables: { cartId } });
  return response.body?.data?.cart;
}

export async function applyDiscountToCart(cartId, discountCodes) {
  const query = `
    mutation cartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]) {
      cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
        cart {
          id
          checkoutUrl
          discountCodes {
            code
            applicable
          }
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                attributes {
                  key
                  value
                }
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price { amount currencyCode }
                    product { title handle }
                    image { url }
                  }
                }
              }
            }
          }
          estimatedCost {
            totalAmount { amount currencyCode }
          }
        }
      }
    }
  `;
  const variables = { cartId, discountCodes };
  const response = await shopifyFetch({ query, variables });
  return response.body?.data?.cartDiscountCodesUpdate?.cart;
}
