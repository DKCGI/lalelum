import React, { useState, useContext } from 'react';
import Input from '../FormElements/Input';
import Button from '../UIElements/Button';
import LoadingSpinner from '../UIElements/LoadingSpinner';
import ErrorModal from '../UIElements/ErrorModal';
import EditDetails from '../EditDetails';
import {
  VALIDATOR_ALPHANUMERIC,
  VALIDATOR_ALPHANUMERICSPACE,
  VALIDATOR_REQUIRE,
} from '../../util/validators';
import { useForm } from '../../hooks/form-hook';
import { useHttpClient } from '../../hooks/http-hook';
import ImageUpload from '../FormElements/ImageUpload';
import '../product.css';
import { AuthContext } from '../../context/auth-context';
import Modal from '../UIElements/Modal';
const Product = (props) => {
  const [blur, setBlur] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [productFormState, productInputHandler] = useForm(
    {
      name: {
        value: props.name,
        isValid: true,
      },
      active: {
        value: props.active,
        isValid: true,
      },
      price: {
        value: props.price,
        isValid: true,
      },
      sku: {
        value: props.sku,
        isValid: true,
      },
      description: {
        value: props.description,
        isValid: true,
      },
      details: {
        value: props.details,
        isValid: true,
      },
      tags: {
        value: props.tags,
        isValid: true,
      },
      stock: {
        value: props.stock,
        isValid: true,
      },
      images: {
        value: props.images,
        isValid: true,
      },
      newImage: {
        value: null,
        isValid: true,
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
    formData.append('active', productFormState.inputs.active.value);
    formData.append('price', productFormState.inputs.price.value);
    formData.append('tags', productFormState.inputs.tags.value);
    formData.append('description', productFormState.inputs.description.value);
    formData.append('stock', productFormState.inputs.stock.value);
    props.images && formData.append('images', JSON.stringify(props.images));
    productFormState.inputs.details.value &&
      formData.append(
        'details',
        JSON.stringify(productFormState.inputs.details.value)
      );
    formData.append('newImage', productFormState.inputs.newImage.value);
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/products/${props.id}`,
        'PATCH',
        formData,
        { Authorization: 'Bearer ' + auth.token }
      );
    } catch (err) {
      console.log(err);
    }
    setBlur(false);
    // update((prev) => !prev);
  };

  const touchHandler = (e) => {
    setBlur(true);
  };
  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };
  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };
  const deleteHandler = async (e) => {
    setShowConfirmModal(false);
    e.preventDefault();
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/products/${props.id}`,
        'DELETE',
        null,
        { Authorization: 'Bearer ' + auth.token }
      );
    } catch (err) {
      console.log(err);
    }
    update((prev) => !prev);
  };

  return (
    <form className={`product editable ${props.classes}`}>
      {isLoading && <LoadingSpinner />}
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header='Are you sure?'
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={deleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      ></Modal>
      <div className='header'>
        <h2>{productFormState.inputs.name.value}</h2>
        <Button
          type='button'
          onClick={showDeleteWarningHandler}
          className='deleteButton'
        >
          Delete
        </Button>
        <div className='checkboxContainer'>
          <h3>Active</h3>
          <Input
            className='active'
            element='input'
            type='checkbox'
            productId={props.id} //don't need these productIds I think
            id='active'
            checked={productFormState.inputs.active.value}
            value={productFormState.inputs.active.value}
            validators={[]}
            errorText=''
            onInput={productInputHandler}
            onBlur={touchHandler}
            isValid={true}
          />
        </div>
      </div>

      <Input
        className='name'
        element='input'
        type='text'
        productId={props.id}
        id='name'
        placeholder='Product Name'
        value={productFormState.inputs.name.value}
        validators={[VALIDATOR_REQUIRE(), VALIDATOR_ALPHANUMERICSPACE()]}
        label='Name'
        errorText='Name required and must only include Aa-Zz, spaces or underscores.'
        onInput={productInputHandler}
        onBlur={touchHandler}
        isValid={true}
      />
      <Input
        className='sku'
        element='input'
        type='text'
        productId={props.id}
        id='sku'
        placeholder='SKU'
        value={productFormState.inputs.sku.value}
        validators={[VALIDATOR_REQUIRE(), VALIDATOR_ALPHANUMERIC()]}
        label='SKU'
        errorText='SKU required and must only include Aa-Zz.'
        onInput={productInputHandler}
        onBlur={touchHandler}
        isValid={true}
      />
      <Input
        className='price'
        type='number'
        element='input'
        productId={props.id}
        id='price'
        placeholder='Product Price'
        value={productFormState.inputs.price.value}
        validators={[VALIDATOR_REQUIRE()]}
        label='Price ($)'
        errorText='Price required.'
        onInput={productInputHandler}
        onBlur={touchHandler}
        isValid={true}
      />

      <Input
        className='stock'
        element='input'
        type='number'
        productId={props.id}
        id='stock'
        placeholder='# in stock.'
        value={productFormState.inputs.stock.value}
        validators={[]}
        label='stock'
        errorText='stock required.'
        onInput={productInputHandler}
        onBlur={touchHandler}
        isValid={true}
      />
      <EditDetails
        productInputHandler={productInputHandler}
        details={props.details}
        touchHandler={touchHandler}
        productFormState={productFormState}
        disabled={!productFormState.isValid || !blur}
        onSubmit={clickHandler}
        update={props.update}
        id={props.id}
      />

      <Input
        className='tags'
        productId={props.id}
        id='tags'
        placeholder='Add tags separated by spaces.'
        value={productFormState.inputs.tags.value}
        validators={[VALIDATOR_ALPHANUMERICSPACE()]}
        label='Tags'
        errorText='Tags required and must only include Aa-Zz, spaces or underscores.'
        onInput={productInputHandler}
        onBlur={touchHandler}
        isValid={true}
      />

      <Input
        className='description'
        productId={props.id}
        id='description'
        placeholder='Add description.'
        value={productFormState.inputs.description.value}
        validators={[VALIDATOR_ALPHANUMERICSPACE()]}
        label='description'
        errorText='description required.'
        onInput={productInputHandler}
        onBlur={touchHandler}
        isValid={true}
      />
      <div className='product-image'>
        <div className='updateImages'>
          <div className='image-container'>
            <img
              src={
                `${process.env.REACT_APP_ASSET_URL}/` +
                (props.images.length > 0
                  ? props.images[0]
                  : 'uploads/images/imageIcon.svg')
              }
              alt='product'
            />
          </div>
          <ImageUpload
            onBlur={touchHandler}
            id='newImage'
            onInput={productInputHandler}
            productFormState={productFormState}
          />
        </div>
      </div>
      <Button
        type='button'
        onClick={clickHandler}
        disabled={!productFormState.isValid || !blur}
        className='form-submit'
      >
        Update
      </Button>
    </form>
  );
};

export default Product;
