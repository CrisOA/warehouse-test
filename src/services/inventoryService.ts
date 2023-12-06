import { Export } from "../dataInterfaces/exportDataInterfaces";
import { Import } from "../dataInterfaces/importDataInterfaces";
import { ProductInventory, ProductInventoryFlat } from "../dataInterfaces/inventoryDataInterfaces";
import { ProductInput } from "../dataInterfaces/productDataInterfaces";
import { Warehouse } from "../dataInterfaces/warehouseDataInterfaces";
import ProductInventoryRepository from "../database/repositories/productInventoryRepository";
import ProductService from "./productService";

class InventoryService {

    async updateInventoryFromExport(exported: Export, currentInventory: ProductInventory[]) {
        const inventoryRepository = new ProductInventoryRepository();
        const newProductInventories : Array<ProductInventoryFlat> = [];
        const inventoriesByProductId = new Map(currentInventory.map(inventory => [inventory.product.id, inventory]));
        for (const batch of exported.productBatches){
            const inventory = inventoriesByProductId.get(batch.product.id);
            if (inventory == undefined){
                throw new Error("Error, Product no longer available")
            }
            const newInventory = {
                warehouseId:  exported.warehouse.id,
                productId:  batch.product.id,
                amount: inventory.amount - batch.amount,
            } as ProductInventoryFlat;

            newProductInventories.push(newInventory);
        }
        
        inventoryRepository.insertProductInventories(newProductInventories);
    }

    async getInventoriesForWarehouse(warehouse: Warehouse): Promise<ProductInventory[]> {
        const inventoryRepository = new ProductInventoryRepository();

        const productService = new ProductService();
        const inventoryFlatForWarehouse = {warehouseId: warehouse.id} as ProductInventoryFlat;
        const currentInventories = await inventoryRepository.queryCurrentProductInventories(inventoryFlatForWarehouse);

        const currentInventoriesWithProduct: Array<ProductInventory> = [];

        for (const productInventory of currentInventories){
            const product = await productService.getSingleProduct({id: productInventory.productId} as ProductInput)
            const prodInventoryWithProduct = {
                id: productInventory.id,
                amount: productInventory.amount,
                product: product,
            } as ProductInventory;

            currentInventoriesWithProduct.push(prodInventoryWithProduct);
        }
        return currentInventoriesWithProduct;
    }

    getInventories(InventoryFlat: ProductInventoryFlat): Promise<ProductInventoryFlat[]> {
        const inventoryRepository = new ProductInventoryRepository();
        return inventoryRepository.queryProductInventories(InventoryFlat);
    }

    updateInventoryFromImport(imported: Import, currentProductInventories: ProductInventory[]) {
        const inventoryRepository = new ProductInventoryRepository();
        const newProductInventories : Array<ProductInventoryFlat> = [];
        const inventoriesByProductId = new Map(currentProductInventories.map(inventory => [inventory.product.id, inventory]));
        for (const batch of imported.productBatches){
            const inventory = inventoriesByProductId.get(batch.product.id);
            const newInventory = {
                warehouseId:  imported.warehouse.id,
                productId:  batch.product.id,
                amount:  batch.amount
            } as ProductInventoryFlat;

            if (inventory != undefined){
                newInventory.amount += inventory.amount;
            }
            newProductInventories.push(newInventory);
        }
        inventoryRepository.insertProductInventories(newProductInventories);
    }
}

export default InventoryService;
