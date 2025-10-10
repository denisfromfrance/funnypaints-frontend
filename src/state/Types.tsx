export type WallImage = {
    wallImageID: number,
    image: string,
    width?: number,
    height?: number
}


export type ModelImage = {
    imageID: number,
    image: string,
    productName: string,
    wallImages: WallImage[],
    smallSize?: string,
    mediumSize?: string,
    largeSize?: string
}


export type Category = {
    id: number,
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
    price: number
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