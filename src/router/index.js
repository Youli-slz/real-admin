import Vue from 'vue';
import Router from 'vue-router';
const _import = require('./_import_' + process.env.NODE_ENV);
// in development env not use Lazy Loading,because Lazy Loading large page will cause webpack hot update too slow.so only in production use Lazy Loading

/* layout */
import Layout from '../views/layout/Layout';

/* login */
const Login = _import('login/index');
const authRedirect = _import('login/authredirect');

/* dashboard */
const dashboard = _import('dashboard/index');

/* components */
const componentsIndex = _import('components/index');
const Tinymce = _import('components/tinymce');
const Markdown = _import('components/markdown');
const JsonEditor = _import('components/jsoneditor');
const DndList = _import('components/dndlist');
const AvatarUpload = _import('components/avatarUpload');
const Dropzone = _import('components/dropzone');
const Sticky = _import('components/sticky');
const SplitPane = _import('components/splitpane');
const CountTo = _import('components/countTo');
const Mixin = _import('components/mixin');



/* error page */
const Err404 = _import('error/404');
const Err401 = _import('error/401');



/* booklib */
const BookList = _import('booklib/BookList');
const BListDetail = _import('booklib/ListDetail');
const Addbook = _import('booklib/AddBook');
const AddSection = _import('booklib/AddSection');
const SectionDetail = _import('booklib/SectionDetail');

/* courselib */
const CourseList = _import('courselib/CourseList');

Vue.use(Router);

 /**
  * icon : the icon show in the sidebar
  * hidden : if hidden:true will not show in the sidebar
  * redirect : if redirect:noredirect will not redirct in the levelbar
  * noDropdown : if noDropdown:true will not has submenu
  * meta : { role: ['admin'] }  will control the page role
  **/

export const constantRouterMap = [
    { path: '/login', component: Login, hidden: true },
    { path: '/authredirect', component: authRedirect, hidden: true },
    { path: '/404', component: Err404, hidden: true },
    { path: '/401', component: Err401, hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    hidden: true,
    children: [{ path: 'dashboard', component: dashboard }]
  },
  {
    path: '/booklib',
    component: Layout,
    redirect: '/booklib/BookList',
    icon: 'xinrenzhinan',
    noDropdown: true,
    children: [
      { path: 'BookList', component: BookList, name: '书籍' },
      { path: 'ListDetail', component: BListDetail, name: '书籍列表详情', hidden: true },
      { path: 'Addbook', component: Addbook, name: '新增书籍', hidden: true },
      { path: 'AddSection', component: AddSection, name: '新增章节', hidden: true },
      { path: 'SectionDetail', component: SectionDetail, name: '章节详情', hidden: true }
    ]
  },
  {
    path: '/courselib',
    component: Layout,
    reirect: '/courselib/CourseList',
    icon: 'wujiaoxing',
    noDropdown: true,
    children: [
      { path: 'CorseList', component: CourseList, name: '课程'}
    ]
  }
]

export default new Router({

  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});

export const asyncRouterMap = [
  {
    path: '/components',
    component: Layout,
    redirect: '/components/index',
    name: '组件',
    icon: 'zujian',
    children: [
      { path: 'index', component: componentsIndex, name: '介绍 ' },
      { path: 'tinymce', component: Tinymce, name: '富文本编辑器' },
      { path: 'markdown', component: Markdown, name: 'Markdown' },
      { path: 'jsoneditor', component: JsonEditor, name: 'JSON编辑器' },
      { path: 'dndlist', component: DndList, name: '列表拖拽' },
      { path: 'splitpane', component: SplitPane, name: 'SplitPane' },
      { path: 'avatarupload', component: AvatarUpload, name: '头像上传' },
      { path: 'dropzone', component: Dropzone, name: 'Dropzone' },
      { path: 'sticky', component: Sticky, name: 'Sticky' },
      { path: 'countto', component: CountTo, name: 'CountTo' },
      { path: 'mixin', component: Mixin, name: '小组件' }
    ],
    hidden: true
  },
  { path: '*', redirect: '/404', hidden: true }
];
