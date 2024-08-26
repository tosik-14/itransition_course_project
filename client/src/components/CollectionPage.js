import React, { useState, useEffect } from 'react';
import '../index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';

import { getUserName, getUserRole, getCollections, getLike, setComment, deleteCollection } from './utility';

import logo_light from '../images/logo_light.jpg'
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useParams } from 'react-router-dom'; //доступ к параметрам url

const apiUrl = process.env.REACT_APP_API_URL;

const CollectionPage = () => {
  const { id } = useParams(); //тут берется id нужной коллекции
  const navigate = useNavigate();
  
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState('');

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [collection, setCollection] = useState(null);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if(collection){
      setComments(collection.comments);
    }
    getUserName(setUserName, setUserId);
    getUserRole(setUserRole);
    getCollections(setCollection, '/api/collectionEditView/viewCollection', id);
  }, [navigate, isLiked, likesCount, id]); /*, collection*/

  const handleLogin = () => {
    navigate('/login');
  };
  const handleHomePage = () => {
    navigate('/collections');
  };
  const handleProfile = () => {
    navigate(`/profile/${userId}`);
  };
  const handleSomeoneProfile = (ownerid) => {
    console.log('id', ownerid);
    navigate(`/profile/${ownerid}`);
  };
  const handleEditCollection = () => {
    navigate(`/collections/edit/${id}`);
  };
  const handleDeleteCollection = async () => {
    //const alert = window.confirm(' you want to delete this collection?');
    deleteCollection(id);
    navigate(`/profile/${userId}`);
  };
  
  const handleSubmitComment = async () => {
    const res = await setComment(id, newComment); 
    if (res && res.data){
      setComments(prevComments => [...prevComments, res.data]);

      setNewComment('');
      getCollections(setCollection, '/api/collectionEditView/viewCollection', id);
    }
  };
  const toggleLike = async (id) => {
    setIsLiked(prev => !prev);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);

    try{
      const res = await getLike(id, setIsLiked);
      console.error('step 1', res, isLiked);
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

  if (!collection) {
    return <div>Loading...</div>; 
  }

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


      <div className="container mt-5 collectionViewBlock">                         {/*start collection block*/}

        <div className="d-flex justify-content-between align-items-start">
          <span className="d-flex justify-content-center">
            <h2 className="mb-1">{collection.title}</h2>

          <p className="categoryVC mt-2 mb-0 ms-4">
            / category:
            <Link to={() => handleSomeoneProfile(collection.user.id)} className="linkToProfileVC text-muted text-black" style={{ textDecoration: 'none' }}> {/*`/profile/${tag.id}`*/}
              <b>{collection.category?.name}</b>
            </Link> / owner:
             
          </p>

          <Link to={`/profile/${collection.user?.id}`} className="linkToProfileVC text-black ms-4" style={{ textDecoration: 'none' }}>
            <h2>{collection.user?.name}</h2>
          </Link>
          </span>
          


          {userId === collection.user?.id || userRole === 'admin' && (
            <div className="d-flex justify-content-start me-2">
              <button className="btn btn-primary me-2" onClick={handleEditCollection}>
                Edit
              </button>
              <button className="btn btn-danger" onClick={handleDeleteCollection}>
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="d-flex">
          <div className="me-4">
            <div className="img_containerCP mb-0" style={{ maxWidth: '800px', maxHeight: '800px', overflow: 'hidden' }}>
              {collection.image_url && (
                <img
                  src={collection.image_url}
                  alt={collection.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
            </div>
            <div className="d-flex align-items-center mt-2">
              <button
                className="btn justify-content-center align-items-center"
                onClick={() => toggleLike(collection.id)}
                style={{ border: 'none' }}
              >
                <i className={`bi ${collection.isLiked ? 'bi-heart-fill text-danger' : 'bi-heart text-dark'} fs-2`}></i>
              </button>
              <span className="ms-2 likeCounter">{collection.likesCount}</span>
              <span className="itemCountVC text-muted ms-5 itemsNum">items in collection: {collection.itemCount}</span>
            </div>
            <div className="mt-4">
              <h5>Description:</h5>
              <p className="text-muted">{collection.description}</p>
            </div>

            <div className="comments mt-4">

              <h5>Comments:</h5>

              <div className="mt-3">
                <textarea className="form-control" placeholder="Add a comment"
                    value={newComment} onChange={(e => setNewComment(e.target.value))}>
                </textarea>
                <button className="btn btn-primary mt-2" onClick={handleSubmitComment}>Submit</button>
              </div>

              <ul className="list-group mt-4">
                {collection.comments?.map((comment) => (
                  <li key={comment.id} className="list-group-item">
                    <p>
                      <Link to={`/profile/${comment.userId}`} className="linkToProfileVC text-muted text-black" style={{ textDecoration: 'none' }}>
                        <strong>{comment.userName}</strong>: 
                      </Link>
                      &nbsp;{comment.text}
                    </p>
                  </li>
                ))}
              </ul>
              
            
            </div>

          </div>

          <div className="elementsContainer d-flex flex-wrap flex-column" style={{ width: '300px' }}>
            {collection.items?.map((item) => (
              
              <div key={item.id} className="card mt-0 mb-2" style={{ width: '100%' }}>
                <div className="card-body">
                  <h5 className="card-title mt-0">{item.name}</h5>
                  <div className="tags mt-2">
                    {item.tags?.map((tag) => (

                      <span key={tag.id} className="badge bg-secondary me-2 mb-1">
                        <Link to={`/profile/${userId}`} className="linkToProfileVC text-white" style={{ textDecoration: 'none' }}> {/*`/profile/${tag.id}`*/}
                          {tag.name}
                        </Link>
                      </span>

                    ))}
                  </div>
                </div>
              
              </div>

            ))}
          
          </div> {/*className="elementsContainer d-flex flex-wrap flex-column"*/}

        </div>

      </div>      {/*end collection block*/}


    </div>
  );
};

export default CollectionPage;