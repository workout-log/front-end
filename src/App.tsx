import React, { FC, useEffect } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { PostListPage, PostPage, WritePage, NoMatch } from './pages';
import { Header } from './components/common';
import { writeState } from './modules/write';
import MyPage from './components/mypage/MyPage';

const App: FC<{}> = () => {
  const location = useLocation();
  const [write, setWrite] = useRecoilState(writeState);
  useEffect(() => {
    if (location.pathname !== '/write') {
      setWrite({
        title: '',
        body: '',
        tags: [],
        files: new FormData(),
        isPrivate: false,
        isEditMode: false,
      });
    }
  }, [location]);
  return (
    <>
      <Header />
      <Switch>
        <Route component={PostListPage} path={['/@:username', '/']} exact />
        <Route component={WritePage} path='/write' />
        <Route component={PostPage} path='/@:username/:postId' />
        <Route component={MyPage} path='/mypage' />
        <Route component={NoMatch} />
      </Switch>
      <ins
        className='kakao_ad_area'
        style={{ display: 'none' }}
        data-ad-unit='DAN-1iauxeaz75yr6'
        data-ad-width='320'
        data-ad-height='100'
      ></ins>
    </>
  );
};

export default App;
