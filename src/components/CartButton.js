import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import './CartButton.css';
import { AuthContext } from '../context/auth-context';

const CartButton = (props) => {
  const auth = useContext(AuthContext);
  let count = 0;
  if (props.sku) {
    count = auth.cartState[props.sku] ? auth.cartState[props.sku].count : 0;
  } else {
    for (const item in auth.cartState) {
      if (item) {
        count += parseInt(auth.cartState[item].count);
      }
    }
  }

  return (
    <div className='cart-button'>
      <NavLink to='/cart'>
        <img className='icon-cart' src='images/ui/cart.svg' alt='cart' />
        <p>{count}</p>
      </NavLink>
    </div>
  );
};

export default CartButton;
