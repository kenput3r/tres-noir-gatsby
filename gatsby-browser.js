import React from "react"
import { CustomizeProvider } from "./src/contexts/customize"
import { SelectedVariantProvider } from "./src/contexts/selectedVariant"
import { CartProvider } from "./src/contexts/cart"
import { CustomerProvider } from "./src/contexts/customer"

export const wrapRootElement = ({ element }) => (
  <CustomerProvider>      
    <CartProvider>    
      <CustomizeProvider>
        <SelectedVariantProvider>
          {element}
        </SelectedVariantProvider>
      </CustomizeProvider>
    </CartProvider>
  </CustomerProvider> 
)