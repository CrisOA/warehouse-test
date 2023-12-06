
import { ExportProductBatch, ExportProductBatchInput } from "./exportProductBatchInterfaces";
import { Warehouse } from "./warehouseDataInterfaces"

export interface Export {
    id: number;
    productBatches: ExportProductBatch[];
    warehouse: Warehouse;
}

export interface ExportInput {
    id: number;
    productBatches: ExportProductBatchInput[];
    warehouseId: number;
}

