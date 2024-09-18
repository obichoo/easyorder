import AxiosInstance from "@/services/axios.service";
import {Category} from "../models/category.model";

export class CategoryService{
    // Get all categories
    getAllCategories() {
        return AxiosInstance.get("/category");
    }

    // Get category by ID
    getCategoryById(categoryId: Category['id']) {
        return AxiosInstance.get(`/category/${categoryId}`);
    }

    // Create category
    createCategory(category: Category) {
        return AxiosInstance.post("/category", category);
    }

    // Update category
    updateCategory(category: Category) {
        return AxiosInstance.put(`/category/${category.id}`, category);
    }

    // Delete category
    deleteCategory(categoryId: Category['id']) {
        return AxiosInstance.delete(`/category/${categoryId}`);
    }
}

export default new CategoryService();