export type WallImage = {
    wallImageID: number,
    image: string,
    width?: number,
    height?: number
}


export type ProductVariation = {
  variation?: Variation | null | undefined;
  sizes?: { id?: number; price?: number; sizeObj: Size | null }[];
};



export type ModelImage = {
  imageID: number;
  image: string;
  categoryID: number;
  productName: string;
  wallImages: WallImage[];
  smallSize?: number;
  mediumSize?: number;
  largeSize?: number;
  smallPaintOnCanvasSize?: number;
  mediumPaintOnCanvasSize?: number;
  largePaintOnCanvasSize?: number;
  smallPrintMetalSize?: number;
  mediumPrintMetalSize?: number;
  largePrintMetalSize?: number;
  smallPrintPaperSize?: number;
  mediumPrintPaperSize?: number;
  largePrintPaperSize?: number;
  variations: ProductVariation[];
};


export type Category = {
    id: number,
    priority: number,
    category: string,
    images: ModelImage[],
    wallImages: WallImage[]
}

export type CategoryRequest = {
    wallImages: WallImage[],
    categories: Category[],
    status: string
}


export type PaintingRequestStatus = {
    id: Number,
    status: String
}


export type Country = {
    id: number,
    name: String
}

export type State = {
    id: number,
    name: String
}

export type City = {
    id: number,
    name: String
}


export type Size = {
    id: number,
    size: string,
    width: number,
    height: number,
    unit: string,
    price?: number
}


export type UserProfileInformation = {
    firstName: string,
    lastName: string,
    email: string,
    country: Country,
    state: State,
    city: City,
    street: string,
    profileImage: string
}


export type Suit = {
    id: number,
    suitImage: string
}

export type Variation = {
    id: number,
    variation: string
}