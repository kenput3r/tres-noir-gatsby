import React from "react"
import styled from "styled-components"
import Layout from "../../components/layout"
import SEO from "../../components/seo"

const TermsandConditions = () => {
  return (
    <Layout>
      <SEO title="Terms and Conditions" />
      <h1>Terms and Conditions</h1>
      <div className ="paragraph">
          <h3>SHIPPING</h3>
          <p>Free U.S shipping on all orders over $50. Most orders ship same day if received before 2pm Pacific time M-F.  Orders received on the weekend or U.S. Federal holidays will ship the next business day. Tracking numbers will be emailed when orders ship</p>
          <p>All orders ship from our warehouse in Southern California. Domestic transit time is 1-5 days depending on your location.</p>
          <p>Domestic mainland orders ship US POST unless otherwise requested. Next Day air is available upon request.</p>

          <h3>International Orders</h3>
          <p>VAT, Duties and other Local Taxes may apply upon delivery. Rates vary by country. Expect to pay additional govt. fees before receiving your order. Orders typically arrive within 5-10 days</p>
      </div>

    <div className='paragraph'>
            <h3>WARRANTY</h3>
            <p>All Tres Noir glasses come with a  1 year manufacturers warranty. This protects against any manufacturer defects. This does not include lens scratches, accidents, normal wear & tear or theft.</p>
            <p>If it is determined a product has a defect we will repair or replace.</p>
            <p>To make a warranty claim please email- <strong>info@tresnoir.com.</strong></p>
            <p>We will not accept a warranty return without a return authorization number.</p>
            <p>NOTE: If your glasses are damaged from an accident or wear & tear, many times we can help, email us for more info. info@tresnoir.com.</p>
            <p>We also stock replacement lenses for many of our frames. Replacement lenses can be purchased for $46.00.</p>
    </div>


      

    <div className='paragraph'>
          <h3>RETURN POLICY</h3>
          <p>Rx & Custom Lenses are NON-REFUNDABLE. The return policy does not apply to Rx & Custom Orders.  All sales are final for Rx & Custom lenses.
                Tres Noir offers a "no questions asked" return policy. If you are unsatisfied for any reason you can return your order for exchange or refund.</p>
          <p>Returns must be received within 30 days of your original order. Items must be in original packaging and in new, unworn condition. </p>
          <p>Exchanges and Refunds will be issued within 3 business days of receipt.</p>
          <p>Click below to download the return form.</p>
        <a href="#">RETURN FORM</a>
    </div> 
    </Layout>
  )
}

export default TermsandConditions

const Page = styled.div`
margin: auto;
    h1{
        align-items: center;
        justify-content: center;
    }
    .paragraph{
        display: flex;
        flex-wrap: wrap;

        h3{
            padding-left: 200px;
        }
    }


`
