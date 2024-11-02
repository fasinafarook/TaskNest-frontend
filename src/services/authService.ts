import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const registerUser = async (username: string, email: string, password: string) => {
    return axios.post(`${API_URL}/user/register`, { username, email, password });
};

export const loginUser = async (email: string, password: string) => {
    return axios.post(`${API_URL}/user/login`, { email, password });
};
