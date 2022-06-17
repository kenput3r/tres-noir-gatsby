import { Dispatch, SetStateAction } from "react"
import { SelectedVariants } from "../../types/global"

export const changeImage = (
  currentStep: number,
  selectedVariants: SelectedVariants,
  // currentImage: any,
  setCurrentImage: Dispatch<SetStateAction<any>>,
  variant: any
) => {
  const { step1, step2, step3, step4 } = selectedVariants
  switch (currentStep) {
    case 1:
      if (step1.product?.title === "Bifocal") {
        const data = variant.contentful.customizations?.bifocal.data
          ? variant.contentful.customizations?.bifocal.data
          : variant.contentful.featuredImage.title
        const title = variant.contentful.customizations?.bifocal.title
          ? variant.contentful.customizations?.bifocal.title
          : variant.contentful.featuredImage.title
        setCurrentImage({
          data: data,
          altText: title,
        })
        // } else if (step1.product?.title === "Progressive") {
        //   setCurrentImage({
        //     data: variant.contentful.customizations.progressive.data,
        //     altText: variant.contentful.customizations.progressive.title,
        //   })
      } else {
        const data = variant.contentful.customizations?.clear.data
          ? variant.contentful.customizations?.clear.data
          : variant.contentful.featuredImage.title
        const title = variant.contentful.customizations?.clear.title
          ? variant.contentful.customizations?.clear.title
          : variant.contentful.featuredImage.title
        setCurrentImage({
          data: data,
          altText: title,
        })
      }
      break
    case 2:
      if (step1.product?.title === "Bifocal" && step2.product?.title) {
        switch (step2.product.title) {
          case "Clear": {
            const data = variant.contentful.customizations?.bifocal.data
              ? variant.contentful.customizations?.bifocal.data
              : variant.contentful.featuredImage.data
            const title = variant.contentful.customizations?.bifocal.title
              ? variant.contentful.customizations?.bifocal.title
              : variant.contentful.featuredImage.title
            setCurrentImage({
              data: data,
              altText: title,
            })
            break
          }
          case "Blue Light Blocking": {
            const data = variant.contentful.customizations?.bifocal.data
              ? variant.contentful.customizations?.bifocal.data
              : variant.contentful.featuredImage.data
            const title = variant.contentful.customizations?.bifocal.title
              ? variant.contentful.customizations?.bifocal.title
              : variant.contentful.featuredImage.title
            setCurrentImage({
              data: data,
              altText: title,
            })
            break
          }
          case "Sunglasses": {
            const variantTitle: string = selectedVariants.step2.title
            const property: string = `sunGlasses${variantTitle}LensesBifocal`
            const data = variant.contentful.customizations?.clear.data
              ? variant.contentful?.customizations[property].data
              : variant.contentful.featuredImage.data
            const title = variant.contentful.customizations?.clear.data
              ? variant.contentful?.customizations[property].title
              : variant.contentful.featuredImage.title
            setCurrentImage({
              data: data,
              altText: title,
            })
            break
          }
          case "Transitions": {
            const variantTitle: string = selectedVariants.step2.title
            const property: string = `sunGlasses${variantTitle}LensesBifocal`
            const data = variant.contentful.customizations?.clear.data
              ? variant.contentful?.customizations[property].data
              : variant.contentful.featuredImage.data
            const title = variant.contentful.customizations?.clear.data
              ? variant.contentful?.customizations[property].title
              : variant.contentful.featuredImage.title
            setCurrentImage({
              data: data,
              altText: title,
            })
            break
          }
          case "Polarized": {
            const variantTitle: string = selectedVariants.step2.title
            const property: string = `sunGlasses${variantTitle}LensesBifocal`
            const data = variant.contentful.customizations?.clear.data
              ? variant.contentful?.customizations[property].data
              : variant.contentful.featuredImage.data
            const title = variant.contentful.customizations?.clear.data
              ? variant.contentful?.customizations[property].title
              : variant.contentful.featuredImage.title
            setCurrentImage({
              data: data,
              altText: title,
            })
            break
          }
          case "Gradient Tint": {
            const variantTitle: string = selectedVariants.step2.title
            const property = `bifocalGradientTint${variantTitle}Lenses`
            const data = variant.contentful.customizations?.clear.data
              ? variant.contentful?.customizations[property].data
              : variant.contentful.featuredImage.data
            const title = variant.contentful.customizations?.clear.data
              ? variant.contentful?.customizations[property].title
              : variant.contentful.featuredImage.title
            setCurrentImage({
              data: data,
              altText: title,
            })
            break
          }
          case "XTRActive Polarized": {
            // const data = variant.contentful.customizations?.clear.data
            //   ? variant.contentful.customizations?.clear.data
            //   : variant.contentful.featuredImage.title
            // const title = variant.contentful.customizations?.clear.title
            //   ? variant.contentful.customizations?.clear.title
            //   : variant.contentful.featuredImage.title
            if (step1.product.title === "Bifocal") {
              setCurrentImage({
                data: variant.contentful.customizations?.bifocal.data,
                altText: variant.contentful.customizations?.bifocal.title,
              })
            } else {
              setCurrentImage({
                data: variant.contentful.customizations?.clear.data,
                altText: variant.contentful.customizations?.clear.title,
              })
            }
            break
          }
          // case "Vantage": {
          //   setCurrentImage({
          //     data: variant.contentful.customizations
          //       .bifocalTransitionsXtractivePolarized?.data,
          //     altText:
          //       variant.contentful.customizations
          //         .bifocalTransitionsXtractivePolarized?.title,
          //   })
          //   break
          // }
          default: {
            const data = variant.contentful.customizations?.bifocal.data
              ? variant.contentful.customizations?.bifocal.data
              : variant.contentful.featuredImage.data
            const title = variant.contentful.customizations?.bifocal.title
              ? variant.contentful.customizations?.bifocal.title
              : variant.contentful.featuredImage.title
            setCurrentImage({
              data: data,
              altText: title,
            })
          }
        }
        // Not Bifocal
      } else {
        switch (step2.product.title) {
          case "Clear": {
            const data = variant.contentful.customizations?.clear.data
              ? variant.contentful.customizations?.clear.data
              : variant.contentful.featuredImage.data
            const title = variant.contentful.customizations?.clear.data
              ? variant.contentful.customizations?.clear.title
              : variant.contentful.featuredImage.title
            setCurrentImage({
              data: data,
              altText: title,
            })
            break
          }
          case "Blue Light Blocking": {
            const data = variant.contentful.customizations?.clear.data
              ? variant.contentful.customizations?.clear.data
              : variant.contentful.featuredImage.data
            const title = variant.contentful.customizations?.clear.data
              ? variant.contentful.customizations?.clear.title
              : variant.contentful.featuredImage.title
            setCurrentImage({
              data: data,
              altText: title,
            })
            break
          }
          case "Sunglasses": {
            const variantTitle: string = selectedVariants.step2.title
            const property: string = `sunGlasses${variantTitle}Lenses`
            const data = variant.contentful.customizations?.clear.data
              ? variant.contentful?.customizations[property].data
              : variant.contentful.featuredImage.data
            const title = variant.contentful.customizations?.clear.data
              ? variant.contentful?.customizations[property].title
              : variant.contentful.featuredImage.title
            setCurrentImage({
              data: data,
              altText: title,
            })
            break
          }
          case "Transitions": {
            const variantTitle: string = selectedVariants.step2.title
            const property: string = `sunGlasses${variantTitle}Lenses`
            const data = variant.contentful.customizations?.clear.data
              ? variant.contentful?.customizations[property].data
              : variant.contentful.featuredImage.data
            const title = variant.contentful.customizations?.clear.data
              ? variant.contentful?.customizations[property].title
              : variant.contentful.featuredImage.title
            setCurrentImage({
              data: data,
              altText: title,
            })
            break
          }
          case "Polarized": {
            const variantTitle: string = selectedVariants.step2.title
            const property: string = `sunGlasses${variantTitle}Lenses`
            const data = variant.contentful.customizations?.clear.data
              ? variant.contentful?.customizations[property].data
              : variant.contentful.featuredImage.data
            const title = variant.contentful.customizations?.clear.data
              ? variant.contentful?.customizations[property].title
              : variant.contentful.featuredImage.title
            setCurrentImage({
              data: data,
              altText: title,
            })
            break
          }
          case "Gradient Tint": {
            const variantTitle: string = selectedVariants.step2.title
            const property = `gradientTint${variantTitle}Lenses`
            const data = variant.contentful.customizations?.clear.data
              ? variant.contentful?.customizations[property].data
              : variant.contentful.featuredImage.data
            const title = variant.contentful.customizations?.clear.data
              ? variant.contentful?.customizations[property].title
              : variant.contentful.featuredImage.title
            setCurrentImage({
              data: data,
              altText: title,
            })
            break
          }
          // case "Vantage": {
          //   setCurrentImage({
          //     data: variant.contentful.customizations
          //       ?.transitionsXtractivePolarized.data,
          //     altText:
          //       variant.contentful.customizations?.transitionsXtractivePolarized
          //         .title,
          //   })
          //   break
          // }
          case "XTRActive Polarized": {
            // const data = variant.contentful.customizations?.clear.data
            //   ? variant.contentful.customizations?.clear.data
            //   : variant.contentful.featuredImage.title
            // const title = variant.contentful.customizations?.clear.title
            //   ? variant.contentful.customizations?.clear.title
            //   : variant.contentful.featuredImage.title
            const property: string = `sunGlassesSmokeLenses`
            setCurrentImage({
              data: variant.contentful.customizations[property].data,
              altText: variant.contentful.customizations[property].title,
            })
            break
          }
          default: {
            const data = variant.contentful.customizations?.clear.data
              ? variant.contentful.customizations?.clear.data
              : variant.contentful.featuredImage.data
            const title = variant.contentful.customizations?.clear.data
              ? variant.contentful.customizations?.clear.title
              : variant.contentful.featuredImage.title
            setCurrentImage({
              data: data,
              altText: title,
            })
          }
        }
      }
      break
    case 3:
      // console.log("step is 3")
      break
    case 4:
      // console.log("step is 4")
      break
    default:
    // console.log("ERROR")
  }
}
