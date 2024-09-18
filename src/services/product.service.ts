import AxiosInstance from "@/services/axios.service";
import {Product} from "@/models/product.model";

class ProductService {
    // Get all products
    getAllProducts() {
        return AxiosInstance.get("/product");
    }

    // Get product by ID
    getProductById(productId: Product['id']) {
        return AxiosInstance.get(`/product/${productId}`);
    }

    // Create product
    createProduct(product: Product) {
        return AxiosInstance.post("/product", product);
    }

    // Update product
    updateProduct(product: Product) {
        return AxiosInstance.put(`/product/${product.id}`, product);
    }

    // Delete product
    deleteProduct(productId: Product['id']) {
        return AxiosInstance.delete(`/product/${productId}`);
    }
}

export default new ProductService();