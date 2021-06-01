import { useStaticQuery, graphql } from "gatsby"

export const useFooterNavigation = () => {
  const { contentfulMenu } = useStaticQuery(graphql`
    query FooterMenuQuery {
      contentfulMenu(name: { eq: "Footer" }) {
        items {
          id
          name
          url
        }
      }
    }
  `)
  return contentfulMenu
}
