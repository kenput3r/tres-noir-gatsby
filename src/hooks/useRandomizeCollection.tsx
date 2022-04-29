import { useEffect } from "react"
import { useStaticQuery, graphql } from "gatsby"

export function useRandomizeCollection() {
  function getRandom(arr: any[], n: number) {
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
            handle
            variants {
              storefrontId
              price
            }
            storefrontId
          }
        }
      }
    `)
    return shopifyCollection
  }

  const queriedCollection = getCollectionItems()
  const randomItems = getRandom(queriedCollection.products, 4)
  return randomItems
}
