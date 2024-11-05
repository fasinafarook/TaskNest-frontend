import axios from 'axios';
import { getSession } from '../utils/auth';

const API_URL = 'http://localhost:5000/api';


const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  api.interceptors.request.use((config) => {
    const token = getSession();
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  });
  

export const registerUser = async (username: string, email: string, password: string) => {
    return api.post(`/user/register`, { username, email, password });
};

export const loginUser = async (email: string, password: string) => {
    return api.post(`/user/login`, { email, password });
};
// Fetch all tasks
export const fetchTasks = async () => {
    const response = await api.get(`/task`);
    return response.data;
  };
  
  // Create a new task
  export const createTask = async (task: { title: string; status: 'pending' | 'completed' }) => {
    const response = await api.post(`/task`, task);
    return response.data;
  };
  
  // Update a task
  export const updateTask = async (id: string, updatedTask: { title: string; status: 'pending' | 'completed' }) => {
    const response = await api.put(`/task/${id}`, updatedTask);
    return response.data;
  };


  export const completeTask = async (taskId: string) => {
    const response = await api.patch(`/task/${taskId}`, {
        status: 'completed',
    });
    return response.data;
};
  
  // Delete a task
  export const deleteTask = async (id: string) => {
    const response = await api.delete(`/task/${id}`);
    return response.data;
  };
