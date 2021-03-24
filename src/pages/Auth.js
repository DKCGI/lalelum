import React, { useContext, useState } from 'react';
import Input from '../components/FormElements/Input';
import Button from '../components/UIElements/Button';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../util/validators';
import { useForm } from '../hooks/form-hook';
import { AuthContext } from '../context/auth-context';
import { useHttpClient } from '../hooks/http-hook';
import ErrorModal from '../components/UIElements/ErrorModal';
import LoadingSpinner from '../components/UIElements/LoadingSpinner';
import './Auth.css';

const Auth = () => {
  const [isloginMode, setIsLoginMode] = useState(true);
  const auth = useContext(AuthContext);
  const [blur, setBlur] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loginFormState, loginInputHandler, setLoginFormData] = useForm(
    {
      email: {
        value: '',
        isValid: true,
      },
      password: {
        value: '',
        isValid: true,
      },
    },
    false
  );
  const submitHandler = async (e) => {
    e.preventDefault();
    if (isloginMode) {
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/login`,
          'POST',
          JSON.stringify({
            email: loginFormState.inputs.email.value,
            password: loginFormState.inputs.password.value,
          }),
          {
            'Content-Type': 'application/json',
          }
        );
        auth.login(response.userId, response.token, response.isAdmin);
      } catch (err) {}
    } else {
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/new`,
          'POST',
          JSON.stringify({
            name: loginFormState.inputs.name.value,
            email: loginFormState.inputs.email.value,
            password: loginFormState.inputs.password.value,
          }),
          {
            'Content-Type': 'application/json',
          }
        );
        auth.login(response.userId, response.token, response.isAdmin);
      } catch (err) {}
    }
  };
  const touchHandler = () => {
    setBlur(true);
  };
  const switchLoginModeHandler = (e) => {
    e.preventDefault();
    if (!isloginMode) {
      setLoginFormData(
        {
          ...loginFormState.inputs,
          name: undefined,
        },
        loginFormState.inputs.email.isValid &&
          loginFormState.inputs.password.isValid
      );
    } else {
      setLoginFormData(
        {
          ...loginFormState.inputs,
          name: {
            value: '',
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  return (
    <main id='auth'>
      <ErrorModal error={error} onClear={clearError} />
      <form className='loginForm' onSubmit={submitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        {!isloginMode && (
          <Input
            element='input'
            type='text'
            id='name'
            placeholder='Name'
            value={loginFormState.inputs.name.value}
            validators={[VALIDATOR_REQUIRE()]}
            label='Name'
            errorText='Name required'
            onInput={loginInputHandler}
            onBlur={touchHandler}
            isValid={false}
          />
        )}
        <Input
          element='input'
          type='text'
          id='email'
          placeholder='Username or Email'
          value={loginFormState.inputs.email.value}
          validators={[VALIDATOR_REQUIRE()]}
          label='email'
          errorText='Username or email required'
          onInput={loginInputHandler}
          onBlur={touchHandler}
          isValid={false}
        />
        <Input
          element='input'
          type='password'
          id='password'
          placeholder='Password'
          value={loginFormState.inputs.password.value}
          validators={[VALIDATOR_MINLENGTH(6)]}
          label='password'
          errorText='Password must be at least 6 characters long.'
          onInput={loginInputHandler}
          onBlur={touchHandler}
          isValid={false}
        />
        <Button disabled={!loginFormState.isValid || !blur}>
          {isloginMode ? 'Login' : 'Signup'}
        </Button>
        <button className='switchAuthMode' onClick={switchLoginModeHandler}>
          Switch to {isloginMode ? 'Signup' : 'Login'} Mode
        </button>
      </form>
    </main>
  );
};

export default Auth;
