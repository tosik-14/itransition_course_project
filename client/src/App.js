import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Collections from './components/Collections';
import CollectionPage from './components/CollectionPage';
import CreateCollection from './components/CreateCollection';
import Profile from './components/Profile';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/UserDashboard';
import PrivateRoute from './components/PrivateRoute';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Collections />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/collections/:id" element={<CollectionPage />} />
        <Route path="/collections/create" element={<CreateCollection />} />
        
        <Route path="/collections/edit/:id" element={<CreateCollection />} />

        <Route path="/profile/:profileId" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;




//cd itransition_course\course_project
