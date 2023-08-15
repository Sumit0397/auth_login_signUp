// import React, { useState } from "react";

// const AuthContext = React.createContext({
//     token : "",
//     isLoggedIn : false,
//     logIn : (token) => {},
//     logOut : () => {}
// })


// export const AuthContextProvider = (props) => {

//     let initialToken = localStorage.getItem('token');
//     const [token,setToken] = useState(initialToken);

//     const userLoggedIn = !!token;

//     const logInHandler = (token) => {
//         setToken(token);
//         localStorage.setItem('token' , token)
//     }

//     const logOutHandler = () => {
//         setToken(null);
//         localStorage.removeItem('token');
//     }

//     const contextValue = {
//         token : token,
//         isLoggedIn : userLoggedIn,
//         logIn : logInHandler,
//         logOut : logOutHandler
//     }

//     return (
//         <AuthContext.Provider value={contextValue}>
//             {props.children}
//         </AuthContext.Provider>
//     )
// }


// export default AuthContext

import React, { createContext, useState, useEffect, useCallback } from 'react';

let logoutTimer;

const AuthContext = createContext({
  token: '',
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

const calcRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpTime = new Date(expirationTime).getTime();

  const remainingTime = adjExpTime - currentTime;

  return remainingTime;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem('token');
  const storedExpirationDate = localStorage.getItem('expTime');
  const remainingTime = calcRemainingTime(storedExpirationDate);

  if (remainingTime <= 3600) {
    localStorage.removeItem('token');
    localStorage.removeItem('expTime');
    return null;
  }

  return { token: storedToken, duration: remainingTime };
};

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();
  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  }
  const [token, setToken] = useState(initialToken);

  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('expTime');

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler = (token, expirationTime) => {
    setToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('expTime', expirationTime);

    const remainingTime = calcRemainingTime(expirationTime);

    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  useEffect(() => {
    if (tokenData) {
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;