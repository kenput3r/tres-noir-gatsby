import { useStaticQuery, graphql } from "gatsby"

export const useDesktopNavigation = () => {
  const { contentfulMenu } = useStaticQuery(graphql`
    query MenuQuery {
      contentfulMenu(name: { eq: "Desktop Main" }) {
        items {
          id
          name
          url
          image {
            gatsbyImageData
            title
          }
          subListItems {
            id
            name
            url
            image {
              gatsbyImageData
              title
            }
          }
        }
      }
    }
  `)
  return contentfulMenu
}
