import { useEffect, useState } from "react"
import { useStaticQuery, graphql } from "gatsby"

export const useRandomizeCollection = (currentProductId: string) => {
  const getCollectionItems = () => {
    const { shopifyCollection } = useStaticQuery(graphql`
      query GetYouMayAlsoLikeProducts {
        shopifyCollection(handle: { eq: "clothing" }) {
          products {
            id
            featuredImage {
              localFile {
                childImageSharp {
                  gatsbyImageData(quality: 40, width: 400)
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
              image {
                localFile {
                  childImageSharp {
                    gatsbyImageData(quality: 40, width: 400)
                  }
                }
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

  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
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
    const filteredCollection = queriedCollection.products.filter(
      (el: {
        id: string
        tags: string | string[]
        hasOutOfStockVariants: boolean
        productType: string
        onlineStoreUrl: string | null
      }) => {
        return (
          el.id !== currentProductId &&
          !el.tags.includes("upsell_item") &&
          !el.hasOutOfStockVariants &&
          el.productType !== "Gift Card" &&
          el.onlineStoreUrl
        )
      }
    )
    setItems(getRandom(filteredCollection, 4))
  }, [])

  return items
}
