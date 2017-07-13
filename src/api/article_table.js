import fetch from 'utils/fetch';

export function fetchList() {
  return fetch({
    url: '/reading/coursemanager/getbooklist',
    method: 'post'
  });
}

export function fetchCourseList() {
  return fetch({
    url: '/reading/coursemanager/getcourselist',
    method: 'post'
  })
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

export function  fetchChapterDetail(chapterId) {
  const data = {
    chapterId
  };
  return fetch({
    url: '/reading/coursemanager/getchapter',
    method: 'post',
    data
  })
}

export function fetchmcourselist(courseId) {
  const data = {
    courseId
  };
  return fetch({
    url: '/reading/coursemanager/getmcourselist',
    method: 'post',
    data
  })
}


