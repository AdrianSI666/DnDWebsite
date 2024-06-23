/* eslint-disable react/no-unescaped-entities */
import React from "react";
// Import the useDropzone hooks from react-dropzone
import { useDropzone } from "react-dropzone";

// eslint-disable-next-line react/prop-types
const Dropzone = ({ onDrop }) => {
  // Initializing useDropzone hooks with options
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop
  });

  /* 
    useDropzone hooks exposes two functions called getRootProps and getInputProps
    and also exposes isDragActive boolean
  */

  return (
    <div className="dropzone-div" {...getRootProps()}>
      <input className="dropzone-input" {...getInputProps()} />
      <div className="text-center">
        {isDragActive ? (
          <p className="dropzone-content">Release to drop image here</p>
        ) : (
          <p className="dropzone-content">
            Drag 'n' drop image here, or click to select and add image
          </p>
        )}
      </div>
    </div>
  );
};

export default Dropzone;