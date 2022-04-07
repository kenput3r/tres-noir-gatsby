import { Checkout } from "../types/checkout"
import {
  AddedToCartPayload,
  IdentifyCustomerPayload,
  ShopifyProductInfo,
  StartedCheckoutPayload,
  ViewedProductPayload,
} from "../types/klaviyo"

const klaviyo = () => {
  const isBrowser = typeof window !== "undefined"
  let _learnq: any
  if (isBrowser) {
    // @ts-ignore
    _learnq = window._learnq || []
  } else {
    _learnq = []
  }
  return _learnq
}

export const identifyCustomerKlaviyoEvent = (email: string) => {
  let _learnq = klaviyo()
  const payload: IdentifyCustomerPayload = { $email: email }

  _learnq.push(["identify", payload])
}

export const viewedProductKlaviyoEvent = (item: ShopifyProductInfo) => {
  let _learnq = klaviyo()
  const payload: ViewedProductPayload = {
    Brand: item.vendor,
    Categories: item.collections,
    CompareAtPrice: Number(item.compareAtPrice),
    ImageUrl: item.image,
    Name: item.title,
    Price: Number(item.price),
    ProductId: item.legacyResourceId,
    SKU: item.sku,
    Url: item.url,
  }

  _learnq.push(["track", "Viewed Product", payload])
}

export const addedToCartKlaviyoEvent = (
  item: ShopifyProductInfo,
  checkout: Checkout
) => {
  console.log("UPDATED CHECKOUT", checkout)
  let _learnq = klaviyo()
  // get cart  to track request where cart already contains items
  // build data
  const payload: AddedToCartPayload = {
    $value: Number(item.price), // cart value
    AddedItemProductName: item.title,
    AddedItemProductID: item.legacyResourceId,
    AddedItemSKU: item.sku,
    AddedItemCategories: item.collections,
    AddedItemImageURL: item.image,
    AddedItemURL: item.url,
    AddedItemPrice: Number(item.price),
    AddedItemQuantity: 1,
    ItemNames: [item.title], // all product names
    // CheckoutURL: "http://www.example.com/path/to/checkout",
    Items: [
      {
        ImageURL: item.image,
        ItemPrice: Number(item.price),
        ProductName: item.title,
        // ProductCategories: item.collections,
        ProductID: item.legacyResourceId,
        ProductURL: item.url,
        Quantity: 1,
        RowTotal: Number(item.price),
        SKU: item.sku,
      },
    ],
  }

  _learnq.push(["track", "Added to Cart", payload])
}

export const startedCheckoutKlaviyoEvent = (checkout: Checkout) => {
  let _learnq = klaviyo()
  const payload: StartedCheckoutPayload = {
    $event_id: new Date().getTime(),
    $value: Number(checkout.totalPrice),
    // Categories: ["Fiction", "Children", "Classics"],
    CheckoutURL: checkout.webUrl,
    ItemNames: [],
    Items: [],
  }
  checkout.lineItems
    .map(lineItem => ({
      ItemPrice: Number(lineItem.variant.price),
      ImageURL: lineItem.variant.image.src,
      // ProductCategories: ["Fiction", "Children"],
      // ProductID: lineItem,
      ProductName: lineItem.title,
      // ProductURL: "http://www.example.com/path/to/product",
      Quantity: lineItem.quantity,
      RowTotal: Number(lineItem.variant.price) * Number(lineItem.quantity),
      SKU: lineItem.variant.sku,
    }))
    .forEach(lineItem => {
      payload.Items.push(lineItem)
      if (!payload.ItemNames.includes(lineItem.ProductName)) {
        payload.ItemNames.push(lineItem.ProductName)
      }
    })

  _learnq.push(["track", "Started Checkout", payload])
}
