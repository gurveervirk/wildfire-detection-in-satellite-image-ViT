import React, { useState } from 'react';

const ImageComponent = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const fileInput = document.getElementById('image-file');
    const file = fileInput.files[0];
    
    if (file) {
      const base64String = await convertFileToBase64(file);
      // console.log(base64String)
      fetch('http://192.168.244.109:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: base64String })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          // console.log(data)
          setResult(data);
        })
        .catch(error => {
          console.error('Error:', error);
          setResult('Error: ' + error);
        });
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result.replace('data:', '').replace(/^.+,/, ''));
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };


  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Wildfire Detection</h5>
              <p className="card-text">Upload an image to detect wildfire.</p>
              <form onSubmit={handleFormSubmit}>
                <input id='image-file' type="file" accept="image/*" onChange={handleImageChange} className="form-control mb-2" />
                {image && <img src={image} className="img-fluid" alt="Uploaded" />}<br />
                <button type="submit" className="btn btn-primary mt-2">Detect Wildfire</button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Result</h5>
              {result ? (
                <>
                  <p className="card-text">Prediction: {result.prediction}</p>
                  <p className="card-text">Probability: {(result.probability).toFixed(2)}%</p>
                </>
              ) : (
                <p className="card-text">Result of wildfire detection will be shown here.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageComponent;
