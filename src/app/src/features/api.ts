import axios from 'axios';

const api = (token:string|undefined) => {
    if (!token) {
        return axios.create({
            baseURL: process.env.REACT_APP_BASE_URL,
            withCredentials: true,
        });
    }    
    return axios.create({
        baseURL: process.env.REACT_APP_BASE_URL,
        withCredentials: true,
        headers: {
            "Authorization": token
        }
    });
}

export default api;
