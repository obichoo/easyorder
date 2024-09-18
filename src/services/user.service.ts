import AxiosInstance from "@/services/axios.service";
import {User} from "@/models/user.model";

class UserService {
    // Login
    login(email: string, password: string) {
        return AxiosInstance.post("/user/login", {email, password});
    }

    // Get all users
    getAllUsers() {
        return AxiosInstance.get("/user");
    }

    // Get user by ID
    getUserById(userId: number) {
        return AxiosInstance.get(`/user/${userId}`);
    }

    // Create user
    createUser(user: User) {
        return AxiosInstance.post("/user", user);
    }

    // Update user
    updateUser(user: User) {
        return AxiosInstance.put(`/user/${user.id}`, user);
    }

    // Delete user
    deleteUser(userId: number) {
        return AxiosInstance.delete(`/user/${userId}`);
    }

    // Get artisans by rating
    getArtisansByRating() {
        return AxiosInstance.get("/artisanByRate");
    }

    // Get all artisans
    getAllArtisans() {
        return AxiosInstance.get("/artisans");
    }

    // Get all clients
    getAllClients() {
        return AxiosInstance.get("/clients");
    }

    // Get companies
    getCompanies() {
        return AxiosInstance.get("/company");
    }

    // Get new artisans
    getNewArtisans() {
        return AxiosInstance.get("/newArtisans");
    }

    // Get user by email or name
    getUserByEmailOrName(searchType: User['email'] | User['name'], value: string) {
        return AxiosInstance.get(`/${searchType}/${value}`);
    }

    // Update profile picture
    updateProfilePicture(userId: number, profilePicture: File) {
        const formData = new FormData();
        formData.append("profile_pic", profilePicture);
        return AxiosInstance.post(`/user/${userId}/profile_pic`, formData);
    }
}

export default new UserService();