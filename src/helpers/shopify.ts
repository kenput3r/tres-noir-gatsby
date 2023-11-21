// determines whether a product is discounted for on sale
export function isDiscounted(price: string, compareAtPrice: string) {
  if (Number(price) === 0 || Number(compareAtPrice) === 0) return false
  // TODO: FLIP LOGIC
  if (Number(compareAtPrice) < Number(price)) {
    return true
  }
  return false
}
