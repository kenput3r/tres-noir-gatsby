import React, {
  createContext,
  ReactChild,
  useState,
  useMemo,
  useReducer,
  Dispatch,
} from "react"

interface rxDetails {
  sph: string
  cyl: string
  axis: string
  add: string
  pd: string
}
interface rxType {
  right: rxDetails
  left: rxDetails
}

const rxInit: rxType = {
  right: {
    sph: "0.00",
    cyl: "0.00",
    axis: "",
    add: "",
    pd: "63",
  },
  left: {
    sph: "0.00",
    cyl: "0.00",
    axis: "",
    add: "",
    pd: "63",
  },
}

const defaultContext = {
  isRxAble: false,
  rxInfo: rxInit,
  rxInfoDispatch: Dispatch => {},
  setRxAble: (isRxAble: boolean) => {},
}

const actionList = {
  RIGHT_SPH: "right-sph",
  RIGHT_CYL: "right-cyl",
  RIGHT_AXIS: "right-axis",
  RIGHT_ADD: "right-add",
  RIGHT_PD: "right-pd",
  LEFT_SPH: "left-sph",
  LEFT_CYL: "left-cyl",
  LEFT_AXIS: "left-axis",
  LEFT_ADD: "left-add",
  LEFT_PD: "left-pd",
}
const reducer = (state, action) => {
  switch (action.type) {
    case actionList.RIGHT_SPH:
      return { ...state, right: { ...state.right, sph: action.payload } }
    case actionList.RIGHT_CYL:
      return { ...state, right: { ...state.right, cyl: action.payload } }
    case actionList.RIGHT_AXIS:
      return { ...state, right: { ...state.right, axis: action.payload } }
    case actionList.RIGHT_ADD:
      return { ...state, right: { ...state.right, add: action.payload } }
    case actionList.RIGHT_PD:
      return { ...state, right: { ...state.right, pd: action.payload } }
    case actionList.LEFT_SPH:
      return { ...state, left: { ...state.left, sph: action.payload } }
    case actionList.LEFT_CYL:
      return { ...state, left: { ...state.left, cyl: action.payload } }
    case actionList.LEFT_AXIS:
      return { ...state, left: { ...state.left, axis: action.payload } }
    case actionList.LEFT_ADD:
      return { ...state, left: { ...state.left, add: action.payload } }
    case actionList.LEFT_PD:
      return { ...state, left: { ...state.left, pd: action.payload } }
    default:
      return state
  }
}

export const RxInfoContext = createContext(defaultContext)

export const RxInfoContextProvider = ({
  children,
}: {
  children: ReactChild
}) => {
  const [isRxAble, setRxAble] = useState(false)
  const [rxInfo, rxInfoDispatch] = useReducer(reducer, rxInit)

  const value = useMemo(
    () => ({
      isRxAble,
      setRxAble,
      rxInfo,
      rxInfoDispatch,
    }),
    [isRxAble, rxInfo]
  )

  return (
    <RxInfoContext.Provider value={value}>{children}</RxInfoContext.Provider>
  )
}
