import React from "react"
import { CustomizeProvider } from "./src/contexts/customize"
import { SelectedVariantProvider } from "./src/contexts/selectedVariant"
import { CartProvider } from "./src/contexts/cart"

export const wrapRootElement = ({ element }) => (
  <CartProvider>    
    <CustomizeProvider>
      <SelectedVariantProvider>
        {element}
      </SelectedVariantProvider>
    </CustomizeProvider>
  </CartProvider>
)