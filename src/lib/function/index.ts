import { useRecoilValue } from 'recoil';
import { userState } from '../../modules/auth';

export const headerToggleHandler = () => {
  ($('#navbarCollapse') as any).collapse('toggle');
};

export const isGoogleImage = (image: string) => {
  return image.indexOf(':') !== -1 ? true : false;
};

export const isLogin = () => {
  const { email } = useRecoilValue(userState);
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
