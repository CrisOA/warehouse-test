
export const typeDefs = `#graphql

    type Query {
        products(product: ProductInput): [Product]
        warehouses(warehouse: WarehouseInput): [Warehouse]
    }

    type Mutation {
        createProduct(product: ProductInput): Product
        importProducts(import: ImportInput): Import
        exportProducts(export: ExportInput): Export
    }

    type Product {
        id: Int,
        name: String,
        size: Int,
        isHazardous: Boolean
    }

    input ProductInput {
        id: Int,
        name: String,
        size: Int,
        isHazardous: Boolean
    }

    type Warehouse {
        id: Int,
        name: String,
        size: Int,
        currentInventory: [ProductInventory],
        imports: [Import],
        exports: [Export],
        status: WarehouseStatus
    }

    type WarehouseStatus {
        availableSpace: Int, 
        acceptsHazardousProducts: Boolean, 
        isEmpty: Boolean
    }

    input WarehouseInput {
        id: Int,
        name: String,
        size: Int,
        withStatus: Boolean,
        withCurrentInventory: Boolean
    }

    type ProductInventory {
        id: Int,
        product: Product,
        amount: Int
    }

    type Import {
        id: Int,
        productBatches: [ProductBatch],
        warehouse: Warehouse
    }

    input ImportInput {
        productBatches: [ProductBatchInput]!,
        warehouseId: Int!
    }

    type Export {
        id: Int,
        productBatches: [ProductBatch],
        warehouse: Warehouse
    }

    input ExportInput {
        productBatches: [ProductBatchInput]!,
        warehouseId: Int!
    }

    type ProductBatch {
        id: Int,
        product: Product,
        amount: Int
    }

    input ProductBatchInput {
        productId: Int!,
        amount: Int!
    }
`

