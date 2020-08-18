import { atom, SetterOrUpdater } from 'recoil';
import { UserState, check } from '../lib/api/auth';

const userInitialState: UserState = {
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
  check()
    .then(res => {
      const { email, loginType, profileImage, username, workoutDays } = res.data;
      setUser({
        email,
        loginType,
        profileImage,
        username,
        workoutDays,
      });
    })
    .catch(err => {
      try {
        localStorage.removeItem('user');
        setUser(userInitialState);
      } catch (e) {
        console.log('localStorage is not working');
      }
    });
};
