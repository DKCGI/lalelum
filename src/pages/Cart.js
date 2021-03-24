import React, { useContext } from 'react';
import { AuthContext } from '../context/auth-context';
import Button from '../components/UIElements/Button';
import './Cart.css';
import { NavLink } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { useHttpClient } from '../hooks/http-hook';
import LoadingSpinner from '../components/UIElements/LoadingSpinner';
import ErrorModal from '../components/UIElements/ErrorModal';

const stripePromise = loadStripe(
  'pk_test_51HtVWkGNg9qZtIsXJ8Sghe4CaIJ2x4ocWFyuuBYpVN2tT2QcCJOeucJCWn34o8lo3DAz31eKkIQyG8TenUZ29SMD00azIUPB3z'
);

const Cart = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const updateCount = (e) => {
    e.preventDefault();
    auth.changeItemCount(e.target.id, e.target.value);
  };
  const removeItem = (e) => {
    e.preventDefault();
    auth.removeFromCart({
      sku: e.target.id,
    });
  };
  let subtotal = 0;
  let items = [];
  for (const item in auth.cartState) {
    subtotal += auth.cartState[item].count * auth.cartState[item].props.price;
    items.push({
      id: auth.cartState[item].props.id,
      quantity: auth.cartState[item].count,
    });
  }
  let user = null;
  if (auth.isLoggedIn) {
    user = auth.uid;
  }
  const handleClick = async (event) => {
    const stripe = await stripePromise;
    try {
      const response = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/transactions/checkout`,
        'POST',
        JSON.stringify({
          user: user,
          items: items,
          amount: subtotal,
          method: 'card',
        }),
        {
          'Content-Type': 'application/json',
        }
      );

      const session = await response;
      await stripe.redirectToCheckout({
        sessionId: session.id,
      });
    } catch (err) {
      console.log(err);
    }
  };

  if (Object.keys(auth.cartState).length > 0) {
    return (
      <main>
        <ErrorModal error={error} onClear={clearError} />
        {isLoading && (
          <div className='center'>
            <LoadingSpinner />
          </div>
        )}
        <h1>Shopping Cart</h1>
        <section className='cartItems'>
          {Object.keys(auth.cartState).map((item) => {
            return (
              <div className='cartItem' key={auth.cartState[item].sku}>
                <img
                  src={
                    `${process.env.REACT_APP_ASSET_URL}/` +
                    auth.cartState[item].props.images[0]
                  }
                  alt='item'
                />
                <div className='itemName'>
                  <h3>{auth.cartState[item].props.name}</h3>
                </div>
                <div className='count'>
                  <input
                    type='number'
                    value={auth.cartState[item].count}
                    id={item}
                    onChange={updateCount}
                    min='0'
                    max='99'
                  />
                  <Button
                    onClick={removeItem}
                    type='button'
                    id={auth.cartState[item].sku}
                  >
                    &#10006;
                  </Button>
                </div>
                <div>
                  <h3>Price</h3>
                  <h4>${auth.cartState[item].props.price}</h4>
                </div>
                <div>
                  <h3>Total</h3>
                  <h4>
                    $
                    {auth.cartState[item].props.price *
                      auth.cartState[item].count}
                  </h4>
                </div>
              </div>
            );
          })}
          <div className='sub-total'>
            <div></div>
            <h2>Subtotal:</h2>
            <h2>${subtotal.toFixed(2)}</h2>
          </div>
          <Button
            className='checkout-btn'
            id='checkout-button'
            role='link'
            onClick={handleClick}
          >
            Checkout
          </Button>
        </section>
      </main>
    );
  } else {
    return (
      <main>
        <h1>Shopping Cart</h1>
        <section className='empty'>
          <h3>Cart is empty</h3>
          <NavLink to='/products'>Shop</NavLink>
        </section>
      </main>
    );
  }
};

export default Cart;
