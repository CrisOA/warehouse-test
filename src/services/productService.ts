import ProductRepository from "../database/repositories/productRepository";
import { ProductInput, Product } from "../dataInterfaces/productDataInterfaces"


class ProductService {

    getProducts(productInput: ProductInput): Promise<Product[]> {
        const productRepository = new ProductRepository();
        return productRepository.queryProducts(productInput)
    }

    getSingleProduct(productInput: ProductInput): Promise<Product> {
        const productRepository = new ProductRepository();
        return productRepository.querySingleProduct(productInput)
    }
}

export default ProductService;
