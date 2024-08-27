import React, { useState, useEffect } from 'react';
import '../index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';

import { getUserName, getCollections, getLike, getTags, getCategories } from './utility';

import logo_light from '../images/logo_light.jpg'
import 'bootstrap-icons/font/bootstrap-icons.css';

import CollectionMainContent from './main_content/CollectionMainContent';
import CloudTags from './main_content/CloudTags';


const apiUrl = process.env.REACT_APP_API_URL;

const Collections = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [collections, setCollections] = useState([]);
  const [sortOrder, setSortOrder] = useState('new');
  const [selectedCategory, setSelectedCategory] = useState('');

  const [collectionsFiltered, setCollectionsFiltered] = useState([]);
  const [collectionsByCategory, setCollectionsByCategory] = useState([]);

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');

  const [tags, setTags] = useState([]);

  useEffect(() => {
  
    getUserName(setUserName, setUserId);
    getCollections(setCollections, '/api/collections/top5', null);
    getCollections(setCollectionsFiltered, '/api/collections/collectionsFilter', null);
    getCollections(setCollectionsByCategory, '/api/collections/collectionsFilter', null);
    getTags(setTags);
    getCategories(setCategories);
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


  const handleSort = (order) => {
    //console.log('order: ', order);
    console.log('step 1', collectionsFiltered);
    //getCollections(setCollectionsFiltered, '/api/collections', order);
    const sorted = [...collectionsFiltered].sort((a, b) => {
      return order ? b.id - a.id : a.id - b.id;
    });

    setCollectionsFiltered(sorted);
    /*if(order){
      console.log('step 1', collectionsFiltered);
      setCollectionsFiltered(collectionsFiltered.sort((a, b) => b.id - a.id));
    }
    else{
      console.log('step 2', collectionsFiltered);
      setCollectionsFiltered(collectionsFiltered.sort((a, b) => a.id - b.id));
    }*/
    
  };

  const handleCategoryChange = (category) => {

    console.log('step 1', category, collectionsFiltered);

    const sorted = collectionsByCategory.filter(collectionsF =>
      collectionsF.Category.id === parseInt(category, 10)
    );
    console.log('step 1', category, sorted);
    setCollectionsFiltered(sorted);
  };

  const handleTag = (tags) => {
    //setTag(tag);
    
  };

  const handleClearSort = () => {
    getCollections(setCollectionsFiltered, '/api/collections/collectionsFilter', null);
    
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
          
            <h2>Top 6 collections</h2>
          
        </div>

        <CloudTags />
        <CollectionMainContent collections={collections} toggleLike={toggleLike} handleComment={handleComment}/>

        <div className="filter-bar d-flex justify-content-between align-items-center mb-4 mt-5">
          <h2 className="me-3">All collections</h2>
          
          <span>
            <button className="btn btn-primary me-3" onClick={() => handleSort(true)}>New</button>
            
            <button className="btn btn-secondary me-3" onClick={() => handleSort(null)}>Old</button>
          </span>
          

          <select id="category" className="form-select me-3" value={category} 
            style={{ width: '200px' }} onChange={(e) => handleCategoryChange(e.target.value)} required>
            <option value="">{category === '' ? ('Select a category') : (category.name)}</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <button className="btn btn-primary me-3" onClick={handleClearSort}>Clear</button>

          <input type="text" className="form-control" style={{ width: '200px' }} placeholder="Tag" onChange={(e) => handleTag(e.target.value)}/>
        
        </div>

        <CollectionMainContent collections={collectionsFiltered} toggleLike={toggleLike} handleComment={handleComment}/>


      </div>


    </div>
  );
};

export default Collections;


