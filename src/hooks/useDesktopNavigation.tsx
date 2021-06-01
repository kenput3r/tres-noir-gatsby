import { useStaticQuery, graphql } from "gatsby"

export const useDesktopNavigation = () => {
  const { contentfulMenu } = useStaticQuery(graphql`
    query MenuQuery {
      contentfulMenu(name: { eq: "Desktop Main" }) {
        items {
          id
          name
          url
          subListItems {
            id
            name
            url
          }
        }
      }
    }
  `)
  return contentfulMenu
}
