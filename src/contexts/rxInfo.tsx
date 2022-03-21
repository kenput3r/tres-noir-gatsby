import React, {
  createContext,
  ReactChild,
  useState,
  useMemo,
  useReducer,
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

const rxInit = {
  right: {
    sph: "",
    cyl: "",
    axis: "",
    add: "",
    pd: "",
  },
  left: {
    sph: "",
    cyl: "",
    axis: "",
    add: "",
    pd: "",
  },
}

const defaultContext = {
  isRxAble: false,
  rxInfo: rxInit,
  setRxAble: (isRxAble: boolean) => {},
}

const actionList = {
  RIGHT_SPH: "right_sph",
  RIGHT_CYL: "right_cyl",
  RIGHT_AXIS: "right_axis",
  RIGHT_ADD: "right_add",
  RIGHT_PD: "right_pd",
  LEFT_SPH: "left_sph",
  LEFT_CYL: "left_cyl",
  LEFT_AXIS: "left_axis",
  LEFT_ADD: "left_add",
  LEFT_PD: "left_pd",
}
const reducer = (state, action) => {
  console.log(action)
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
      console.log("error, no value found")
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
  const [rxInfo, dispatch] = useReducer(reducer, rxInit)

  const value = useMemo(
    () => ({
      isRxAble,
      setRxAble,
      rxInfo,
      dispatch,
    }),
    [isRxAble, rxInfo]
  )

  return (
    <RxInfoContext.Provider value={value}>{children}</RxInfoContext.Provider>
  )
}
