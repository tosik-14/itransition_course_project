import React, { useState, useEffect } from 'react';
import '../index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';

import { getUserName, getCollections, getLike, getTags } from './utility';

import logo_light from '../images/logo_light.jpg'
import 'bootstrap-icons/font/bootstrap-icons.css';

import CollectionMainContent from './main_content/CollectionMainContent';


const apiUrl = process.env.REACT_APP_API_URL;

const Collections = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [collections, setCollections] = useState([]);
  const [collectionMain, setCollectionMain] = useState(true);

  const [tags, setTags] = useState([]);

  useEffect(() => {
  
    getUserName(setUserName, setUserId);
    getCollections(setCollections, '/api/collections/top5', null);
    getTags(setTags);
  }, [navigate, isLiked, likesCount]);

  const handleLogin = () => {
    navigate('/login');
  };
  const handleHomePage = () => {
    navigate('/collections');
  };
  const handleProfile = () => {
    navigate(`/profile/${userId}`);
  };
  const handleComment = (e) => {
    e.preventDefault();
  };
  const toggleLike = async ( e, id ) => {
    //e.stopPropagation();
    e.preventDefault();

    setIsLiked(prev => !prev);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);

    try{
      const res = await getLike(id, setIsLiked);
      //console.error('step 1', res);
      if(res.status != 200){
        setIsLiked(prev => !prev);
        setLikesCount(prev => isLiked ? prev + 1 : prev - 1);
      }
    }
    catch(err){
      console.error('error like/dislike 57', err);
      setIsLiked(prev => !prev);
      setLikesCount(prev => isLiked ? prev + 1 : prev - 1);
    }
  };


//<span className="me-3">{userName}</span>     <div className="d-flex justify-content-end align-items-start">   </div>
// style={{ width: '100px', height: '100px' }} 
  return (
    
    <div className="container-fluid">

      <div className="container mt-3 d-flex justify-content-between align-items-center">

        <div className="d-flex justify-content-start align-items-start">
            <button className="btn btn-wight me-2" onClick={handleHomePage}>
              <img src={logo_light} alt="Unblock" style={{ width: '350px' }} />
            </button>
        </div>
        <div className="d-flex justify-content-end align-items-start"> 
          <div className="d-flex align-items-center">
            {userName ? (
              <>
                <button className="btn btn-primary me-3" onClick={handleProfile}>{userName}</button>
                <LogoutButton />
              </>
            ) : (
              <button className="btn btn-primary me-2" onClick={handleLogin}>Log In</button>
            )}
            
          </div>
        </div>
      
      </div>

      
      <div className="container mt-5">
        <div className="d-flex align-items-center mb-3">
          
            <h2>Top 5 collections</h2>
          
        </div>


        {collectionMain ? (
          <CollectionMainContent
            collections={collections}
            toggleLike={toggleLike}
            handleComment={handleComment}
          />
        ) : (
          <LogoutButton /> 
        )}


      </div>


    </div>
  );
};

export default Collections;


