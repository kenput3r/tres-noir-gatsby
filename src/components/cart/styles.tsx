import styled from "styled-components"

export const Page = styled.div`
  .cart-wrapper {
    max-width: 860px;
    width: 100%;
    padding-left: 22px;
    padding-right: 22px;
    h2 {
      font-weight: normal;
    }
    padding-top: 30px;
    ul {
      .wrapper {
        padding: 0;
      }
      margin: 0;
      li {
        padding: 5px;
        border-radius: 10px;
        .close-btn {
          text-align: right;
          padding: 0px 3px 3px 3px;
          a {
            text-align: right;
            svg {
              font-size: 1.65rem;
            }
          }
        }
        list-style: none;
        background: white;
        margin: 30px 0;
        .card {
          display: flex;
          justify-content: space-between;
          padding: 0 10px 20px 10px;
          > div {
            flex: 1;
            padding: 0 10px;
          }
          @media (max-width: 600px) {
            flex-direction: column;
            .card-image {
              max-width: 280px;
              align-self: center;
            }
          }
        }
        .card-items {
          .quantity-selector {
            margin-top: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .price {
              color: var(--color-grey-dark);
              font-size: 100%;
              font-family: var(--sub-heading-font);
            }
          }
        }
        .title {
          /* font-weight: bold; */
          margin-bottom: 0;
          a {
            color: #000;
            text-decoration: none;
          }
        }
        .sub-title {
          display: flex;
          justify-content: space-between;
          color: var(--color-grey-dark);
          span {
            font-family: var(--sub-heading-font);
          }
        }
        .sub-title-customize {
          display: flex;
          justify-content: space-between;
          flex-direction: column;
          color: var(--color-grey-dark);
          span {
            font-size: 85%;
            font-family: var(--sub-heading-font);
          }
          .price {
            text-align: right;
          }
        }
        /* img {
          width: 100px;
          height: auto;
        } */
        .remove-item {
          text-decoration: none;
          /* font-weight: bold; */
          color: #000;
        }
      }
    }
    .subtotal {
      text-align: right;
      p {
        :first-child {
          font-size: 1.75rem;
        }
        :not(:first-child) {
          color: var(--color-grey-dark);
          font-family: var(--sub-heading-font);
        }
        margin-bottom: 10px;
      }
    }
    .btn-container {
      text-align: right;
      padding: 15px 0;
      button,
      .button {
        background-color: #000;
        border-radius: 0;
        border: 1px solid #000;
        color: #fff;
        display: block;
        font-family: var(--sub-heading-font);
        padding: 10px 20px;
        text-decoration: none;
        text-transform: uppercase;
        font-family: var(--heading-font);
        -webkit-appearance: button-bevel;
        :hover {
          cursor: pointer;
        }
        @media only screen and (max-width: 480px) {
          display: inline-block;
        }
      }
      /* a {
        text-decoration: none;
        color: #000;
      } */
    }
    p,
    span,
    a,
    h2 {
      font-family: var(--heading-font);
      text-transform: uppercase;
    }
    :nth-child(1) {
      background: #e0e0e0;
    }
    :nth-child(2) {
      background: white;
    }
    hr {
      background-color: black;
      margin-bottom: 0;
      margin: 5px 0 5px 0;
    }
  }
  .customized {
    .step-name {
      color: black;
    }
  }
  .grey-background {
    background: #e0e0e0;
  }
  .empty-cart {
    p {
      font-family: var(--heading-font);
      color: var(--color-grey-dark);
      font-size: 130%;
    }
    h1 {
      text-transform: uppercase;
      font-weight: normal;
      text-align: center;
    }
    .empty-flex {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 40px 0;
    }
  }
  .no-events {
    pointer-events: none;
    opacity: 0.5;
  }
  .checkout-loading {
    min-height: 42px;
    min-width: 165px;
    position: relative;
    @media only screen and (max-width: 468px) {
      min-height: 39px;
      min-width: 152px;
    }
    div {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
`
