import React from 'react';
import './AboutBlock.css';
const AboutBlock = (props) => {
  return (
    <div className='aboutBlock'>
      <h2>{props.about.aboutTitle}</h2>
      <p>{props.about.aboutInfo}</p>
    </div>
  );
};

export default AboutBlock;
