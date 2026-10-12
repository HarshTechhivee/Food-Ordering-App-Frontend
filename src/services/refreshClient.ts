import axios from "axios";

const refreshClient = axios.create({
    baseURL: import.meta.env.API_BASE_URL,
    timeout: 10000,
    withCredentials: true,
});

export default refreshClient;