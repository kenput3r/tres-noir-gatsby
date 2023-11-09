import React, { useState, useMemo, ReactNode, useCallback } from "react"
import { ReviewsContext } from "./context"

type Props = {
  children: ReactNode | ReactNode[]
}

export function ReviewsProvider({ children }: Props) {
  const cartContextValue = useMemo(() => ({}), [])

  return (
    <ReviewsContext.Provider value={cartContextValue}>
      {children}
    </ReviewsContext.Provider>
  )
}

export default ReviewsProvider
