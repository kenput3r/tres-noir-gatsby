import { tnItem, tnSubItem } from "../../types/checkout"

export const orderTnLineItems = lineItems => {
  const order = ["0", "1", "2", "3", "4", "5"]
  lineItems.sort((a, b) => {
    return order.indexOf(a.stepNumber) - order.indexOf(b.stepNumber)
  })
  return lineItems
}

export const formatItemTitle = (
  subItem: tnSubItem,
  stepName: string,
  isCustom: boolean
) => {
  if (subItem.stepNumber === "0" && isCustom) {
    return subItem.shopifyItem.variant.title.split("-")[0]
  }
  if (stepName === "CASE") {
    let spl = subItem.shopifyItem.title.split("AO")[0]
    return spl.slice(0, -2)
  }
  if (subItem.shopifyItem.variant.title === "Default Title") {
    return subItem.shopifyItem.title
  } else {
    return `${subItem.shopifyItem.title} - ${subItem.shopifyItem.variant.title}`
  }
}

export const priceTimesQuantity = (price: string, quantity: number) => {
  return (Number(price) * quantity).toFixed(2)
}

export const totalSum = lineItems => {
  let sum = 0
  lineItems.forEach(item => {
    sum += parseFloat(item.shopifyItem.variant.price)
  })
  return sum.toFixed(2)
}
