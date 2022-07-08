const path = require("path")

exports.createPages = async ({ graphql, actions: { createPage } }) => {
  const pageable = await graphql(`
    query PagesQuery {
      allShopifyProduct {
        edges {
          node {
            handle
            id
            metafields {
              key
              value
            }
            productType
          }
        }
      }
      allShopifyCollection {
        edges {
          node {
            handle
            id
            title
          }
        }
      }
      allContentfulProduct {
        edges {
          node {
            handle
          }
        }
      }
      allContentfulCollection {
        edges {
          node {
            handle
          }
        }
      }
    }
  `)

  pageable.data.allShopifyProduct.edges.forEach(
    async ({ node: { handle, id, metafields, productType } }) => {
      let template = "product"
      if (metafields.length) {
        metafields.forEach(node => {
          if (node.key === "gatsby_template_name" && node.value) {
            template = node.value
          }
        })
      }

      if (productType === "Glasses") {
        template = "product-customizable"
      } else if (productType === "Gift Card" || productType === "Gift Cards") {
        template = "gift-card"
      }

      if (
        productType !== "Lense Customization" &&
        productType !== "Lens Customization" &&
        productType !== "Lenses" &&
        productType !== "Upsell AO"
      ) {
        createPage({
          path: `/products/${handle}`,
          component: path.resolve(`./src/templates/${template}.tsx`),
          context: {
            id,
            handle,
          },
        })
      }
    }
  )
  pageable.data.allShopifyProduct.edges.forEach(
    async ({ node: { handle, id, productType } }) => {
      if (productType === "Glasses") {
        createPage({
          path: `/products/${handle}/customize`,
          component: path.resolve(`./src/templates/customize.tsx`),
          context: {
            id,
            handle,
          },
        })
      }
    }
  )
  pageable.data.allShopifyCollection.edges.forEach(
    ({ node: { handle, id, title } }) => {
      const template = "collection"
      // exclude collections
      const excludedCollections = [
        "Lens Coating",
        "Lens Material",
        "Lenses",
        "Lens Type",
        "RX Type",
        "Welcome",
        "Home Page",
        "Black Friday Sale",
        "Case Add-ons",
      ]

      if (!excludedCollections.includes(title)) {
        createPage({
          path: `/collections/${handle}`,
          component: path.resolve(`./src/templates/${template}.tsx`),
          context: {
            id,
            handle,
          },
        })
      }
    }
  )
  pageable.data.allContentfulProduct.edges.forEach(({ node: { handle } }) => {
    createPage({
      path: `/${handle}`,
      component: path.resolve(`./src/templates/learn-more/index.tsx`),
      context: {
        handle,
      },
    })
  })
  pageable.data.allContentfulCollection.edges.forEach(
    ({ node: { handle } }) => {
      const template = "collection-contentful"
      createPage({
        path: `/collections/${handle}`,
        component: path.resolve(`./src/templates/${template}.tsx`),
        context: {
          handle,
        },
      })
    }
  )
}

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === "build-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /offending-module/,
            use: loaders.null(),
          },
        ],
      },
    })
  }
}
