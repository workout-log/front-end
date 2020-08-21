import { atom, SetterOrUpdater, selector } from 'recoil';
import { History } from 'history';
import * as postsCtrl from '../lib/api/posts';
import { checkUser } from './auth';
import { UserState } from '../lib/api/auth';

const userInitialState = {
  username: '',
  workoutDays: 0,
  profileImage: '',
  email: '',
  loginType: '',
};

type Post = postsCtrl.Post;

export type EditorState = {
  title: string;
  body: string;
  tags: string[];
  files: FormData;
  filesUrl: string[];
  isPrivate: boolean;
  originalPostId: number;
  isEditMode: boolean;
};

export const editorInitialState: EditorState = {
  title: '',
  body: '',
  tags: [],
  files: new FormData(),
  filesUrl: [],
  isPrivate: false,
  originalPostId: 0,
  isEditMode: false,
};

export const editorState = atom<EditorState>({
  key: 'editor/editorState',
  default: editorInitialState,
});

export const postState = atom<Post>({
  key: 'write/postState',
  default: {
    id: 0,
    isPrivate: false,
    title: '',
    body: '',
    files: [],
    tags: [],
    likeUsers: [],
    likes: 0,
    comments: [],
    user: userInitialState,
    publishedDate: new Date(),
  },
});

/* 
  https://github.com/facebookexperimental/Recoil/issues/12
  - 20.08.20

export const postLikeSelector = selector<boolean>({
  key: 'write/postLike',
  get: ({ get }) => {
    const { likeUsers } = get(postState);
    const { email: userEmail } = get(userState);
    return likeUsers.findIndex((email: string) => email === userEmail) ? true : false;
  },
});


export const postAuthorSelector = selector<boolean>({
  key: 'write/postAuthor',
  get: ({ get }) => {
    const { user } = get(postState);
    const { email } = get(userState);
    if (!user.email || !email) return false;
    return user.email === email ? true : false;
  },
});

*/

export const update = (id: number, data: FormData, history: History) => {
  postsCtrl
    .updatePost(id, data)
    .then(({ data }) => {
      history.push(`/@${data.user.username}/${data.id}`);
    })
    .catch(err => {
      console.log(err);
      alert('수정하기에 실패하였습니다.');
    });
};

export const write = (data: FormData, history: History, setUser: SetterOrUpdater<UserState>) => {
  postsCtrl
    .writePost(data)
    .then(({ data }) => {
      checkUser(setUser);
      history.push(`/@${data.user.username}/${data.id}`);
    })
    .catch(err => {
      console.log(err);
      alert('글쓰기에 실패하였습니다.');
    });
};
