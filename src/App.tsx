import React, { FC } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { PostListPage, WritePage, PostPage, MyPagePage, NoMatch } from './pages';
import { Header } from './components/common';

const App: FC = () => {
  return (
    <>
      <Header />
      <Switch>
        <Route component={PostListPage} path={['/@:username', '/']} exact />
        <Route component={WritePage} path='/write' exact />
        <Route component={PostPage} path='/@:username/:postId' exact />
        <Route component={MyPagePage} path='/mypage' exact />
        <Route component={NoMatch} path='/error' />
        <Redirect to='/error' />
      </Switch>
    </>
  );
};

export default App;
