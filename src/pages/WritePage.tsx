import React, { FC } from 'react';
import Editor from '../components/write/Editor';
import { isLogin } from '../lib/function';
import { Redirect } from 'react-router-dom';

const WritePage: FC = () => {
  if (!isLogin()) {
    return <Redirect to='/error' />;
  }
  return <Editor />;
};

export default WritePage;
