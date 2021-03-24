import React from 'react';
import Product from '../components/product';

const ProductList = (props) => {
  let content;
  if (props.editable) {
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
  } else {
    content = props.items.map((item) => {
      return (
        item.active && (
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
        )
      );
    });
  }
  if (content.length === 0) {
    return <h1>No products</h1>;
  }
  return content;
};

export default ProductList;
