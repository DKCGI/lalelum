import React, { useEffect, useState } from 'react';
import ProductList from '../components/productList';
import { useHttpClient } from '../hooks/http-hook';
import LoadingSpinner from '../components/UIElements/LoadingSpinner';
import ErrorModal from '../components/UIElements/ErrorModal';
import './Products.css';

const Products = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [itemsState, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/products`
        );
        setItems(responseData.products);
      } catch (err) {}
    };
    fetchItems();
  }, [sendRequest]);

  return (
    <main id='products'>
      <h1>Products</h1>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className='center'>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && itemsState.length > 0 && (
        <ProductList items={itemsState} />
      )}
      {!isLoading && itemsState.length === 0 && <h1>No products</h1>}
    </main>
  );
};

export default Products;

//FAKE FETCH WITH DELAY
// useEffect(() => {
//   let timeout = setTimeout(function () {
//     setITEMS([
//       {
//         id: 1,
//         name: 'Aura G1',
//         price: 19.99,
//         images: ['images/products/bulbs/led.svg'],
//         details: {
//           watts: 8,
//           voltage: '100 - 240',
//           lumens: 800,
//           color: 'RGB+CCT',
//           lifespan: 30000,
//           temperature: '24-45',
//           shape: 'globe',
//           base: 'e26',
//           material: 'aluminum + plastic',
//           extra: ['Anion Generator'],
//         },
//       },
//       {
//         id: 2,
//         name: 'Aura G2',
//         price: 24.99,
//         images: ['images/products/bulbs/led.svg'],
//         details: {
//           watts: 10,
//           voltage: '100 - 240',
//           lumens: 1000,
//           color: 'RGB+CCT',
//           lifespan: 30000,
//           temperature: '24-45',
//           shape: 'globe',
//           base: 'e26',
//           material: 'aluminum + plastic',
//           extra: ['Anion Generator'],
//         },
//       },
//     ]);
//   }, 1000);
//   return function cleanup() {
//     clearTimeout(timeout)
// }
// }, [itemsState, setITEMS]);
