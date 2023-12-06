import { Product } from "./productDataInterfaces"


export interface ExportProductBatch {
    id: number,
    product: Product,
    amount: number
}

export interface ExportProductBatchInput {
    id: number
    productId: number,
    amount: number,
    exportId: number
}
