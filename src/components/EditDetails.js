import React, { useContext, useEffect, useState } from 'react';
import './product.css';
import Input from './FormElements/Input';
import Button from './UIElements/Button';
import { useForm } from '../hooks/form-hook';
import './EditDetails.css';
import { useHttpClient } from '../hooks/http-hook';
import ErrorModal from './UIElements/ErrorModal';
import LoadingSpinner from './UIElements/LoadingSpinner';
import { AuthContext } from '../context/auth-context';
import {
  VALIDATOR_ALPHANUMERICSPACE,
  VALIDATOR_REQUIRE,
} from '../util/validators';

const EditDetails = (props) => {
  const [reset, setReset] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [details, setDetails] = useState(props.details);
  const auth = useContext(AuthContext);
  let initialDetailsForm = {};
  if (props.details) {
    for (const detail in props.details) {
      initialDetailsForm[detail] = {
        value: props.details[detail],
        isValid: true,
      };
    }
  } else {
    initialDetailsForm = {};
  }
  const [detailsForm, detailsFormHandler, setDetailsForm] = useForm(
    initialDetailsForm,
    true
  );
  const [newDetail, newDetailHandler, setNewDetail] = useForm(
    {
      dName: {
        value: '',
        isValid: false,
      },
      dValue: {
        value: '',
        isValid: false,
      },
    },
    false
  );
  const { productInputHandler, productFormState } = props;
  useEffect(() => {
    let updatedDetails = {};
    for (const detail in detailsForm.inputs) {
      updatedDetails[detail] = detailsForm.inputs[detail].value;
    }
    setDetails(updatedDetails);
    productInputHandler('details', updatedDetails, true);
  }, [detailsForm, productInputHandler]);

  const addDetail = async (e) => {
    e.preventDefault();
    try {
      let updatedDetails = details;
      if (newDetail.inputs.dName.value) {
        let newDName = newDetail.inputs.dName.value;
        let newDValue = newDetail.inputs.dValue.value;
        setNewDetail({
          dName: {
            value: '',
            isValid: false,
          },
          dValue: {
            value: '',
            isValid: false,
          },
        });
        updatedDetails[newDName] = newDValue;
        detailsFormHandler(newDName, newDValue, true);
      }
      setNewDetail({
        dName: {
          value: '',
          isValid: false,
        },
        dValue: {
          value: '',
          isValid: false,
        },
      });
      setReset(true);
      setDetails(updatedDetails);
      productInputHandler('details', updatedDetails, true);
      if (props.newProduct) {
        console.log(productFormState);
        return;
      }
      const formData = new FormData();
      formData.append('sku', productFormState.inputs.sku.value);
      formData.append('name', productFormState.inputs.name.value);
      formData.append('active', productFormState.inputs.active.value);
      formData.append('price', productFormState.inputs.price.value);
      formData.append('tags', productFormState.inputs.tags.value);
      formData.append('description', productFormState.inputs.description.value);
      formData.append('stock', productFormState.inputs.stock.value);
      formData.append(
        'images',
        JSON.stringify(productFormState.inputs.images.value)
      );
      formData.append('newImage', productFormState.inputs.newImage.value);
      formData.append('details', JSON.stringify(updatedDetails));
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/products/${props.id}`,
        'PATCH',
        formData,
        { Authorization: 'Bearer ' + auth.token }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const removeDetail = async (e) => {
    let filteredDetails = {};
    for (const detail in details) {
      if (detail !== e.target.getAttribute('datatarget')) {
        filteredDetails[detail] = details[detail];
      }
    }
    let filteredDetailsForm = {};
    for (const detail in details) {
      if (detail !== e.target.getAttribute('datatarget')) {
        filteredDetailsForm[detail] = {
          value: details[detail],
          isValid: true,
        };
      }
    }
    setDetailsForm(filteredDetailsForm);
    setDetails(filteredDetails);
    productInputHandler('details', filteredDetails, true);

    const formData = new FormData();
    formData.append('sku', productFormState.inputs.sku.value);
    formData.append('name', productFormState.inputs.name.value);
    formData.append('active', productFormState.inputs.active.value);
    formData.append('price', productFormState.inputs.price.value);
    formData.append('tags', productFormState.inputs.tags.value);
    formData.append('description', productFormState.inputs.description.value);
    formData.append('stock', productFormState.inputs.stock.value);
    formData.append(
      'images',
      JSON.stringify(productFormState.inputs.images.value)
    );
    formData.append('newImage', productFormState.inputs.newImage.value);
    formData.append('details', JSON.stringify(filteredDetails));
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
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <div className='details editable'>
        <div>{newDetail.inputs.dName.value}</div>
        {isLoading && <LoadingSpinner />}
        {details &&
          Object.keys(details).map((detail) => {
            return (
              <div key={detail} className='detail'>
                <p>{detail}:</p>
                <Input
                  type='text'
                  element='input'
                  productId={props.id}
                  id={detail}
                  placeholder={details[detail]}
                  value={details[detail]}
                  validators={[]}
                  errorText={`${detail} required`}
                  onInput={detailsFormHandler}
                  onBlur={props.touchHandler}
                  isValid={true}
                />
                <Button
                  datatarget={detail}
                  onClick={removeDetail}
                  type='button'
                >
                  &#10006;
                </Button>
              </div>
            );
          })}
      </div>
      <div className='newDetail'>
        <h4>
          <p>{newDetail.inputs.dName.value}</p>
          Add New Detail
        </h4>
        <Input
          type='text'
          element='input'
          productId={props.id}
          id='dName'
          placeholder='Detail Name'
          validators={[VALIDATOR_ALPHANUMERICSPACE(), VALIDATOR_REQUIRE()]}
          onInput={newDetailHandler}
          onBlur={props.touchHandler}
          isValid={false}
          errorText='Value is required and must be alphanumeric (A-Z,a-z,0-9) only.'
          value={newDetail.inputs.dName.value}
          reset={reset}
          setReset={setReset}
        />
        <Input
          type='text'
          element='input'
          productId={props.id}
          id='dValue'
          placeholder='Detail Value'
          validators={[]}
          onInput={newDetailHandler}
          onBlur={props.touchHandler}
          isValid={true}
          value={newDetail.inputs.dValue.value}
          reset={reset}
          setReset={setReset}
        />
        <Button
          type='button'
          onClick={addDetail}
          disabled={props.disabled || !newDetail.isValid}
        >
          &#10010;
        </Button>
      </div>
    </React.Fragment>
  );
};

export default EditDetails;
