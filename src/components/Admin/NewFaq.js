import React, { useContext, useEffect, useState } from 'react';
import { useForm } from '../../hooks/form-hook';
import Input from '../FormElements/Input';
import { VALIDATOR_REQUIRE } from '../../util/validators';
import { AuthContext } from '../../context/auth-context';
import Button from '../UIElements/Button';
import LoadingSpinner from '../UIElements/LoadingSpinner';
import ErrorModal from '../UIElements/ErrorModal';
import { useHttpClient } from '../../hooks/http-hook';
import '../Faqs.css';

const NewFaq = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [reset, setReset] = useState(false);
  const { token, isAdmin } = useContext(AuthContext);

  const [newFaqState, newFaqStateHandler] = useForm(
    {
      faqId: {
        value: '',
        isValid: false,
      },
      question: {
        value: '',
        isValid: false,
      },
      answer: {
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
        `${process.env.REACT_APP_BACKEND_URL}/support/newFaq`,
        'POST',
        JSON.stringify({
          faqId: newFaqState.inputs.faqId.value,
          question: newFaqState.inputs.question.value,
          answer: newFaqState.inputs.answer.value,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        }
      );
      let newFaqId = newFaqState.inputs.faqId.value;
      let updatedFaqsState = props.faqsState;
      updatedFaqsState[newFaqId] = {
        faqId: newFaqId,
        question: newFaqState.inputs.question.value,
        answer: newFaqState.inputs.answer.value,
      };
      props.setFaqsState(updatedFaqsState);
    } catch (err) {
      console.log(err);
    }
    setReset(true);
    props.setReset(true);
  };

  if (token && isAdmin) {
    return (
      <div className='newFaq'>
        {isLoading && <LoadingSpinner />}
        <ErrorModal error={error} onClear={clearError} />
        <Input
          className='faqId'
          element='input'
          type='text'
          id='faqId'
          placeholder='FAQ ID'
          value={newFaqState.inputs.faqId.value}
          validators={[VALIDATOR_REQUIRE()]}
          label='FAQ ID'
          errorText='FAQ ID Required.'
          onInput={newFaqStateHandler}
          reset={reset}
          setReset={setReset}
        />
        <Input
          className='question'
          element='textarea'
          id='question'
          placeholder='FAQ Question'
          value={newFaqState.inputs.question.value}
          validators={[VALIDATOR_REQUIRE()]}
          label='FAQ Question'
          errorText='Question Required.'
          onInput={newFaqStateHandler}
          reset={reset}
          setReset={setReset}
        />
        <Input
          className='answer'
          element='textarea'
          id='answer'
          placeholder='FAQ Answer'
          value={newFaqState.inputs.answer.value}
          validators={[VALIDATOR_REQUIRE()]}
          label='FAQ Answer'
          errorText='Answer Required.'
          onInput={newFaqStateHandler}
          reset={reset}
          setReset={setReset}
        />
        <Button
          type='button'
          onClick={clickHandler}
          disabled={!newFaqState.isValid}
          className='form-submit'
        >
          Add
        </Button>
      </div>
    );
  } else {
    return <h1>This page does not exist!</h1>;
  }
};
export default NewFaq;
