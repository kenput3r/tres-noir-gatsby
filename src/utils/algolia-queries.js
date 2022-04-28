const pagePath = `content`
const indexName = `Products`

const excludedProductTypes = ["Lense Customization", "Lenses"]

const productsQuery = `{
  Shopify: allShopifyProduct {
    edges {
      node {
        handle
        id
        legacyResourceId
        title
        vendor
        metafields {
          key
          value
        }
        productType
        tags
        options {
          name
        }
        featuredImage {
          originalSrc
        }
        priceRangeV2 {
					minVariantPrice {
						amount
          }
          maxVariantPrice {
            amount
          }
        }
      }
    }
  }
  Contentful: allContentfulProduct {
    edges {
      node {
        handle
        styleDescription {
          styleDescription
        }
        variants {
          featuredImage {
            file {
              url
            }
          }
        }
      }
    }
  }
}
`

function products(data) {
  const arr = []
  data.Shopify.edges.forEach(({ node }) => {
    const handle = node.handle
    const contentful = data.Contentful.edges.find(({ node }) => {
      return node.handle === handle
    })
    if (!excludedProductTypes.includes(node.productType)) {
      arr.push({
        node: {
          id: node.legacyResourceId,
          vendor: node.vendor,
          title: node.title,
          style_description: contentful
            ? contentful.node.styleDescription.styleDescription
            : "",
          option_names: node.options.map(el => el.name),
          min_variant_price: node.priceRangeV2.minVariantPrice.amount,
          max_variant_price: node.priceRangeV2.maxVariantPrice.amount,
          product_type: node.productType,
          tags: node.tags,
          product_image: contentful
            ? contentful.node.variants[0].featuredImage.file.url
            : node.featuredImage
            ? node.featuredImage.originalSrc
            : "",
          handle: node.handle,
          price:
            node.priceRangeV2.minVariantPrice.amount ===
            node.priceRangeV2.maxVariantPrice.amount
              ? node.priceRangeV2.minVariantPrice.amount
              : "",
        },
      })
    }
  })
  return arr
}

function productToAlgoliaRecord({
  node: {
    id,
    vendor,
    title,
    style_description,
    option_names,
    price,
    min_variant_price,
    max_variant_price,
    product_type,
    tags,
    product_image,
    handle,
  },
}) {
  return {
    objectID: id,
    vendor: vendor,
    title: title,
    style_description: style_description,
    option_names: option_names,
    price: price,
    min_variant_price: min_variant_price,
    max_variant_price: max_variant_price,
    product_type: product_type,
    tags: tags,
    image: product_image,
    handle: handle,
  }
}

const queries = [
  {
    query: productsQuery,
    // transformer: ({ data }) => data.pages.edges.map(productToAlgoliaRecord),
    transformer: ({ data }) => {
      const p = products(data)
      console.log("P ===>", JSON.stringify(p))
      return p.map(productToAlgoliaRecord)
    },
    indexName,
    settings: { attributesToSnippet: [`style_description:20`] },
  },
]

module.exports = queries
