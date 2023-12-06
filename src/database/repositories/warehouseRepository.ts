import db from "../db"
import { WarehouseInput, Warehouse } from "../../dataInterfaces/warehouseDataInterfaces"


class WharehouseRepository {
    queryWarehouses(warehouseInput: WarehouseInput): Promise<Warehouse[]> {
        const query = this.buildWarehousesQuery(warehouseInput);
        const warehouses = query.select('*').then(rows => rows);
        return warehouses
    }
    private buildWarehousesQuery(warehouseInput: WarehouseInput) {
        const query = db<Warehouse>('warehouse');
        if ('id' in warehouseInput) {
            query.andWhere('id', warehouseInput.id);
        }
        if ('size' in warehouseInput) {
            query.andWhere('size', warehouseInput.size);
        }
        if ('name' in warehouseInput) {
            query.andWhereLike('name', "%" + warehouseInput.name + "%");
        }
        return query;
    }

    querySingleWarehouse(warehouseInput: WarehouseInput): Promise<Warehouse> {
        const query = this.buildWarehousesQuery(warehouseInput);
        return query.select('*').first().then(
            row => {
                if (row === undefined){
                    throw new Error('Warehouse does not exist');
                }
                return row
            }
        )
    }
}


export default WharehouseRepository;
 