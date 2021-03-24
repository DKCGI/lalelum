import React, { useRef, useState, useEffect } from 'react';
import Button from '../UIElements/Button';
import './ImageUpload.css';
const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  const filePickerRef = useRef();
  useEffect(() => {
    setPreviewUrl(null);
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      !props.reset && setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
    props.reset && setPreviewUrl(null);
  }, [file, props.reset]);
  const chooseHandler = (event) => {
    props.setReset && props.setReset(false);
    let chosenFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      chosenFile = event.target.files[0];
      setFile(chosenFile);
      setIsValid(true);
      fileIsValid = true;
      props.onBlur();
    } else {
      setIsValid(false);
    }
    props.onInput(props.id, chosenFile, fileIsValid);
  };
  const chooseImageHandler = () => {
    filePickerRef.current.click();
  };
  return (
    <div className='imageUpload'>
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: 'none' }}
        type='file'
        accept='.jpg, .png, .jpeg'
        onChange={chooseHandler}
      />
      <div className='imageUploadPreview'>
        {!props.reset && previewUrl && <img src={previewUrl} alt='Preview' />}
        {!previewUrl && <p>Add a new image</p>}
      </div>
      <Button type='button' onClick={chooseImageHandler}>
        {!previewUrl && 'No image selected'}
        {previewUrl && filePickerRef.current.files[0].name}
      </Button>
      {!isValid && props.errorText}
    </div>
  );
};

export default ImageUpload;
