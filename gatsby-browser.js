import React from "react"
import { CustomizeProvider } from "./src/contexts/customize"
import { SelectedVariantProvider } from "./src/contexts/selectedVariant"

export const wrapRootElement = ({ element }) => (
  <CustomizeProvider>
    <SelectedVariantProvider>
      {element}
    </SelectedVariantProvider>
  </CustomizeProvider>
)