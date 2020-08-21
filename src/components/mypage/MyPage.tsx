import React, { FC, useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory, Redirect } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { googleIcon } from '../../../public/assets';
import { userState, getProfileImage } from '../../modules/auth';
import { update, leave } from '../../modules/auth';
import AskWithDrawModal from './AskWithDrawModal';
import { useUser, isGoogleImage } from '../../lib/function';

const MyPageWrapper = styled.div`
  .container {
    padding-top: 2rem;
  }
  img {
    width: 140px;
    height: 140px;
    object-fit: cover;
    border-radius: 50%;
  }
  .mb-0 {
    img {
      width: 20px;
      height: 20px;
    }
  }
  ul {
    display: flex;
    justify-content: space-between;
  }
  #profile-block {
    height: 140px;
    background-color: rgb(233, 236, 239);
  }
  #profile-wrapper {
    width: 140px;
  }
`;

const loginImage = {
  'gmail.com': googleIcon,
};

const MyPage: FC = () => {
  const [isChanged, setIsChanged] = useState(false);
  const [isDefault, setIsDefault] = useState(false);
  const history = useHistory();
  const { username, workoutDays, profileImage, email, loginType, profileImageUrl } = useUser();
  const [, setUser] = useRecoilState(userState);
  const [file, setFile] = useState<File>();
  const [name, setName] = useState(username);
  const [modal, setModal] = useState(false);

  const onChange = useCallback(e => {
    setName(e.target.value);
  }, []);

  const imageChangeHandler = useCallback(() => {
    const inputEl = document.createElement('input');
    inputEl.setAttribute('type', 'file');
    inputEl.setAttribute('accept', '.jpeg, .jpeg/jfif, .png, .heif');
    inputEl.click();
    inputEl.onchange = () => {
      setIsChanged(true);
      setIsDefault(false);
      const imageDiv = document.querySelector('#profile-block');
      imageDiv.innerHTML = '';
      function readURL(input: any) {
        if (input.files && input.files[0]) {
          setFile(input.files[0]);
          const reader = new FileReader();
          reader.onload = function (e: any) {
            const imgEl = document.createElement('img');
            imgEl.setAttribute('src', e.target.result);
            imageDiv.appendChild(imgEl);
          };
          reader.readAsDataURL(input.files[0]);
        }
      }
      readURL(inputEl);
    };
  }, []);
  const changeDefaultImage = () => {
    const imageDiv = document.querySelector('#profile-block');
    imageDiv.innerHTML = '';
    const imgEl = document.createElement('img');
    imgEl.setAttribute('src', `${process.env.SERVER_URL}/upload/profileImage/default.png`);
    imageDiv.appendChild(imgEl);
    setIsDefault(true);
    setIsChanged(true);
  };

  const onSubmit = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      const data = new FormData();
      data.set('username', name);
      data.set('file', file);
      data.set('fileChanged', JSON.stringify(isChanged));
      data.set('isDefaultImage', JSON.stringify(isDefault));
      update(data, setUser, history);
    },
    [name, file, isChanged, isDefault],
  );

  const withDrawAccount = useCallback(() => {
    leave(setUser, history);
  }, []);

  useEffect(() => {
    if (!isGoogleImage(profileImage)) getProfileImage(profileImage, setFile);
  }, []);
  return (
    <>
      <MyPageWrapper>
        <div className='container'>
          <div className='row flex-lg-nowrap'>
            <div className='col'>
              <div className='col mb-3'>
                <div className='card'>
                  <div className='card-body'>
                    <div className='e-profile'>
                      <div className='row'>
                        <div className='col-12 col-sm-auto mb-3'>
                          <div className='mx-auto' id='profile-wrapper'>
                            <div
                              id='profile-block'
                              className='d-flex justify-content-center align-items-center rounded'
                            >
                              <img src={profileImageUrl} />
                            </div>
                          </div>
                        </div>
                        <div className='col d-flex flex-column flex-sm-row justify-content-between mb-3'>
                          <div className='text-center text-sm-left mb-2 mb-sm-0'>
                            <h4 className='pt-sm-2 pb-1 mb-0 text-nowrap'>{username}</h4>
                            <p className='mb-0'>
                              {email}&nbsp;
                              <img src={loginImage[loginType]} />
                            </p>
                            <div className='text-muted'></div>
                            <div className='mt-2'>
                              <button
                                className='btn btn-success'
                                type='button'
                                onClick={imageChangeHandler}
                              >
                                <span>사진 변경</span>
                              </button>
                              <button
                                className='btn btn-warning ml-2'
                                type='button'
                                onClick={changeDefaultImage}
                              >
                                <span>기본 이미지</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <ul className='nav nav-tabs'>
                        <li className='nav-item active nav-link'>내 정보 수정</li>
                        <button className='btn btn-danger' onClick={() => setModal(true)}>
                          회원 탈퇴
                        </button>
                      </ul>
                      <div className='tab-content pt-3'>
                        <div className='tab-pane active'>
                          <form className='form'>
                            <div className='row'>
                              <div className='col'>
                                <div className='row'>
                                  <div className='col'>
                                    <div className='form-group'>
                                      <label htmlFor='name'>이름</label>
                                      <input
                                        id='name'
                                        className='form-control'
                                        type='text'
                                        placeholder='이름'
                                        value={name}
                                        onChange={onChange}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className='row'>
                              <div className='col d-flex justify-content-end'>
                                <button
                                  className='btn btn-success'
                                  type='submit'
                                  onClick={onSubmit}
                                >
                                  저장
                                </button>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MyPageWrapper>
      <AskWithDrawModal
        visible={modal}
        onCancel={() => setModal(false)}
        onConfirm={withDrawAccount}
      />
    </>
  );
};

export default MyPage;
