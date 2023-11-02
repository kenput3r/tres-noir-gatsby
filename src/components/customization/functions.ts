import { Dispatch, SetStateAction } from "react"
import { SelectedVariants } from "../../types/global"

export const changeImage = (
  currentStep: number,
  selectedVariants: SelectedVariants,
  setCurrentImage: Dispatch<SetStateAction<any>>,
  variant: any
) => {
  const { step1, step2 } = selectedVariants
  const defaultImage =
    variant.contentful.customizations.clear.title ??
    variant.contentful.featuredImage.data
  const defaultTitle =
    variant.contentful.customizations.clear.title ??
    variant.contentful.featuredImage.title

  const isBifocal = step1.product.title === "Bifocal"
  try {
    switch (currentStep) {
      case 1:
        if (isBifocal) {
          const property = "bifocal"
          setCurrentImage({
            data: variant.contentful.customizations[property].data,
            altText: variant.contentful.customizations[property].title,
          })
        }
        break
      case 2:
        const variantTitle = selectedVariants.step2.title
        switch (step2.product.title) {
          // Clear
          case "Clear":
          case "Blue Light Blocking":
            const property = isBifocal ? "bifocal" : "clear"
            setCurrentImage({
              data: variant.contentful.customizations[property].data,
              altText: variant.contentful.customizations[property].title,
            })
          // Sunglasses
          case "Sunglasses":
          case "Transitions":
          case "Transitions - For Progressive":
          case "XTRActive Polarized":
          case "Polarized": {
            const property = isBifocal
              ? `sunGlasses${variantTitle}LensesBifocal`
              : `sunGlasses${variantTitle}Lenses`
            setCurrentImage({
              data: variant.contentful.customizations[property].data,
              altText: variant.contentful.customizations[property].title,
            })
            break
          }
          // Gradient Tint
          case "Gradient":
          case "Gradient Tint": {
            const property = isBifocal
              ? `bifocalGradientTint${variantTitle}Lenses`
              : `gradientTint${variantTitle}Lenses`
            setCurrentImage({
              data: variant.contentful.customizations[property].data,
              altText: variant.contentful.customizations[property].title,
            })
            break
          }
        }
        break
      default:
        setCurrentImage({
          data: defaultImage,
          altText: defaultTitle,
        })
    }
  } catch (error) {
    setCurrentImage({
      data: defaultImage,
      altText: defaultTitle,
    })
  }
}
