import AxiosInstance from "@/services/axios.service";
import {User} from "@/models/user.model";
import {Company} from "@/models/company.model";

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
    getUserById(userId: User['_id']) {
        return AxiosInstance.get(`/user/${userId}`);
    }

    // Create user
    createUser(user: User) {
        return AxiosInstance.post("/user", user);
    }

    // Update user
    updateUser(user: User) {
        const userId = user._id;
        const userData = {...user};
        delete userData._id;
        return AxiosInstance.put(`/user/${userId}`, userData);
    }

    // Delete user
    deleteUser(userId: User['_id']) {
        return AxiosInstance.delete(`/user/${userId}`);
    }

    // Get artisans by rating
    getArtisansByRating() {
        return AxiosInstance.get("/artisanByRate");
    }

    // Get all artisans
    getAllArtisans() {
        return AxiosInstance.get("/user/artisans");
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
    getUserByEmailOrName(searchType: 'email' | 'name', value: string) {
        return AxiosInstance.get(`/user/${searchType}/${value}`);
    }

    // Update profile picture
    updateProfilePicture(userId: User['_id'], profilePicture: File) {
        const formData = new FormData();
        formData.append("profile_pic", profilePicture);
        return AxiosInstance.post(`/user/${userId}/profile_pic`, formData);
    }

    // Add company to user
    addCompanyToUser(userId: User['_id'], siret: Company['siret']) {
        return AxiosInstance.post(`/user/addCompany`, {
            _id: userId,
            siret
        });
    }

    updateCompanyPictures(userId: User['_id'], { profilePicture, bannerPicture }: { profilePicture?: File, bannerPicture?: File }) {
        const formData = new FormData();
        if (profilePicture) formData.append("profile_pic", profilePicture);
        if (bannerPicture) formData.append("banner_pic", bannerPicture);
        return AxiosInstance.post(`/user/${userId}/company_pic`, formData);
    }
}

export default new UserService();