import axios from 'axios';

// const DEV_BASE = "http://localhost:3000";

const api = axios.create({
    // baseURL: process.env.REACT_APP_BASE_URL || DEV_BASE,
    withCredentials: true
});

// const withCredentials = (api) => {
//     api.
// }
export default api;
