import { useState, useEffect, useCallback } from 'react';

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState();
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState();

  const login = useCallback((uid, token, isAd, expirationDate) => {
    setToken(token);
    setUserId(uid);
    setIsAdmin(isAd);
    let tokenExpiration =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 15);
    setTokenExpirationDate(tokenExpiration);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token: token,
        isAdmin: isAd,
        expiration: tokenExpiration.toISOString(),
      })
    );
  }, []);
  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    localStorage.removeItem('userData');
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        storedData.isAdmin,
        new Date(storedData.expiration)
      );
    }
  }, [login]);
  return { token, isAdmin, login, logout, userId };
};
