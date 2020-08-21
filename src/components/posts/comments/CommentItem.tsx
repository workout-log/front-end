import React, {
  FC,
  useCallback,
  useEffect,
  Dispatch,
  SetStateAction,
  Children,
  useState,
} from 'react';
import styled from 'styled-components';
import CommentActionButtons from './CommentActionButtons';
import { useHistory, useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import {
  commentsState,
  Comment,
  ReComment,
  removeComment,
  removeReComment,
} from '../../../modules/comments';
import { useUser, isGoogleImage, isExistedImage } from '../../../lib/function';

const CommentItemBlock = styled.li`
  list-style: none;
  .pull-left {
    margin-right: 10px;
  }
  .pull-left {
    float: left !important;
  }
  .media,
  .media-object {
    width: 80px;
    height: 80px;
    object-fit: cover;
  }
  .media-object {
    display: block;
  }
  .img-circle {
    border-radius: 50%;
  }
  img {
    vertical-align: middle;
    border: 0;
    cursor: pointer;
  }
  .media-body {
    position: relative;
  }
  .media,
  .media-body {
    overflow: hidden;
    zoom: 1;
  }
  .well-lg {
    padding: 24px;
    border-radius: 6px;
  }
  .well {
    min-height: 20px;
    padding: 19px;
    margin-bottom: 20px;
    background-color: #f5f5f5;
    border: 1px solid #e3e3e3;
    border-radius: 4px;
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);
  }
  .reviews {
    color: #555;
    font-weight: bold;
    margin: 10px auto 20px;
  }
  .text-uppercase {
    text-transform: uppercase;
  }
  .media-date {
    position: absolute;
    right: 25px;
    top: 25px;
  }
  .media-comment {
    margin-bottom: 20px;
    line-break: anywhere;
  }
  .btn-circle {
    font-weight: bold;
    font-size: 12px;
    padding: 6px 15px;
    border-radius: 20px;
  }
  .btn-info {
    color: #fff;
    background-color: #5bc0de;
    border-color: #46b8da;
  }
  .btn-circle span {
    padding-right: 6px;
  }
  .glyphicon {
    position: relative;
    top: 1px;
    display: inline-block;
    font-family: 'Glyphicons Halflings';
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .btn-info {
    color: #fff;
    background-color: #5bc0de;
    border-color: #46b8da;
  }
  .glyphicon-share-alt:before {
    content: 're';
  }
  .btn-info:hover,
  .btn-info:focus,
  .btn-info:active,
  .btn-info.active,
  .open > .dropdown-toggle.btn-info {
    color: #fff;
    background-color: #31b0d5;
    border-color: #269abc;
  }
  .btn-warning {
    color: #fff;
    background-color: #f0ad4e;
    border-color: #eea236;
  }
  .btn-warning:hover,
  .btn-warning:focus,
  .btn-warning:active,
  .btn-warning.active,
  .open > .dropdown-toggle.btn-warning {
    color: #fff;
    background-color: #ec971f;
    border-color: #d58512;
  }
  .glyphicon-comment:before {
    content: '\e111';
  }
  .btn.btn-info.btn-circle.text-uppercase {
    margin-right: 8px;
  }
  .collapse.show {
    display: block;
  }
`;

type Props = {
  data: Comment | ReComment;
  commentId: number;
  setCommentId: Dispatch<SetStateAction<number>>;
  setRecommentId: React.Dispatch<React.SetStateAction<number>>;
  setIsRecomment: Dispatch<React.SetStateAction<boolean>>;
  isRecomment: boolean;
  setIsEditMode: Dispatch<SetStateAction<boolean>>;
  setIsReplyMode: Dispatch<SetStateAction<boolean>>;
  children?: React.ReactNode;
};
const CommentItem: FC<Props> = ({
  data,
  commentId,
  isRecomment,
  setCommentId,
  setIsEditMode,
  setIsReplyMode,
  setIsRecomment,
  setRecommentId,
  children,
}) => {
  const [, setCommentsList] = useRecoilState(commentsState);
  const { email } = useUser();
  const location = useLocation();
  const postId = Number(location.pathname.split('/')[2]);
  const history = useHistory();
  const [isExisted, setIsExisted] = useState(false);
  const { username, profileImage } = data.user;
  useEffect(() => {
    if (!isGoogleImage(profileImage))
      isExistedImage(profileImage)
        .then(() => setIsExisted(true))
        .catch(() => setIsExisted(false));
  }, [profileImage]);

  const openRecommentHandler = () => {
    ($(`.tab-content > ul > div > .c-${data.id}`) as any).collapse('toggle');
  };

  const onReplyHandler = useCallback(() => {
    $('textarea').focus();
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    setIsEditMode(false);
    setIsReplyMode(true);
    setCommentId(commentId);
  }, [isRecomment]);

  const onEdit = useCallback(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    setIsEditMode(true);
    setIsReplyMode(false);
    setCommentId(commentId);
    if (isRecomment) {
      setIsRecomment(true);
      setRecommentId(data.id);
    }
    $('textarea').focus();
  }, []);
  const onRemove = useCallback(() => {
    if (isRecomment) removeReComment(postId, commentId, data.id, setCommentsList);
    else removeComment(postId, data.id, setCommentsList);
  }, [postId, commentId]);

  useEffect(() => {
    if (
      isRecomment &&
      [...$(`.tab-content > ul > div > .c-${commentId}`)].some(
        el => [...el.classList].indexOf('show') !== -1,
      )
    ) {
      $(`.tab-content > ul > div > .c-${commentId}`).addClass('show');
    }
  }, [data]);
  return (
    <>
      <CommentItemBlock className={isRecomment ? `collapse c-${commentId}` : ''}>
        <img
          className='pull-left media-object img-circle'
          src={
            isGoogleImage(profileImage)
              ? profileImage
              : isExisted
              ? `${process.env.SERVER_URL}/${profileImage}`
              : `${process.env.SERVER_URL}/upload/profileImage/default.png`
          }
          alt='profile'
          onClick={() => history.push(`/@${username}`)}
        />

        <div className='media-body'>
          <div className='well well-lg'>
            <h4 className='media-heading text-uppercase reviews'>{username}</h4>
            <ul className='media-date text-uppercase reviews list-inline'>
              {email && email === data.user.email ? (
                <CommentActionButtons
                  isRecomment={isRecomment}
                  onEdit={onEdit}
                  onRemove={onRemove}
                />
              ) : (
                ''
              )}
              {data.isEdited && `수정됨 • `}
              {new Date(data.publishedDate).toLocaleDateString()}
            </ul>
            <p className='media-comment'>{data.text}</p>
            <span
              className='btn btn-info btn-circle text-uppercase'
              id='reply'
              onClick={onReplyHandler}
            >
              <span className='glyphicon glyphicon-share-alt'></span> Reply
            </span>
            {!isRecomment && (data as Comment).recomments.length ? (
              <span
                className='btn btn-warning btn-circle text-uppercase'
                data-toggle='collapse'
                onClick={openRecommentHandler}
              >
                <span className='glyphicon glyphicon-comment'></span>{' '}
                {(data as Comment).recomments.length} comments
              </span>
            ) : (
              ''
            )}
          </div>
        </div>
      </CommentItemBlock>
      {children}
    </>
  );
};
export default CommentItem;
