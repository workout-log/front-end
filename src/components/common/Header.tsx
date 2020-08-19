import React, { FC, useState, useEffect, useCallback } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import Marquee from 'react-double-marquee';
import { Nav, Button } from 'reactstrap';
import { GoogleAPI, GoogleLogin, googleGetBasicProfil } from 'react-google-oauth';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { userState, login, logout } from '../../modules/auth';
import { UserState } from '../../lib/api/auth';
import headerToggleHandler from '../../lib/headerToggleHandler';

enum Search {
  '닉네임' = '/@',
  '태그' = '/?tag=',
  '이메일' = '/?email=',
}

const activeStyle = {
  color: '#fff',
};

const Spacer = styled.div`
  height: 61px;
`;

const LogoutBlock = styled.div`
  cursor: pointer;
`;

const HeaaderWrapper = styled.header`
  svg {
    vertical-align: unset;
  }
  .dropdown-menu {
    margin-top: 0;
    margin-bottom: 1rem;
    padding: 0;
    &.show {
      display: inline-block;
    }
  }
  .dropdown-menu > li + li {
    margin-top: 0.25rem;
  }

  .dropdown.pull-left {
    display: inline-block;
  }
  .form-inline {
    display: flex;
    background-color: #28a745 !important;
    z-index: 1000;
  }
  .nav-item.greet {
    width: 4rem !important;
  }
  .greet {
    white-space: nowrap;
    padding: 0.5rem 0;
    > div {
      width: 20rem;
      height: 100%;
      display: flex;
      align-items: center;
      color: white;
    }
  }
`;

type MarqueeItemProps = {
  user: UserState;
};

const MarqueeItem = React.memo<MarqueeItemProps>(({ user: { username, workoutDays } }) => (
  <Marquee direction='left'>
    {username}님 안녕하세요. {workoutDays ? `${workoutDays}일째 운동중입니다!💪` : '0일째 운동중입니다. 분발하세요!🤬'}
    검색 형식은 닉네임=이우찬 형태로 태그, 이메일 검색 가능합니다!
  </Marquee>
));

const Header: FC = () => {
  const history = useHistory();
  const [search, setSearch] = useState<string>('');
  const [user, setUser] = useRecoilState(userState);
  const loginHandler = useCallback(data => {
    const { email, name: username, imageUrl: profileImage } = googleGetBasicProfil(data);
    login(
      {
        email,
        username,
        profileImage,
      },
      setUser,
    );
  }, []);
  const logoutHandler = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    logout(setUser);
  }, []);
  const searchChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value;
    setSearch(search);
  };
  const onSearch = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const splitedSearch = search.split('=');
      const searchKey = splitedSearch[0];
      const searchWord = splitedSearch[1];
      const uri = Search[searchKey];
      if (typeof uri === 'undefined') return alert('검색 형식을 확인해주세요!');
      history.push(uri + searchWord);
      headerToggleHandler();
    },
    [search],
  );
  useEffect(() => {
    $('.dropdown').hover(
      function () {
        $(this).addClass('show');
        $('.dropdown-menu').addClass('show');
        $('.dropdown-toggle').attr('aria-expanded', 'true');
      },
      function () {
        $(this).removeClass('show');
        $('.dropdown-menu').removeClass('show');
        $('.dropdown-toggle').attr('aria-expanded', 'false');
      },
    );
  }, [user]);
  return (
    <>
      <HeaaderWrapper>
        <Nav className='navbar navbar-expand-md navbar-dark fixed-top bg-success'>
          <NavLink className='navbar-brand' to='/' onClick={() => history.push('/')}>
            <span className='h3'>workoutLog</span>
          </NavLink>
          <Button
            className='navbar-toggler collapsed'
            type='button'
            data-toggle='collapse'
            data-target='#navbarCollapse'
            aria-controls='navbarCollapse'
            aria-expanded={true}
            aria-label='Toggle navigation'
            onClickCapture={headerToggleHandler}
          >
            <span className='navbar-toggler-icon'></span>
          </Button>
          <div className='navbar-collapse collapse' id='navbarCollapse'>
            <ul className='navbar-nav mr-auto'>
              {user.username !== '' ? (
                <>
                  <li className='nav-item'>
                    <NavLink activeStyle={activeStyle} className='nav-link' to='/write' onClick={headerToggleHandler}>
                      <span className='mb-0'>WRITE</span>
                    </NavLink>
                  </li>
                  <li className='nav-item'>
                    <NavLink activeStyle={activeStyle} className='nav-link' to='/mypage' onClick={headerToggleHandler}>
                      <span className='mb-0'>MYPAGE</span>
                    </NavLink>
                  </li>
                  <li className='nav-item'>
                    <LogoutBlock className='nav-link' onClickCapture={logoutHandler}>
                      <span className='mb-0'>LOGOUT</span>
                    </LogoutBlock>
                  </li>
                  <li className='nav-item greet'>
                    <MarqueeItem user={user} />
                  </li>
                </>
              ) : (
                <li className='nav-item'>
                  <div className='dropdown pull-left'>
                    <button
                      className='btn btn-default dropdown-toggle nav-link'
                      type='button'
                      data-toggle='dropdown'
                      data-hover='dropdown'
                      aria-expanded='false'
                    >
                      LOGIN
                    </button>
                    <ul className='dropdown-menu dropdownhover-bottom d-print-inline-block' role='menu' aria-labelledby='dropdownMenu1'>
                      <li>
                        <GoogleAPI
                          clientId={process.env.GOOGLE_CLIENT_ID}
                          onUpdateSigninStatus={res => console.log(res)}
                          onInitFailure={(err: any) => console.log(err)}
                        >
                          <GoogleLogin onLoginSuccess={loginHandler} onLoginFailure={err => console.log(err)} />
                        </GoogleAPI>
                      </li>
                    </ul>
                  </div>
                </li>
              )}
            </ul>
            <form className='form-inline mt-2 mt-md-0' onSubmit={onSearch}>
              <input
                className='form-control mr-sm-2'
                type='text'
                placeholder='ex) 닉네임=이우찬'
                aria-label='Search'
                onChange={searchChangeHandler}
              />
              <button className='btn btn-outline-dark my-2 my-sm-0' type='submit'>
                Search
              </button>
            </form>
          </div>
        </Nav>
      </HeaaderWrapper>
      <Spacer />
    </>
  );
};

export default Header;
