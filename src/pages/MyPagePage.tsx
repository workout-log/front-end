import React, { FC } from 'react';
import MyPage from '../components/mypage/MyPage';
import { isLogin } from '../lib/function';
import { Redirect } from 'react-router-dom';

const MyPagePage: FC = () => {
  if (!isLogin()) {
    return <Redirect to='/error' />;
  }
  return <MyPage />;
};

export default MyPagePage;
