import { Import } from "./importDataInterfaces"
import { Product } from "./productDataInterfaces"
import { Warehouse } from "./warehouseDataInterfaces"

export interface ProductInventoryFlat {
    id: number,
    amount: number,
    productId: number,
    warehouseId: number, 
    importId: number,
    exportId: number,
}

export interface ProductInventory {
    id: number,
    amount: number,
    product: Product,
    warehouse: Warehouse, 
    import: Import,
}
