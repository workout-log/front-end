import { atom, SetterOrUpdater } from 'recoil';
import { userInitialState } from './auth';
import {
  CommonComment,
  Comment,
  ReComment,
  listComments,
  deleteComment,
  deleteRecomment,
  updateReComment as apiUpdateReComment,
  writeReComment as apiWriteReComment,
  updateComment as apiUpdateComment,
  writeComment as apiWriteComment,
} from '../lib/api/comments';

export { CommonComment, Comment, ReComment };

export const commonCommentInitialState = {
  id: 0,
  publishedDate: new Date(),
  text: '',
  isEdited: false,
  user: userInitialState,
};

export type CommentsState = Comment[];

export const commentsState = atom<CommentsState>({
  key: 'comments/commentsState',
  default: [],
});

export const getComments = (id: number, setCommentsList: SetterOrUpdater<CommentsState>) => {
  return new Promise(resolve => {
    listComments(id)
      .then(({ data }) => {
        setCommentsList(data);
        setTimeout(() => resolve(), [100]);
      })
      .catch(err => console.log(err));
  });
};

export const removeComment = (
  postId: number,
  commentId: number,
  setCommentsList: SetterOrUpdater<CommentsState>,
) => {
  deleteComment(postId, commentId)
    .then(() => {
      getComments(postId, setCommentsList);
    })
    .catch(err => console.log(err));
};

export const removeReComment = (
  postId: number,
  commentId: number,
  reCommentId: number,
  setCommentsList: SetterOrUpdater<CommentsState>,
) => {
  deleteRecomment(postId, commentId, reCommentId)
    .then(() => {
      getComments(postId, setCommentsList);
    })
    .catch(err => console.log(err));
};

export const updateRecomment = (
  postId: number,
  commentId: number,
  recommentId: number,
  text: string,
  setCommentsList: SetterOrUpdater<CommentsState>,
  init: () => void,
) => {
  apiUpdateReComment(postId, commentId, recommentId, text)
    .then(() => {
      getComments(postId, setCommentsList);
      init();
    })
    .catch(err => console.log(err));
};

export const writeReComment = (
  postId: number,
  commentId: number,
  text: string,
  setCommentsList: SetterOrUpdater<CommentsState>,
  init: () => void,
) => {
  apiWriteReComment(postId, commentId, text)
    .then(() => {
      getComments(postId, setCommentsList).then(() => {
        ($(`.tab-content > ul > div > .c-${commentId}`) as any).addClass('show');
        init();
      });
    })
    .catch(err => console.log(err));
};

export const updateComment = (
  postId: number,
  commentId: number,
  text: string,
  setCommentsList: SetterOrUpdater<CommentsState>,
  init: () => void,
) => {
  apiUpdateComment(postId, commentId, text)
    .then(() => {
      getComments(postId, setCommentsList);
      init();
    })
    .catch(err => console.log(err));
};

export const writeComment = (
  postId: number,
  text: string,
  setCommentsList: SetterOrUpdater<CommentsState>,
  init: () => void,
) => {
  apiWriteComment(postId, text)
    .then(() => {
      getComments(postId, setCommentsList);
      init();
    })
    .catch(err => console.log(err));
};
