import React, { useState, useEffect } from 'react';
import '../index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import TagsInput from './TagsInput';

import { getUserName, getCollections, getCategories, getTags, uploadImageToImgur } from './utility';

import logo_light from '../images/logo_light.jpg'
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useParams } from 'react-router-dom'; //доступ к параметрам url


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

 

  useEffect(() => {
    getUserName(setUserName, setUserId);
    //console.log('step 1');
    getCategories(setCategories);
    //getTags(setTags);
    //console.log('create_collection 1 tags:', tags);
    if (id) {

      getCollections(setCollection, '/api/collectionEditView/viewCollection', id);
      setTitle(collection.title);
      setDescription(collection.description);
      setImageUrl(collection.image_url);
      setError('error loading collection data');
      setLoading(false);
    }
    else {
      setLoading(false);
    }
    
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

    if (isSubmitting) return;  // Если уже идет отправка данных, выходим из функции

    setIsSubmitting(true);
    
    console.log("submin submit...");

    let uploadedImageUrl = '';
    console.log('submit imageFile:', imageFile);
    // Загружаем изображение на Imgur, если файл выбран
    if (imageFile) {
        uploadedImageUrl = await uploadImageToImgur(imageFile); // Замените imageUrl на imageFile
    }

    const formData = {
      title,
      category,
      description,
      imageUrl: uploadedImageUrl, // Используем URL загруженного изображения или превью
      items // Ваши элементы с тегами
    };

    try {
      await axios.post('/api/your-endpoint', formData);
      // Обработка успешной отправки
      alert('Data submitted successfully');
      setIsSubmitting(false);
    } catch (error) {
      console.error('Failed to submit form:', error);
      alert('Error submitting data');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result); // Устанавливаем превью изображения
      };
      reader.readAsDataURL(file);

      setImageFile(file); // Сохраняем файл для дальнейшей загрузки на Imgur
    }
  };


  

  /*const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const imageUrl = await uploadImageToImgur(file);
        setPreviewImage(imageUrl); 

      } catch (error) {
        console.error('Failed to upload image:', error);
      }
    }
  };*/

  

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

              <select id="category" className="form-select" value={category} onChange={(e) => setCategory(e.target.value)} required>

                <option value="">Select a category</option>
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

          
              <div className="elementsContainer d-flex flex-wrap flex-column" style={{ width: '300px' }}>
                {items.map((item) => (
                  <div key={item.id} className="card mt-0 mb-2" style={{ width: '100%' }}>
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