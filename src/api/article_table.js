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

export function fetchmcbooklist(courseId, monthCourseId) {
  const data = {
      courseId,
      monthCourseId
  };
  return fetch({
    url: '/reading/coursemanager/getmcbooklist',
    method: 'post',
    data
  })
}

export function fetchmcbcataloglist(courseId, monthCourseId, bookId) {
  const data = {
    courseId,
    monthCourseId,
    bookId
  };
  return fetch({
    url: '/reading/coursemanager/getmcbcataloglist',
    method: 'post',
    data
  })
}

export function fetchmcbcChapterList(monthCourseCatalogId) {
  const data ={
    monthCourseCatalogId
  };
  return fetch({
    url: '/reading/coursemanager/getmcbcchapterlist',
    method: 'post',
    data
  })
}