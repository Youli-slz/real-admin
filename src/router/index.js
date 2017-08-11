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
const cataloglist = _import('booklib/CatalogList');
const CatalogChapter = _import('booklib/CatalogChapterlist');

/* courselib */
const CourseList = _import('courselib/CourseList');
const AddCourse = _import('courselib/AddCourse');
const CourseDetailList = _import('courselib/CourseDetailList');
const AddMCourse = _import('courselib/AddMCourse');
const McBookList = _import('courselib/McBookList');
const AddMcBook = _import('courselib/AddMcBook');
const McbCatalogList = _import('courselib/McbCatalogList');
const AddMcbCatalog = _import('courselib/AddMcbCatalog');
const McbcChapterList = _import('courselib/McbcChapterList');
const AddMcbcChapter = _import('courselib/AddMcbcChapter');

/*comment*/
const Comment = _import('comment/commentlist');

/* statistics  */
const CourseType = _import('statistics/CourseTypeList');
const StatisticsData = _import('statistics/StatisticsData');

Vue.use(Router);

 /**
  * icon : the icon show in the sidebar
  * hidden : if hidden:true will not show in the sidebar
  * redirect : if redirect:noredirect will not redirct in the levelbar
  * noDropdown : if noDropdown:true will not has submenu
  * meta : { role: ['admin'] }  will control the page role
  **/

export const constantRouterMap = [
    { path: '/', component: Login, hidden: true },
    { path: '/login', component: Login, hidden: true},
    { path: '/authredirect', component: authRedirect, hidden: true },
    { path: '/404', component: Err404, hidden: true },
    { path: '/401', component: Err401, hidden: true },
  {
    path: '/dashboard',
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
      { path: 'ListDetail/:id', component: BListDetail, name: '书籍详情列表', hidden: true },
      { path: 'Addbook', component: Addbook, name: '新增书籍', hidden: true },
      { path: 'AddSection/:id/:indexid', component: AddSection, name: '新增章节', hidden: true },
      { path: 'SectionDetail/:id', component: SectionDetail, name: '章节详情', hidden: true },
      { path: 'CatalogList/:id', component: cataloglist, name: '书籍目录', hidden: true},
      { path: 'CatalogChapter/:bookCatalogid/:bookid', component: CatalogChapter, name: '目录章节', hidden: true}
    ]
  },
  {
    path: '/courselib',
    component: Layout,
    reirect: '/courselib/CourseList',
    icon: 'wujiaoxing',
    noDropdown: true,
    children: [
      { path: 'CourseList', component: CourseList, name: '课程' },
      { path: 'AddCourse', component: AddCourse, name: '新增课程', hidden: true },
      { path: 'CourseDetailList/:courseid', component: CourseDetailList, name: '课程月份目录列表', hidden: true },
      { path: 'AddMCourse/:courseid/:indexid', component: AddMCourse, name: '新增课程月份', hidden: true },
      { path: 'McBookList/:courseid/:monthcourseid', component: McBookList, name: '月份书籍列表', hidden: true },
      { path: 'AddMcBook/:courseid/:monthcourseid/:indexid', component: AddMcBook, name: '添加月份书籍', hidden: true },
      { path: 'McbCatalogList/:courseid/:monthcourseid/:bookid', component: McbCatalogList, name: '月份书籍目录', hidden: true },
      { path: 'AddMcbCatalog/:courseid/:monthcourseid/:bookid/:indexid', component: AddMcbCatalog, name: '添加月份书籍目录', hidden: true },
      { path: 'McbcChapterList/:id/:bookid/:courseid/:monthcourseid', component: McbcChapterList, name: '月份书籍章节', hidden: true },
      { path: 'AddMcbcChapter/:monthcoursecatalogid/:bookid/:courseid/:monthcourseid', component: AddMcbcChapter, name: '添加课程书籍章节列表', hidden: true }
    ]
  },
  {
    path: '/comment',
    component: Layout,
    reirect: '/comment/commentlist',
    icon: 'wujiaoxing',
    noDropdown: true,
    children: [
      {path: 'commentlist', component: Comment, name: '评论'}
    ]
  },
  {
    path: '/statistics',
    name: '课程统计',
    component: Layout,
    reirect: '/statistics/CourseTypeList',
    icon: 'zujian',
    children: [
      {path: 'coursetypelist', component: CourseType, name: '课程类型列表'},
      {path: 'statisticsdata', component: StatisticsData, name: '课程数据统计'}
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
