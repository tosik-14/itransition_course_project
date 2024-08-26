import React, { useState, useEffect } from 'react';
import Autosuggest from 'react-autosuggest';
import 'bootstrap/dist/css/bootstrap.min.css';

const apiUrl = process.env.REACT_APP_API_URL;

// Генератор уникальных идентификаторов
const generateId = () => Date.now() + Math.random();

const fetchTags = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/tags`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
};

const TagsInput = ({ tags, setTags }) => {
  const [allSuggestions, setAllSuggestions] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [value, setValue] = useState('');

  useEffect(() => {
    fetchTags().then((tags) => {
      setAllSuggestions(tags.map(tag => ({ id: tag.id, name: tag.name })));
      setSuggestions(tags.map(tag => ({ id: tag.id, name: tag.name })));
      //console.log('onSuggestionsFetchRequested 1 tags:', tags, allSuggestions, suggestions);
    });
  }, []);

  const onChange = (event, { newValue }) => {
    setValue(newValue);
    //console.log('onSuggestionsFetchRequested 1 tags:', tags, allSuggestions, suggestions);
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    //console.log('onSuggestionsFetchRequested 1 tags:', tags, allSuggestions, suggestions);
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    const filteredSuggestions = allSuggestions.filter(tag =>
      tag.name.toLowerCase().slice(0, inputLength) === inputValue
    );

    setSuggestions(filteredSuggestions);
    //console.log('onSuggestionsFetchRequested 1 tags:', tags, allSuggestions, suggestions);
  };

  const onSuggestionSelected = (event, { suggestion }) => {
    console.log('onSuggestionsFetchRequested 1 tags:', tags, allSuggestions, suggestions);
    if (!tags.some(tag => tag.id === suggestion.id)) {
      setTags([...tags, suggestion]);
    }
    setValue('');
  };

  const addCustomTag = (event) => {
    event.preventDefault();
    const trimmedValue = value.trim();
    if (trimmedValue && !tags.some(tag => tag.name === trimmedValue)) {
      setTags([...tags, { id: generateId(), name: trimmedValue }]);
      setValue('');
    }
  };

  const handleDeleteTag = (tagId) => {
    
    const updatedTags = tags.filter(tag => tag.id !== tagId);
    setTags(updatedTags);

  };

  const getSuggestionValue = (suggestion) => suggestion.name;

  const renderSuggestion = (suggestion) => (
    <div>{suggestion.name}</div>
  );

  const inputProps = {
    placeholder: 'Type a tag',
    value,
    onChange,
    onKeyDown: (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        addCustomTag(event);
      }
    },
    className: 'form-control'  // Add Bootstrap classes for input styling
  };

  return (
    <div>
      <div className="d-flex align-items-center">
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={() => setSuggestions(allSuggestions)}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
          onSuggestionSelected={onSuggestionSelected}
          theme={{
            container: 'd-flex flex-grow-1',
            input: 'form-control me-2',
            suggestionsList: 'list-group',
            suggestion: 'list-group-item',
          }}
        />
        <button className="btn btn-primary me-2" onClick={addCustomTag}>
          Add Custom Tag
        </button>
      </div>
      <div className="mt-2">
        {tags.map((tag) => (
          <span key={tag.id} className="badge bg-secondary me-2 mb-1" style={{ cursor: 'pointer' }} onClick={() => handleDeleteTag(tag.id)}>
            {tag.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagsInput;



