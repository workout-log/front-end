import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import dotenv from 'dotenv';
import { useRecoilState } from 'recoil';
import App from './App';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { userState } from './modules/auth';
import { check } from './lib/api/auth';
import path from 'path';

function LoadUser({ children }) {
  const [user, setUser] = useRecoilState(userState);
  const [isRetuenTime, setIsReturnTime] = useState(false);
  useEffect(() => {
    try {
      const userValue = localStorage.getItem('user');
      if (!userValue) return setIsReturnTime(true);
      setUser(JSON.parse(userValue));
      check()
        .then((res) => {
          setUser({
            email: res.data.email,
            loginType: res.data.loginType,
            profileImage: res.data.profileImage,
            username: res.data.username,
            workoutDays: res.data.workoutDays,
          });
        })
        .catch((err) => {
          try {
            localStorage.removeItem('user');
            setUser({
              username: '',
              workoutDays: 0,
              profileImage: '',
              email: '',
              loginType: '',
            });
          } catch (e) {
            console.log('localStorage is not working');
          }
        });
    } catch (e) {
      console.log('localStorage is not working');
    }
    setIsReturnTime(true);
  }, []);
  if (isRetuenTime) return children;
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
