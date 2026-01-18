import axios from 'axios';
//'http://localhost:5000/api'
const api = axios.create({
    baseURL: 'https://tech-sprint-ragnarok.vercel.app/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
