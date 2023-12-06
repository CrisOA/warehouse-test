import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("product").del();
    await knex("warehouse").del();
    await knex("warehouseProductInventory").del();
    await knex("importProductBatch").del();
    await knex("exportProductBatch").del();
    await knex("warehouseProductImport").del();;
    await knex("warehouseProductExport").del();

    // Inserts seed entries
    await knex("product").insert([
        { name: "Prod A" , size: 2, isHazardous: true },
        { name: "Prod B" , size: 3, isHazardous: false },
        { name: "Prod C" , size: 4, isHazardous: true },
        { name: "Prod D" , size: 5, isHazardous: false },
        { name: "Prod F" , size: 4, isHazardous: true },
        { name: "Prod G" , size: 3, isHazardous: false },
        { name: "Prod H" , size: 6, isHazardous: true },
    ]);

    await knex("warehouse").insert([
        { name: "WH Z" , size: 20 },
        { name: "WH Y" , size: 30 },
        { name: "WH X" , size: 35 },
        { name: "WH T" , size: 28 },
    ]);
};
