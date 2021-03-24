import React, { useReducer, useEffect } from 'react';
import { validate } from '../../util/validators';
import './Input.css';

const inputReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case 'BLUR':
      return {
        ...state,
        isTouched: true,
      };
    case 'RESET':
      return {
        ...state,
        value: action.val,
        isValid: false,
        isTouched: false,
      };
    default:
      return state;
  }
};

const Input = (props) => {
  let val;
  if (props.checked === true || props.checked === false) {
    val = props.value || false;
  } else {
    val = props.value || '';
  }
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: val,
    isValid: props.isValid || false,
    isTouched: false,
  });

  const { id, onInput, onBlur, reset, setReset, checked } = props;
  const { value, isValid } = inputState;

  const changeHandler = (e) => {
    if (e.target.type === 'checkbox') {
      dispatch({
        type: 'CHANGE',
        val: e.target.checked,
        validators: props.validators,
      });
    } else {
      dispatch({
        type: 'CHANGE',
        val: e.target.value,
        validators: props.validators,
      });
    }
    if (onBlur) {
      onBlur();
    }
  };

  useEffect(() => {
    onInput(id, value, isValid);
    if (reset) {
      dispatch({
        type: 'RESET',
        val: '',
        validators: '',
      });
      setReset(false);
    }
  }, [id, value, isValid, onInput, reset, setReset]);

  const touchHandler = () => {
    dispatch({
      type: 'BLUR',
    });
    if (onBlur) {
      onBlur();
    }
  };

  const element =
    props.element === 'input' ? (
      <input
        type={props.type}
        min={props.min}
        id={props.id}
        checked={!!checked}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      ></input>
    ) : (
      <textarea
        id={props.id}
        placeholder={props.placeholder}
        rows={props.rows || 3}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
        maxLength='1000'
      />
    );
  return (
    <div
      className={`form-control ${props.className} ${
        !inputState.isValid && inputState.isTouched && 'form-control--invalid'
      }`}
    >
      {props.label && <label htmlFor={props.id}>{props.label}</label>}
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
