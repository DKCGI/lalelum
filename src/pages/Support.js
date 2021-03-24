import React, { useState } from 'react';
import Input from '../components/FormElements/Input';
import Button from '../components/UIElements/Button';
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL,
} from '../util/validators';
import './Support.css';
import { useForm } from '../hooks/form-hook';
import Faqs from '../components/Faqs';
import Policies from '../components/Policies';

const Support = () => {
  const [reset, setReset] = useState(false);
  const [formState, inputHandler] = useForm(
    {
      name: {
        value: '',
        isValid: false,
      },
      email: {
        value: '',
        isValid: false,
      },
      message: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const messageSubmitHandler = () => {
    setReset(true);
  };

  return (
    <main id='support-section'>
      <div className='support-nav'>
        <ul>
          <li>
            <a href='#faqs'>FAQ</a>
          </li>
          <li>
            <a href='#contact'>Contact</a>
          </li>
          <li>
            <a href='#policies'>Policies</a>
          </li>
        </ul>
      </div>
      <div className='support-content'>
        <div id='faq-section'>
          <a href='/#' className='anchor' id='faqs'>
            anchor
          </a>
          <h2>FAQ</h2>
          <Faqs />
        </div>
        <div id='contact-section' className='contact-form'>
          <form>
            <a href='/#' className='anchor' id='contact'>
              anchor
            </a>
            <h2>Contact</h2>
            <p>
              <strong>Reach out.</strong> Leave us a message and we'll get back
              to you as soon as we feel like it.
            </p>
            <Input
              element='input'
              id='name'
              placeholder='Name'
              validators={[VALIDATOR_REQUIRE()]}
              errorText='Name required.'
              onInput={inputHandler}
              value={formState.inputs.name.value}
              reset={reset}
              setReset={setReset}
            />
            <Input
              element='input'
              id='email'
              placeholder='Email'
              validators={[VALIDATOR_EMAIL()]}
              errorText='Enter a valid email.'
              onInput={inputHandler}
              value={formState.inputs.email.value}
              reset={reset}
              setReset={setReset}
            />
            <Input
              element='text-area'
              id='message'
              placeholder='Message'
              validators={[VALIDATOR_MINLENGTH(10)]}
              errorText='Message too short.'
              onInput={inputHandler}
              value={formState.inputs.message.value}
              reset={reset}
              setReset={setReset}
            />
            <Button
              type='button'
              onClick={messageSubmitHandler}
              disabled={!formState.isValid}
            >
              Send
            </Button>
          </form>
        </div>
        <div id='policy-section'>
          <a href='/#' className='anchor' id='policies'>
            anchor
          </a>
          <h2>Policies</h2>
          <Policies />
        </div>
      </div>
    </main>
  );
};

export default Support;
