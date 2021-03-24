import React, { useState, useCallback, useEffect, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Cart from './pages/Cart';
import './App.css';
import MainNavigation from './components/Navigation/MainNavigation';
import { AuthContext } from './context/auth-context';
import { useAuth } from './hooks/auth-hook';
import LoadingSpinner from './components/UIElements/LoadingSpinner';

// import Auth from './pages/Auth';
const Auth = React.lazy(() => import('./pages/Auth'));
// import Stars from './components/Animation/Stars';
const Stars = React.lazy(() => import('./components/Animation/Stars'));
// import Products from './pages/Products';
const Products = React.lazy(() => import('./pages/Products'));
// import UpdateProducts from './pages/Admin/UpdateProducts';
const UpdateProducts = React.lazy(() => import('./pages/Admin/UpdateProducts'));
// import UpdateSite from './pages/Admin/UpdateSite';
const UpdateSite = React.lazy(() => import('./pages/Admin/UpdateSite'));
// import Support from './pages/Support';
const Support = React.lazy(() => import('./pages/Support'));
// import About from './pages/About';
const About = React.lazy(() => import('./pages/About'));

const App = () => {
  const [cartState, setCartState] = useState(() => {
    let state = JSON.parse(localStorage.getItem('cartState'));
    if (state) {
      return state;
    }
    return {};
  });
  const { token, isAdmin, login, logout, userId } = useAuth();
  const addToCart = useCallback(
    (item) => {
      let sku = item.sku;
      setCartState((prevState) => {
        return { ...prevState, [sku]: item };
      });
      console.log(cartState);
    },
    [cartState]
  );
  const changeItemCount = useCallback((item, count) => {
    setCartState((prevState) => {
      return { ...prevState, [item]: { ...prevState[item], count: count } };
    });
  }, []);

  // const removeFromCart = useCallback((item) => {
  //   let cart = {};
  //   setCartState((prevState) => {
  //     for (const [key, value] of Object.entries(prevState)) {
  //       if (item.sku !== key) {
  //         cart[key] = value;
  //       }
  //     }
  //     console.log(cart);
  //     return cart;
  //   });
  // });

  const removeFromCart = useCallback((item) => {
    let sku = item.sku;
    setCartState((prevState) => {
      const { [sku]: something, ...newState } = prevState;
      console.log(newState);
      return newState;
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('cartState', JSON.stringify(cartState));
  }, [cartState]);

  let routes;

  if (token && isAdmin) {
    routes = (
      <Switch>
        <Route path='/' exact>
          <Home></Home>
        </Route>
        <Route path='/products'>
          <Products></Products>
        </Route>
        <Route path='/updateproducts'>
          <UpdateProducts></UpdateProducts>
        </Route>
        <Route path='/updatesite'>
          <UpdateSite></UpdateSite>
        </Route>
        <Route path='/support'>
          <Support></Support>
        </Route>
        <Route path='/about'>
          <About></About>
        </Route>
        <Route path='/cart'>
          <Cart></Cart>
        </Route>
        <Route path='/:success' exact>
          <Home></Home>
        </Route>
        <Route path='/:canceled' exact>
          <Home></Home>
        </Route>
        <Redirect to='/'></Redirect>
      </Switch>
    );
  } else if (token) {
    routes = (
      <Switch>
        <Route path='/' exact>
          <Home></Home>
        </Route>
        <Route path='/products'>
          <Products></Products>
        </Route>
        <Route path='/support'>
          <Support></Support>
        </Route>
        <Route path='/about'>
          <About></About>
        </Route>
        <Route path='/cart'>
          <Cart></Cart>
        </Route>
        <Route path='/:success' exact>
          <Home></Home>
        </Route>
        <Route path='/:canceled' exact>
          <Home></Home>
        </Route>
        <Redirect to='/'></Redirect>
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path='/' exact>
          <Home></Home>
        </Route>
        <Route path='/products'>
          <Products></Products>
        </Route>
        <Route path='/support'>
          <Support></Support>
        </Route>
        <Route path='/about'>
          <About></About>
        </Route>
        <Route path='/cart'>
          <Cart></Cart>
        </Route>
        <Route path='/auth'>
          <Auth></Auth>
        </Route>
        <Route path='/:success' exact>
          <Home></Home>
        </Route>
        <Route path='/:canceled' exact>
          <Home></Home>
        </Route>
        <Redirect to='/auth'></Redirect>
      </Switch>
    );
  }

  return (
    <div className='App'>
      <AuthContext.Provider
        value={{
          cartState: cartState,
          isLoggedIn: !!token,
          isAdmin: isAdmin,
          token: token,
          login: login,
          logout: logout,
          uid: userId,
          addToCart: addToCart,
          removeFromCart: removeFromCart,
          changeItemCount: changeItemCount,
        }}
      >
        <Router>
          <Suspense
            fallback={
              <div className='center'>
                <LoadingSpinner />
              </div>
            }
          >
            <Stars bgColor='#000010' />
          </Suspense>
          <MainNavigation />
          <Suspense
            fallback={
              <div className='center'>
                <LoadingSpinner />
              </div>
            }
          >
            {routes}
          </Suspense>
        </Router>
      </AuthContext.Provider>
    </div>
  );
};

export default App;
