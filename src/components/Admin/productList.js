import React, { useContext } from 'react';
import Product from './product';
import { AuthContext } from '../../context/auth-context';

const ProductList = (props) => {
  const { token, isAdmin } = useContext(AuthContext);
  let content;
  if (token && isAdmin) {
    content = props.items.map((item) => {
      return (
        <Product
          name={item.name}
          active={item.active}
          sku={item.sku}
          classes=''
          key={item.id}
          id={item.id}
          price={item.price}
          images={item.images}
          details={item.details}
          stock={item.stock}
          description={item.description}
          tags={item.tags}
          editable={props.editable}
          update={props.update}
        />
      );
    });
    if (content.length === 0) {
      return <h1>No products</h1>;
    }
    return content;
  } else {
    return <h1>This page doesn't exist!</h1>;
  }
};

export default ProductList;
