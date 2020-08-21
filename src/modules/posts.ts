import { atom, SetterOrUpdater } from 'recoil';
import * as postsCtrl from '../lib/api/posts';
import * as likeCtrl from '../lib/api/like';
import client from '../lib/api/client';
import { History } from 'history';

type Post = postsCtrl.Post;
type ListPostsData = postsCtrl.ListPostsData;

type PostsState = {
  posts: Post[];
  lastPage: number;
  isLoading: boolean;
};

export const postsState = atom<PostsState>({
  key: 'posts/postsState',
  default: {
    posts: [],
    lastPage: 1,
    isLoading: true,
  },
});

const dataURLtoFile = (dataurl, fileName) => {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], fileName, { type: mime });
};

export const getImage = (url: string, data: FormData) => {
  client
    .get(url, { responseType: 'blob' })
    .then(function (response) {
      var reader = new window.FileReader();
      reader.readAsDataURL(response.data);
      reader.onload = function () {
        const embedEl = document.createElement('embed');
        var imageDataUrl = reader.result;
        embedEl.src = imageDataUrl as string;
        document.querySelector('#image').appendChild(embedEl);
        data.append('files', dataURLtoFile(imageDataUrl, url));
      };
    })
    .catch(err => console.log(err));
};

export const getPosts = (data: ListPostsData, setPosts: SetterOrUpdater<PostsState>) => {
  postsCtrl
    .listPosts(data)
    .then(res => {
      const { headers, data } = res;
      setPosts({
        isLoading: false,
        posts: [...data],
        lastPage: parseInt(headers['last-page'], 10),
      });
    })
    .catch(err => console.log(err));
};

export const getPost = (
  id: number,
  setPost: SetterOrUpdater<Post>,
  setError: React.Dispatch<React.SetStateAction<string>>,
) => {
  postsCtrl
    .readPost(id)
    .then(({ data }) => {
      console.log(data);
      setPost(data);
    })
    .catch(err => {
      if (err.response && err.response.status === 404) setError('not found');
      else setError('error');
    });
};

export const removePost = (id: number, history: History) => {
  postsCtrl
    .removePost(id)
    .then(() => history.push('/'))
    .catch(err => console.log(err));
};

export const bad = (
  id: number,
  setPost: SetterOrUpdater<Post>,
  setLiking: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  likeCtrl
    .bad(id)
    .then(res => {
      setPost(res.data);
      setLiking(false);
    })
    .catch(err => console.log(err));
};

export const good = (
  id: number,
  setPost: SetterOrUpdater<Post>,
  setLiking: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  likeCtrl
    .good(id)
    .then(res => {
      setPost(res.data);
      setLiking(true);
    })
    .catch(err => console.log(err));
};
