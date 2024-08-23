import React, { useState, useEffect } from 'react';
import '../index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';

import { getUserName, getCollections, getLike } from './utility';

import logo_light from '../images/logo_light.jpg'
import 'bootstrap-icons/font/bootstrap-icons.css';


const apiUrl = process.env.REACT_APP_API_URL;

const Collections = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [collections, setCollections] = useState([]);

  useEffect(() => {
  
    getUserName(setUserName, setUserId);
    getCollections(setCollections, '/api/collections', null);
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

      {/*<div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center">
          <h2>Top 5 collections</h2>
          
        </div>

        
        <ul className="list-group">
          {collections.map(collection => (
            
            <li key={collection.id} className="list-group-item col-md-4 mb-4 collectionCard p-0">

              <Link to={`/collections/${collection.id}`} className="linkToCollection" style={{ textDecoration: 'none' }}>

                <div className="img_container">
                  {collection.image_url && (<img src={collection.image_url} alt={collection.title}/>)}
                </div>

                <div className="d-flex justify-content-between">

                  <div>
                    <h4 className="cardHeader mt-1 ms-2 mb-0 pb-0" style={{ marginBottom: '0' }}>{collection.title}</h4>
                    <p className="itemsNum text-muted ms-2 ">
                      items in collection: {collection.itemCount}
                    </p>
                  </div>

                  <div className="d-flex me-1 align-items-center">
                  
                    <button className="btn" onClick={handleComment} style={{ border: 'none' }}>
                      <i className="bi bi-chat fs-2 text-dark"></i>
                    </button>
                    <button className="btn justify-content-center align-items-center" onClick={(e) => toggleLike(e, collection.id)} style={{ border: 'none' }}>
                      <i className={`bi ${collection.isLiked ? 'bi-heart-fill text-danger' : 'bi-heart text-dark'} fs-2`}></i> 
                    </button>
                    <span className="ms-0"><p className="likeCounter mb-0 me-2">{collection.likesCount}</p></span>
                  </div>

                </div>

              </Link>

            </li>

          ))}
        </ul>
      </div>*/}
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center">
          <h2>Top 5 collections</h2>
        </div>

        <div className="row g-5">
          {collections.map(collection => (
            <div key={collection.id} className="col-md-4 mb-5"> {/* Вы можете изменить ширину, например, на col-md-3 или col-lg-4 */}
              <div className="list-group-item collectionCard p-0 me-4 mb-5">
                <Link to={`/collections/${collection.id}`} className="linkToCollection" style={{ textDecoration: 'none' }}>
                  <div className="img_container">
                    {collection.image_url && (<img src={collection.image_url} alt={collection.title} style={{ width: '100%', height: 'auto' }}/>)}
                  </div>

                  <div className="d-flex justify-content-between">
                    <div>
                      <h4 className="cardHeader mt-1 ms-2 mb-0 pb-0" style={{ marginBottom: '0' }}>{collection.title}</h4>
                      <p className="itemsNum text-muted ms-2 ">
                        items in collection: {collection.itemCount}
                      </p>
                    </div>

                    <div className="d-flex me-1 align-items-center">
                      <button className="btn" onClick={handleComment} style={{ border: 'none' }}>
                        <i className="bi bi-chat fs-2 text-dark"></i>
                      </button>
                      <button className="btn justify-content-center align-items-center" onClick={(e) => toggleLike(e, collection.id)} style={{ border: 'none' }}>
                        <i className={`bi ${collection.isLiked ? 'bi-heart-fill text-danger' : 'bi-heart text-dark'} fs-2`}></i> 
                      </button>
                      <span className="ms-0"><p className="likeCounter mb-0 me-2">{collection.likesCount}</p></span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Collections;


