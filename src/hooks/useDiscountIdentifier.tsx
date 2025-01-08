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
  return {
    discountIdentifier: "20% OFF RX and Custom Lenses",
    enableDiscountIdentifier: true,
    overwriteLabel: true,
  }
  // return {
  //   discountIdentifier: data.contentfulHomepage.discountIdentifier as string,
  //   enableDiscountIdentifier: data.contentfulHomepage
  //     .enableDiscountIdentifier as boolean,
  //   overwriteLabel: true,
  // }
}

export default useDiscountIdentifier
