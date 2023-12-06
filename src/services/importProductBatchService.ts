import ProductBatchRepository from "../database/repositories/importProductBatchRepository";
import { Import } from "../dataInterfaces/importDataInterfaces";
import { ImportProductBatch, ImportProductBatchInput } from "../dataInterfaces/importProductBatchInterfaces";
import { ProductInput } from "../dataInterfaces/productDataInterfaces"
import ProductService from "./productService";


class ImportProductBatchService {

    getProductBatches(productBatchesIds: number[]): Promise<ImportProductBatch[]> {
        const productBatchRepository = new ProductBatchRepository();
        return productBatchRepository.queryProductBatches(productBatchesIds)
    }

    getProductBatchesForImport(importId: number): Promise<ImportProductBatch[]> {
        const productBatchRepository = new ProductBatchRepository();
        return productBatchRepository.queryProductBatchesForImport(importId)
    }

    async loadProductInBatches(prodBatches: ImportProductBatchInput[]):  Promise<ImportProductBatch[]>{
        const batchesWithProducts: Array<ImportProductBatch> = []
        const productService = new ProductService();
        for (const batch of prodBatches){
            const productInput = {id: batch.productId} as ProductInput
            const product = await productService.getSingleProduct(productInput) 
            const batchWithProd = {
                id: batch.id,
                amount: batch.amount,
                product: product
            } as ImportProductBatch
            batchesWithProducts.push(batchWithProd)
        }
        return batchesWithProducts
    }

    async saveProductBatches(imported: Import, productBatchesInput: ImportProductBatchInput[]): Promise<ImportProductBatchInput[]> {
        const productService = new ProductService();
        const productBatches: Array<ImportProductBatchInput> = [];
        for (const productBatchInput of productBatchesInput){
            const productInput = {id: productBatchInput.productId} as ProductInput;
            const product = await productService.getSingleProduct(productInput);
            const productBatch = {
                productId: product.id, 
                amount: productBatchInput.amount, 
                importId: imported.id
            } as ImportProductBatchInput
            productBatches.push(productBatch)
        }
        const productBatchRepository = new ProductBatchRepository()
        const savedProductBatchesIds = await productBatchRepository.insertProductBatches(productBatches);
        return savedProductBatchesIds
    }
}

export default ImportProductBatchService;
