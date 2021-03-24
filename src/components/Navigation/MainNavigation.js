import React, { useState } from 'react';
import NavLinks from './NavLinks';
import MainHeader from './MainHeader';
import CartButton from '../CartButton';
import Logo from '../Logo';
import Hamburger from './Hamburger';
import MobileNav from './MobileNav';
import Backdrop from '../UIElements/Backdrop';
import './MainNavigation.css';

const MainNavigation = () => {
  const [mobileNav, setMobileNav] = useState(false);

  const hideMobileNav = () => {
    setMobileNav(false);
  };
  const toggleMobileNav = () => {
    setMobileNav(!mobileNav);
  };

  return (
    <React.Fragment>
      {mobileNav && <Backdrop onClick={hideMobileNav} />}
      <MobileNav
        onClick={hideMobileNav}
        show={mobileNav}
        className="mobile-nav"
      >
        <NavLinks onClick={hideMobileNav} />
      </MobileNav>
      <MainHeader>
        <Logo to="/#home" />
        <nav className="desktop-nav">
          <NavLinks />
        </nav>
        <Hamburger toggle={toggleMobileNav} show={mobileNav} />
        <CartButton to="/cart" />
      </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
