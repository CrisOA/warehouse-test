import { ProductInventory } from "./inventoryDataInterfaces";

export interface Warehouse {
    id: number;
    name: string;
    size: number;
    status: WarehouseStatus;
    currentInventory: ProductInventory[];
}

export interface WarehouseInput {
    id: number;
    name: string;
    size: number;
    withStatus: boolean;
    withCurrentInventory: boolean;
}

export interface WarehouseStatus {
    availableSpace: number;
    acceptsHazardousProducts: Boolean;
    isEmpty: Boolean;
}

