import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { setProfileToken } from './utility';

const apiUrl = process.env.REACT_APP_API_URL;


const ProfileSalesforceForm = ({ profileId, show, handleClose }) => {
  
  const [token, setToken] = useState('');
  
  const getToken = () => {
    const bufarr = new Uint32Array(8);
    window.crypto.getRandomValues(bufarr);
    return Array.from(bufarr, dec => dec.toString(16)).join('');
  };

  useEffect(() => {
    const supFunc = async () => {

      const newT = getToken();
      setToken(newT); 
      
      //console.log('new token:', token);
    };
    
    supFunc();
  }, [profileId]);


  useEffect(() => {

    setProfileToken(profileId, token);
    console.log('new token:', token);
  }, [token]);

  //const handleOpenForm = () => setShow(show);
  //const handleCloseForm = () => setShow(false);


  return (
    <>
      {/*<button className="btn btn-success me-3" onClick={handleOpenForm}>
        Create Salesforce Record
      </button>*/}

      {show && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Access token</h5>

                <button type="button" className="btn-close" onClick={handleClose}></button>
              </div>

              <div className="modal-body">

                <form>

                  <input type="text" readOnly value={token} className="form-control"/>
                  <button type="submit" className="btn btn-primary" onClick={handleClose}>OK</button>

                </form>

              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileSalesforceForm;