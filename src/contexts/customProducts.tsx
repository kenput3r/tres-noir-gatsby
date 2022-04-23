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

// const actionList = {
//   ADD: "add",
//   REMOVE: "remove",
// }
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      const findId = state.items.findIndex(
        srch => srch.customizationId === action.payload.id
      )
      if (findId === -1) {
        //create new item
        console.log("create new item then add")
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
        console.log("add existing item")
        return {
          ...state,
          items: [
            ...state.items.splice(0, findId),
            (state.items[findId] = {
              customizationId: action.payload.id,
              lineItems: action.payload.value,
              customImage: action.payload.image,
            }),
            ...state.slice(findId),
          ],
        }
      }
    case "SET_CHECKOUT":
      return { ...state, checkoutId: action.payload }
    case "SET_CUSTOM_IMAGE":
      return { ...state }
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
