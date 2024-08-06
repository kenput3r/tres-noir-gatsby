import React from "react"
import { CustomizeProvider } from "./src/contexts/customize"
import { CartProvider } from "./src/contexts/cart"
import { RxInfoContextProvider } from "./src/contexts/rxInfo"
import { ErrorModalProvider } from "./src/contexts/error"
import ErrorBoundary from "./src/components/error-boundary"

export const wrapRootElement = ({ element }) => {
  return (
    <ErrorModalProvider>
      <CartProvider>
        <CustomizeProvider>
          <RxInfoContextProvider>
            <ErrorBoundary>{element}</ErrorBoundary>
          </RxInfoContextProvider>
        </CustomizeProvider>
      </CartProvider>
    </ErrorModalProvider>
  )
}
