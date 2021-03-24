import { createContext } from 'react';

export const AuthContext = createContext({
  cartState: null,
  isLoggedIn: false,
  token: null,
  login: () => {},
  logout: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
  changeItemCount: () => {},
});
