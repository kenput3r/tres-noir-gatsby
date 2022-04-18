import React from "react"
import styled from "styled-components"
import Layout from "../../components/layout"
import SEO from "../../components/seo"

const Page = styled.div`
  h1 {
    text-align: center;
    padding-top: 10px;
  }
  h1,
  h3 {
    font-weight: normal;
    text-transform: uppercase;
  }
  h3 {
    font-size: 1.41rem;
  }
  p {
    font-family: var(--sub-heading-font);
    color: var(--color-grey-dark);
  }
  span {
    color: black;
  }
  a {
    color: black;
    :visited {
      color: black;
    }
    :hover,
    :active,
    :focus {
      color: var(--color-grey-dark);
    }
  }
`

const ShippingInfo = () => (
  <Layout>
    <Page className="wrapper">
      <SEO title="Shipping Info" />
      <h1>Shipping &amp; Returns</h1>
      <section>
        <h3>Shipping</h3>
        <p>
          Free U.S shipping on all orders over $50. Most orders ship same day if
          received before 2pm Pacific time M-F. Orders received on the weekend
          or U.S. Federal holidays will ship the next business day. Tracking
          numbers will be emailed when orders ship.
        </p>
        <p>
          All orders ship from our warehouse in Southern California. Domestic
          transit time is 1-5 days depending on your location.
        </p>
        <p>
          Domestic mainland orders ship US POST unless otherwise requested. Next
          Day air is available upon request.
        </p>
        <p>
          <span>International Orders:</span> <br />
          VAT, Duties and other Local Taxes may apply upon delivery. Rates vary
          by country. Expect to pay additional govt. fees before receiving your
          order. Orders typically arrive within 5-10 days.
        </p>
      </section>
      <section>
        <h3>Return Policy</h3>
        <p>
          <span>Rx & Custom Lenses are NON-REFUNDABLE.</span> The return policy
          does not apply to Rx & Custom Orders. All sales are final for Rx &
          Custom lenses.
        </p>
        <p>
          Tres Noir offers a "no questions asked" return policy. If you are
          unsatisfied for any reason you can return your order for exchange or
          refund.
        </p>
        <p>
          Returns must be received within 30 days of your original order. Items
          must be in original packaging and in new, unworn condition.
        </p>
        <p>
          Exchanges and Refunds will be issued within 3 business days of
          receipt.
        </p>
        <p>Click below to download the return form.</p>
        <p>
          <a
            href="https://cdn.shopify.com/s/files/1/0140/0012/8057/files/tn_return_form_2020.pdf?v=1603495365"
            download=""
            target="_blank"
            rel="noopener noreferrer"
          >
            RETURN FORM
          </a>
        </p>
      </section>
    </Page>
  </Layout>
)

export default ShippingInfo
