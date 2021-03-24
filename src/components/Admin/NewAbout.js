import React, { useContext, useEffect, useState } from 'react';
import { useForm } from '../../hooks/form-hook';
import Input from '../FormElements/Input';
import { VALIDATOR_REQUIRE } from '../../util/validators';
import { AuthContext } from '../../context/auth-context';
import Button from '../UIElements/Button';
import LoadingSpinner from '../UIElements/LoadingSpinner';
import ErrorModal from '../UIElements/ErrorModal';
import { useHttpClient } from '../../hooks/http-hook';
// import '../Abouts.css';

const NewAbout = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [reset, setReset] = useState(false);
  const { token, isAdmin } = useContext(AuthContext);

  const [newAboutState, newAboutStateHandler] = useForm(
    {
      aboutId: {
        value: '',
        isValid: false,
      },
      aboutTitle: {
        value: '',
        isValid: false,
      },
      aboutInfo: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    props.setReset(reset);
  }, [reset, props]);

  const clickHandler = async (e) => {
    e.preventDefault();
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/about/new`,
        'POST',
        JSON.stringify({
          aboutId: newAboutState.inputs.aboutId.value,
          aboutTitle: newAboutState.inputs.aboutTitle.value,
          aboutInfo: newAboutState.inputs.aboutInfo.value,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        }
      );

      let newAboutId = newAboutState.inputs.aboutId.value;
      let updatedAboutsState = props.aboutsState;
      updatedAboutsState[newAboutId] = {
        aboutId: newAboutId,
        aboutTitle: newAboutState.inputs.aboutTitle.value,
        aboutInfo: newAboutState.inputs.aboutInfo.value,
      };
      props.setAboutsState(updatedAboutsState);
    } catch (err) {
      console.log(err);
    }

    //   let newAbout = {
    //     aboutId: newAboutState.inputs.aboutId.value,
    //     aboutTitle: newAboutState.inputs.aboutTitle.value,
    //     aboutInfo: newAboutState.inputs.aboutInfo.value,
    //   };
    //   let aboutKey = newAbout.aboutId;

    //   props.setAboutsState((prevState) => {
    //     return { ...prevState, [aboutKey]: newAbout };
    //   });
    // } catch (err) {
    //   console.log(err);
    // }
    setReset(true);
    props.setReset(true);
  };

  if (token && isAdmin) {
    return (
      <div className='abouts-container'>
        {isLoading && <LoadingSpinner />}
        <ErrorModal error={error} onClear={clearError} />
        <h3>Add New</h3>
        <Input
          className='aboutId'
          element='input'
          type='text'
          id='aboutId'
          placeholder='Unique ID'
          value={newAboutState.inputs.aboutId.value}
          validators={[VALIDATOR_REQUIRE]}
          label='About ID'
          errorText='Unique ID required.'
          onInput={newAboutStateHandler}
          reset={reset}
          setReset={setReset}
        />
        <Input
          clasName='aboutTitle'
          element='textarea'
          type='text'
          id='aboutTitle'
          placeholder='Title'
          value={newAboutState.inputs.aboutTitle.value}
          validators={[VALIDATOR_REQUIRE()]}
          label='About Title'
          errorText='Title required.'
          onInput={newAboutStateHandler}
          reset={reset}
          setReset={setReset}
        />
        <Input
          className='aboutInfo'
          id='aboutInfo'
          element='textarea'
          type='text'
          value={newAboutState.inputs.aboutInfo.value}
          validators={[VALIDATOR_REQUIRE()]}
          label='About Info'
          errorText='Some info required.'
          onInput={newAboutStateHandler}
          placeholder='About information'
          reset={reset}
          setReset={setReset}
        />
        <Button
          type='submit'
          onClick={clickHandler}
          disabled={!newAboutState.isValid}
        >
          Add About Block
        </Button>
      </div>
    );
  } else {
    return <h1>This page does not exist!</h1>;
  }
};
export default NewAbout;
