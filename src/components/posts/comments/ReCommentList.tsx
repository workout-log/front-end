import React, { FC, Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import CommentItem from './CommentItem';
import { CommonComment } from '../../../modules/comments';

const RecommentBlock = styled.div`
  margin-left: 1rem;
`;

type Props = {
  data: CommonComment[];
  commentId: number;
  setCommentId: Dispatch<SetStateAction<number>>;
  setIsReplyMode: Dispatch<SetStateAction<boolean>>;
  setIsEditMode: Dispatch<SetStateAction<boolean>>;
  setIsRecomment: Dispatch<SetStateAction<boolean>>;
  setRecommentId: Dispatch<SetStateAction<number>>;
};

const RecommentList: FC<Props> = ({
  data,
  commentId,
  setCommentId,
  setIsReplyMode,
  setIsEditMode,
  setIsRecomment,
  setRecommentId,
}) => {
  return (
    <RecommentBlock>
      {data.map(d => (
        <CommentItem
          key={`r_${d.id}`}
          data={d}
          isRecomment={true}
          commentId={commentId}
          setCommentId={setCommentId}
          setRecommentId={setRecommentId}
          setIsReplyMode={setIsReplyMode}
          setIsEditMode={setIsEditMode}
          setIsRecomment={setIsRecomment}
        />
      ))}
    </RecommentBlock>
  );
};

export default RecommentList;
