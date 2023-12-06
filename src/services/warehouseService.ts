import WarehouseRepository from "../database/repositories/warehouseRepository";
import { Export, ExportInput } from "../dataInterfaces/exportDataInterfaces";
import { Import, ImportConditions, ImportInput } from "../dataInterfaces/importDataInterfaces";
import { ProductInventory } from "../dataInterfaces/inventoryDataInterfaces";
import { WarehouseInput, Warehouse, WarehouseStatus } from "../dataInterfaces/warehouseDataInterfaces"
import ExportService from "./exportService";
import ImportService from "./importService";
import InventoryService from "./inventoryService";


class WarehouseService {

    async getWarehouses(warehouseInput: WarehouseInput): Promise<Warehouse[]> {
        const warehouseRepository = new WarehouseRepository();
        const warehouses = await warehouseRepository.queryWarehouses(warehouseInput);
        for (const warehouse of warehouses){
            await this.addInventoryAndStatus(warehouse);
        }
        
        return warehouses
    }

    private async addInventoryAndStatus(warehouse: Warehouse) {
        const inventoryService = new InventoryService();
        warehouse.currentInventory = await inventoryService.getInventoriesForWarehouse(warehouse);
        warehouse.status = this.getWarehouseStorageState(warehouse);
    }

    async getSingleWarehouse(warehouseInput: WarehouseInput): Promise<Warehouse> {
        const warehouseRepository = new WarehouseRepository();
        const warehouse = await warehouseRepository.querySingleWarehouse(warehouseInput);
        await this.addInventoryAndStatus(warehouse);
        return warehouse;
    }

    async importProducts(importInput: ImportInput): Promise<Import> {
        const warehouseInput = {id: importInput.warehouseId} as WarehouseInput;
        const warehouse = await this.getSingleWarehouse(warehouseInput)

        const importService = new ImportService();
        const importConditions = await importService.getImportConditions(importInput);

        this.assessIfImportCanBeAccepted(warehouse.status, importConditions);
        const imported =  await importService.importProducts(importInput);
        imported.warehouse = warehouse

        const inventoryService = new InventoryService();
        inventoryService.updateInventoryFromImport(imported, warehouse.currentInventory);

        const updatedWarehouse = await this.getSingleWarehouse(warehouseInput)

        imported.warehouse = updatedWarehouse;

        return imported;
    }

    async exportProducts(exportInput: ExportInput): Promise<Export> {
        const warehouseInput = {id: exportInput.warehouseId} as WarehouseInput;
        const warehouse = await this.getSingleWarehouse(warehouseInput)

        this.assessIfExportCanBeAccepted(warehouse.currentInventory, exportInput);
    
        const exportService = new ExportService()
        const exported =  await exportService.exportProducts(exportInput);
        exported.warehouse = warehouse

        const inventoryService = new InventoryService();
        inventoryService.updateInventoryFromExport(exported, warehouse.currentInventory);

        const updatedWarehouse = await this.getSingleWarehouse(warehouseInput)
        exported.warehouse = updatedWarehouse;

        return exported;
    }

    private assessIfImportCanBeAccepted(warehouseStatus: WarehouseStatus, importConditions: ImportConditions) {
        if (warehouseStatus.availableSpace < importConditions.size){
            throw new Error("Error, not enough available space");
        }
        if ((!warehouseStatus.isEmpty) && (warehouseStatus.acceptsHazardousProducts != importConditions.containsHazardous)){
            throw new Error("Error, Hazardousness issues ");
        }
    }

    private assessIfExportCanBeAccepted(currentInventory: ProductInventory[], toExport: ExportInput) {
        const inventoriesByProductId = new Map(currentInventory.map(inventory => [inventory.product.id, inventory]));
        for (const batch of toExport.productBatches){
            const productInventory = inventoriesByProductId.get(batch.productId)
            if (productInventory == undefined ){
                throw new Error("Error Product not in Storage")
            }
            if(productInventory.amount < batch.amount) {
                throw new Error("Error not enough existences of Product")
            }
        }
    }
   
    private getWarehouseStorageState(warehouse: Warehouse): WarehouseStatus {
        let spaceAvailable = warehouse.size;
        let acceptsHazardousProducts: Boolean = false;
        let isEmpty: Boolean = true;
        for (const productInventory of warehouse.currentInventory){
            spaceAvailable -= productInventory.amount * productInventory.product.size;
            acceptsHazardousProducts = acceptsHazardousProducts || productInventory.product.isHazardous;
            isEmpty = false;
        }
        
        return {
                availableSpace: spaceAvailable, 
                acceptsHazardousProducts: acceptsHazardousProducts, 
                isEmpty:isEmpty
            };
    }

}

export default WarehouseService;
