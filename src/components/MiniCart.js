import React, { useContext } from 'react';
import { VALIDATOR_MIN } from '../util/validators';
import { useForm } from '../hooks/form-hook';
import CartButton from './CartButton';
import Input from './FormElements/Input';
import Button from './UIElements/Button';
import { AuthContext } from '../context/auth-context';
import './MiniCart.css';
const MiniCart = (props) => {
  const auth = useContext(AuthContext);
  const [cartFormState, cartInputHandler] = useForm(
    {
      sku: {
        value: props.sku,
        isValid: true,
      },
      count: {
        value: 1,
        isValid: true,
      },
      option: {
        value: null,
        isValid: true,
      },
    },
    true
  );
  const clickHandler = (e) => {
    e.preventDefault();
    auth.addToCart({
      sku: props.sku,
      count: cartFormState.inputs.count.value,
      option: cartFormState.inputs.option.value,
      props: props.props,
    });
  };
  const removeItem = (e) => {
    e.preventDefault();
    auth.removeFromCart({
      sku: props.sku,
    });
  };
  return (
    <form className='minicart'>
      <Input
        id='count'
        element='input'
        type='number'
        value={cartFormState.inputs.count.value}
        placeholder='0'
        min='0'
        onInput={cartInputHandler}
        validators={[VALIDATOR_MIN(1)]}
        isValid={true}
      />
      <Button
        type='submit'
        disabled={!cartFormState.isValid}
        onClick={clickHandler}
      >
        Add to cart
      </Button>
      <CartButton sku={props.sku} />
      <Button
        onClick={removeItem}
        type='button'
        disabled={!auth.cartState[props.sku]}
      >
        &#10006;
      </Button>
    </form>
  );
};

export default MiniCart;
