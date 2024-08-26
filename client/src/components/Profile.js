import React, { useState, useEffect } from 'react';
import '../index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate, Link, useParams } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import logo_light from '../images/logo_light.jpg'
import { getUserName, getUserRole, getLike, getCollections, getProfileName } from './utility';


const apiUrl = process.env.REACT_APP_API_URL;

const Collections = () => {
  const { profileId } = useParams();
  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [collectionOwnerName, setCollectionOwnerName] = useState('');

  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [collections, setCollections] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supFunc = async() => {
      getUserName(setUserName, setUserId);
      getProfileName(profileId, setCollectionOwnerName);
      getUserRole(setUserRole);
      getCollections(setCollections, '/api/collections/userCollections', profileId);

      //await Promise.all([userPromise, profilePromise, rolePromise, collectionsPromise]);
      if(profileId != undefined || userId != undefined){
        setLoading(false);
      }

      //console.log('profileId, userId, collectionOwnerName', profileId, userId, collectionOwnerName);
    };
    //console.log('userId:', userId, 'profileId:', profileId);
    supFunc();

  }, [navigate, isLiked, likesCount, profileId, userId]);

  const handleLogin = () => {
    navigate('/login');
  };
  const handleHomePage = () => {
    navigate('/collections');
  };
  const handleDashboard = () => {
  	navigate('/dashboard');
  };
  const handleProfile = () => {
    navigate(`/profile/${userId}`);
  };
  const handleNewCollection = () => {
    navigate('/collections/create');
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

  if (loading) {
    return <div>Loading...</div>; 
  }
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
              	{userRole == 'admin' && (
              		<button className="btn btn-secondary me-2" onClick={handleDashboard}>Admin</button>
              	)}
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

        <div className="d-flex justify-content-between align-items-center mb-3">
          {String(userId) === String(profileId) ? (
            <h2>Your collections</h2>
          ) : (
            <h2>{collectionOwnerName} collections</h2>
          )}

          {String(userId) === String(profileId) && (
            <button className="btn btn-primary me-0" onClick={handleNewCollection}>
              New collections
            </button>
          )}
          
        </div>

        <div className="row g-1">
          {collections.map(collection => (
            <div key={collection.id} className="col-md-4 mb-5">

              <div className="collectionCard list-group-item p-0">

                <Link to={`/collections/${collection.id}`} className="linkToCollection">
                  <div className="img_container mb-0">
                    {collection.image_url && (
                      <img src={collection.image_url} alt={collection.title} style={{ width: '100%', height: '100%'/*, objectFit: 'cover'*/ }}/>
                    )}
                  </div>

                  <div className="d-flex justify-content-between ps-2 pt-1">
                    
                    <div>

                      <h4 className="cardHeader mt-0 mb-0 pb-0" style={{ marginBottom: '0' }}>
                        {collection.title}
                      </h4>
                      <p className="itemsNum text-muted mt-1 mb-1">
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