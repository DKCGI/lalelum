import React, { useEffect, useState, useContext } from 'react';
import Input from './FormElements/Input';
import { VALIDATOR_REQUIRE } from '../util/validators';
import Button from './UIElements/Button';
import { useForm } from '../hooks/form-hook';
import { AuthContext } from '../context/auth-context';
import LoadingSpinner from './UIElements/LoadingSpinner';
import ErrorModal from './UIElements/ErrorModal';
import Modal from './UIElements/Modal';
import { useHttpClient } from '../hooks/http-hook';

const Policy = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [editMode, setEditMode] = useState(false);
  const { token } = useContext(AuthContext);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [policyState, policyInputHandler, setPolicyState] = useForm(
    {
      policyId: {
        value: props.policyId,
        isValid: true,
      },
      prevId: {
        value: props.policyId,
        isValid: true,
      },
      header: {
        value: props.policyHeader,
        isValid: true,
      },
      body: {
        value: props.policyBody,
        isValid: true,
      },
    },
    true
  );

  useEffect(() => {
    setPolicyState(
      {
        policyId: {
          value: props.policyId,
          isValid: true,
        },
        prevId: {
          value: props.policyId,
          isValid: true,
        },
        header: {
          value: props.policyHeader,
          isValid: true,
        },
        body: {
          value: props.policyBody,
          isValid: true,
        },
      },
      true
    );
  }, [props, setPolicyState]);

  const toggleEditMode = () => {
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

    let policyId = policyState.inputs.policyId.value;
    let prevId = policyState.inputs.prevId.value;
    let updatedpoliciesState = {};

    let idTaken = false;
    for (const policy in props.policiesState) {
      if (policy === policyId && policyId !== prevId) {
        idTaken = true;
      }
    }
    if (idTaken) {
      alert('Id Taken');
      return;
    }

    policyInputHandler('prevId', policyState.inputs.policyId.value, true);
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/support/updatePolicy/${policyState.inputs.prevId.value}`,
        'PATCH',
        JSON.stringify({
          policyId: policyState.inputs.policyId.value,
          header: policyState.inputs.header.value,
          body: policyState.inputs.body.value,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        }
      );
      updatedpoliciesState[policyId] = {
        policyId: policyState.inputs.policyId.value,
        header: policyState.inputs.header.value,
        body: policyState.inputs.body.value,
      };

      for (const policy in props.policiesState) {
        let policyID = props.policiesState[policy].policyId;
        if (policyID !== policyState.inputs.prevId.value) {
          updatedpoliciesState[policyID] = props.policiesState[policy];
        }
      }

      props.setPoliciesState(updatedpoliciesState);

      props.setPoliciesState(updatedpoliciesState);
    } catch (err) {
      console.log(err);
    }

    toggleEditMode();
  };

  const deleteHandler = async (e) => {
    setShowConfirmModal(false);
    e.preventDefault();
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/support/policies/${policyState.inputs.policyId.value}`,
        'DELETE',
        null,
        { Authorization: 'Bearer ' + token }
      );
    } catch (err) {
      console.log(err);
    }

    let updatedpoliciesState = {};
    for (const policy in props.policiesState) {
      let policyID = props.policiesState[policy].policyId;
      if (policyID !== policyState.inputs.policyId.value) {
        updatedpoliciesState[policyID] = props.policiesState[policy];
      }
    }
    props.setPoliciesState(updatedpoliciesState);
  };

  if (props.editable && editMode) {
    return (
      <div className='policy-editMode'>
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
          className='policyId'
          element='input'
          type='text'
          id='policyId'
          placeholder='POLICY ID'
          value={policyState.inputs.policyId.value}
          validators={[VALIDATOR_REQUIRE()]}
          label='POLICY ID'
          errorText='POLICY ID Required.'
          onInput={policyInputHandler}
          isValid={true}
        />
        <Input
          className='policyHeader'
          element='textarea'
          id='header'
          placeholder='POLICY header'
          value={policyState.inputs.header.value}
          validators={[VALIDATOR_REQUIRE()]}
          label='POLICY header'
          errorText='header Required.'
          onInput={policyInputHandler}
          isValid={true}
        />
        <Input
          className='policyBody'
          element='textarea'
          id='body'
          placeholder='POLICY body'
          value={policyState.inputs.body.value}
          validators={[VALIDATOR_REQUIRE()]}
          label='POLICY body'
          errorText='body Required.'
          onInput={policyInputHandler}
          isValid={true}
        />
        <Button
          type='button'
          onClick={clickHandler}
          disabled={!policyState.isValid}
          className='form-submit updateButton'
        >
          Update
        </Button>
        <Button type='button' onClick={toggleEditMode} className='cancelButton'>
          Cancel
        </Button>
      </div>
    );
  } else if (props.editable) {
    return (
      <div className='policy-editable'>
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
        <h4 className='policyId'>ID: {policyState.inputs.policyId.value}</h4>
        <p className='policyHeader'>
          Header: {policyState.inputs.header.value}
        </p>
        <p className='policyBody'>Body: {policyState.inputs.body.value}</p>
      </div>
    );
  } else {
    return (
      <div className='policy'>
        <h4 className='policyHeader'>{policyState.inputs.header.value}</h4>
        <p className='policyBody'>{policyState.inputs.body.value}</p>
      </div>
    );
  }
};

export default Policy;
