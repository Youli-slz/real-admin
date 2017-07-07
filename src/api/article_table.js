import fetch from 'utils/fetch';

export function fetchList() {
  return fetch({
    url: '/reading/coursemanager/getbooklist',
    method: 'post'
  });
}

export function fetchChapterList(bookId) {
  const data = {
    bookId
  };
  return fetch({
    url: '/reading/coursemanager/getchapterlist',
    method: 'post',
    data
  })
}

export function CreateChapter(bookId, indexId, title, cover, content) {
  const data = {
    bookId,
    indexId,
    title,
    cover,
    content
  };
  return fetch({
    url: '/reading/coursemanager/createchapter',
    method: 'post',
    data
  })
}
