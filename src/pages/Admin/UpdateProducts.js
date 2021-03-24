import React, { useEffect, useState } from 'react';
import ProductList from '../../components/Admin/productList';
import { useHttpClient } from '../../hooks/http-hook';
import LoadingSpinner from '../../components/UIElements/LoadingSpinner';
import ErrorModal from '../../components/UIElements/ErrorModal';
import NewProduct from '../../components/Admin/NewProduct';
import '../Products.css';

const Products = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [itemsState, setItems] = useState([]);
  const [updated, setUpdated] = useState(true);
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
  }, [sendRequest, updated]);

  return (
    <main id='products'>
      <h1>Update Products</h1>

      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className='center'>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && (
        <ProductList items={itemsState} editable={true} update={setUpdated} />
      )}
      <NewProduct update={setUpdated} />
    </main>
  );
};

export default Products;

// useEffect(() => {
//   setTimeout(function () {
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
// }, [itemsState, setITEMS]);
