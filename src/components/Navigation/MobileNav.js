import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import './MobileNav.css';

const MobileNav = (props) => {
  const content = (
    <CSSTransition
      in={props.show} timeout={1000} classNames='slide-left'
      mountOnEnter
      unmountOnExit
    >
      <aside onClick={props.onClick} className='mobile-nav'>
        {props.children}
      </aside>
    </CSSTransition>
  );
  return ReactDOM.createPortal(
    content,
    document.getElementById('mobile-nav-hook')
  );
};

export default MobileNav;
