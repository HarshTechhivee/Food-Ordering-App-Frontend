import axios from "axios";

const refreshClient = axios.create({
    baseURL: process.env.API_BASE_URL,
    timeout: 10000,
    withCredentials: true,
});

export default refreshClient;