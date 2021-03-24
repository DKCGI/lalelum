import React from 'react';

const Faq = (props) => {
  return (
    <div className={`faq ${props.className}`}>
      <h4 className='faqQ'>{props.faqQ}</h4>
      <p className='faqA'>{props.faqA}</p>
    </div>
  );
};

export default Faq;
