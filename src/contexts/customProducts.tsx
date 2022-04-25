import React, {
  createContext,
  ReactChild,
  useState,
  useMemo,
  useReducer,
  Dispatch,
} from "react"

interface BundleCustomsItemType {
  customizationId: string
  lineItems: any[]
  customImage: {
    data: any
    altText: string
  }
}

interface BundleCustomsType {
  checkoutId: string
  items: BundleCustomsItemType[]
}

const bundleInit: BundleCustomsType = {
  checkoutId: "",
  items: [],
}

const defaultContext = {
  bundledCustoms: bundleInit,
  bundledDispatch: Dispatch => {},
}

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      const findId = state.items.findIndex(
        srch => srch.customizationId === action.payload.id
      )
      if (findId === -1) {
        //create new item
        return {
          ...state,
          items: [
            ...state.items,
            {
              customizationId: action.payload.id,
              lineItems: action.payload.value,
              customImage: action.payload.image,
            },
          ],
        }
      } else {
        // append line item to array
        return {
          ...state,
          items: [
            ...state.items.slice(0, findId),
            (state.items[findId] = {
              customizationId: action.payload.id,
              lineItems: action.payload.value,
              customImage: action.payload.image,
            }),
            ...state.items.slice(findId),
          ],
        }
      }
    case "DELETE":
      const filteredDelete = state.items.filter(
        item => item.customizationId !== action.payload.id
      )
      if (state.items.length === 1) {
        return {
          ...state,
          items: [],
        }
      } else {
        return {
          ...state,
          items: filteredDelete,
        }
      }

    case "SET_CHECKOUT":
      return { ...state, checkoutId: action.payload }
    default:
      return state
  }
}

export const CustomProductsContext = createContext(defaultContext)

export const CustomProductsContextProvider = ({
  children,
}: {
  children: ReactChild
}) => {
  const [bundledCustoms, bundledDispatch] = useReducer(reducer, bundleInit)

  const value = useMemo(
    () => ({
      bundledCustoms,
      bundledDispatch,
    }),
    [bundledCustoms]
  )

  return (
    <CustomProductsContext.Provider value={value}>
      {children}
    </CustomProductsContext.Provider>
  )
}
