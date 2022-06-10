import { useStaticQuery, graphql } from "gatsby"

export const useFrameColors = () => {
  const FrameColors = useStaticQuery(
    graphql`
      query {
        amber: file(relativePath: { eq: "amber.png" }) {
          childImageSharp {
            gatsbyImageData(width: 50)
          }
        }
        black: file(relativePath: { eq: "black.png" }) {
          childImageSharp {
            gatsbyImageData(width: 50)
          }
        }
        blue: file(relativePath: { eq: "blue.png" }) {
          childImageSharp {
            gatsbyImageData(width: 50)
          }
        }
        brown: file(relativePath: { eq: "brown.png" }) {
          childImageSharp {
            gatsbyImageData(width: 50)
          }
        }
        clear: file(relativePath: { eq: "clear.png" }) {
          childImageSharp {
            gatsbyImageData(width: 50)
          }
        }
        green: file(relativePath: { eq: "green.png" }) {
          childImageSharp {
            gatsbyImageData(width: 50)
          }
        }
        grey: file(relativePath: { eq: "grey.png" }) {
          childImageSharp {
            gatsbyImageData(width: 50)
          }
        }
        pink: file(relativePath: { eq: "pink.png" }) {
          childImageSharp {
            gatsbyImageData(width: 50)
          }
        }
        purple: file(relativePath: { eq: "purple.png" }) {
          childImageSharp {
            gatsbyImageData(width: 50)
          }
        }
        tortoise: file(relativePath: { eq: "tortoise.png" }) {
          childImageSharp {
            gatsbyImageData(width: 50)
          }
        }
        two_toned: file(relativePath: { eq: "two-toned.png" }) {
          childImageSharp {
            gatsbyImageData(width: 50)
          }
        }
        yellow: file(relativePath: { eq: "yellow.png" }) {
          childImageSharp {
            gatsbyImageData(width: 50)
          }
        }
      }
    `
  )
  return FrameColors
}
