import { Import, ImportConditions, ImportInput } from "../dataInterfaces/importDataInterfaces";
import { ImportProductBatchInput } from "../dataInterfaces/importProductBatchInterfaces";
import { ProductInput } from "../dataInterfaces/productDataInterfaces";
import ImportRepository from "../database/repositories/importRepository";
import ProductBatchService from "./importProductBatchService";
import ProductService from "./productService";


class ImportService {

    async importProducts(importInput: ImportInput): Promise<Import> { 
        const importRepository = new ImportRepository()
        const savedImport = await importRepository.insertImport(importInput)
        const importedWithBatches = await this.saveProductBatchesForImport(savedImport, importInput.productBatches)
        return importedWithBatches;
    }

    async getImportConditions(importInput: ImportInput): Promise<ImportConditions> {
        let importSize = 0;
        let importContainHazardous = new Boolean(false)
        let firstBatch = true
        const productService = new ProductService();
        for (const batch of importInput.productBatches){
            const product = await productService.getSingleProduct({id: batch.productId} as ProductInput)
            importSize += product.size * batch.amount
            if (firstBatch){
                importContainHazardous = product.isHazardous
                firstBatch = false
            }
            if (importContainHazardous != product.isHazardous){
                throw new Error("Error, import hazardousness inconsistent (mixed)")
            }
        }
        if (importSize == 0){
            throw new Error("Error Import size unable to be determined")
        }

        if (importContainHazardous == undefined){
            throw new Error("Error Import hazardousness unable to be determined")
        }
        return {size: importSize, containsHazardous: importContainHazardous}
    }
 
    async saveProductBatchesForImport(imported: Import, productBatches: ImportProductBatchInput[]): Promise<Import> {
        const productBatchService = new ProductBatchService();
        const savedProductBatches = await productBatchService.saveProductBatches(imported, productBatches);
        const batchesWithProducts = await productBatchService.loadProductInBatches(savedProductBatches)
        imported.productBatches = batchesWithProducts
        return imported;
    }

}


export default ImportService;

