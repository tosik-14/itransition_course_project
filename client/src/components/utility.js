import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;

export const getUserName = async(setUserName, setUserId) => {
	const token = localStorage.getItem('token');
	if(token){
    try{
      const responce = await axios.get(`${apiUrl}/api/users/me`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}});
      setUserName(responce.data.name);
      //console.log('step 1', responce.data.name);
      setUserId(responce.data.currentUserId);
      //console.log('step 2', responce.data.currentUserId);
      return {
        name: responce.data.name,
        userId: responce.data.currentUserId
      };
    }
    catch (error){
      console.error('error fetch user name: ', error);
    }
  }
};

export const getUserRole = async(setUserRole) => {
	const token = localStorage.getItem('token');
	if(token){
		try{
      const responce = await axios.get(`${apiUrl}/api/users/role`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}});
      setUserRole(responce.data.role);
      return responce.data.role;
    }
    catch (error){
      console.error('error fetch user role: ', error);
    }
	}
};

export const getProfileName = async(id, setCollectionOwnerName) => {
  //console.log('getProfileName step 1', id);
  try{
    const responce = await axios.get(`${apiUrl}/api/users/nameById`, { 
      params: { id } 
    });
    setCollectionOwnerName(responce.data.name);
    //console.log('getProfileName step 2', responce.data.name)
    return responce.data.name;
  }
  catch (error){
    console.error('error fetch profile name: ', error);
  }
  
};



export const getCollections = async(setCollections, path, supId) => {
  const token = localStorage.getItem('token');
  //console.log('step 1 user', supId);
  if(token){
    try{
      const responce = await axios.get(`${apiUrl}${path}`, { 
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`},
        params: { supId }
      });
      setCollections(responce.data);

      //console.log('collections: ', responce.data);
      return responce.data;
    }
    catch (error){
      console.error('error get collections: ', error);
    }
  }
};



export const getLike = async(collectionId, setIsLike) => {
  const token = localStorage.getItem('token');
  //console.log('step 1');
  if(token){
    try{
      const responce = await axios.get(`${apiUrl}/api/collections/like`, { 
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}`},
          params: { collectionId }
      });
      setIsLike(responce.data.isLiked);
      //console.log('step 2 like', responce.data.isLiked);
      return responce;
    }
    catch (error){
      console.error('error like/dislike: ', error);
    }
  }
};



export const setComment = async(collectionId, text) => {
  const token = localStorage.getItem('token');
  //console.log('step 1');
  if(token){
    try{
      const responce = await axios.post(`${apiUrl}/api/comments/add`, 
        { collectionId, text },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      //setNewComment(prevComments => [...prevComments, responce.data]);
      //console.log('step 2 comm utility', responce.data);
      return responce;
    }
    catch (error){
      console.error('error add comment: ', error);
    }
  }
};

export const getCategories = async(setCategories) => {
  //console.log('step 1');
  try{
    const responce = await axios.get(`${apiUrl}/api/collections/categories`);
    setCategories(responce.data);
    //console.log('step 1 getCategories: ', responce);
    return responce;
  }
  catch (error){
    console.error('error to fetch categories: ', error);
  }
};

export const getTags = async(setTags) => {
  //console.log('step 1');
  try{
    const responce = await axios.get(`${apiUrl}/api/collections/tags`);
    setTags(responce.data);
    //console.log('step 1 gettags: ', responce.data);
    return responce;
  }
  catch (error){
    console.error('error to fetch tags: ', error);
  }
};




const IMGUR_CLIENT_ID = process.env.REACT_APP_IMGUR_CLIENT_ID; //client secret 715896c8a097121261f9fce4a38628cb72e82cb1 

export const uploadImageToImgur = async (imageFile, retryCount = 3) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    console.log('utility step 1', imageFile);
    try {
      const response = await axios.post('https://api.imgur.com/3/image', formData, {
          headers: { Authorization: `Client-ID ${IMGUR_CLIENT_ID}`, },
        });
        console.log('utility step 2', response.data.data.link);
        
        return response.data.data.link;
    } catch (error) {
        
        if (error.response?.status === 429 && retryCount > 0) {
            console.log('Rate limit exceeded, retrying in 15 seconds...');
            await new Promise(resolve => setTimeout(resolve, 15000)); // Ожидание 15 секунд перед повторной попыткой
            return uploadImageToImgur(imageFile, retryCount - 1); // Повторная попытка
        } else {
            console.error('error to upload image on imgur:', error);
            throw error;
        }
    }
};

