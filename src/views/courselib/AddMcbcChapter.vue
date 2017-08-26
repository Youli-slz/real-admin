<template>
    <div class="app-container calerndar-list-container">
        <div style="width: 400px;padding: 10px">
            <el-button type="primary" size="small" @click="goback()" style="margin-buttom: 10px">返回</el-button>
        </div>
        <template>
            <el-checkbox-group v-model="Chapterlist">
                <input type="checkbox" @click="checkAll()">全选
                <el-table :data="courselist" v-loading.body="listLoading" border fit highlight-current-row style="width:100%">
                    <el-table-column align="center" label="序号" width="300">
                        <template scope="scope">
                            <span>{{ scope.row.indexId }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column width="300" align="center" label="书籍ID">
                        <template scope="scope">
                            <span>{{ scope.row.bookId }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column min-width="300" align="center" label="标题">
                        <template scope="scope">
                            <span> {{ scope.row.title }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column width="80" align="center" label="操作">
                        <template scope="scope">
                            <input type="checkbox" :id="scope.row.id" :value="scope.row" v-model="Chapterlist">
                            <!-- <el-button type="primary" v-show="!scope.row.edit" @click='goDetail(scope.row)' size="small" icon="search">详情</el-button>
                            <el-button type="primary" v-show="!scope.row.edit" @click='scope.row.edit=true' size="small"  icon="edit">更新</el-button>
                            <el-button type="primary" v-show="scope.row.edit" @click='updateCourse(scope.row),scope.row.edit=false' size="small" icon="check">确定</el-button>
                            <el-button type="primary" v-show="scope.row.edit" @click='scope.row.edit=false' size="small" icon="check">取消</el-button>
                            <el-button type="primary" v-show="!scope.row.edit" @click='confirm(scope.row.id)' size="small" icon="close">删除</el-button> -->
                        </template>
                    </el-table-column>
                </el-table>
            </el-checkbox-group>
            <!-- <span v-for="item in Chapterlist">{{ item.id }}, </span>  -->

        </template>
        <div style="margin-bottom: 40px;">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size='pagesize' ayout="total, prev, pager, next" :total='totalpage'></el-pagination>
        </div>
        <div style="margin-bottom: 20px;">
            <label>音频标题:</label>
        </div>
        <div style="margin-bottom: 20px;">
            <el-input v-model="vidoTitle" placeholder="上传音频的标题"></el-input>
        </div>
        <div class="">
            <label>语音</label>
            <div id="container" style="margin-bottom: 20px;">
                <label for="audio" class="el-button el-button--primary el-button--small">
                    <i class="el-icon-upload"></i>
                    <span>点击上传语音</span>
                </label>
                <div>
                    <audio :src="reply.content" controls id="content">
                        您的浏览器不支持 audio 标签.
                    </audio>
                </div>
                <input type="file" id="audio" style="display: none;" />
            </div>
            <div style="margin-bottom:20px;">
                <el-input type="text" v-model="reply.content"  id="content"  placeholder="复制语音链接"></el-input>
            </div>
        </div>

        <el-button type="primary" @click='updateCourse'>创建</el-button>
        <!-- <el-button @click="createaucio">获取时长</el-button> -->
        <!-- <el-button @click='Addaudio'>添加语音</el-button> -->
    </div>
</template>

<script>
import { fetchChapterList } from 'api/article_table';    /// 调用获取列表的接口方法
import Vue from 'vue';
export default {
    name: 'courselist',
    data() {
        return {
            list: null,
            listLoading: false,    /// 暂时改为false， 是等待的旋转框不出现
            alllist: [],
            courselist: [],
            pagesize: 100,
            totalpage: 1,
            currentPage: 1,
            NewTaskTime: null,
            taskT: null,
            courseid: null,
            monthcoursecatalogid: null,
            bookid: null,
            Chapterlist: [],
            Chapterlist1: [],
            checkall: false,
            uptoken: '',
            audioUrl: '',
            reply: {
                msgType: 34,
                content: ''
            },
            vidoTitle: '',
            vidoTime: ''


        }
    },
    methods: {
        checkAll: function() {//全选
            if (!this.checkall) {
                this.Chapterlist = []
                this.alllist.forEach((item) => {
                    this.Chapterlist.push(item);
                });
                this.checkall = true
            }
            else {
                this.Chapterlist = []
                this.checkall = false
            }
        },
        getList: function() {
            this.bookid = Number.parseInt(this.$route.params.bookid);
            this.monthcoursecatalogid = Number.parseInt(this.$route.params.monthcoursecatalogid);
            fetchChapterList(this.bookid).then(response => {
                this.list = response.data.data.map(v => {
                    v.edit = false;
                    return v;
                });
                if (response.data.code === 0) {
                    this.listLoading = false;
                    this.alllist = this.list;
                    this.totalpage = this.list.length;
                    this.courselist = [];
                    var currentSize = this.currentPage * this.pagesize;
                    if (currentSize > this.alllist.length) {
                        currentSize = this.alllist.length;
                    }
                    for (var i = (this.currentPage - 1) * this.pagesize; i < currentSize; i++) {
                        this.alllist[i].money
                        this.courselist.push(this.alllist[i]);
                    }
                }
                else {
                    this.listLoading = true;
                }
            })
        },
        handleSizeChange: function() {
            const self = this;
            self.courselist = [];
            const j = self.currentPage === Math.ceil(self.alllist.length / self.pagesize) ? self.alllist.length : self.currentPage * self.pageszie;
            for (let i = (self.currentPage - 1) * self.pagesize; i < j; i++) {
                self.courselist.push(self.alllist[i]);
            }
        },
        handleCurrentChange: function(val) {
            const self = this;

            self.courselist = [];
            const j = val === Math.ceil(self.alllist.length / self.pagesize) ? self.alllist.length : val * self.pagesize;
            for (let i = (val - 1) * self.pagesize; i < j; i++) {
                self.courselist.push(self.alllist[i]);
            }
        },
        createaucio: function () {
            var self = this;
            var courseid = Number.parseInt(this.$route.params.courseid);
            var monthcourseid = Number.parseInt(this.$route.params.monthcourseid);
            var monthcoursecatalogId = Number.parseInt(this.$route.params.monthcoursecatalogid);
            if(this.reply.content != ''){
                this.vidoTime = document.getElementById("content");
                console.log(this.vidoTime.duration);
                this.$http.post('http://reading.dingjiantaoke.cn/reading/coursemanager/createmcbcaudio',{
                    monthCourseCatalogId: monthcoursecatalogId,
                    AudioTitle: self.vidoTitle,
                    AudioUrl: self.reply.content,
                    AudioTime: Number.parseInt(self.vidoTime.duration)
                })
                .then(function(res){
                    var data = res.data;
                    if(data.code == 0){
                        self.$message("创建成功")
                    }
                    else{
                        self.$message("创建失败")
                    }
                })
                .catch(function(err){
                    console.log(err);
                    self.$message('创建失败');
                })
                setTimeout(function() {
                    self.$router.push({ name: '月份书籍章节', params: { id: self.monthcoursecatalogid, bookid: self.bookid, courseid: courseid, monthcourseid: monthcourseid } });
                }, 1000)
            } else {
                if(this.Chapterlist1.length == 0){
                    this.$message("请填写信息");
                    return false;
                }
                else{
                    setTimeout(function() {
                        self.$router.push({ name: '月份书籍章节', params: { id: self.monthcoursecatalogid, bookid: self.bookid, courseid: courseid, monthcourseid: monthcourseid } });
                    }, 1000)
                    this.$message('创建成功')
                }

            }
        },
        updateCourse: function() {
            var self = this;
            for (var i in this.Chapterlist) {
                this.Chapterlist1.push({
                    monthCourseCatalogId: Number.parseInt(self.$route.params.monthcoursecatalogid),
                    bookId: Number.parseInt(self.$route.params.bookid),
                    chapterId: self.Chapterlist[i].id,
                    indexId: self.Chapterlist[i].indexId
                })
            }
            console.log(this.Chapterlist1)
            if(this.Chapterlist1.length != 0){
                this.$http.post('http://reading.dingjiantaoke.cn/reading/coursemanager/createmcbcchapter', this.Chapterlist1)
                    .then(function(res) {
                        var data = res.data;
                        if (data.code === 0) {
                            self.createaucio();
                        }
                    })
                    .catch(function(err) {
                        console.log(err);
                        self.$message('创建失败');
                    })
            } else {
                this.createaucio();
            }

        },
        goCourseList: function() {                    /// 提交完成后跳转到列表页面
            //   this.$router.push('/courselib/McbcChapterList?id='+ this.monthcoursecatalogid + '&bookid='+ this.bookid);
            var courseid = Number.parseInt(this.$route.params.courseid);
            var monthcourseid = Number.parseInt(this.$route.params.monthcourseid);
            this.$router.push({ name: '月份书籍章节', params: { id: this.monthcoursecatalogid, bookid: this.bookid, courseid: courseid, monthcourseid: monthcourseid } });
        },
        goback: function() {
            var courseid = Number.parseInt(this.$route.params.courseid);
            var monthcourseid = Number.parseInt(this.$route.params.monthcourseid);
            //   this.$router.push('/courselib/McbcChapterList?id=' + this.monthcoursecatalogid+ '&bookid='+ this.bookid +'&courseid='+courseid + '&monthcourseid='+ monthcourseid);
            this.$router.push({ name: '月份书籍章节', params: { id: this.monthcoursecatalogid, bookid: this.bookid, courseid: courseid, monthcourseid: monthcourseid } });
        },
        getuptoken: function() {
            var self = this;
            this.$http.get('http://wxmp.gatao.cn/mypic/gettoken')
                .then((response) => {
                    var data = response.data;
                    self.uptoken = data.token;
                    self.uploadaudio();

                })
                .catch((error) => {
                    console.log(error)
                })
        },
        uploadaudio: function() {
            var self = this;
            var uploader = Qiniu.uploader({
                runtimes: 'html5,flash,html4', //上传模式,依次退化
                browse_button: 'audio', //上传选择的点选按钮，**必需**
                uptoken: this.uptoken,
                //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
                // uptoken : '<Your upload token>',
                //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
                // unique_names: true,
                // 默认 false，key为文件名。若开启该选项，SDK会为每个文件自动生成key（文件名）
                save_key: true,
                // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
                domain: 'http://7xld1x.com1.z0.glb.clouddn.com/',
                //bucket 域名，下载资源时用到，**必需**
                container: 'container', //上传区域DOM ID，默认是browser_button的父元素，
                max_file_size: '5mb', //最大文件体积限制
                flash_swf_url: 'qiniu/Moxie.swf', //引入flash,相对路径
                max_retries: 3, //上传失败最大重试次数
                dragdrop: true, //开启可拖曳上传
                drop_element: 'container', //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                chunk_size: '4mb', //分块上传时，每片的体积
                auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                filters: {
                    mime_types: [
                        { title: "Audio files", extensions: "mp3" } // 限定flv后缀上传格式上传
                    ]
                },
                multi_selection: false,
                init: {
                    UploadProgress: function(up, file) {
                    },
                    'FileUploaded': function(up, file, info) {
                        var domain = up.getOption('domain');
                        var res = JSON.parse(info);
                        var urlImg = 'http://7xld1x.com1.z0.glb.clouddn.com/' + res.key;
                        self.reply.content = urlImg;
                    },
                    'Error': function(up, err, errTip) {
                        //上传出错时，处理相关的事情
                        console.log(err);
                        alert("上传出错，请刷新重新上传")
                    }
                }
            });
        }
    },
    created() {
        this.getList();
        this.getuptoken();
    }
}
</script>

<style>
input[type="checkbox"] {
    width: 20px;
    height: 20px;
}
</style>