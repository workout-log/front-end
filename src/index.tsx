import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import dotenv from 'dotenv';
import path from 'path';
import App from './App';
import './index.css';
import { RecoilRoot, useRecoilState } from 'recoil';
import { userState, checkUser } from './modules/auth';

function LoadUser({ children }) {
  const [, setUser] = useRecoilState(userState);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    try {
      const userValue = localStorage.getItem('user');
      if (!userValue) return setIsLoaded(true);
      setUser(JSON.parse(userValue));
      checkUser(setUser);
    } catch (e) {
      console.log('localStorage is not working');
    }
    setIsLoaded(true);
  }, []);
  if (isLoaded) return children;
  return null;
}

if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: path.join(__dirname, '/.env.production') });
} else if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: path.join(__dirname, '/.env.development') });
} else {
  throw new Error('process.env.NODE_ENV를 설정하지 않았습니다!');
}

ReactDOM.render(
  <RecoilRoot>
    <LoadUser>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </LoadUser>
  </RecoilRoot>,
  document.getElementById('root'),
);
serviceWorker.unregister();
