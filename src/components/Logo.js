import React from 'react';
// import { NavLink } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import './Logo.css';

const Logo = (props) => {
  return (
    <div className="logo">
      <HashLink to={props.to}>
        <img src="images/logo.svg" alt="logo" />
      </HashLink>
    </div>
  );
};

export default Logo;
