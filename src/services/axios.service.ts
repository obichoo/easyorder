import axios from "axios";

// Axios Interceptor Instance
const AxiosInstance = axios.create({
    baseURL: "https://easyorder-back.onrender.com/easyorder/v1"
});

AxiosInstance.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        // Handle request errors here
        return Promise.reject(error);
    }
);

AxiosInstance.interceptors.response.use(
    (response) => {
        // Can be modified response
        return response;
    },
    (error) => {
        // Handle response errors here
        return Promise.reject(error);
    }
);

export default AxiosInstance;