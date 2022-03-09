import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { FaFacebookF as F } from "react-icons/fa"
import { TiSocialInstagram as I } from "react-icons/ti"
import { useFooterNavigation } from "../hooks/useFooterNavigation"

const Component = styled.footer`
  background-color: var(--color-grey-dark);
  color: #fff;
  font-family: var(--sub-heading-font);
  padding: 1.45rem 5px;
  .social {
    a {
      display: inline-block;
      padding: 2px;
      margin: 0 5px;
    }
  }
  svg {
    font-size: 1.5rem;
  }
  ul {
    margin: 0 0 1.45rem;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
  li {
    list-style-type: none;
    padding: 0 5px;
    a {
      padding: 3px;
      text-transform: uppercase;
    }
  }
  p {
    text-align: center;
  }
  a {
    color: #fff;
    text-decoration: none;
  }
  form {
    text-align: center;
  }
  input[type="button"] {
    background-color: #000;
    color: #fff;
    border-color: #000;
    border-style: solid;
  }
`

interface Item {
  id: string
  url: string | null
  name: string
}

const Footer = () => {
  const { items } = useFooterNavigation()
  return (
    <Component>
      <nav>
        <ul>
          {items.map((item: Item) => (
            <li key={item.id}>
              {item.url && <Link to={item.url}>{item.name}</Link>}
            </li>
          ))}
        </ul>
      </nav>
      <p className="social">
        <a
          href="https://instagram.com/tresnoir"
          target="_blank"
          rel="noreferrer"
        >
          <I />
        </a>
        <a
          href="https://facebook.com/tresnoir"
          target="_blank"
          rel="noreferrer"
        >
          <F />
        </a>
      </p>
      <p>
        <a href="tel:1-714-656-4796">714.656.4796</a>
        <br />
        2831 W 1st St, Santa Ana, CA 92703
      </p>
      <form>
        <p>Sign up for our newsletter</p>
        <div className="form-group">
          <input type="email" placeholder="Email Address" />
          <input type="button" value="&rarr;" />
        </div>
      </form>
    </Component>
  )
}

export default Footer
