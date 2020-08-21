import React, { FC, useEffect } from 'react';
import qs from 'querystring';
import styled from 'styled-components';
import { useLocation, Link, Redirect } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { SubInfo, Tags } from '../common';
import { Post } from '../../lib/api/posts';
import { postsState, getPosts } from '../../modules/posts';
import Pagination from './Pagination';
import { lockIcon } from '../../../public/assets';
import { isObject } from '../../lib/function';

const PostListWrapper = styled.div`
    margin-top 3rem;
    #images {
      ::-webkit-scrollbar {
        width: 100%;
        height: 8px;
      }
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background: #2C2C2C;
        border-radius: 0;
      }
    }
    embed {
        width: 100%;
        max-height: 31rem;
        object-fit: cover;
        
    }
    a {
      color: #000000;
      text-decoration: none;
    }
`;

const PostItemBlock = styled.div`
  padding-top: 3rem;
  padding-bottom: 3rem;
  &:first-child {
    padding-top: 0;
  }
  & + & {
    border-top: 1px solid gray;
  }

  h2 {
    font-size: 2rem;
    margin-bottom: 0;
    margin-top: 0;
    &:hover {
      color: gray;
    }
    > a {
      > img {
        width: 20px;
        height: 20px;
        object-fit: contain;
        margin-right: 4px;
      }
    }
  }
  p {
    margin-top: 2rem;
  }
  > div:last-child {
    white-space: nowrap;
    overflow-x: scroll;
  }
`;

type PostItemProps = {
  post: Post;
};

const PostItem: FC<PostItemProps> = ({
  post: { publishedDate, user, tags, title, body, id, files, isPrivate },
}) => {
  const { username, profileImage } = user;
  return (
    <PostItemBlock>
      <h2>
        <Link to={username && `/@${username}/${id}`}>
          {isPrivate && <img src={lockIcon} />}
          {title}
        </Link>
      </h2>
      <SubInfo
        username={username && username}
        profileImage={profileImage && profileImage}
        publishedDate={publishedDate}
      />
      <Tags tags={tags} />
      <p>{body}</p>
      <div id='images'>
        {files.length
          ? files.map(url => <embed src={`${process.env.SERVER_URL}/${url}`} key={url} />)
          : ''}
      </div>
    </PostItemBlock>
  );
};

const PostList: FC = () => {
  const location = useLocation();
  const [{ posts, lastPage, isLoading }, setPosts] = useRecoilState(postsState);
  const { tag, page = '1', email } = qs.parse(location.search.slice(1));
  const numberPage = Number(page) as number;
  if (isObject(tag) || isObject(page) || isObject(email) || isNaN(numberPage) || numberPage < 1)
    return <Redirect to='/error' />;
  let username = location.pathname.split('@')[1];
  const stringTag = tag as string;
  const stringEmail = email as string;
  useEffect(() => {
    const data = {
      page: numberPage,
      username,
      email: stringEmail,
      tag: stringTag,
    };
    getPosts(data, setPosts);
  }, [location]);
  return (
    <PostListWrapper>
      <div className='container'>
        <div>{posts.length ? posts.map(post => <PostItem post={post} key={post.id} />) : ''}</div>
      </div>
      <Pagination
        page={numberPage}
        lastPage={lastPage}
        username={username}
        useremail={stringEmail}
        tag={stringTag}
        isLoading={isLoading}
      />
    </PostListWrapper>
  );
};

export default PostList;
