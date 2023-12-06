import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('exportProductBatch',
    (table: Knex.TableBuilder) => {
        table.increments('id').primary().notNullable().unique();
        table.integer('amount').notNullable();
        table.integer('productId').notNullable().references('id').inTable('product')
        table.integer('exportId').notNullable().references('id').inTable('warehouseProductExport')
        table.timestamps(false, true);
        table.check('?? >= 0', ['amount'])
    })
}


export async function down(knex: Knex): Promise<void> {
}

