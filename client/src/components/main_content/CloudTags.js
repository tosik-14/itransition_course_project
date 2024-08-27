import React, { useState, useEffect } from 'react';
import './mainPage.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link } from 'react-router-dom';
import { getPopularTags } from '../utility';

const CloudTags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const quantity = 20;

  useEffect(() => {
    const fetchTags = async () => {
      try {
        //console.log('step 1');
        const res = await getPopularTags(quantity);
        //console.log('fetched tags:', res.data);  // Лог данных после их получения
        setTags(res.data || []);  // Защита от undefined
      } catch (err) {
        console.error('Error fetching tags:', err); // Лог ошибки
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
    //console.log('cloud tags: ',tags);
  }, []);


  const getFontSize = (count) => {
    if (count > 4) return '2rem';
    if (count > 2) return '1.5rem';
    return '1rem';
  };

  

  return (
    <div className="tag-cloud">
      {tags && tags.length > 0 && tags
        /*.filter(tag => tag.count > 1)*/  //я конечно, перестарался
        .map((tag) => (
        <span
          key={tag.id}
          style={{ fontSize: getFontSize(tag.count), margin: '0.5rem', display: 'inline-block' }}
          className="tag"
        >
          {tag.name}
        </span>
      ))}
    </div>
  );
};

export default CloudTags;
