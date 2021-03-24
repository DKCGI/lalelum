import React from 'react';
import MiniCart from './MiniCart';
import './product.css';
const Product = (props) => {
  return (
    <div className={`product ${props.classes}`}>
      <div className='header' style={{ display: 'block' }}>
        <h2>{props.name}</h2>
        <p className='sku'>SKU:{props.sku}</p>
        <p className='price'>${`${props.price}`}</p>
      </div>
      {props.details && (
        <div className='details'>
          <h3>
            <span>Details</span>
          </h3>
          {props.details &&
            Object.keys(props.details).map((detail) => {
              return (
                <div
                  className='detail'
                  key={detail}
                >{`${detail}: ${props.details[detail]}`}</div>
              );
            })}
        </div>
      )}
      <div className='description'>
        <p>{props.description}</p>
      </div>
      <div className='product-image'>
        <img
          src={
            `${process.env.REACT_APP_ASSET_URL}/` +
            (props.images.length > 0
              ? props.images[0]
              : 'uploads/images/imageIcon.svg')
          }
          alt={props.name}
        />
      </div>
      <MiniCart sku={props.sku} props={props} />
    </div>
  );
};

export default Product;
