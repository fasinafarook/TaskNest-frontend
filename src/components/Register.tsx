import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';
import { saveSession } from '../utils/auth';
import { toast } from 'react-toastify';
import { Form, Button, FormGroup, FormControl, InputGroup } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList } from '@fortawesome/free-solid-svg-icons';

interface RegisterProps {
  setIsAuthenticated: (value: boolean) => void;
}

const RegisterForm: React.FC<RegisterProps> = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validation, setValidation] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  useEffect(() => {
    // Add styles when component mounts
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      body {
        font-family: 'Poppins', sans-serif;
        margin: 0;
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
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
        margin: auto;
      }
      .login-title {
        text-align: center;
        color: #fff;
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
      }
      .input-group {
        margin-bottom: 1.5rem;
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
      .input-icon {
        background-color: transparent !important;
        border-right: none !important;
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
      .error-message {
        color: #e74c3c;
        font-size: 0.9rem;
      }
      .text-center {
        text-align: center;
        color: white;
      }
      .app-name {
        font-size: 2rem;
        font-weight: bold;
        margin-bottom: 1rem;
        text-align: center;
        color: white;
      }
      .intro-text {
        color: #8B6930;
        font-size: 0.9rem;
        font-weight: 400;
        margin-bottom: 1rem;
        text-align: center;
      }
      .intro-icon {
        color: #3498db;
        font-size: 1.5rem;
        margin-right: 0.5rem;
      }
    `;
    document.head.appendChild(styleElement);

    // Cleanup function to remove styles when component unmounts
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const validateForm = () => {
    const newErrors = { username: '', email: '', password: '' };

    if (!username) newErrors.username = 'Username is required';
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setValidation(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await registerUser(username, email, password);
      saveSession(response.data.token);
      setIsAuthenticated(false);
      toast.success('Registration successful!');
      navigate('/');
    } catch (err) {
      toast.error('Registration failed');
    }
  };

  return (
    <div className="login-container">
      <Form onSubmit={handleSubmit} className="register-form">
        <h1 className="app-name">
          <FontAwesomeIcon icon={faClipboardList} className="intro-icon" />
          TaskNest
        </h1>
        <p className="intro-text">
          Join our task management app and stay on top of your daily goals.
        </p>
        <h5 className="login-title">Register</h5>

        <FormGroup className="mb-3">
          <InputGroup>
            <InputGroup.Text className="input-icon">
              <FaUser />
            </InputGroup.Text>
            <FormControl
              type="text"
              className="input-field"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setValidation({ ...validation, username: '' });
              }}
              placeholder="Enter username"
              isInvalid={!!validation.username}
            />
            <FormControl.Feedback type="invalid" className="error-message">
              {validation.username}
            </FormControl.Feedback>
          </InputGroup>
        </FormGroup>

        <FormGroup className="mb-3">
          <InputGroup>
            <InputGroup.Text className="input-icon">
              <FaEnvelope />
            </InputGroup.Text>
            <FormControl
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setValidation({ ...validation, email: '' });
              }}
              placeholder="Enter email"
              isInvalid={!!validation.email}
            />
            <FormControl.Feedback type="invalid" className="error-message">
              {validation.email}
            </FormControl.Feedback>
          </InputGroup>
        </FormGroup>

        <FormGroup className="mb-3">
          <InputGroup>
            <InputGroup.Text className="input-icon">
              <FaLock />
            </InputGroup.Text>
            <FormControl
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setValidation({ ...validation, password: '' });
              }}
              placeholder="Enter password"
              isInvalid={!!validation.password}
            />
            <FormControl.Feedback type="invalid" className="error-message">
              {validation.password}
            </FormControl.Feedback>
          </InputGroup>
        </FormGroup>

        <Button type="submit" className="submit-button">
          Register
        </Button>
      </Form>
      <p className="text-center mt-3">
        Already have an account?{' '}
        <a href="/" style={{ color: '#3498db', textDecoration: 'underline' }}>
          Login
        </a>
      </p>
    </div>
  );
};

export default RegisterForm;
