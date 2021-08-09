import React, { createContext, ReactChild, useState } from "react"
import Cookies from "js-cookie"

interface CC {
  customerAccessToken: null | string
  setCustomerAccessToken: (value: null | string) => void
  login: (data: { accessToken: string; expiresAt: string }) => void
  logout: () => void
}

const defaultContext: CC = {
  customerAccessToken: "",
  setCustomerAccessToken: (customerAccessToken: string | null) => {},
  login: (data: { accessToken: string; expiresAt: string }) => {},
  logout: () => {},
}

export const CustomerContext = createContext(defaultContext)

export const CustomerProvider = ({ children }: { children: ReactChild }) => {
  const accessToken = Cookies.get("tn-login")
  const [customerAccessToken, setCustomerAccessToken] = useState<null | string>(
    accessToken ? accessToken : null
  )

  const logout = () => {
    Cookies.remove("tn-login")
    setCustomerAccessToken(null)
  }

  const login = (data: { accessToken: string; expiresAt: string }) => {
    Cookies.set("tn-login", data.accessToken, {
      expires: new Date(data.expiresAt),
    })
    setCustomerAccessToken(data.accessToken)
  }

  return (
    <CustomerContext.Provider
      value={{ customerAccessToken, setCustomerAccessToken, login, logout }}
    >
      {children}
    </CustomerContext.Provider>
  )
}
