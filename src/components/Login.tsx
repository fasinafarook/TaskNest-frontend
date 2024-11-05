import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { saveSession } from '../utils/auth';
import toast, { Toaster } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { Form, FormGroup, Input, Button } from 'reactstrap';
import { faClipboardList } from '@fortawesome/free-solid-svg-icons';


interface LoginProps {
  setIsAuthenticated: (value: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const styles = `
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

      body {
        font-family: 'Poppins', sans-serif;
        margin: 0;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        background: linear-gradient(135deg, #1a1a1a, #444);
      }

      .login-container {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        padding: 2.5rem;
        width: 100%;
        max-width: 400px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.3);
      }

      .login-title {
        text-align: center;
        color: #fff;
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
      }

      .input-group {
        margin-bottom: 1.5rem;
        position: relative;
      }

      .input-field {
        width: 100%;
        padding: 1rem 1rem 1rem 2.5rem;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 1rem;
        transition: border 0.3s ease, box-shadow 0.3s ease;
        background-color: rgba(255, 255, 255, 0.2);
        color: white;
      }

      .input-field:focus {
        border-color: #3498db;
        box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
        outline: none;
      }

      .input-icon {
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        color: #ccc;
      }

      .submit-button {
        background: #3498db;
        color: #fff;
        border: none;
        border-radius: 6px;
        padding: 1rem;
        font-size: 1.1rem;
        cursor: pointer;
        font-weight: 600;
        width: 100%;
        transition: background 0.3s ease;
        box-shadow: 0 4px 10px rgba(52, 152, 219, 0.3);
      }

      .submit-button:hover {
        background: #2980b9;
      }

      .error-message {
        color: #e74c3c;
        text-align: center;
        margin-bottom: 1rem;
        font-size: 0.9rem;
      }

      .field-error {
        color: #e74c3c;
        font-size: 0.85rem;
        margin-top: 0.3rem;
      }

      .text-center {
        text-align: center;
        color: white;
      }

      .intro-text {
  display: flex;
  align-items: center;
  color: #8B6930;
  font-size: 1rem;
  font-weight: 400;
  margin-bottom: 0.9rem;
  text-align: center;
}

.intro-icon {
  margin-right: 0.5rem;
  color: #3498db; /* Icon color */
  font-size: 1.5rem; /* Increase icon size */
}
.app-name {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center; /* Center the text */
}

    `;

    const styleElement = document.createElement('style');
    styleElement.innerHTML = styles;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;

    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (!valid) return;

    try {
      const response = await loginUser(email, password);
      saveSession(response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
      toast.error('Invalid username or password');
    }
  };

  return (
    <>
      <Toaster />
      <div className="login-container">
        <Form onSubmit={handleSubmit}>
        <h1 className="app-name">
        <FontAwesomeIcon icon={faClipboardList} className="intro-icon" />
        TaskNest</h1>
        <p className="intro-text">
          Stay organized and boost your productivity.
        </p>
        <h3 className="login-title">Login</h3>
        
          {error && <p className="error-message">{error}</p>}

          <FormGroup className="input-group">
            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="input-field"
            />
            {emailError && <p className="field-error">{emailError}</p>}
          </FormGroup>

          <FormGroup className="input-group">
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="input-field"
            />
            {passwordError && <p className="field-error">{passwordError}</p>}
          </FormGroup>

          <Button type="submit" className="submit-button">
            Login
          </Button>
        </Form>

        <p className="text-center">
          Don't have an account?{' '}
          <a href="/register" style={{ color: '#3498db', textDecoration: 'underline' }}>
            Sign Up
          </a>
        </p>
      </div>
    </>
  );
};

export default Login;
