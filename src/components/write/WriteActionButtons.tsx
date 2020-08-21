import React, { FC, useCallback } from 'react';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { editorState, update, write } from '../../modules/editor';
import { userState } from '../../modules/auth';

const WriteActionButtonsBlock = styled.div`
  margin-top: 1rem;
  margin-bottom: 3rem;
  button + button {
    margin-left: 0.5rem;
  }
  button {
    padding: 0.25rem 0.75rem;
  }
`;

const WriteActionButtons: FC<RouteComponentProps> = ({ history }) => {
  const [, setUser] = useRecoilState(userState);
  const [editor, setEditor] = useRecoilState(editorState);
  const { title, body, tags, files, isPrivate, originalPostId, isEditMode } = editor;
  const onCancel = () => {
    history.goBack();
  };
  const onPublish = useCallback(() => {
    files.set('title', title);
    files.set('body', body);
    files.set('isPrivate', JSON.stringify(isPrivate));
    [...new Set(tags)].forEach(t => files.append('tags', t));
    if (body === '<p><br></p>') return alert('내용은 공백일 수 없습니다.');
    if (isEditMode) {
      update(originalPostId, files, history);
    } else {
      write(files, history, setUser);
    }
  }, [editor]);
  return (
    <WriteActionButtonsBlock>
      <button className='btn btn-sm btn-success' onClick={onPublish}>
        {isEditMode ? '포스트 수정' : '포스트 등록'}
      </button>
      <button className='btn btn-sm btn-dark' onClick={onCancel}>
        취소
      </button>
    </WriteActionButtonsBlock>
  );
};

export default withRouter(WriteActionButtons);
