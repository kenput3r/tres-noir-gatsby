import { useStaticQuery, graphql } from "gatsby"

export const useDiscountIdentifier = () => {
  const data = useStaticQuery(graphql`
    query getContenfulDiscountSettings {
      contentfulHomepage {
        discountIdentifier
        enableDiscountIdentifier
      }
    }
  `)
  // return {
  //   discountIdentifier: data.contentfulHomepage.discountIdentifier as string,
  //   enableDiscountIdentifier: data.contentfulHomepage
  //     .enableDiscountIdentifier as boolean,
  // }
  return {
    discountIdentifier: "TEST24",
    enableDiscountIdentifier: true,
  }
}

export default useDiscountIdentifier
