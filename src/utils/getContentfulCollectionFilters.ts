import { ContentfulProduct } from "../types/contentful"

export const getFilters = (products: ContentfulProduct[]) => {
  // get fit type
  let fitTypesList = products.map(product => product.fitType)
  fitTypesList = fitTypesList.filter((v, i) => fitTypesList.indexOf(v) === i)
  // get colors
  let colorsList: string[] = []
  products.forEach(product =>
    product.variants.forEach(variant => colorsList.push(variant.frameColor))
  )
  colorsList = colorsList.filter((v, i) => colorsList.indexOf(v) === i)
  // return values
  return {
    fitTypesList: fitTypesList,
    colorsList: colorsList.sort(),
  }
}
