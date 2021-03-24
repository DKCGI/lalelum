import React, { useEffect, useState, useContext } from 'react';
import Input from '../FormElements/Input';
import { VALIDATOR_REQUIRE } from '../../util/validators';
import Button from '../UIElements/Button';
import { useForm } from '../../hooks/form-hook';
import { AuthContext } from '../../context/auth-context';
import LoadingSpinner from '../UIElements/LoadingSpinner';
import ErrorModal from '../UIElements/ErrorModal';
import Modal from '../UIElements/Modal';
import { useHttpClient } from '../../hooks/http-hook';

const Faq = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [editMode, setEditMode] = useState(false);
  const { token, isAdmin } = useContext(AuthContext);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { setReset } = props;
  const [faqState, faqInputHandler, setFaqState] = useForm(
    {
      faqId: {
        value: props.faqId,
        isValid: true,
      },
      prevId: {
        value: props.faqId,
        isValid: true,
      },
      question: {
        value: props.faqQ,
        isValid: true,
      },
      answer: {
        value: props.faqA,
        isValid: true,
      },
    },
    true
  );

  useEffect(() => {
    setFaqState(
      {
        faqId: {
          value: props.faqId,
          isValid: true,
        },
        prevId: {
          value: props.faqId,
          isValid: true,
        },
        question: {
          value: props.faqQ,
          isValid: true,
        },
        answer: {
          value: props.faqA,
          isValid: true,
        },
      },
      true
    );
  }, [props, setFaqState]);

  const toggleEditMode = () => {
    setFaqState(
      {
        faqId: {
          value: props.faqId,
          isValid: true,
        },
        prevId: {
          value: props.faqId,
          isValid: true,
        },
        question: {
          value: props.faqQ,
          isValid: true,
        },
        answer: {
          value: props.faqA,
          isValid: true,
        },
      },
      true
    );
    setEditMode((prevState) => {
      return !prevState;
    });
  };
  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };
  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };
  const clickHandler = async (e) => {
    e.preventDefault();

    let faqId = faqState.inputs.faqId.value;
    let prevId = faqState.inputs.prevId.value;
    let idTaken = false;
    for (const faq in props.faqsState) {
      if (faq === faqId && faqId !== prevId) {
        idTaken = true;
      }
    }
    if (idTaken) {
      alert('ID taken');
      return;
    }
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/support/updateFaq/${faqState.inputs.prevId.value}`,
        'PATCH',
        JSON.stringify({
          faqId: faqState.inputs.faqId.value,
          question: faqState.inputs.question.value,
          answer: faqState.inputs.answer.value,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        }
      );
      let updatedFaqsState = {};
      updatedFaqsState[faqId] = {
        faqId: faqState.inputs.faqId.value,
        prevId: faqState.inputs.prevId.value,
        question: faqState.inputs.question.value,
        answer: faqState.inputs.answer.value,
      };
      for (const faq in props.faqsState) {
        if (faq !== prevId) {
          updatedFaqsState[faq] = props.faqsState[faq];
        }
      }
      props.setFaqsState(updatedFaqsState);
      faqInputHandler('prevId', faqState.inputs.faqId.value, true);
    } catch (err) {
      console.log(err);
    }
    setReset(true);
    toggleEditMode();
  };

  const deleteHandler = async (e) => {
    setShowConfirmModal(false);
    e.preventDefault();
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/support/faqs/${faqState.inputs.faqId.value}`,
        'DELETE',
        null,
        { Authorization: 'Bearer ' + token }
      );
    } catch (err) {
      console.log(err);
    }

    let updatedFaqsState = {};
    for (const faq in props.faqsState) {
      let faqID = props.faqsState[faq].faqId;
      if (faqID !== faqState.inputs.faqId.value) {
        updatedFaqsState[faqID] = props.faqsState[faq];
      }
    }
    props.setFaqsState(updatedFaqsState);
  };

  if (token && isAdmin && editMode) {
    return (
      <div className='faq-editMode'>
        {isLoading && <LoadingSpinner />}
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
        <ErrorModal error={error} onClear={clearError} />
        <Input
          className='faqId'
          element='input'
          type='text'
          id='faqId'
          placeholder='FAQ ID'
          value={faqState.inputs.faqId.value}
          validators={[VALIDATOR_REQUIRE()]}
          label='FAQ ID'
          errorText='FAQ ID Required.'
          onInput={faqInputHandler}
          isValid={true}
        />
        <Input
          className='FaqQ'
          element='textarea'
          id='question'
          placeholder='FAQ Question'
          value={faqState.inputs.question.value}
          validators={[VALIDATOR_REQUIRE()]}
          label='FAQ Question'
          errorText='Question Required.'
          onInput={faqInputHandler}
          isValid={true}
        />
        <Input
          className='FaqA'
          element='textarea'
          id='answer'
          placeholder='FAQ Answer'
          value={faqState.inputs.answer.value}
          validators={[VALIDATOR_REQUIRE()]}
          label='FAQ Answer'
          errorText='Answer Required.'
          onInput={faqInputHandler}
          isValid={true}
        />
        <Button
          type='button'
          onClick={clickHandler}
          disabled={!faqState.isValid}
          className='form-submit updateButton'
        >
          Update
        </Button>
        <Button type='button' onClick={toggleEditMode} className='cancelButton'>
          Cancel
        </Button>
      </div>
    );
  } else if (token && isAdmin) {
    return (
      <div className='faq-editable'>
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
        <Button type='button' onClick={toggleEditMode} className='editButton'>
          Edit
        </Button>
        <Button
          type='button'
          onClick={showDeleteWarningHandler}
          className='deleteButton'
        >
          Delete
        </Button>
        <h4 className='faqId'>ID: {faqState.inputs.faqId.value}</h4>
        <p className='faqQ'>Q: {faqState.inputs.question.value}</p>
        <p className='faqA'>A: {faqState.inputs.answer.value}</p>
      </div>
    );
  } else {
    return (
      <div className='faq'>
        <h4 className='faqQ'>Q: {faqState.inputs.question.value}</h4>
        <p className='faqA'>A: {faqState.inputs.answer.value}</p>
      </div>
    );
  }
};

export default Faq;
