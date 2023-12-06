import { Import, ImportInput } from "../../dataInterfaces/importDataInterfaces";
import db from "../db";


class ImportRepository {
    queryImports(importInput: ImportInput): Promise<Import[]> {
        const query = this.buildImportSelectQuery(importInput);
        const importsPromise = query.select('*').then(rows => rows);
        return importsPromise;
    }

    private buildImportSelectQuery(importInput: ImportInput) {
        const query = db<Import>('warehouseProductImport');
        if ('id' in importInput) {
            query.andWhere('id', importInput.id);
        }
        if ('warehouseId' in importInput) {
            query.andWhere('warehouseId', importInput.warehouseId);
        }
        return query;
    }

    async querySingleImport(imported: ImportInput): Promise<Import> {
        const query = this.buildImportSelectQuery(imported);
        return query.select('*').first().then(imported => {
            if (imported === undefined){
                throw new Error('Import does not exist');
            }
            return imported
          });
    }

    insertImport(importData: ImportInput): Promise<Import> {
        const basicImportData = {warehouseId: importData.warehouseId, importedAt: (new Date()).toISOString()}
        return db('warehouseProductImport').insert(basicImportData, '*').then(
            insertedRow => {

            if (insertedRow === undefined || insertedRow.length === 0){
                throw new Error('Import failed');
            }
            return insertedRow[0]
          })
    }
}

export default ImportRepository
