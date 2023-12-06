import { ImportProductBatch, ImportProductBatchInput } from "./importProductBatchInterfaces";
import { Warehouse } from "./warehouseDataInterfaces"

export interface Import {
    id: number;
    productBatches: ImportProductBatch[];
    warehouse: Warehouse;
}

export interface ImportInput {
    id: number;
    productBatches: ImportProductBatchInput[];
    warehouseId: number;
}

export interface ImportConditions{
    size: number;
    containsHazardous: Boolean
}


