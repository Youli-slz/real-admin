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

export function fetchcommentlist(status,offset,num) {
  const data = {
    status,
    offset,
    num
  };
  return fetch({
    url: '/reading/course/getallcomment',
    method: 'post',
    data
  })
}

export function fetchCourseType(){
  return fetch({
    url:'/reading/statistics/getcoursetypelist',
    method: 'post'
  });
}

export function fetchcoursechannellist(courseType) {
  const data = {
    courseType
  };
  return fetch({
    url: '/reading/statistics/getcoursechannellist',
    method: 'post',
    data
  })
}

export function fetchdatastatistics(courseType,source,startTime,endTime){
  const data = {
    courseType,
    source,
    startTime,
    endTime
  };
  return fetch({
    url: '/reading/statistics/getcoursedatastatistics',
    method: 'post',
    data
  })
}

export function fetchCatalog(bookId){
  const data = {
    bookId
  };
  return fetch({
    url: '/reading/coursemanager/getbookcatalogs',
    method: 'post',
    data
  })
}

export function fetchcatachapter(bookCatalogid){
  const data ={
    bookCatalogid
  };
  return fetch({
    url:'/reading/coursemanager/getbcchapters',
    method:'post',
    data
  })
}
