import { useMemo } from "react"
import { useStaticQuery, graphql } from "gatsby"

export const useRandomizeCollection = currentProduct => {
  const getCollectionItems = () => {
    const { shopifyCollection } = useStaticQuery(graphql`
      query GetYouMayAlsoLikeProducts {
        shopifyCollection(handle: { eq: "clothing" }) {
          products {
            id
            featuredImage {
              localFile {
                childImageSharp {
                  gatsbyImageData
                }
              }
            }
            title
            productType
            handle
            hasOnlyDefaultVariant
            hasOutOfStockVariants
            onlineStoreUrl
            variants {
              title
              sku
              storefrontId
              price
              inventoryQuantity
              selectedOptions {
                name
              }
              position
            }
            tags
            storefrontId
          }
        }
      }
    `)
    return shopifyCollection
  }

  const queriedCollection = getCollectionItems()

  const getRandom = (arr: any[], n: number) => {
    var result = new Array(n),
      len = arr.length,
      taken = new Array(len)
    if (n > len)
      throw new RangeError("getRandom: more elements taken than available")
    while (n--) {
      var x = Math.floor(Math.random() * len)
      result[n] = arr[x in taken ? taken[x] : x]
      taken[x] = --len in taken ? taken[len] : len
    }
    return result
  }

  const data = useMemo(() => {
    const filteredCollection = queriedCollection.products.filter(el => {
      return (
        el.id !== currentProduct.id &&
        !el.tags.includes("upsell_item") &&
        !el.hasOutOfStockVariants &&
        el.productType !== "Gift Card" &&
        el.onlineStoreUrl
      )
    })

    return getRandom(filteredCollection, 4)
  }, [currentProduct, queriedCollection])

  return data
}
