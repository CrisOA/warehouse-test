import { Product } from "./productDataInterfaces"


export interface ImportProductBatch {
    id: number,
    product: Product,
    amount: number
}

export interface ImportProductBatchInput {
    id: number
    productId: number,
    amount: number,
    importId: number
}
