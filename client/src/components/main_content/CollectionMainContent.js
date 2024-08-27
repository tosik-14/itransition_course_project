import React from 'react';
import { Link } from 'react-router-dom';


const CollectionList = ({ collections, toggleLike, handleComment }) => {
  return (
    

      

      <div className="row g-1">
        {collections.map((collection) => (
          <div key={collection.id} className="col-md-4 mb-4">
            <div className="collectionCard list-group-item p-0">

              <Link to={`/collections/${collection.id}`} className="linkToCollection">

                <div className="img_container mb-0">
                  {collection.image_url && (
                    <img
                      src={collection.image_url}
                      alt={collection.title}
                      style={{ width: '100%', height: '100%' }}
                    />
                  )}
                </div>

                <div className="d-flex justify-content-between ps-2 pt-1">
                
                  <div>
                    <h4 className="cardHeader mt-0 mb-0 pb-0" style={{ marginBottom: '0' }}>
                      {collection.title}
                    </h4>

                    <p className="itemsNum text-muted mt-1 mb-1">
                      items in collection: {collection.itemCount}
                    </p>
                  </div>

                  <div className="d-flex me-1 align-items-center">

                    <button className="btn" onClick={handleComment} style={{ border: 'none' }}>
                      <i className="bi bi-chat fs-2 text-dark"></i>
                    </button>

                    <button className="btn justify-content-center align-items-center"onClick={(e) => toggleLike(e, collection.id)} style={{ border: 'none' }}>
                      <i className={`bi ${collection.isLiked ? 'bi-heart-fill text-danger' : 'bi-heart text-dark'} fs-2`}></i>
                    </button>

                    <span className="ms-0">
                      <p className="likeCounter mb-0 me-2">{collection.likesCount}</p>
                    </span>

                  </div>
                
                </div>

              </Link>

            </div>
          </div>
        ))}
      </div>


    
  );
};

export default CollectionList;
