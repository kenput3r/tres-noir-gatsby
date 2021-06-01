import React from "react"
import { CustomizeProvider } from "./src/contexts/customize"

export const wrapRootElement = ({ element }) => (
  <CustomizeProvider>
    {element}
  </CustomizeProvider>
)