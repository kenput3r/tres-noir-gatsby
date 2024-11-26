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
  //   overwriteLabel: true,
  // }
  // TODO: Delete after testing and uncomment above
  return {
    discountIdentifier: "TEST-RX",
    enableDiscountIdentifier: true,
    overwriteLabel: true,
  }
}

export default useDiscountIdentifier
