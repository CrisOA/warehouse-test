import { Export, ExportInput } from "../../dataInterfaces/exportDataInterfaces";
import db from "../db";



class ExportRepository {
    queryExports(exportInput: ExportInput): Promise<Export[]> {
        const query = this.buildExportSelectQuery(exportInput);
        const exportsPromise = query.select('*').then(rows => rows);
        return exportsPromise;
    }

    private buildExportSelectQuery(exportInput: ExportInput) {
        const query = db<Export>('warehouseProductExport');
        if ('id' in exportInput) {
            query.andWhere('id', exportInput.id);
        }
        if ('warehouseId' in exportInput) {
            query.andWhere('warehouseId', exportInput.warehouseId);
        }
        return query;
    }

    insertExport(exportInput: ExportInput): Promise<Export> {
        const basicExportData = {warehouseId: exportInput.warehouseId, exportedAt: (new Date()).toISOString()}
        return db('warehouseProductExport').insert(basicExportData, '*').then(
            insertedRow => {
                if (insertedRow === undefined || insertedRow.length === 0){
                    throw new Error('Export failed');
                }
                return insertedRow[0]
          })
    }
}

export default ExportRepository
