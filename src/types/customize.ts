export interface ContentfulProduct {
  handle: string
  fitType: string
  fitDimensions: string
  variants: ContentfulProductVariant[]
}

export interface ContentfulProductVariant {
  colorName: string
  sku: string
  colorImage: {
    data: any
    title: string
  }
  customizations: {
    bifocal: {
      data: any
      title: string
    }
    bifocalGradientTintSmokeLenses: {
      data: any
      title: string
    }
    bifocalGradientTintBrownLenses: {
      data: any
      title: string
    }
    bifocalGradientTintG15Lenses: {
      data: any
      title: string
    }
    clear: {
      data: any
      title: string
    }
    gradientTintSmokeLenses: {
      data: any
      title: string
    }
    gradientTintBrownLenses: {
      data: any
      title: string
    }
    gradientTintG15Lenses: {
      data: any
      title: string
    }
    sunGlassesSmokeLenses: {
      data: any
      title: string
    }
    sunGlassesBrownLenses: {
      data: any
      title: string
    }
    sunGlassesGreenLenses: {
      data: any
      title: string
    }
    sunGlassesOrangeLenses: {
      data: any
      title: string
    }
    sunGlassesYellowLenses: {
      data: any
      title: string
    }
    sunGlassesBlueLenses: {
      data: any
      title: string
    }
    sunGlassesG15Lenses: {
      data: any
      title: string
    }
    sunGlassesSmokeLensesBifocal: {
      data: any
      title: string
    }
    sunGlassesBrownLensesBifocal: {
      data: any
      title: string
    }
    sunGlassesGreenLensesBifocal: {
      data: any
      title: string
    }
    sunGlassesOrangeLensesBifocal: {
      data: any
      title: string
    }
    sunGlassesYellowLensesBifocal: {
      data: any
      title: string
    }
    sunGlassesBlueLensesBifocal: {
      data: any
      title: string
    }
    sunGlassesG15LensesBifocal: {
      data: any
      title: string
    }
  }
}

export interface ShopifyProduct {
  priceRange: {
    minVariantPrice: {
      amount: number
    }
    maxVariantPrice: {
      amount: number
    }
  }
  title: string
  variants: ShopifyProductVariant[]
}

export interface ShopifyProductVariant {
  availableForSale: boolean
  compareAtPriceV2: {
    amount: number
  }
  id: string
  priceNumber: number
  sku: string
  shopifyId: string
  title: string
}
