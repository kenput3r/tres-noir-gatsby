import { useStaticQuery, graphql } from "gatsby"

export const useLensColors = () => {
  const LensColors = useStaticQuery(
    graphql`
      query {
        smoke: file(relativePath: { eq: "smoke-lens.png" }) {
          childImageSharp {
            gatsbyImageData(quality: 40, height: 55)
          }
        }
        brown: file(relativePath: { eq: "brown-lens.png" }) {
          childImageSharp {
            gatsbyImageData(quality: 40, height: 55)
          }
        }
        green: file(relativePath: { eq: "green-lens.png" }) {
          childImageSharp {
            gatsbyImageData(quality: 40, height: 55)
          }
        }
        clear: file(relativePath: { eq: "clear-lens.png" }) {
          childImageSharp {
            gatsbyImageData(quality: 40, height: 55)
          }
        }
      }
    `
  )
  return LensColors
}
