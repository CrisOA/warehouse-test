import ProductService from "../services/productService";
import { ProductInput } from "../dataInterfaces/productDataInterfaces"
import WarehouseService from "../services/warehouseService";
import { WarehouseInput } from "../dataInterfaces/warehouseDataInterfaces";
import { ExportInput } from "../dataInterfaces/exportDataInterfaces";
import { ImportInput } from "../dataInterfaces/importDataInterfaces";


export const resolvers = {
    Query: {
        products: (parent: any, args:any) => {
            const productInput: ProductInput = args.product;
            const productService = new ProductService();
            return productService.getProducts(productInput);
        },
        warehouses: (parent: any, args:any) => {
            const warehouseInput: WarehouseInput = args.warehouse;
            const warehouseService = new WarehouseService();
            const whs = warehouseService.getWarehouses(warehouseInput)
            return whs
        }
    },
    Mutation: {
        createProduct: (parent: any, args: any) => {
            return { 
                id: args.product.id,
                name: args.product.name,
                size: args.product.size, 
                is_hazourdous: args.product.is_hazourdous
            }
        },
        importProducts: (parent: any, args: any) => {
            const importInput: ImportInput = args.import;
            const warehouseService = new WarehouseService();
            const savedImport = warehouseService.importProducts(importInput);
            return savedImport
        },
        exportProducts: (parent: any, args: any) => {
            const exportInput: ExportInput = args.export;
            const warehouseService = new WarehouseService();
            const savedExport = warehouseService.exportProducts(exportInput);
            return savedExport
        }
    }
}