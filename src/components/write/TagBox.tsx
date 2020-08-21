import React, { FC, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { editorState } from '../../modules/editor';

const Tag = styled.div`
  margin-right: 0.5rem;
  color: gray;
  cursor: pointer;
  &:hover {
    opacity: 0.5;
  }
`;

const TagListBlock = styled.div`
  display: flex;
  margin-top: 0.5rem;
`;

const TagBoxBlock = styled.div`
  .form-control {
    width: auto !important;
  }
  input {
    border: none;
  }
  form {
    width: 256px;
    border: 1px solid black;
    border-radius: 0.25rem;
  }
  button {
    border: none;
    width: 100%;
    border-left: 1px solid black;
    border-radius: 0;
    box-sizing: border-box;
  }
`;
const TagItem = React.memo<{
  tag: string;
  onRemove: (tag: string) => void;
}>(({ tag, onRemove }) => <Tag onClick={() => onRemove(tag)}>#{tag}</Tag>);

const TagList = React.memo<{
  tags: string[];
  onRemove: (tag: string) => void;
}>(({ tags, onRemove }) => (
  <TagListBlock>
    {tags.map(tag => (
      <TagItem key={tag} tag={tag} onRemove={onRemove} />
    ))}
  </TagListBlock>
));

const TagBox: FC = () => {
  const [{ tags }, setEditor] = useRecoilState(editorState);
  const [input, setInput] = useState('');

  const insertTag = useCallback(
    tag => {
      if (!tag) return;
      if (tags.includes(tag)) return;
      const nextTags = [...tags, tag];
      setEditor(curr => ({ ...curr, tags: nextTags }));
    },
    [tags],
  );

  const onRemove = useCallback(
    (tag: string) => {
      const nextTags = tags.filter(t => t !== tag);
      setEditor(curr => ({ ...curr, tags: nextTags }));
    },
    [tags],
  );

  const onChange = useCallback(e => {
    setInput(e.target.value);
  }, []);

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      insertTag(input.trim());
      setInput('');
    },
    [input, insertTag],
  );

  return (
    <>
      <TagBoxBlock>
        <div className='mb-3'>
          <span>태그</span>
          <form className='d-flex' onSubmit={onSubmit}>
            <input
              type='text'
              className='form-control'
              name='tag'
              id='tag'
              placeholder='태그를 입력해 주세요'
              value={input}
              onChange={onChange}
            />
            <button type='submit' className='btn btn-outline-dark my-sm-0'>
              추가
            </button>
          </form>
          <TagList tags={tags} onRemove={onRemove} />
        </div>
      </TagBoxBlock>
    </>
  );
};

export default TagBox;
