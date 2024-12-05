// determines whether a product is discounted for on sale
// export function isDiscounted(price: string, compareAtPrice: string) {
//   if (Number(price) === 0 || Number(compareAtPrice) === 0) return false
//   if (Number(compareAtPrice) > Number(price)) {
//     return true
//   }
//   return false
// }

export function isDiscounted(
  price: string | number,
  compareAtPrice: string | number
) {
  price = Number(price)
  compareAtPrice = Number(compareAtPrice)
  if (price === 0 || compareAtPrice === 0) return false
  if (compareAtPrice > price) {
    return true
  }
  return false
}

export function formatPrice(price: string) {
  return Number(price).toFixed(2)
}
