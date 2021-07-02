import { useStaticQuery, graphql } from "gatsby"

export const useFrameColors = () => {
  const FrameColors = useStaticQuery(
    graphql`
      query {
        amber: file(relativePath: { eq: "amber.png" }) {
          childImageSharp {
            gatsbyImageData(width: 30)
          }
        }
        black: file(relativePath: { eq: "black.png" }) {
          childImageSharp {
            gatsbyImageData(width: 30)
          }
        }
        blue: file(relativePath: { eq: "blue.png" }) {
          childImageSharp {
            gatsbyImageData(width: 30)
          }
        }
        brown: file(relativePath: { eq: "brown.png" }) {
          childImageSharp {
            gatsbyImageData(width: 30)
          }
        }
        clear: file(relativePath: { eq: "clear.png" }) {
          childImageSharp {
            gatsbyImageData(width: 30)
          }
        }
        green: file(relativePath: { eq: "green.png" }) {
          childImageSharp {
            gatsbyImageData(width: 30)
          }
        }
        grey: file(relativePath: { eq: "grey.png" }) {
          childImageSharp {
            gatsbyImageData(width: 30)
          }
        }
        tortoise: file(relativePath: { eq: "tortoise.png" }) {
          childImageSharp {
            gatsbyImageData(width: 30)
          }
        }
        two_toned: file(relativePath: { eq: "two-toned.png" }) {
          childImageSharp {
            gatsbyImageData(width: 30)
          }
        }
      }
    `
  )
  return FrameColors
}
