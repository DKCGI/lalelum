import React from 'react';
import './Hamburger.css';

const Hamburger = (props) => {
  return (
    <button onClick={props.toggle} className={`hamburger ${props.show && 'x'}`}>
      <span />
      <span />
      <span />
    </button>
  );
};

export default Hamburger;
