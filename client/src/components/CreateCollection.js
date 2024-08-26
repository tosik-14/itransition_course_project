import React, { useState, useEffect } from 'react';
import '../index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import TagsInput from './TagsInput';

import deleteIcon from '../images/delete.png'

import { getUserName, getCollections, getCategories, getTags, uploadImageToDropbox, setNewCollection, deleteImageFromDropbox } from './utility';

import logo_light from '../images/logo_light.jpg'
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useParams } from 'react-router-dom'; //доступ к параметрам url

const slugify = require('slugify');


const apiUrl = process.env.REACT_APP_API_URL;

const CreateCollection = () => {
  const { id } = useParams(); //тут берется id нужной коллекции
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState(null);
  
  const [collection, setCollection] = useState(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState('');
  const [error, setError] = useState('');

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [items, setItems] = useState([]);
  const [tags, setTags] = useState([]);
  const [newItemName, setNewItemName] = useState('');

  const [previewImage, setPreviewImage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  //const [uploadNewPict, setUploadNewPict] = useState(false);

 

  useEffect(() => {
    const fetchData = async () => {
      await getUserName(setUserName, setUserId);
      //console.log('step 1');
      await getCategories(setCategories);
      //getTags(setTags);
      //console.log('create_collection 1 tags:', tags);
    
    
      if (id) {
        try{
          //console.log('step 1', id);
          const fullCollection = await getCollections(setCollection, '/api/collectionEditView/viewCollection', id);
          //console.log('full: ', fullCollection);
          //console.log('title: ', collection.title);
          setTitle(fullCollection.title);
          setDescription(fullCollection.description);
          setImageUrl(fullCollection.image_url);
          setItems(fullCollection.items);
          setCategory(fullCollection.category);
          setPreviewImage(fullCollection.image_url);
          //console.log('step 2', category, imageUrl);
        
          setLoading(false);
        }
        catch(err) {
          console.error('step 1', err);
          setError('error loading collection data a');
          setLoading(false);
        }
        
      }
      else {
        setLoading(false);
      }
    }

    fetchData();
  }, [navigate, id]); /*, collection*/

  /*useEffect(() => {
    console.log('create_collection 1 tags:', tags);
  }, [tags]); */

  const handleLogin = () => {
    navigate('/login');
  };
  const handleHomePage = () => {
    navigate('/collections');
  };
  const handleProfile = () => {
    navigate(`/profile/${userId}`);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log('submit imageFile:', imageFile);
    
    let uploadedImageUrl = '';

    if(id){
      if(imageUrl !== ''){
        const res = await deleteImageFromDropbox(imageUrl);
        if (!res) {
          throw error('delete pict err');
        }
      }
    }
    
    if (imageFile/* && uploadNewPict === true*/) {
      uploadedImageUrl = await uploadImageToDropbox(imageFile);
    }
   /* if (uploadedImageUrl === '' && imageUrl !== ''){
      uploadedImageUrl = imageUrl;
    }*/

    console.log('get img url:', uploadedImageUrl);

    const formData = {
      id,
      title,
      category,
      description,
      imageUrl: uploadedImageUrl, 
      items: items,
    };

    //console.log('formData: ', formData);

    try {
      const res = setNewCollection(formData);
      /*if (res && res.data){
        console.log('collection added: ', res.data);
      }*/
      setIsSubmitting(false);
      navigate(`/profile/${userId}`);
    } catch (error) {
      console.error('add collection error handleSubmit:', error);
    }
  };

  const handleImageUpload = (e) => {
    
    const file = e.target.files[0];
    console.log('handleImageUpload: ', file);

    const dotFileFormat = file.name.split('.').pop();

    let bufName = file.name.substring(0, file.name.lastIndexOf('.'))

    if (file) {
      const bufNameSlugiFy = slugify(bufName, {
        lower: true,
        strict: true,
        replacement: "_" 
      });
      
      bufName = `${bufNameSlugiFy}-${Date.now()}.${dotFileFormat}`;

      const rFile = new File([file], bufName, { type: file.type });

      console.log('new handleImageUpload: ', rFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result); 
      };
      reader.readAsDataURL(rFile);

      setImageFile(rFile);
      /*setUploadNewPict(true);*/ 
    }
  };




  const handleCategoryChange = (e) => {
    const userCategory = e.target.value;
    setCategory(userCategory);
    //console.log('userCategory:', userCategory, category); 
  };
  

  

  

  const handleAddItem = (e) => {
    if (newItemName.trim()) {
      const newItem = {
        id: Date.now(), 
        name: newItemName,
        tags: tags,
      };

      setItems([...items, newItem]);
      setNewItemName('');
      setTags([]); 
    }
  };
  const handleEditItem = (item) => {
    setNewItemName(item.name);
    setTags(item.tags);
  };

  const handleDeleteItem = (itemId) => {    // работает прекрасно
    console.log('step 1', itemId, items);
    const updatedItems = items.filter(bitem => bitem.id !== itemId);
    console.log('step 2', updatedItems, items);
    setItems(updatedItems);
  };
  /*const handleDeleteItem = (item) => {   // работает плохо, почему?
    console.log('step 1', item, items);
    const updatedItems = items.filter(bitem => bitem.id !== item);
    console.log('step 2', updatedItems, items);
    setTags(updatedItems);
  };*/

  if (loading) {
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


      <div className="container">

        <h2>{id ? 'Edit Collection' : 'Create New Collection'}</h2>

        <form onSubmit={handleSubmit}>
          
          <div className="mb-3">
            <label htmlFor="imageUpload" className="form-label">Upload Image</label>
            <input
              type="file"
              id="imageUpload"
              className="form-control"
              onChange={handleImageUpload}
            />
            {previewImage && (
              <div className="mt-3">
                <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px' }} />
              </div>
            )}
          </div>

          <div className="d-flex mb-3">

            <div className="me-2" style={{ flex: 1 }}>
              <label htmlFor="title" className="form-label">Title</label>
              <input
                type="text"
                id="title"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="ms-2" style={{ flex: 1 }}>
              <label htmlFor="category" className="form-label">Category</label>

              <select id="category" className="form-select" value={category} onChange={handleCategoryChange} required>

                <option value="">{category === '' ? ('Select a category') : (category.name)}</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}

              </select>

            </div>

          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea id="description" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required/>
          </div>

          
          <div className="mb-3">
            <h5>Add New Item</h5>
              <div className="d-flex mb-3">
                <input
                  type="text"
                  className="form-control me-2 w-50"
                  placeholder="Item name"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                />
                <div className="w-50">
                  <TagsInput 
                    tags={tags} 
                    setTags={setTags} 
                  />
                </div>
                <button type="button" className="btn btn-secondary" onClick={handleAddItem}>
                  Add Item
                </button>
              </div>

          
              <div className="elementsContainer d-flex flex-wrap"/* style={{ width: '300px' }}*/>
                {items.map((item) => (
                  <div key={item.id} className="card mt-0 mb-2 ms-2 me-2 itemCard" 
                    style={{ flex: '1 1 calc(33.33% - 1rem)', boxSizing: 'border-box', cursor: 'pointer' }} onClick={() => handleEditItem(item)}>
                    
                    <div className="card-body">

                      <h5 className="card-title mt-0">{item.name}</h5>

                      <div className="tags mt-2">
                        {item.tags.map((tag) => (
                          <span key={tag.id} className="badge bg-secondary me-2 mb-1">
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="deleteIcon" onClick={() => handleDeleteItem(item.id)}>
                      <img src={deleteIcon} alt="Delete" />
                    </div>

                  </div>
                ))}
              </div>
              {error && <div className="alert alert-danger">{error}</div>}
              <button type="submit" className="btn btn-primary">
                {id ? 'Save Changes' : 'Create'}
              </button>
           </div>
        </form>

      </div>


    </div>
  );
};

export default CreateCollection;