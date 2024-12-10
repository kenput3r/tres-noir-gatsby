// determines whether a product is discounted for on sale
export function isDiscounted(
  price: number | string,
  compareAtPrice: number | string
) {
  if (typeof price === "string") price = parseFloat(price)
  if (typeof compareAtPrice === "string")
    compareAtPrice = parseFloat(compareAtPrice)
  if (price === 0 || compareAtPrice === 0) return false
  if (compareAtPrice > price) {
    return true
  }
  return false
}

export function formatPrice(price: number) {
  return price.toFixed(2)
}
