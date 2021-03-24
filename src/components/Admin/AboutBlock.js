import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/auth-context';
import { useForm } from '../../hooks/form-hook';
import { VALIDATOR_REQUIRE } from '../../util/validators';
import Input from '../FormElements/Input';
import Button from '../UIElements/Button';
import LoadingSpinner from '../UIElements/LoadingSpinner';
import ErrorModal from '../UIElements/ErrorModal';
import Modal from '../UIElements/Modal';
import { useHttpClient } from '../../hooks/http-hook';

const AboutBlock = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [editMode, setEditMode] = useState(false);
  const { token, isAdmin } = useContext(AuthContext);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { setReset } = props;
  const [aboutState, aboutStateInputHandler, setAboutState] = useForm(
    {
      aboutId: {
        value: props.aboutId,
        isValid: true,
      },
      prevId: {
        value: props.aboutId,
        isValid: true,
      },
      aboutTitle: {
        value: props.title,
        isValid: true,
      },
      aboutInfo: {
        value: props.aboutInfo,
        isValid: true,
      },
    },
    true
  );

  useEffect(() => {
    setAboutState(
      {
        aboutId: {
          value: props.aboutId,
          isValid: true,
        },
        prevId: {
          value: props.aboutId,
          isValid: true,
        },
        aboutTitle: {
          value: props.aboutTitle,
          isValid: true,
        },
        aboutInfo: {
          value: props.aboutInfo,
          isValid: true,
        },
      },
      true
    );
  }, [props, setAboutState]);

  const toggleEditMode = () => {
    setAboutState(
      {
        aboutId: {
          value: props.aboutId,
          isValid: true,
        },
        prevId: {
          value: props.aboutId,
          isValid: true,
        },
        aboutTitle: {
          value: props.aboutTitle,
          isValid: true,
        },
        aboutInfo: {
          value: props.aboutInfo,
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

    let aboutId = aboutState.inputs.aboutId.value;
    let prevId = aboutState.inputs.prevId.value;
    let idTaken = false;
    for (const about in props.aboutsState) {
      if (about === aboutId && aboutId !== prevId) {
        idTaken = true;
      }
    }
    if (idTaken) {
      alert('Id Taken');
      return;
    }
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/about/updateAbout/${aboutState.inputs.prevId.value}`,
        'PATCH',
        JSON.stringify({
          aboutId: aboutState.inputs.aboutId.value,
          aboutTitle: aboutState.inputs.aboutTitle.value,
          aboutInfo: aboutState.inputs.aboutInfo.value,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        }
      );
      let updatedAboutsState = {};
      updatedAboutsState[aboutId] = {
        aboutId: aboutState.inputs.aboutId.value,
        prevId: aboutState.inputs.prevId.value,
        aboutTitle: aboutState.inputs.aboutTitle.value,
        aboutInfo: aboutState.inputs.aboutInfo.value,
      };
      for (const about in props.aboutsState) {
        if (about !== prevId) {
          updatedAboutsState[about] = props.aboutsState[about];
        }
      }
      props.setAboutsState(updatedAboutsState);
      aboutStateInputHandler('prevId', aboutState.inputs.aboutId.value, true);
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
        `${process.env.REACT_APP_BACKEND_URL}/about/abouts/${aboutState.inputs.aboutId.value}`,
        'DELETE',
        null,
        { Authorization: 'Bearer ' + token }
      );
    } catch (err) {
      console.log(err);
    }

    let updatedAboutsState = {};
    for (const about in props.aboutsState) {
      let aboutID = props.aboutsState[about].aboutId;
      if (aboutID !== aboutState.inputs.aboutId.value) {
        updatedAboutsState[aboutID] = props.aboutsState[about];
      }
    }
    props.setAboutsState(updatedAboutsState);
  };

  if (token && isAdmin && editMode) {
    return (
      <div className='aboutBlock'>
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
          className='aboutId'
          element='input'
          type='text'
          id='aboutId'
          placeholder='Unique ID'
          value={aboutState.inputs.aboutId.value}
          validators={[VALIDATOR_REQUIRE()]}
          label='About ID'
          errorText='Unique ID required.'
          onInput={aboutStateInputHandler}
          isValid={true}
        />
        <Input
          className='aboutTitle'
          element='textarea'
          type='text'
          id='aboutTitle'
          placeholder='Title'
          value={aboutState.inputs.aboutTitle.value}
          validators={[VALIDATOR_REQUIRE()]}
          label='Title'
          errorText='Title required.'
          onInput={aboutStateInputHandler}
          isValid={true}
        />
        <Input
          className='aboutInfo'
          element='textarea'
          type='text'
          id='aboutInfo'
          placeholder='Info'
          value={aboutState.inputs.aboutInfo.value}
          validators={[VALIDATOR_REQUIRE()]}
          label='Info'
          errorText='Info required.'
          onInput={aboutStateInputHandler}
          isValid={true}
        />
        <Button
          type='button'
          onClick={clickHandler}
          disabled={!aboutState.isValid}
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
      <div className='about-editable'>
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
        <h4 className='aboutId'>ID: {aboutState.inputs.aboutId.value}</h4>
        <p className='aboutTitle'>
          Title: {aboutState.inputs.aboutTitle.value}
        </p>
        <p className='aboutInfo'>Info: {aboutState.inputs.aboutInfo.value}</p>
      </div>
    );
  } else {
    return (
      <div className='aboutBlock'>
        <h3>{aboutState.inputs.aboutTitle.value}</h3>
        <p>{aboutState.inputs.aboutInfo.value}</p>
      </div>
    );
  }
};

export default AboutBlock;
