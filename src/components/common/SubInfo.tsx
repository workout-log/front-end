import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import { Link, useHistory } from 'react-router-dom';

type SubInfoBlockProps = {
  hasMarginTop: boolean;
};

const SubInfoBlock = styled.div<SubInfoBlockProps>`
  ${({ hasMarginTop }) => hasMarginTop && 'margin-top: 1rem;'}
  a {
    color: gray !important;
  }
  display: flex;
  align-items: center;
  img {
    width: 20px;
    height: 20px;
    object-fit: cover;
    border-radius: 100%;
    margin-right: 4px;
    cursor: pointer;
  }
  span + span:before {
    color: gray;
    padding-left: 0.25rem;
    padding-right: 0.25rem;
    content: '\\B7';
  }
`;

type SubInfoProps = { username: string; profileImage: string; publishedDate: Date; hasMarginTop?: boolean };

const isGoogleImage = (image: string) => {
  return image.indexOf(':') !== -1 ? true : false;
};

const SubInfo: FC<SubInfoProps> = ({ username, profileImage, publishedDate, hasMarginTop }) => {
  const history = useHistory();
  return (
    <SubInfoBlock hasMarginTop={hasMarginTop}>
      <img
        onClick={() => history.push(`/@${username}`)}
        src={isGoogleImage(profileImage) ? profileImage : `${process.env.SERVER_URL}/${profileImage}`}
      />
      <span>
        <b>
          <Link to={`/@${username}`} onClick={() => history.push(`/@${username}`)}>
            {username}
          </Link>
        </b>
      </span>
      <span>{new Date(publishedDate).toLocaleDateString()}</span>
    </SubInfoBlock>
  );
};

export default SubInfo;
