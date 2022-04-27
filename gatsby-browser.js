import React from "react"
import { CustomizeProvider } from "./src/contexts/customize"
import { SelectedVariantProvider } from "./src/contexts/selectedVariant"
import { CartProvider } from "./src/contexts/cart"
import { CustomerProvider } from "./src/contexts/customer"
import { RxInfoContextProvider } from "./src/contexts/rxInfo"
import { ErrorModalProvider } from "./src/contexts/error"

export const wrapRootElement = ({ element }) => (
  <ErrorModalProvider>
    <CustomerProvider>
      <CartProvider>
        <CustomizeProvider>
          <SelectedVariantProvider>
            <RxInfoContextProvider>{element}</RxInfoContextProvider>
          </SelectedVariantProvider>
        </CustomizeProvider>
      </CartProvider>
    </CustomerProvider>
  </ErrorModalProvider>
)
