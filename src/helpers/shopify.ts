// determines whether a product is discounted for on sale
export function isDiscounted(price: string, compareAtPrice: string) {
  if (Number(compareAtPrice) > Number(price)) {
    return true
  }
  return false
}
