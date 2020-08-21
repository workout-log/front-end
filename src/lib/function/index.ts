import { useRecoilValue } from 'recoil';
import { userState } from '../../modules/auth';
import { postState } from '../../modules/editor';
import client from '../api/client';

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

export const isObject = value => (typeof value === 'object' ? true : false);

export const isLikeAndMine = () => {
  const { email: userEmail } = useRecoilValue(userState);
  const { user, likeUsers } = useRecoilValue(postState);
  if (typeof user === 'undefined') return [false, false];
  const isLike = likeUsers.findIndex((email: string) => email === userEmail) !== -1 ? true : false;
  const isMine = !user.email || !userEmail ? false : user.email === userEmail ? true : false;
  return [isLike, isMine];
};

export const isExistedImage = (url: string) => {
  return new Promise((resolve, reject) =>
    client
      .get(url)
      .then(() => resolve())
      .catch(() => reject()),
  );
};
