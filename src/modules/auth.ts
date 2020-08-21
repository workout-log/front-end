import { atom, SetterOrUpdater } from 'recoil';
import * as authCtrl from '../lib/api/auth';
import { headerToggleHandler } from '../lib/function';
import { History } from 'history';
import client from '../lib/api/client';

type UserState = authCtrl.UserState;
type LoginData = authCtrl.LoginData;

const setLocalStorageUser = data => localStorage.setItem('user', JSON.stringify(data));
const removeLocalStorageUser = () => localStorage.removeItem('user');

export const userInitialState: UserState = {
  username: '',
  workoutDays: 0,
  profileImage: '',
  email: '',
  loginType: '',
};

export const userState = atom<UserState>({
  key: 'auth/userState',
  default: userInitialState,
});

export const checkUser = (setUser: SetterOrUpdater<UserState>) => {
  authCtrl
    .check()
    .then(({ data }) => {
      setUser(data);
      setLocalStorageUser(data);
    })
    .catch(err => {
      console.log(err);
      try {
        removeLocalStorageUser;
        setUser(userInitialState);
      } catch (e) {
        console.log('localStorage is not working');
      }
    });
};

export const login = (data: LoginData, setUser: SetterOrUpdater<UserState>) => {
  authCtrl
    .login(data)
    .then(({ data }) => {
      setLocalStorageUser(data);
      setUser(data);
      headerToggleHandler();
    })
    .catch(err => console.log(err));
};

export const logout = (setUser: SetterOrUpdater<UserState>) => {
  authCtrl
    .logout()
    .then(() => {
      removeLocalStorageUser();
      setUser(userInitialState);
      headerToggleHandler();
    })
    .catch(err => console.log(err));
};

export const leave = (setUser: SetterOrUpdater<UserState>, history: History) => {
  authCtrl
    .leave()
    .then(() => {
      setUser(userInitialState);
      removeLocalStorageUser();
      history.push('/');
    })
    .catch(err => console.log(err));
};

export const update = (data: FormData, setUser: SetterOrUpdater<UserState>, history: History) => {
  authCtrl
    .update(data)
    .then(({ data }) => {
      setUser(data);
      setLocalStorageUser(data);
      history.push('/');
    })
    .catch(err => console.log(err.response));
};

const dataURLtoFile = (dataurl, fileName) => {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], fileName, { type: mime });
};

export const getProfileImage = (
  profileImage: string,
  setFile: React.Dispatch<React.SetStateAction<File>>,
) => {
  client
    .get(`/${profileImage}`, { responseType: 'blob' })
    .then(function (response) {
      var reader = new window.FileReader();
      reader.readAsDataURL(response.data);
      reader.onload = function () {
        var imageDataUrl = reader.result;
        setFile(dataURLtoFile(imageDataUrl, profileImage));
      };
    })
    .catch(err => console.log(err));
};
