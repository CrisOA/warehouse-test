import db from "../db"
import { ProductInput, Product } from "../../dataInterfaces/productDataInterfaces"


class ProductRepository {
    queryProducts(productInput: ProductInput): Promise<Product[]> {
        const query = this.buildProductQuery(productInput);
        const products = query.select('*').then(rows => rows);
        return products
    }

    querySingleProduct(productInput: ProductInput): Promise<Product> {
        const query = this.buildProductQuery(productInput);
        return query.select('*').first().then(
            row => {
                if (row === undefined){
                    console.log("throwing error")
                    throw new Error('Product does not exist');
                }
                return row
            }
        )
    }

    private buildProductQuery(productInput: ProductInput) {
        const query = db<Product>('product');
        if ('id' in productInput) {
            query.andWhere('id', productInput.id);
        }
        if ('size' in productInput) {
            query.andWhere('size', productInput.size);
        }
        if ('isHazardous' in productInput) {
            query.andWhere('isHazardous', productInput.isHazardous);
        }
        if ('name' in productInput) {
            query.andWhereLike('name', "%" + productInput.name + "%");
        }
        return query;
    }
}


export default ProductRepository;
 