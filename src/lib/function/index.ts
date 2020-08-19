import { useRecoilValue } from 'recoil';
import { userState } from '../../modules/auth';
import { Redirect } from 'react-router-dom';

export const headerToggleHandler = () => {
  ($('#navbarCollapse') as any).collapse('toggle');
};

export const isGoogleImage = (image: string) => {
  return image.indexOf(':') !== -1 ? true : false;
};

export const isLogin = () => {
  const { email } = useRecoilValue(userState);
  console.log(email);
  return email !== '' ? true : false;
};

export const useUser = () => {
  const user = useRecoilValue(userState);
  const profileImageUrl = isGoogleImage(user.profileImage)
    ? user.profileImage
    : `${process.env.SERVER_URL}/${user.profileImage}`;
  return {
    ...user,
    profileImageUrl,
  };
};
