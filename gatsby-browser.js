import React from "react"
import fetch from "isomorphic-fetch"
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client"
import { CustomizeProvider } from "./src/contexts/customize"
import { SelectedVariantProvider } from "./src/contexts/selectedVariant"
import { CartProvider } from "./src/contexts/cart"
import { CustomerProvider } from "./src/contexts/customer"

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new createHttpLink({
    uri: `https://tres-noir.myshopify.com/api/2021-07/graphql.json`,
    headers: {
      "X-Shopify-Storefront-Access-Token":
        process.env.GATSBY_STORE_TOKEN,
      "Accept": "application/graphql",
    },
    fetch,
  }),
})

export const wrapRootElement = ({ element }) => (
  <ApolloProvider client={apolloClient}>
    <CustomerProvider>      
      <CartProvider>    
        <CustomizeProvider>
          <SelectedVariantProvider>
            {element}
          </SelectedVariantProvider>
        </CustomizeProvider>
      </CartProvider>
    </CustomerProvider>  
  </ApolloProvider>
)