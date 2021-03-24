import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/auth-context';
import Faq from './Faq';
import LoadingSpinner from '../UIElements/LoadingSpinner';
import ErrorModal from '../UIElements/ErrorModal';
import { useHttpClient } from '../../hooks/http-hook';
import '../Faqs.css';
import NewFaq from './NewFaq';

const Faqs = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { token, isAdmin } = useContext(AuthContext);
  const [faqsState, setFaqsState] = useState({});
  const [reset, setReset] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/support/faqs`
        );
        let faqsObject = {};
        responseData.faqs.forEach((faq) => {
          let id = faq.faqId;
          faqsObject[id] = faq;
        });
        setFaqsState(faqsObject);
      } catch (err) {}
    };
    fetchItems();
  }, [sendRequest]);

  let faqs = [];
  for (const faq in faqsState) {
    if (token && isAdmin) {
      faqs.push(
        <div
          key={faqsState[faq].faqId + '_container'}
          className='faq_container'
        >
          <Faq
            faq={faq}
            faqQ={faqsState[faq].question}
            faqA={faqsState[faq].answer}
            faqId={faqsState[faq].faqId}
            key={faqsState[faq].faqId}
            faqsState={faqsState}
            setFaqsState={setFaqsState}
            reset={reset}
            setReset={setReset}
          />
        </div>
      );
    } else {
      faqs.push(
        <div
          key={faqsState[faq].faqId + '_container'}
          className='faq_container'
        >
          <Faq
            faq={faq}
            faqQ={faqsState[faq].question}
            faqA={faqsState[faq].answer}
            faqId={faqsState[faq].faqId}
            key={faqsState[faq].faqId}
            faqsState={faqsState}
            reset={reset}
            setReset={setReset}
          />
        </div>
      );
    }
  }

  if (token && isAdmin) {
    return (
      <div className='faqSection'>
        {isLoading && <LoadingSpinner />}
        <ErrorModal error={error} onClear={clearError} />
        {faqs}
        <NewFaq
          reset={reset}
          setReset={setReset}
          setFaqsState={setFaqsState}
          faqsState={faqsState}
        />
      </div>
    );
  } else {
    return (
      <div className='faqSection'>
        {isLoading && <LoadingSpinner />}
        <ErrorModal error={error} onClear={clearError} />
        {faqs}
      </div>
    );
  }
};
export default Faqs;
