import React, { useEffect, useState } from 'react';
import Policy from './Policy';
import LoadingSpinner from './UIElements/LoadingSpinner';
import ErrorModal from './UIElements/ErrorModal';
import { useHttpClient } from '../hooks/http-hook';
import './Policies.css';

const Policies = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [policiesState, setPoliciesState] = useState({});

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

  let policies = [];
  for (const policy in policiesState) {
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
        />
      </div>
    );
  }
  return (
    <div className='policySection'>
      {isLoading && <LoadingSpinner />}
      <ErrorModal error={error} onClear={clearError} />

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
};
export default Policies;
