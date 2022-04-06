import { Checkout } from "../types/checkout"

interface ShopifyProduct {
  collections: string[]
  compareAtPrice: string
  image: string
  legacyResourceId: string
  price: string
  sku: string
  title: string
  url: string
  vendor: string
}

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

export const identifyCustomer = (email: string) => {
  let _learnq = klaviyo()
  const response = _learnq.push(["identify", { $email: email }])
  console.log("IDENTIFY CUSTOMER", response)
}

export const viewedProduct = (email: string, item: ShopifyProduct) => {
  let _learnq = klaviyo()
  // identifyCustomer(email)
  const data = formatProductData(item)
  const response = _learnq.push(["track", "Viewed Product", data])
  console.log("VIEWED PRODUCT", response)
}

export const addedToCart = (email: string, item: ShopifyProduct) => {
  let _learnq = klaviyo()
  // identifyCustomer(email)
  // get cart  to track request where cart already contains items
  // build data
  const data = {
    $value: Number(item.price), // cart value
    AddedItemProductName: item.title,
    AddedItemProductID: item.legacyResourceId,
    AddedItemSKU: item.sku,
    AddedItemCategories: item.collections,
    AddedItemImageURL: item.image,
    AddedItemURL: item.url,
    AddedItemPrice: Number(item.price),
    AddedItemQuantity: 1,
    ItemNames: [item.title], // all produc names
    // CheckoutURL: "http://www.example.com/path/to/checkout",
    Items: [
      {
        ProductID: item.legacyResourceId,
        SKU: item.sku,
        ProductName: item.title,
        Quantity: 1,
        ItemPrice: Number(item.price),
        RowTotal: Number(item.price),
        ProductURL: item.url,
        ImageURL: item.image,
        // ProductCategories: item.collections,
      },
    ],
  }

  const response = _learnq.push(["track", "Added to Cart", data])
  console.log("ADDED TO CART", response)
}

export const startedCheckout = (checkout: Checkout) => {
  let _learnq = klaviyo()
  identifyCustomer("jriv@suavecito.com")
  const items = checkout.lineItems.map(lineItem => {
    return {
      // ProductID: lineItem,
      SKU: lineItem.variant.sku,
      ProductName: lineItem.title,
      Quantity: lineItem.quantity,
      ItemPrice: Number(lineItem.variant.price),
      RowTotal: Number(lineItem.variant.price) * Number(lineItem.quantity),
      // ProductURL: "http://www.example.com/path/to/product",
      ImageURL: lineItem.variant.image.src,
      // ProductCategories: ["Fiction", "Children"],
    }
  })
  const data = {
    $event_id: new Date().getTime(),
    $value: Number(checkout.totalPrice), // cart value
    ItemNames: checkout.lineItems.map(lineItem => lineItem.title), // string[]
    CheckoutURL: checkout.webUrl,
    // Categories: ["Fiction", "Children", "Classics"],
    Items: items,
  }
  console.log("CHECKOUT DATA", data)
  const response = _learnq.push(["track", "Started Checkout", data])
  console.log("STARTED CHECKOUT", response)
}

export const formatProductData = (product: ShopifyProduct) => {
  const data = {
    Brand: product.vendor,
    Categories: product.collections,
    CompareAtPrice: product.compareAtPrice,
    ImageUrl: product.image,
    Name: product.title,
    Price: product.price,
    ProductId: product.legacyResourceId,
    SKU: product.sku,
    Url: product.url,
  }
  return data
}
