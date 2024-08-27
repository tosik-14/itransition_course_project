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
    const responce = await axios.get(`${apiUrl}/api/tags`);
    setTags(responce.data);
    //console.log('step 1 gettags: ', responce.data);
    return responce;
  }
  catch (error){
    console.error('error to fetch tags: ', error);
  }
};

export const getPopularTags = async(quantity) => {
  console.log('step 1', quantity);
  try{
    const responce = await axios.get(`${apiUrl}/api/tags/popular`, {
      params: { quantity } 
    });
    
    //console.log('step 1 gettags: ', responce.data);
    return responce;
  }
  catch (error){
    console.error('error to fetch tags: ', error);
  }
};




export const setNewCollection = async(formData) => {
  const token = localStorage.getItem('token');
  //console.log('step 1');
  if(token){
    try{
      //console.log('step 2', formData);
      const responce = await axios.post(`${apiUrl}/api/collections/create`, formData,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      //console.log('step 3');
      return responce;
    }
    catch (error){
      console.error('error add collection: ', error);
    }
  }
};





export const uploadImageToDropbox = async (imageFile) => {
  const DROPBOX_API_TOKEN = process.env.REACT_APP_DROPBOX_API_TOKEN; //client 
  //const buftoken = 'sl.B7vh5kHysETxW0Y3-SK5KfoGq_OLzS03ly_ZEh7n3iwqTFllGUr1pFjefXfv2RMtZEXrt2WqJE9bYmYmZVK-czM-gi8sqqwFL1xmGm8yTjvFBUYipV5nY77zd4yhyECxOzIJcYpXpeiz1WQ';
  console.log('utility DROPBOX_API_TOKEN', DROPBOX_API_TOKEN);

  const formData = new FormData();
  formData.append('file', imageFile);

  console.log('utility step 1', imageFile);

  
  try {

    const headers = {
      'Authorization': `Bearer ${DROPBOX_API_TOKEN}`,
      //'Authorization': `Bearer ${buftoken}`,
      'Dropbox-API-Arg': JSON.stringify({
        path: `/itransition_course_project/${imageFile.name}`,
        mode: 'add',
        autorename: true,
        mute: false,
        strict_conflict: false,
      }),
      'Content-Type': 'application/octet-stream'
    };

    console.log('headers:', headers);

    const responсe = await axios.post('https://content.dropboxapi.com/2/files/upload', imageFile,  
      { headers } 
    );

    console.log('utility step 3:', responсe.data);
    //return responсe.data;



    const responceLink = await axios.post('https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings',
      { path: `/itransition_course_project/${imageFile.name}`, },
      { headers: {
          'Authorization': `Bearer ${DROPBOX_API_TOKEN}`,
          //'Authorization': `Bearer ${buftoken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    
    //console.log('utility step 4:', responceLink.data.url);
    let linkToPict = responceLink.data.url;
    //console.log('link ver 1:', linkToPict);
    const resultLink = linkToPict.replace(/dl=0$/, 'raw=1');
    //console.log('link ver 2:', resultLink);
    return resultLink;
    
  } catch (error) {
    console.error('error uploading image to dropbox :(:', error.response ? error.response.data : error.message);
    throw error;
  }
};





export const deleteImageFromDropbox = async (imageUlr) => {
  const DROPBOX_API_TOKEN = process.env.REACT_APP_DROPBOX_API_TOKEN; 
  //const buftoken = '';
  console.log('utility DROPBOX_API_TOKEN', DROPBOX_API_TOKEN);
  
  const headers = {
    'Authorization': `Bearer ${DROPBOX_API_TOKEN}`,
    //'Authorization': `Bearer ${buftoken}`,
    'Content-Type': 'application/json'
  };

  console.log('link default:', imageUlr);

  const data = {
    "url": imageUlr
  };

  let filePath;
  try{
    const response = await axios.post('https://api.dropboxapi.com/2/sharing/get_shared_link_metadata', data, { headers });
    filePath = response.data.path_lower;

    console.log('filePath: ', filePath);
  }
  catch(err){
    console.error('error fetching filePath ', err);
    throw err;
  }

  if(filePath){

    const path = {
      "path": filePath
    };

    try{
      const res = await axios.post('https://api.dropboxapi.com/2/files/delete_v2', path, { headers });
      console.log('file deleted', res.data);
      return res;
    }
    catch(err){
      console.error('delete file error ', err);
      throw err;
    }

  }

};




export const deleteCollection = async(supId) => {
  const token = localStorage.getItem('token');
  //console.log('step 1');
  if(token){
    try{
      console.log('step 2', supId);
      const responce = await axios.post(`${apiUrl}/api/collections/delete`, { supId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      //console.log('step 3');
      return responce;
    }
    catch (error){
      console.error('error delete collection: ', error);
    }
  }
};







