import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';
import './NavLinks.css';

const NavLinks = (props) => {
  const auth = useContext(AuthContext);
  return (
    <ul onClick={props.onClick}>
      <li>
        <NavLink to='/products'>Shop</NavLink>
      </li>
      <li>
        <NavLink to='/about'>About</NavLink>
      </li>
      <li>
        <NavLink to='/support'>Support</NavLink>
      </li>
      {auth.isLoggedIn && auth.isAdmin && (
        <li>
          <NavLink to='/updateproducts'>Update Products</NavLink>
        </li>
      )}
      {auth.isLoggedIn && auth.isAdmin && (
        <li>
          <NavLink to='/updateSite'>Update Site</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to='/auth'>Login</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button type='button' onClick={auth.logout}>
            Logout
          </button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
