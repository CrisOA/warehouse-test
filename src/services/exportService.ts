import { Export, ExportInput } from "../dataInterfaces/exportDataInterfaces";
import { ExportProductBatchInput } from "../dataInterfaces/exportProductBatchInterfaces";
import ExportRepository from "../database/repositories/exportRepository";
import ExportProductBatchService from "./exportProductBatchService";



class ExportService {

    async exportProducts(exportInput: ExportInput): Promise<Export> { 
        const exportRepository = new ExportRepository()
        const savedExport = await exportRepository.insertExport(exportInput)
        const exportedWithBatches = await this.saveProductBatchesForExport(savedExport, exportInput.productBatches)
        return exportedWithBatches;
    }

    async saveProductBatchesForExport(exported: Export, productBatches: ExportProductBatchInput[]): Promise<Export> {
        const exportProductBatchService = new ExportProductBatchService();
        const savedProductBatches = await exportProductBatchService.saveProductBatches(exported, productBatches);
        const batchesWithProducts = await exportProductBatchService.loadProductInBatches(savedProductBatches)
        exported.productBatches = batchesWithProducts
        return exported;
    }
}

export default ExportService
