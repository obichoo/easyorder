import AxiosInstance from "@/services/axios.service";
import {Product} from "@/models/product.model";

class ProductService {
    // Get all products
    getAllProducts() {
        return AxiosInstance.get("/product");
    }

    // Get product by ID
    getProductById(productId: Product['_id']) {
        return AxiosInstance.get(`/product/${productId}`);
    }

    // Create product
    createProduct(product: Product) {
        return AxiosInstance.post("/product", product);
    }

    // Update product
    updateProduct(product: Product) {
        return AxiosInstance.put(`/product/${product._id}`, product);
    }

    // Delete product
    deleteProduct(productId: Product['_id']) {
        return AxiosInstance.delete(`/product/${productId}`);
    }

    // Get new products
    getNewProducts() {
        return AxiosInstance.get("/product/newProduct");
    }

    // Get products by user id
    getProductsByUserId(userId: Product['artisan_id']) {
        return AxiosInstance.get(`/product/userProduct/${userId}`);
    }

    // Upload product pictures
    uploadProductPictures(productId: Product['_id'], pictures: any) {
        const formData = new FormData();

        for (let i = 0; i < pictures?.length; i++) {
            formData.append('pictures', pictures[i]);
        }

        return AxiosInstance.post(`/product/${productId}/addPictures`, formData);
    }
}

export default new ProductService();