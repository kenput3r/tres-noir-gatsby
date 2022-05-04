import { useEffect, useState, useMemo } from "react"
import { useStaticQuery, graphql } from "gatsby"

export const useRandomizeCollection = currentProduct => {
  const getCollectionItems = () => {
    const { shopifyCollection } = useStaticQuery(graphql`
      query GetYouMayAlsoLikeProducts {
        shopifyCollection(
          handle: { eq: "clothing" }
          products: {
            elemMatch: {
              variants: {
                elemMatch: { inventoryQuantity: { gt: 0 }, price: {} }
              }
              totalInventory: { gt: 0 }
            }
          }
        ) {
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
            handle
            hasOnlyDefaultVariant
            variants {
              title
              sku
              storefrontId
              price
              inventoryQuantity
              selectedOptions {
                name
              }
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
        el.variants[0].inventoryQuantity > 0
      )
    })

    return getRandom(filteredCollection, 4)
  }, [currentProduct, queriedCollection])

  return data
}
