import React, { useEffect, useState } from 'react';
import Faq from './Faq';
import LoadingSpinner from './UIElements/LoadingSpinner';
import ErrorModal from './UIElements/ErrorModal';
import { useHttpClient } from '../hooks/http-hook';
import './Faqs.css';

const Faqs = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [faqsState, setFaqsState] = useState({});

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
    faqs.push(
      <div key={faqsState[faq].faqId + '_container'} className='faq_container'>
        <Faq
          faq={faq}
          faqQ={faqsState[faq].question}
          faqA={faqsState[faq].answer}
          faqId={faqsState[faq].faqId}
          key={faqsState[faq].faqId}
          faqsState={faqsState}
        />
      </div>
    );
  }

  return (
    <div className='faqSection'>
      {isLoading && <LoadingSpinner />}
      <ErrorModal error={error} onClear={clearError} />
      {faqs}
    </div>
  );
};
export default Faqs;
