import {User} from "@/models/user.model";

const getUser = (): User | null => {
    const userJson = localStorage.getItem('user');

    if (!userJson) return null;

    return JSON.parse(userJson);
}

export default getUser;