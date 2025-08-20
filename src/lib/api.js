import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
    baseURL: "http://localhost:5000/api/v1",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});


api.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            const msg = error.response.data?.message || error.message;
            console.error(msg);
            toast.error(msg);
        } else if (error.request) {
            console.error("Network Error:", error.message);
            toast.error("Network Error: " + error.message);
        } else {
            console.error("Config Error:", error.message);
            toast.error("Config Error: " + error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
