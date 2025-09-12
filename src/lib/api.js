import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL

const api = axios.create({
    baseURL: `${API_URL}/api/v1`,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 60000,
});


api.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            const msg = error.response.data?.message || error.message;
            console.error(msg);
        } else if (error.request) {
            console.error("Network Error:", error.message);
            // toast.error(error.message);
        } else {
            console.error("Config Error:", error.message);
            // toast.error("Config Error: " + error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
