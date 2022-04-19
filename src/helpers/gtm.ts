import type {
  AddedToCartPayload,
  ViewedProductPayload,
  ShopifyProductInfo,
  StartedCheckoutPayload,
} from "../types/gtm"
import type { Checkout } from "../types/checkout"

// Check if window is defined (so if in the browser or in node.js).
const isBrowser = typeof window !== "undefined"

export const viewedProductGTMEvent = (productInfo: ShopifyProductInfo) => {
  if (isBrowser) {
    const payload: ViewedProductPayload = {
      Brand: productInfo.vendor,
      Categories: productInfo.collections,
      CompareAtPrice: Number(productInfo.compareAtPrice),
      ImageUrl: productInfo.image,
      Name: productInfo.title,
      Price: Number(productInfo.price),
      ProductId: productInfo.legacyResourceId,
      SKU: productInfo.sku,
      Url: productInfo.url,
    }
    console.log("VIEWED PRODUCT GTM EVENT", payload)
    window.dataLayer.push({
      event: "view_item",
      viewed_product_payload: payload,
    })
  }
}

export const addedToCartGTMEvent = (productInfo: ShopifyProductInfo) => {
  if (isBrowser) {
    const payload: AddedToCartPayload = {
      $value: Number(productInfo.price), // cart value
      AddedItemProductName: productInfo.title,
      AddedItemProductID: productInfo.legacyResourceId,
      AddedItemSKU: productInfo.sku,
      AddedItemCategories: productInfo.collections,
      AddedItemImageURL: productInfo.image,
      AddedItemURL: productInfo.url,
      AddedItemPrice: Number(productInfo.price),
      AddedItemQuantity: 1,
      ItemNames: [productInfo.title], // all product names
      // CheckoutURL: "http://www.example.com/path/to/checkout",
      Items: [
        {
          ImageURL: productInfo.image,
          ItemPrice: Number(productInfo.price),
          ProductName: productInfo.title,
          // ProductCategories: item.collections,
          ProductID: productInfo.legacyResourceId,
          ProductURL: productInfo.url,
          Quantity: 1,
          RowTotal: Number(productInfo.price),
          SKU: productInfo.sku,
        },
      ],
    }
    console.log("ADDED TO CART GTM EVENT", payload)
    window.dataLayer.push({
      event: "add_to_cart",
      added_to_cart_payload: payload,
    })
  }
}

export const startedCheckoutGTMEvent = (checkoutInfo: Checkout) => {
  if (isBrowser) {
    const payload: StartedCheckoutPayload = {
      $event_id: new Date().getTime(),
      $value: Number(checkoutInfo.totalPrice),
      // Categories: ["Fiction", "Children", "Classics"],
      CheckoutURL: checkoutInfo.webUrl,
      ItemNames: [],
      Items: [],
    }
    checkoutInfo.lineItems
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

    window.dataLayer.push({
      event: "begin_checkout",
      started_checkout_payload: payload,
    })
  }
}
