import React, { useContext, useEffect, useState } from 'react';
import { useForm } from '../../hooks/form-hook';
import Input from '../FormElements/Input';
import { VALIDATOR_REQUIRE } from '../../util/validators';
import { AuthContext } from '../../context/auth-context';
import Button from '../UIElements/Button';
import Policy from '../Policy';
import LoadingSpinner from '../UIElements/LoadingSpinner';
import ErrorModal from '../UIElements/ErrorModal';
import { useHttpClient } from '../../hooks/http-hook';
import '../Policies.css';

const Policies = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [reset, setReset] = useState(false);
  const { token, isAdmin } = useContext(AuthContext);
  let editable;
  if (token && isAdmin) {
    editable = true;
  } else {
    editable = false;
  }
  const [policiesState, setPoliciesState] = useState({});
  const [newPolicyState, newPolicyStateHandler] = useForm(
    {
      policyId: {
        value: '',
        isValid: false,
      },
      header: {
        value: '',
        isValid: false,
      },
      body: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/support/policies`
        );
        let policiesObject = {};
        responseData.policies.forEach((policy) => {
          let id = policy.policyId;
          policiesObject[id] = policy;
        });
        setPoliciesState(policiesObject);
      } catch (err) {}
    };
    fetchItems();
  }, [sendRequest]);

  const clickHandler = async (e) => {
    e.preventDefault();
    console.log(policiesState);
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/support/newPolicy`,
        'POST',
        JSON.stringify({
          policyId: newPolicyState.inputs.policyId.value,
          header: newPolicyState.inputs.header.value,
          body: newPolicyState.inputs.body.value,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        }
      );
    } catch (err) {
      console.log(err);
    }
    let policyId = newPolicyState.inputs.policyId.value;
    let updatedPoliciesState = policiesState;
    updatedPoliciesState[policyId] = {
      policyId: policyId,
      header: newPolicyState.inputs.header.value,
      body: newPolicyState.inputs.body.value,
    };
    setPoliciesState(updatedPoliciesState);
    setReset(true);
  };
  let policies = [];
  for (const policy in policiesState) {
    if (editable) {
      policies.push(
        <div
          key={policiesState[policy].policyId + '_container'}
          className='policy_container'
        >
          <Policy
            policy={policy}
            policyHeader={policiesState[policy].header}
            policyBody={policiesState[policy].body}
            policyId={policiesState[policy].policyId}
            key={policiesState[policy].policyId}
            policiesState={policiesState}
            setPoliciesState={setPoliciesState}
            editable={editable}
          />
        </div>
      );
    } else {
      policies.push(
        <div
          key={policiesState[policy].policyId + '_container'}
          className='policy_container'
        >
          <Policy
            policy={policy}
            policyHeader={policiesState[policy].header}
            policyBody={policiesState[policy].body}
            policyId={policiesState[policy].policyId}
            key={policiesState[policy].policyId}
            policiesState={policiesState}
            setPoliciesState={setPoliciesState}
          />
        </div>
      );
    }
  }

  if (editable) {
    return (
      <div className='policySection'>
        {isLoading && <LoadingSpinner />}
        <ErrorModal error={error} onClear={clearError} />
        {policies}
        <div className='newPolicy'>
          <Input
            className='policyId'
            element='input'
            type='text'
            id='policyId'
            placeholder='POLICY ID'
            value={newPolicyState.inputs.policyId.value}
            validators={[VALIDATOR_REQUIRE()]}
            label='POLICY ID'
            errorText='POLICY ID Required.'
            onInput={newPolicyStateHandler}
            reset={reset}
            setReset={setReset}
          />

          <Input
            className='header'
            element='textarea'
            id='header'
            placeholder='POLICY header'
            value={newPolicyState.inputs.header.value}
            validators={[VALIDATOR_REQUIRE()]}
            label='POLICY header'
            errorText='header Required.'
            onInput={newPolicyStateHandler}
            reset={reset}
            setReset={setReset}
          />
          <Input
            className='body'
            element='textarea'
            id='body'
            placeholder='POLICY body'
            value={newPolicyState.inputs.body.value}
            validators={[VALIDATOR_REQUIRE()]}
            label='POLICY body'
            errorText='body Required.'
            onInput={newPolicyStateHandler}
            reset={reset}
            setReset={setReset}
          />
        </div>
        <Button
          type='button'
          onClick={clickHandler}
          disabled={!newPolicyState.isValid}
          className='form-submit'
        >
          Add
        </Button>
      </div>
    );
  } else {
    return (
      <div className='policySection'>
        {policiesState &&
          Object.keys(policiesState).map((policyId) => {
            return (
              <Policy
                policyHeader={policiesState[policyId].header}
                policyBody={policiesState[policyId].body}
                policyId={policyId}
                key={policyId}
              />
            );
          })}
      </div>
    );
  }
};
export default Policies;
