import { ProductInventoryFlat } from "../../dataInterfaces/inventoryDataInterfaces";
import db from "../db";

class ProductInventoryRepository {
    insertProductInventories(newProductInventories: ProductInventoryFlat[]): void {
        console.log("New Product Inventories ", newProductInventories)
        db('warehouseProductInventory').insert(newProductInventories).then(rows => rows);
    }
    queryProductInventories(productInventoryFlat: ProductInventoryFlat): Promise<ProductInventoryFlat[]> {
        const query = this.buildProductInventoryQuery(productInventoryFlat);
        const products = query.select('*').then(rows => rows);
        return products
    }

    async queryCurrentProductInventories(productInventoryFlat: ProductInventoryFlat): Promise<ProductInventoryFlat[]> {
        const rankedInventoriesForWarehouse = db('warehouseProductInventory').select('*')
        .rank('product_current_inventory', 
            function() {
                this.orderBy('created_at', 'desc').partitionBy('productId')
            }
        ).where('warehouseId', productInventoryFlat.warehouseId)

        const currentInventoriesForWarehouse = db<ProductInventoryFlat>(rankedInventoriesForWarehouse).select('*').where('product_current_inventory', 1).whereRaw('amount > 0')

        const mock_return: Array<ProductInventoryFlat> = [{id: 1} as ProductInventoryFlat]
        return currentInventoriesForWarehouse
    }
    
    querySingleProductInventory(productInput: ProductInventoryFlat): Promise<ProductInventoryFlat> {
        const query = this.buildProductInventoryQuery(productInput);
        return query.select('*').first().then(
            row => {
                if (row === undefined){
                    console.log("throwing error")
                    throw new Error('Product Inventory does not exist');
                }
                return row
            }
        )
    }

    private buildProductInventoryQuery(productInventoryFlat: ProductInventoryFlat) {
        const query = db<ProductInventoryFlat>('warehouseProductInventory');
        if ('id' in productInventoryFlat) {
            query.andWhere('id', productInventoryFlat.id);
        }
        if ('productId' in productInventoryFlat) {
            query.andWhere('productId', productInventoryFlat.productId);
        }
        if ('warehouseId' in productInventoryFlat) {
            query.andWhere('warehouseId', productInventoryFlat.warehouseId);
        }
        if ('importId' in productInventoryFlat) {
            query.andWhere('importId', productInventoryFlat.importId);
        }
        return query;
    }
}


export default ProductInventoryRepository;
 