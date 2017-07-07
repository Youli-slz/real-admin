import fetch from 'utils/fetch';

export function getToken() {
  return fetch({
    url: 'http://wxmp.gatao.cn/mypic/gettoken', // 假地址 自行替换
    method: 'get'
  });
}