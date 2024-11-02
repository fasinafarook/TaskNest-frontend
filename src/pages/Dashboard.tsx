import React from 'react';
import { clearSession } from '../utils/auth';
interface UserHomeProps {
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  }
  
  const Dashboard: React.FC<UserHomeProps> = ({ setIsAuthenticated }) => {
    const handleLogout = () => {
        clearSession();
        window.location.href = '/'; // Redirect after logout
    };

    return (
        <div>
            <h1>Welcome to the Dashboard</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Dashboard;
