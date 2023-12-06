import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('warehouseProductImport',
    (table: Knex.TableBuilder) => {
        table.increments('id').primary().notNullable().unique();
        table.integer('warehouseId').notNullable().references('id').inTable('warehouse')
        table.dateTime("importedAt").notNullable();
        table.timestamps(false, true);
    })
}


export async function down(knex: Knex): Promise<void> {
}

