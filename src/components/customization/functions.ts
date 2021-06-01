import { SelectedVariants } from "../../../global"

export const changeImage = (
  currentStep: number,
  selectedVariants: SelectedVariants,
  currentImage: any,
  setCurrentImage: React.Dispatch<React.SetStateAction<any>>,
  variant: any
) => {
  const { step1, step2, step3, step4 } = selectedVariants
  switch (currentStep) {
    case 1:
      if (step1.product?.title === "Bifocal") {
        setCurrentImage({
          data: variant.contentful.customizations.bifocal.data,
          altText: variant.contentful.customizations.bifocal.title,
        })
        // } else if (step1.product?.title === "Progressive") {
        //   setCurrentImage({
        //     data: variant.contentful.customizations.progressive.data,
        //     altText: variant.contentful.customizations.progressive.title,
        //   })
      } else {
        setCurrentImage({
          data: variant.contentful.customizations.clear.data,
          altText: variant.contentful.customizations.clear.title,
        })
      }
      break
    case 2:
      if (step1.product?.title === "Bifocal" && step2.product?.title) {
        switch (step2.product.title) {
          case "Clear": {
            setCurrentImage({
              data: variant.contentful.customizations.bifocal.data,
              altText: variant.contentful.customizations.bifocal.title,
            })
            break
          }
          case "Blue Light Blocking": {
            setCurrentImage({
              data: variant.contentful.customizations.bifocal.data,
              altText: variant.contentful.customizations.bifocal.title,
            })
            break
          }
          case "Sunglasses": {
            const variantTitle: string = selectedVariants.step2.title
            const property: string = `sunGlasses${variantTitle}LensesBifocal`
            setCurrentImage({
              data: variant.contentful.customizations[property].data,
              altText: variant.contentful.customizations[property].title,
            })
            break
          }
          case "Transitions": {
            const variantTitle: string = selectedVariants.step2.title
            const property: string = `sunGlasses${variantTitle}LensesBifocal`
            setCurrentImage({
              data: variant.contentful.customizations[property].data,
              altText: variant.contentful.customizations[property].title,
            })
            break
          }
          case "Polarized": {
            const variantTitle: string = selectedVariants.step2.title
            const property: string = `sunGlasses${variantTitle}LensesBifocal`
            setCurrentImage({
              data: variant.contentful.customizations[property].data,
              altText: variant.contentful.customizations[property].title,
            })
            break
          }
          case "Gradient Tint": {
            const variantTitle: string = selectedVariants.step2.title
            const property = `bifocalGradientTint${variantTitle}Lenses`
            setCurrentImage({
              data: variant.contentful.customizations[property].data,
              altText: variant.contentful.customizations[property].title,
            })
            break
          }
          case "Transitions Xtractive Polarized": {
            setCurrentImage({
              data:
                variant.contentful.customizations
                  .bifocalTransitionsXtractivePolarized.data,
              altText:
                variant.contentful.customizations
                  .bifocalTransitionsXtractivePolarized.title,
            })
            break
          }
          case "Vantage": {
            setCurrentImage({
              data:
                variant.contentful.customizations
                  .bifocalTransitionsXtractivePolarized.data,
              altText:
                variant.contentful.customizations
                  .bifocalTransitionsXtractivePolarized.title,
            })
            break
          }
        }
        //Not Bifocal
      } else {
        switch (step2.product.title) {
          case "Clear": {
            setCurrentImage({
              data: variant.contentful.customizations.clear.data,
              altText: variant.contentful.featuredImage.title,
            })
            break
          }
          case "Blue Light Blocking": {
            setCurrentImage({
              data: variant.contentful.customizations.clear.data,
              altText: variant.contentful.customizations.clear.title,
            })
            break
          }
          case "Sunglasses": {
            const variantTitle: string = selectedVariants.step2.title
            const property: string = `sunGlasses${variantTitle}Lenses`
            setCurrentImage({
              data: variant.contentful.customizations[property].data,
              altText: variant.contentful.customizations[property].title,
            })
            break
          }
          case "Transitions": {
            const variantTitle: string = selectedVariants.step2.title
            const property: string = `sunGlasses${variantTitle}Lenses`
            setCurrentImage({
              data: variant.contentful.customizations[property].data,
              altText: variant.contentful.customizations[property].title,
            })
            break
          }
          case "Polarized": {
            const variantTitle: string = selectedVariants.step2.title
            const property: string = `sunGlasses${variantTitle}Lenses`
            setCurrentImage({
              data: variant.contentful.customizations[property].data,
              altText: variant.contentful.customizations[property].title,
            })
            break
          }
          case "Gradient Tint": {
            const variantTitle: string = selectedVariants.step2.title
            const property = `gradientTint${variantTitle}Lenses`
            setCurrentImage({
              data: variant.contentful.customizations[property].data,
              altText: variant.contentful.customizations[property].title,
            })
            break
          }
          case "Vantage": {
            setCurrentImage({
              data:
                variant.contentful.customizations.transitionsXtractivePolarized
                  .data,
              altText:
                variant.contentful.customizations.transitionsXtractivePolarized
                  .title,
            })
            break
          }
          case "Transitions Xtractive Polarized": {
            setCurrentImage({
              data:
                variant.contentful.customizations.transitionsXtractivePolarized
                  .data,
              altText:
                variant.contentful.customizations.transitionsXtractivePolarized
                  .title,
            })
            break
          }
        }
      }
    case 3:
      console.log("step is 3")
    case 4:
      console.log("step is 4")
  }
}
