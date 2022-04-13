import React from "react"
import { Link } from "gatsby"
import { useFooterNavigation } from "../../hooks/useFooterNavigation"

const FooterLinks = () => {
  const { items } = useFooterNavigation()
  return (
    <nav>
      {items.map(element => {
        return (
          <ul key={element.name}>
            <span>{element.name}</span>
            {element.subListItems.map(item => {
              return (
                <li key={item.name}>
                  {item.url && <Link to={item.url}>{item.name}</Link>}
                </li>
              )
            })}
          </ul>
        )
      })}
    </nav>
  )
}

export default FooterLinks
