import { ImportProductBatch, ImportProductBatchInput } from "../../dataInterfaces/importProductBatchInterfaces";
import db from "../db"


class ImportProductBatchRepository {

    queryProductBatches(productBatchIds: number[]): Promise<ImportProductBatch[]> {
        const query = db<ImportProductBatch>('importProductBatch')
            .whereIn('id', productBatchIds)
            .innerJoin(
                'product', 
                'product.id', 
                '=', 
                'importProductBatch.productId'
            ).then(rows => rows)
        
        return query;
    }

    queryProductBatchesForImport(importId: number): Promise<ImportProductBatch[]> {
        const query = db<ImportProductBatch>('importProductBatch')
            .select('*')
            .where('importId', importId)
            .innerJoin(
                'product', 
                'product.id', 
                '=', 
                'importProductBatch.productId'
            ).then(rows => rows)
        
        return query;
    }

    insertProductBatches(productBatches: ImportProductBatchInput[]): Promise<ImportProductBatchInput[]> {
        return db('importProductBatch').insert(productBatches, '*').then(
            insertedRows => {
            if (insertedRows === undefined || insertedRows.length === 0){
                throw new Error('Import failed');
            }
            return insertedRows
          })
    }
}


export default ImportProductBatchRepository;
 