<template>
    <div class="app-container calerndar-list-container">
        <div style="width: 400px;padding: 10px">
            <el-button type="primary" size="small" @click="goback()" style="margin-buttom: 10px">返回</el-button>
        </div>
        <template>
          <el-checkbox-group v-model="Chapterlist">
                <input type="checkbox" @click="checkAll()">全选
            <el-table :data="courselist" v-loading.body = "listLoading" border fit highlight-current-row style="width:100%">
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
            <el-pagination 
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage" :page-size='pagesize' ayout="total, prev, pager, next" :total = 'totalpage'></el-pagination>
        </div>
        <div class="" v-for="(item, key) in reply">
           <label>语音</label>
            <div :id="key" style="margin-bottom: 20px;">
            <label :for="key+ 'audio'" class="el-button el-button--primary el-button--small">
              <i class="el-icon-upload"></i><span>点击上传语音</span>
            </label>
            <div><audio :src="item.content" controls :id="'content'+ key">
            您的浏览器不支持 audio 标签.
            </audio></div>
            <input type="file" :id="key + 'audio'" style="display: none;" />
            </div>
        </div>

        <el-button @click='updateCourse'>创建</el-button>
        <el-button @click='Addaudio'>添加语音</el-button>
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
            totalpage:1,
            currentPage:1,
            NewTaskTime: null,
            taskT: null,
            courseid: null,
            monthcoursecatalogid: null,
            bookid: null,
            Chapterlist:[],
            Chapterlist1:[],
            checkall: false,
            uptoken:'',
            audioUrl:'',
            reply:[{
                msgType: 34,
                content: ''
            }]

        }
    },
    methods: {
        Addaudio: function() {
            var self = this;
            this.reply.push({msgType: 34, content: ''});
            this.$nextTick(function(){
                setTimeout(function(){
                    self.getuptoken()
                },500)
            })
        },
        checkAll: function () {//全选
            if (!this.checkall) {
                this.Chapterlist = []         
                this.alllist.forEach((item) => {
                this.Chapterlist.push(item);
                });
                this.checkall = true
            }
           else{
            this.Chapterlist = [] 
            this.checkall = false                
           }
  		},
        getList: function() {
            this.bookid = Number.parseInt(this.$route.query.bookid);
            this.monthcoursecatalogid = Number.parseInt(this.$route.query.monthcoursecatalogid);
            fetchChapterList(this.bookid).then(response => {
                this.list = response.data.data.map(v => {
                    v.edit= false;
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
                    for (var i = (this.currentPage -1) * this.pagesize; i < currentSize; i++) {
                        this.alllist[i].money
                        this.courselist.push(this.alllist[i]);
                    }
                }
                else{
                    this.listLoading = true;
                }
            })
        },
        handleSizeChange: function() {
            const self= this;
            self.courselist =[];
            const j = self.currentPage === Math.ceil(self.alllist.length / self.pagesize) ? self.alllist.length: self.currentPage * self.pageszie;
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
       updateCourse: function() {
           var self = this;
           for(var i in this.Chapterlist)
           {
               this.Chapterlist1.push({
                   monthCourseCatalogId:Number.parseInt(self.$route.query.monthcoursecatalogid),
                   bookId: Number.parseInt(self.$route.query.bookid),
                   chapterId: self.Chapterlist[i].id,
                   indexId: self.Chapterlist[i].indexId 
                   })
           }
           console.log(this.Chapterlist1)
           this.$http.post('http://reading.dingjiantaoke.cn/reading/coursemanager/createmcbcchapter',this.Chapterlist1)
               .then(function(res) {
                   var data = res.data;
                   if(data.code === 0){
                       self.$message('更新成功');
                   }
               })
               .catch(function(err) {
                   console.log(err);
                   self.$message('更新失败');
               })
               this.goCourseList();
       },
       goCourseList: function(){                    /// 提交完成后跳转到列表页面
          this.$router.push('/courselib/McbcChapterList?id='+ this.monthcoursecatalogid + '&bookid='+ this.bookid);
       },
       goback: function() {
           var courseid = Number.parseInt(this.$route.query.courseid);
           var monthcourseid = Number.parseInt(this.$route.query.monthcourseid);
          this.$router.push('/courselib/McbcChapterList?id=' + this.monthcoursecatalogid+ '&bookid='+ this.bookid +'&courseid='+courseid + '&monthcourseid='+ monthcourseid);
       },
       getuptoken:function() {
            var self = this;
            this.$http.get('http://wxmp.gatao.cn/mypic/gettoken')
                .then((response) => {
                var data = response.data;     
                self.uptoken = data.token;
                for(var i in self.reply)
                {
                    if(self.reply[i].msgType == 34){
                    self.uploadaudio(i);
                    }                    
                }

            })
            .catch((error) => {
            console.log(error)
            })
        },
        uploadaudio:function(val){
            var self = this;
            var uploader = Qiniu.uploader({
            runtimes: 'html5,flash,html4', //上传模式,依次退化
            browse_button: val+'audio', //上传选择的点选按钮，**必需**
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
            container: val, //上传区域DOM ID，默认是browser_button的父元素，
            max_file_size: '5mb', //最大文件体积限制
            flash_swf_url: 'qiniu/Moxie.swf', //引入flash,相对路径
            max_retries: 3, //上传失败最大重试次数
            dragdrop: true, //开启可拖曳上传
            drop_element: val, //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
            chunk_size: '4mb', //分块上传时，每片的体积
            auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
            filters: {
            mime_types: [
                {title : "Audio files", extensions : "mp3"} // 限定flv后缀上传格式上传
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
                self.reply[val].content = urlImg;
                console.log(self.audioUrl);
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
    created(){
       this.getList();
       this.getuptoken();
    }
}
</script>

<style>
input[type="checkbox"]
{
    width:20px;
    height:20px;
}
</style>