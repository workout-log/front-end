import React, { FC, useEffect, useState, useCallback } from 'react';
import { useRouteMatch, useHistory, Redirect } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { SubInfo, Tags } from '../common';
import PostActionButtons from './PostActionButtons';
import { isLike, isNotLike, lockIcon } from '../../../public/assets';
import CommentList from './comments/CommentList';
import { getPost, removePost, bad, good } from '../../modules/posts';
import { isLikeAndMine } from '../../lib/function';
import { postState, editorState } from '../../modules/editor';
import { userState } from '../../modules/auth';
 
const PostViewerWrapper = styled.div`
  margin-top: 4rem;
  padding-bottom: 50px;
  #files {
    width: 100%;
    max-height: 31rem;
    display: block;
    overflow-x: scroll;
    overflow-y: hidden;
    margin-bottom: 1rem;
    white-space: nowrap;
    ::-webkit-scrollbar {
      width: 100%;
      height: 8px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: #2c2c2c;
      border-radius: 0;
    }
    > embed {
      object-fit: cover;
      width: 100%;
      height: auto;
      max-height: 31rem;
    }
  }
  .additional {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 2rem;
    margin-top: -1.5rem;
    img {
      width: 20px;
      height: 20px;
      cursor: pointer;
      margin-right: 4px;
    }
    span {
      margin-right: 4px;
    }
  }
  ul {
    padding: 0;
  }
`;

const PostHead = styled.div`
  border-bottom: 1px solid gray;
  padding-bottom: 3rem;
  margin-bottom: 3rem;
  h1 {
    font-size: 3rem;
    line-height: 1.5;
    margin: 0;
    > img {
      width: 20px;
      height: 20px;
      object-fit: contain;
      margin-right: 4px;
    }
  }
`;

const PostContent = styled.div`
  font-size: 1.3125rem;
  color: #343a40;
`;

type Params = {
  postId: string;
};

const PostViewer: FC = () => {
  const [isLiked, isMine] = isLikeAndMine();
  const match = useRouteMatch<Params>();
  const history = useHistory();
  const postId = Number(match.params.postId);
  const [error, setError] = useState('');
  const [
    { title, body, tags, files, isPrivate, user, likes, publishedDate, id },
    setPost,
  ] = useRecoilState(postState);
  const { email } = useRecoilValue(userState);
  const [, setEditor] = useRecoilState(editorState);
  const [liking, setLiking] = useState(false);
  if (isNaN(postId) || postId < 1) return <Redirect to='/error' />;

  const onEdit = () => {
    setEditor({
      title,
      body,
      tags,
      files: new FormData(),
      filesUrl: files,
      isPrivate,
      originalPostId: id,
      isEditMode: true,
    });
    history.push('/write');
  };
  const onRemove = () => {
    removePost(postId, history);
  };
  const onLikeHandler = useCallback(() => {
    if (!email) return alert('로그인 후 이용해주세요!');
    if (liking) {
      bad(postId, setPost, setLiking);
    } else {
      good(postId, setPost, setLiking);
    }
  }, [liking, email]);

  useEffect(() => {
    getPost(postId, setPost, setError);
  }, [postId]);
  useEffect(() => {
    setLiking(isLiked);
  }, [isLiked]);
  if (error === 'not found')
    return (
      <PostViewerWrapper>
        <div className='container'>존재하지 않는 포스트입니다.</div>
      </PostViewerWrapper>
    );
  else if (error === 'error')
    return (
      <PostViewerWrapper>
        <div className='container'>오류 발생!</div>
      </PostViewerWrapper>
    );
  return (
    <PostViewerWrapper>
      <div className='container'>
        <PostHead>
          <h1>
            {isPrivate && <img src={lockIcon} />}
            {title}
          </h1>
          <SubInfo
            username={user.username}
            profileImage={user.profileImage}
            publishedDate={publishedDate}
            hasMarginTop
          />
          <Tags tags={tags} />
        </PostHead>
        <div className='additional'>
          <span>{likes}</span>
          <img src={liking ? isLike : isNotLike} onClick={onLikeHandler} />
          {isMine && <PostActionButtons onEdit={onEdit} onRemove={onRemove} />}
        </div>
        <div id='files'>
          {!!files.length &&
            files.map(f => <embed src={`${process.env.SERVER_URL}/${f}`} key={f} />)}
        </div>
        <PostContent dangerouslySetInnerHTML={{ __html: body }} />
        <CommentList />
      </div>
    </PostViewerWrapper>
  );
};

export default PostViewer;
