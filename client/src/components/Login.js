import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo_light from '../images/logo_light.jpg'

const apiUrl = process.env.REACT_APP_API_URL;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    //console.log('CHECK CHECK CHECK');
    try {
      const response = await axios.post(`${apiUrl}/api/auth/login`, { email, password });
      //const response = await axios.post(`http://localhost:5000/api/auth/login`, { email, password });
      localStorage.setItem('token', response.data.token);
      //localStorage.setItem('currentUserId', response.data.userId);
      navigate('/collections');
    } catch (error) {
      console.log('CHECK CHECK CHECK');
      alert('Invalid credentials client');
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };
  const handleHomePage = () => {
    navigate('/collections');
  };
//anton.mikhailouski@gmail.com
//<div className="w-50">    <div className="container d-flex justify-content-center align-items-center vh-100">
//</div>                    </div>
  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-center align-items-start" style={{ paddingRight: '50px', marginTop: '10px' }}>
        
          <button className="btn btn-wight me-2" onClick={handleHomePage}>
            <img src={logo_light} alt="Unblock" style={{ width: '350px' }} />
          </button>
        
      </div>
      

        <div className="position-absolute top-50 start-50 translate-middle w-25">
          <h2 className="text-center mb-4">Login</h2>
          <form onSubmit={handleLogin}>

            <div className="form-group mb-3">
              <label>Email:</label>
              <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="form-group mb-3">
              <label>Password:</label>
              <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required/>
            </div>

            <div className="d-flex justify-content-center align-items-center">

              <button type="submit" className="btn btn-primary me-2">Login</button>

              <button onClick={handleRegisterRedirect} className="btn btn-link">
                Register
              </button>
              
            </div>

          </form>
        </div>
      

    </div>
  );
};

export default Login;

