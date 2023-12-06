import ExportProductBatchRepository from "../database/repositories/exportProductBatchRepository";
import { Export } from "../dataInterfaces/exportDataInterfaces";
import { ExportProductBatch, ExportProductBatchInput } from "../dataInterfaces/exportProductBatchInterfaces";
import { ProductInput } from "../dataInterfaces/productDataInterfaces"
import ProductService from "./productService";


class ExportProductBatchService {

    getProductBatches(productBatchesIds: number[]): Promise<ExportProductBatch[]> {
        const productBatchRepository = new ExportProductBatchRepository();
        return productBatchRepository.queryExportProductBatches(productBatchesIds)
    }

    getProductBatchesForExport(exportId: number): Promise<ExportProductBatch[]> {
        const productBatchRepository = new ExportProductBatchRepository();
        return productBatchRepository.queryProductBatchesForExport(exportId)
    }

    async loadProductInBatches(prodBatches: ExportProductBatchInput[]):  Promise<ExportProductBatch[]>{
        const batchesWithProducts: Array<ExportProductBatch> = []
        const productService = new ProductService();
        for (const batch of prodBatches){
            const productInput = {id: batch.productId} as ProductInput
            const product = await productService.getSingleProduct(productInput) 
            const batchWithProd = {
                id: batch.id,
                amount: batch.amount,
                product: product
            } as ExportProductBatch
            batchesWithProducts.push(batchWithProd)
        }
        return batchesWithProducts
    }

    async saveProductBatches(exported: Export, productBatchesInput: ExportProductBatchInput[]): Promise<ExportProductBatchInput[]> {
        const productService = new ProductService();
        const productBatches: Array<ExportProductBatchInput> = [];
        for (const productBatchInput of productBatchesInput){
            const productInput = {id: productBatchInput.productId} as ProductInput;
            const product = await productService.getSingleProduct(productInput);
            const productBatch = {
                productId: product.id, 
                amount: productBatchInput.amount, 
                exportId: exported.id
            } as ExportProductBatchInput

            productBatches.push(productBatch)
        }
        const exportProductBatchRepository = new ExportProductBatchRepository()
        const savedProductBatchesIds = await exportProductBatchRepository.insertExportProductBatches(productBatches);
        return savedProductBatchesIds
    }
}

export default ExportProductBatchService;
