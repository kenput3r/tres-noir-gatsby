import type {
  AddedToCartPayload,
  ViewedProductPayload,
  ShopifyProductInfo,
  ShopifyCustomizedProductInfo,
  StartedCheckoutPayload,
} from "../types/gtm"
import type { Checkout } from "../types/checkout"

// Check if window is defined (so if in the browser or in node.js).
const isBrowser = typeof window !== "undefined"

export const identifyCustomerGTMEvent = (email: string) => {
  if (isBrowser) {
    const payload: string = email
    window.dataLayer.push({
      event: "identify_customer",
      identify_customer_payload: payload,
    })
  }
}

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
      AddedItemQuantity: Number(productInfo.quantity),
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
    window.dataLayer.push({
      event: "add_to_cart",
      added_to_cart_payload: payload,
    })
  }
}

export const addedCustomizedToCartGTMEvent = (
  productInfo: ShopifyCustomizedProductInfo
) => {
  if (isBrowser) {
    // calculate value
    let value = Number(productInfo.main.price)
    // get item names
    let itemNames = [productInfo.main.title]
    productInfo.addOns.forEach(addOn => {
      value += Number(addOn.price)
      itemNames.push(addOn.title)
    })

    const payload: AddedToCartPayload = {
      $value: value, // cart value
      AddedItemProductName: productInfo.main.title,
      AddedItemProductID: productInfo.main.legacyResourceId,
      AddedItemSKU: productInfo.main.sku,
      AddedItemCategories: productInfo.main.collections,
      AddedItemImageURL: productInfo.main.image,
      AddedItemURL: productInfo.main.url,
      AddedItemPrice: Number(productInfo.main.price),
      AddedItemQuantity: 1,
      ItemNames: itemNames, // all product names
      Items: [],
    }
    // push first item
    payload.Items.push({
      ImageURL: productInfo.main.image,
      ItemPrice: Number(productInfo.main.price),
      ProductName: productInfo.main.title,
      ProductID: productInfo.main.legacyResourceId,
      ProductURL: productInfo.main.url,
      Quantity: 1,
      RowTotal: Number(productInfo.main.price),
      SKU: productInfo.main.sku,
    })

    productInfo.addOns
      .map(addOn => ({
        ImageURL: addOn.image,
        ItemPrice: Number(addOn.price),
        ProductName: addOn.title,
        ProductID: addOn.legacyResourceId,
        ProductURL: addOn.url,
        Quantity: 1,
        RowTotal: Number(addOn.price),
        SKU: addOn.sku,
      }))
      .forEach(lineItem => {
        payload.Items.push(lineItem)
      })

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
