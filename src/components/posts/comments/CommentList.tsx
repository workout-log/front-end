import React, { FC, useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import CommentItem from './CommentItem';
import RecommentList from './ReCommentList';
import {
  commentsState,
  Comment,
  getComments,
  updateRecomment,
  writeReComment,
  updateComment,
  writeComment,
} from '../../../modules/comments';
import { userState } from '../../../modules/auth';

const CommentListWrapper = styled.div`
  padding: 0 15px;
  margin-right: -15px;
  margin-left: -15px;
  > div {
    border-top: 1px solid gray;
  }
  .reviews {
    color: #555;
    font-weight: bold;
    margin: 10px auto 20px;
  }
  .nav-tabs > li {
    float: left;
    margin-bottom: -1px;
  }
  .nav > li {
    position: relative;
    display: block;
  }
  .nav-tabs > li.active > h4 {
    margin-bottom: 0;
    padding-bottom: 0;
    color: #555;
    cursor: default;
    background-color: #fff;
    border: 1px solid #ddd;
    border-bottom-color: transparent;
  }
  .nav-tabs > li > h4 {
    margin-right: 2px;
    line-height: 1.42857143;
    border: 1px solid transparent;
    border-radius: 4px 4px 0 0;
  }
  .nav > li > h4 {
    position: relative;
    display: block;
    padding: 10px 15px;
  }
  .page-header {
    position: relative;
    padding-bottom: 9px;
    margin: 40px 0 20px;
    border-bottom: 1px solid #eee;
  }
  .page-header {
    div {
      display: flex;
      align-items: flex-end;
      textarea {
        flex: 1;
        min-height: 50px;
        height: auto;
        outline: none;
      }
      button {
        height: 37px;
        margin-left: 8px;
      }
    }
  }
  .tab-content {
    border: 1px solid #ddd;
    border-top: none;
    padding: 50px 15px;
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
  }
`;

const CommentList: FC = () => {
  const location = useLocation();
  const postId = Number(location.pathname.split('/')[2]);

  const [commentId, setCommentId] = useState<number>(0);
  const [recommentId, setRecommentId] = useState<number>(0);

  const [text, setText] = useState<string>('');

  const [commentsList, setCommentsList] = useRecoilState(commentsState);

  const [isRecomment, setIsRecomment] = useState<boolean>(false);

  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const [isReplyMode, setIsReplyMode] = useState<boolean>(false);

  const { email } = useRecoilValue(userState);
  const onChange = useCallback(e => {
    setText(e.target.value);
  }, []);
  const initMode = useCallback(() => {
    setCommentId(0);
    setRecommentId(0);
    setIsRecomment(false);
    setIsEditMode(false);
    setIsReplyMode(false);
    setText('');
  }, []);
  const commentSubmitHandler = useCallback(() => {
    if (!email) return alert('로그인 후 이용해주세요.');
    if (!text) return alert('1자 이상 입력해주세요.');
    if (isRecomment) {
      if (isEditMode) {
        updateRecomment(postId, commentId, recommentId, text, setCommentsList, initMode);
      }
    } else {
      if (isReplyMode) {
        writeReComment(postId, commentId, text, setCommentsList, initMode);
      } else if (isEditMode) {
        updateComment(postId, commentId, text, setCommentsList, initMode);
      } else {
        writeComment(postId, text, setCommentsList, initMode);
      }
    }
  }, [isRecomment, isReplyMode, isEditMode, commentId, recommentId, text]);

  useEffect(() => {
    getComments(postId, setCommentsList);
  }, []);

  return (
    <CommentListWrapper>
      <div>
        <div className='page-header'>
          <h3 className='reviews'>
            {isEditMode && '수정 하기'}
            {isReplyMode && '대댓글 달기'}
            {!isEditMode && !isReplyMode && '댓글 달기'}
          </h3>
          <div>
            <textarea value={text} onChange={onChange}></textarea>
            {(isEditMode || isReplyMode) && (
              <button className='btn btn-danger' onClick={initMode}>
                취소
              </button>
            )}
            <button className='btn btn-success' onClick={commentSubmitHandler}>
              {isEditMode ? '수정' : '작성'}
            </button>
          </div>
        </div>
        <div className='comment-tab'>
          <ul className='nav nav-tabs' role='tablist'>
            <li className='active'>
              <h4 className='reviews text-capitalize'>Comments</h4>
            </li>
          </ul>
          <div className='tab-content'>
            <ul>
              {commentsList.map((data: Comment) => (
                <CommentItem
                  data={data}
                  commentId={data.id}
                  setCommentId={setCommentId}
                  setRecommentId={setRecommentId}
                  isRecomment={false}
                  setIsReplyMode={setIsReplyMode}
                  setIsEditMode={setIsEditMode}
                  key={`c_${data.id}`}
                  setIsRecomment={setIsRecomment}
                >
                  <RecommentList
                    data={data.recomments}
                    commentId={data.id}
                    setCommentId={setCommentId}
                    setIsReplyMode={setIsReplyMode}
                    setIsEditMode={setIsEditMode}
                    setRecommentId={setRecommentId}
                    setIsRecomment={setIsRecomment}
                  />
                </CommentItem>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </CommentListWrapper>
  );
};
export default CommentList;
