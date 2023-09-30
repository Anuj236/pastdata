import React, { useState } from 'react';
import axios from 'axios';
import Dropzone from 'react-dropzone';

const UploadForm = () => {
  const [file, setFile] = useState(null);

  const handleDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/data', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      alert('File uploaded successfully');
    } catch (error) {
      console.error(error);
      alert('Error uploading file');
    }
  };

  return (
    <div>
      <h1>Upload CSV File</h1>
      <form onSubmit={handleSubmit}>
        <Dropzone onDrop={handleDrop} accept=".csv">
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {file ? (
                <p>Selected file: {file.name}</p>
              ) : (
                <p>Drag and drop a CSV file here, or click to select file</p>
              )}
            </div>
          )}
        </Dropzone>
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default UploadForm;