import { ExportProductBatch, ExportProductBatchInput } from "../../dataInterfaces/exportProductBatchInterfaces";
import db from "../db"


class ExportProductBatchRepository {

    queryExportProductBatches(productBatchIds: number[]): Promise<ExportProductBatch[]> {
        const query = db<ExportProductBatch>('exportProductBatch')
            .whereIn('id', productBatchIds)
            .then(rows => rows)
        
        return query;
    }

    queryProductBatchesForExport(exportId: number): Promise<ExportProductBatch[]> {
        const query = db<ExportProductBatch>('exportProductBatch')
            .select('*')
            .where('exportId', exportId)
            .then(rows => rows)
        return query;
    }

    insertExportProductBatches(productBatches: ExportProductBatchInput[]): Promise<ExportProductBatchInput[]> {
        return db<ExportProductBatchInput>('exportProductBatch').insert(productBatches, '*').then(
            insertedRows => {
            if (insertedRows === undefined || insertedRows.length === 0){
                throw new Error('Export failed');
            }
            return insertedRows
          })
    }
}


export default ExportProductBatchRepository;
 