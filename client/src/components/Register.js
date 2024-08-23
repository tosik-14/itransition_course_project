import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo_light from '../images/logo_light.jpg'

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const apiUrl = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/api/auth/register`, { name, email, password });
      //await axios.post(`http://localhost:5000/api/auth/register`, { name, email, password });
      navigate('/register');
      navigate('/register');
      navigate('/login');
    } catch (err) {
      alert('Registration failed');
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };
  const handleHomePage = () => {
    navigate('/collections');
  };

//<div className="container d-flex justify-content-center align-items-center vh-100">
//</div>

  return (
    <div className="container-fluid">
      
      <div className="d-flex justify-content-center align-items-start" style={{ paddingRight: '50px', marginTop: '10px' }}>
        
          <button className="btn btn-wight me-2" onClick={handleHomePage}>
            <img src={logo_light} alt="Unblock" style={{ width: '350px' }} />
          </button>
        
      </div>

      
        
        <div className="position-absolute top-50 start-50 translate-middle w-25"> 
          <h2 className="text-center mb-4">Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Name</label>
              <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label>Email</label>
              <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label>Password</label>
              <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <button type="submit" className="btn btn-primary">Register</button>
              <button type="button" onClick={handleLoginRedirect} className="btn btn-link">Login</button>
            </div>
          </form>
        </div>
      
      

    </div>
  );
}

export default Register;