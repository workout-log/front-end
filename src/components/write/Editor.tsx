import React, { FC, useEffect, useCallback, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import TagBox from './TagBox';
import WriteActionButtons from './WriteActionButtons';
import { editorState, editorInitialState } from '../../modules/editor';
import { getImage } from '../../modules/posts';

const EditorWrapper = styled.article`
  padding: 1rem 0;
  .form-control.content {
    min-height: 134px;
    height: auto;
  }
  .ql-editor.ql-blank::before {
    font-size: 1rem;
    position: absolute;
    left: 0;
  }
  .ql-editor {
    padding: 0.375rem 0 !important;
    > p {
      font-size: 1rem !important;
    }
  }
  .quill.form-control.content {
    > div:first-child {
      border-radius: 0.25rem;
      display: flex;
      overflow-x: scroll;
    }
    > div:last-child {
      border: none;
    }
    margin-bottom: 1rem;
  }
  .ql-formats {
    display: flex;
    &:first-child {
      display: none;
    }
  }
  span {
    display: inline-block;
    margin-bottom: 0.5rem;
  }
  .ql-container.ql-snow {
    min-height: 150px;
  }
  .ql-toolbar.ql-snow {
    height: 2.5rem;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    ::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera*/
  }
}
  }
  #image {
    width: 100%;
    max-height: 31rem;
    display: block;
    overflow-y: hidden;
    overflow-x: scroll;
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
      background: #2C2C2C;
      border-radius: 0;
    }
    > embed {
      object-fit: cover;
      width: 100%;
      height: auto;
      max-height: 31rem;
    }
  }
  .toggle.btn {
    display: block;
    width: 61.9844px;
    height: 38px;
  }
`;

type Key =
  | 'title'
  | 'body'
  | 'tags'
  | 'files'
  | 'filesUrl'
  | 'isPrivate'
  | 'originalPostId'
  | 'isEditMode';

const Editor: FC = () => {
  const mounted = useRef<boolean>(false);
  const [files, setFiles] = useState<FormData>(new FormData());
  const [editor, setEditor] = useRecoilState(editorState);

  const onChangeField = useCallback(
    ({ key, value }: { key: Key; value: string }) => {
      const newPost = {
        ...editor,
        [key]: value,
      };
      setEditor(newPost);
    },
    [editor],
  );

  const onChangeTitle = e => {
    onChangeField({ key: 'title', value: e.target.value });
  };

  const onChangeBody = value => {
    onChangeField({ key: 'body', value });
  };

  const imageHandler = useCallback(() => {
    const inputEl = document.createElement('input');
    inputEl.setAttribute('type', 'file');
    inputEl.setAttribute('accept', '.jpeg, .jpeg/jfif, .png, .heif');
    inputEl.setAttribute('multiple', '');
    inputEl.click();
    inputEl.onchange = () => {
      const imageDiv = document.querySelector('#image');
      imageDiv.innerHTML = '';
      function readURL(input: any) {
        const formData = new FormData();
        if (input.files && input.files[0]) {
          for (let i = 0; i < input.files.length; i++) {
            formData.append('files', input.files[i]);
            const reader = new FileReader();
            reader.onload = function (e: any) {
              const embedEl = document.createElement('embed');
              embedEl.setAttribute('src', e.target.result);
              imageDiv.appendChild(embedEl);
            };
            reader.readAsDataURL(input.files[i]);
          }
          setFiles(formData);
        }
      }
      readURL(inputEl);
    };
  }, []);

  const toggleHandler = useCallback(() => {
    if (editor.isPrivate) {
      $('.toggle.btn').removeClass('btn-success');
      $('.toggle.btn').addClass('btn-light off');
      setEditor({ ...editor, isPrivate: false });
    } else {
      $('.toggle.btn').removeClass('btn-light off');
      $('.toggle.btn').addClass('btn-success');
      setEditor({ ...editor, isPrivate: true });
    }
  }, [editor]);

  useEffect(() => {
    setEditor({
      ...editor,
      files,
    });
  }, [files]);

  useEffect(() => {
    const quillInstance = document.querySelector('.ql-editor');
    if (mounted.current) return;
    mounted.current = true;
    quillInstance.innerHTML = editor.body;
    if (editor.filesUrl && editor.filesUrl.length) {
      const formData = new FormData();
      for (let i = 0; i < editor.filesUrl.length; i++) {
        getImage(`/${editor.filesUrl[i]}`, formData);
      }
      setEditor({
        ...editor,
        files: formData,
      });
    }
    return () => {
      setEditor(editorInitialState);
    };
  }, []);

  return (
    <EditorWrapper>
      <div className='container' role='main'>
        <h2>{editor.isEditMode ? '수정하기' : '새 게시물'}</h2>
        <div className='mb-3'>
          <span>제목</span>
          <input
            type='text'
            className='form-control'
            name='title'
            id='title'
            placeholder='제목을 입력해 주세요'
            value={editor.title}
            onChange={onChangeTitle}
          />
        </div>
        <div className='mb-3'>
          <span>내용</span>
          <ReactQuill
            theme='snow'
            placeholder='내용을 작성하세요...'
            modules={{
              toolbar: {
                container: [
                  [{ size: '1rem !important;' }],
                  [{ header: '1' }, { header: '2' }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['blockquote', 'code-block', 'link', 'image'],
                ],
                handlers: {
                  image: imageHandler,
                },
              },
            }}
            onChange={onChangeBody}
            className='form-control content'
          />
          <span>사진</span>
          <div id='image' />
          <div>
            <span>비공개</span>
            <div
              className='toggle btn btn-light off'
              data-toggle='toggle'
              role='button'
              onClick={toggleHandler}
            >
              <input type='checkbox' data-toggle='toggle' data-onstyle='success' />
              <div className='toggle-group'>
                <label htmlFor='' className='btn btn-success toggle-on'>
                  On
                </label>
                <label htmlFor='' className='btn btn-light toggle-off'>
                  Off
                </label>
                <span className='toggle-handle btn btn-light'></span>
              </div>
            </div>
          </div>
        </div>
        <TagBox />
        <div>
          <WriteActionButtons />
        </div>
      </div>
    </EditorWrapper>
  );
};

export default Editor;
