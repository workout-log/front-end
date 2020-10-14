import React, { FC } from 'react';
import styled from 'styled-components';
import qs from 'querystring';
import { Link, useHistory, Redirect } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { postsState } from '../../modules/posts';

const PaginationBlock = styled.div`
  width: 320px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  margin-bottom: 3rem;
  > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .disabled {
    background: #dee2e6;
    color: #adb5bd;
    cursor: not-allowed;
  }
`;

const PageNumber = styled.div``;

const buildLink = ({ username, page, tag, useremail }) => {
  const query = qs.stringify({ tag, page, useremail });
  return username ? `/@${username}?${query}` : `/?${query}`;
};

type Props = {
  page: number;
  lastPage: number;
  username: string;
  useremail: string;
  tag: string;
  isLoading: boolean;
};

const Pagination: FC<Props> = ({ page, lastPage, username, tag, useremail, isLoading }) => {
  if (!isLoading && page > lastPage) return <Redirect to='/error' />;
  const history = useHistory();
  return (
    <PaginationBlock>
      <button
        type='button'
        className={`btn ${page === 1 ? 'disabled' : 'btn-dark'}`}
        onClick={() => {
          history.push(page === 1 ? '' : buildLink({ useremail, username, tag, page: page - 1 }));
        }}
      >
        이전
      </button>
      <PageNumber>{page}</PageNumber>
      <button
        type='button'
        className={`btn ${page >= lastPage ? 'disabled' : 'btn-dark'}`}
        onClick={() => {
          history.push(
            page === lastPage
              ? buildLink({ useremail, username, tag, page })
              : buildLink({ useremail, username, tag, page: page + 1 }),
          );
        }}
      >
        다음
      </button>
    </PaginationBlock>
  );
};

export default Pagination;
