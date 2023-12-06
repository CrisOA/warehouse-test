import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('product',
    (table: Knex.TableBuilder) => {
        table.increments('id').primary().notNullable().unique();
        table.string('name', 100).notNullable();
        table.integer('size').notNullable();
        table.boolean('isHazardous').defaultTo(false);
        table.timestamps(false, true)
    })
}


export async function down(knex: Knex): Promise<void> {
}

