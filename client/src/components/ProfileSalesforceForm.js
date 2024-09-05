import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { getProfileEmail } from './utility';

const apiUrl = process.env.REACT_APP_API_URL;

const ProfileSalesforceForm = ({ profileId, show, handleClose }) => {
  
  const [email, setEmail] = useState('');
  
  useEffect(() => {
    const supFunc = async () => {
      await getProfileEmail(profileId, setEmail);
      //console.log('email:', email);
    };
    
    supFunc();
  }, [profileId]);


  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    email: "",
  });


  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      email: email,
    }));
  }, [email]);

  //const handleOpenForm = () => setShow(show);
  //const handleCloseForm = () => setShow(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    
    //console.log('formData:', formData);

    try {
      const response = await fetch(`${apiUrl}/api/salesforce`, { method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("done");
      } else {
        console.log("error:", response);
      }
    } catch (err) {
      console.error("error:", err);
      
    }
    //handleCloseForm();
    handleClose();
  };

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
                <h5 className="modal-title">Create Salesforce Record</h5>

                <button type="button" className="btn-close" onClick={handleClose}></button>
              </div>

              <div className="modal-body">

                <form onSubmit={handleSubmit}>

                  <div className="mb-3">

                    <label htmlFor="formFirstName" className="form-label">First Name</label>
                    <input type="text" className="form-control" id="formFirstName" name="firstName"
                      value={formData.firstName} onChange={handleChange} required/>

                  </div>

                  <div className="mb-3">

                    <label htmlFor="formLastName" className="form-label">Last Name</label>
                    <input type="text" className="form-control" id="formLastName" name="lastName"
                      value={formData.lastName} onChange={handleChange} required/>

                  </div>

                  <div className="mb-3">

                    <label htmlFor="formBirthDate" className="form-label">Birth Date</label>
                    <input type="date" className="form-control" id="formBirthDate" name="birthDate" 
                      value={formData.birthDate} onChange={handleChange} required/>

                  </div>

                  <button type="submit" className="btn btn-primary">OK</button>

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