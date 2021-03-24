import React, { useContext, useState } from 'react';
import Input from '../FormElements/Input';
import { VALIDATOR_REQUIRE } from '../../util/validators';
import Button from '../UIElements/Button';
import { useForm } from '../../hooks/form-hook';
import LoadingSpinner from '../UIElements/LoadingSpinner';
import ErrorModal from '../UIElements/ErrorModal';
import { useHttpClient } from '../../hooks/http-hook';
import ImageUpload from '../FormElements/ImageUpload';
import EditDetails from '../EditDetails';
import '../product.css';
import { AuthContext } from '../../context/auth-context';

const NewProduct = (props) => {
  const [reset, setReset] = useState(false);
  const [resetPreviewURL, setResetPreviewURL] = useState(false);
  const [blur, setBlur] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [productFormState, productInputHandler] = useForm(
    {
      name: {
        value: '',
        isValid: false,
      },
      price: {
        value: '',
        isValid: false,
      },
      sku: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
      details: {
        value: '',
        isValid: true,
      },
      tags: {
        value: '',
        isValid: false,
      },
      stock: {
        value: '',
        isValid: false,
      },
      images: {
        value: null,
        isValid: true,
      },
      newImage: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const update = props.update;

  const clickHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('sku', productFormState.inputs.sku.value);
    formData.append('name', productFormState.inputs.name.value);
    formData.append('price', productFormState.inputs.price.value);
    formData.append('tags', productFormState.inputs.tags.value);
    formData.append('description', productFormState.inputs.description.value);
    formData.append(
      'details',
      JSON.stringify(productFormState.inputs.details.value)
    );
    formData.append('stock', productFormState.inputs.stock.value);
    formData.append('newImage', productFormState.inputs.newImage.value);
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/products/new`,
        'POST',
        formData,
        { Authorization: 'Bearer ' + auth.token }
      );
    } catch (err) {
      console.log(err);
    }
    setReset(true);
    setResetPreviewURL(true);
    setBlur(false);
    update((prev) => !prev);
  };

  const touchHandler = (e) => {
    setBlur(true);
  };

  return (
    <form className={`product newProduct editable`}>
      {isLoading && <LoadingSpinner />}
      <ErrorModal error={error} onClear={clearError} />
      <div className='header'>
        <h2>{productFormState.inputs.name.value || 'New Product'}</h2>
      </div>

      <Input
        className='name'
        element='input'
        type='text'
        id='name'
        placeholder='Product Name'
        value={productFormState.inputs.name.value}
        validators={[VALIDATOR_REQUIRE()]}
        errorText='Name required.'
        onInput={productInputHandler}
        onBlur={touchHandler}
        isValid={true}
        reset={reset}
        setReset={setReset}
      />
      <Input
        className='sku'
        element='input'
        type='text'
        id='sku'
        placeholder='SKU'
        value={productFormState.inputs.sku.value}
        validators={[VALIDATOR_REQUIRE()]}
        errorText='SKU required.'
        onInput={productInputHandler}
        onBlur={touchHandler}
        isValid={true}
        reset={reset}
        setReset={setReset}
      />
      <Input
        className='price'
        type='number'
        element='input'
        id='price'
        placeholder='Product Price'
        value={productFormState.inputs.price.value}
        validators={[VALIDATOR_REQUIRE()]}
        errorText='Price required.'
        onInput={productInputHandler}
        onBlur={touchHandler}
        isValid={true}
        reset={reset}
        setReset={setReset}
      />
      <Input
        className='stock'
        element='input'
        type='number'
        id='stock'
        placeholder='# in stock'
        value={productFormState.inputs.stock.value}
        validators={[]}
        errorText='stock required.'
        onInput={productInputHandler}
        onBlur={touchHandler}
        isValid={true}
        reset={reset}
        setReset={setReset}
      />
      <EditDetails
        productInputHandler={productInputHandler}
        details={{}}
        touchHandler={touchHandler}
        productFormState={productFormState}
        disabled={!blur}
        onSubmit={clickHandler}
        newProduct={true}
      />

      <Input
        className='tags'
        id='tags'
        placeholder='Add tags separated by spaces'
        value={productFormState.inputs.tags.value}
        validators={[]}
        errorText='Tags required.'
        onInput={productInputHandler}
        onBlur={touchHandler}
        isValid={true}
        reset={reset}
        setReset={setReset}
      />
      <Input
        className='description'
        id='description'
        placeholder='Add description.'
        value={productFormState.inputs.description.value}
        validators={[]}
        errorText='description required.'
        onInput={productInputHandler}
        onBlur={touchHandler}
        isValid={true}
        reset={reset}
        setReset={setReset}
      />
      <div className='product-image'>
        <ImageUpload
          id='newImage'
          onBlur={touchHandler}
          onInput={productInputHandler}
          reset={resetPreviewURL}
          setReset={setResetPreviewURL}
        />
      </div>
      <Button
        type='button'
        onClick={clickHandler}
        disabled={!productFormState.isValid || !blur}
        className='form-submit'
      >
        Add
      </Button>
    </form>
  );
};

export default NewProduct;
