import axios from 'axios';

// const DEV_BASE = "http://localhost:3000";

const api = (token:string|undefined) => {
    if (!token) {
        return axios.create({
            // baseURL: process.env.REACT_APP_BASE_URL || DEV_BASE,
            withCredentials: true,
        });
    }    
    return axios.create({
        // baseURL: process.env.REACT_APP_BASE_URL || DEV_BASE,
        withCredentials: true,
        headers: {
            "Authorization": token
        }
    });
}

export default api;
