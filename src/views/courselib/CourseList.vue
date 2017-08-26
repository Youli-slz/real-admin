<template>
    <div class="app-container calerndar-list-container">
        <div style="width: 400px;padding: 10px">
            <el-button type="primary" size="small" @click="goAdd()" style="margin-buttom: 10px">添加课程</el-button>
        </div>
        <template>
            <el-table :data="courselist" v-loading.body = "listLoading" border fit highlight-current-row style="width:100%">
                <el-table-column align="center" label="序号" width="80">
                    <template scope="scope">
                      <span>{{ scope.row.id }}</span>
                    </template>
                </el-table-column>

                <el-table-column width="220px" align="center" label="课程">
                    <template scope="scope"> 
                        <el-input type="text" v-show="scope.row.edit" size v-model="scope.row.name"></el-input>
                        <span v-show="!scope.row.edit">{{ scope.row.name }}</span>
                    </template>
                </el-table-column>

                <el-table-column width="180px" align="center" label="图片">
                    <template scope="scope">
                        <div class="am-form-group an-form-file" :id="scope.$index" v-show="scope.row.edit">
                            <label type="button" class="btn btn-default" :for="scope.$index + 'img'">
                                <i class="glyphicon glyphicon-open-file"></i>请点击选择图片
                                <input type="file" :id="scope.$index + 'img'" style="display:none;"/>
                            </label>
                            <img :src="CourseCover" alt="" width="100">
                        </div>
                        <img  v-show="!scope.row.edit" :src="scope.row.cover" alt="" width="100">
                    </template>
                </el-table-column>

                <el-table-column min-width="150" align="center" label="简介">
                    <template scope="scope">
                        <el-input type="textarea" :rows="3" v-show="scope.row.edit" size="small" v-model="scope.row.introduction"></el-input>
                        <span v-show="!scope.row.edit"> {{ scope.row.introduction }}</span>
                    </template>
                </el-table-column>

                <el-table-column min-width="150" align="center" label="时间">
                    <template scope="scope">
                        <div class=""  v-show="scope.row.edit">
                            <span>开始时间</span><el-date-picker  v-model="NewStartTime" type="datetime" format="yyyy-MM-dd" placeholder="选择日期时间" ></el-date-picker> <br>
                            <span>结束时间</span><el-date-picker v-model="NewEndTime" type="datetime" format="yyyy-MM-dd " placeholder="选择日期时间"></el-date-picker>
                        </div>
                        <span v-show="!scope.row.edit"> {{ scope.row.startTime | timeStemp}} / {{ scope.row.endTime | timeStemp}}</span>
                    </template>
                </el-table-column>

                <el-table-column min-width="80" align="center" label="费用">
                    <template scope="scope">
                        <el-input type="text" v-show="scope.row.edit" v-model="scope.row.money"></el-input>
                        <span v-show="!scope.row.edit">{{ scope.row.money }}</span>
                    </template>
                </el-table-column>

                <el-table-column width="250" align="center" label="操作">
                    <template scope="scope">
                        <el-button type="primary" v-show="!scope.row.edit" @click='goDetail(scope.row.id)' size="small" icon="search">详情</el-button>
                        <el-button type="primary" v-show="!scope.row.edit" @click='tasktime(scope.row.startTime,scope.row.endTime),scope.row.edit=true' size="small"  icon="edit">更新</el-button>
                        <el-button type="primary" v-show="scope.row.edit" @click='updateCourse(scope.row),scope.row.edit=false' size="small" icon="check">确定</el-button>
                        <el-button type="primary" v-show="scope.row.edit" @click='scope.row.edit=false' size="small" icon="check">取消</el-button>
                        <el-button type="primary" v-show="!scope.row.edit" @click='confirm(scope.row.id)' size="small" icon="close">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <div style="margin-bottom: 40px;">
            <el-pagination 
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage" :page-size='pagesize' ayout="total, prev, pager, next" :total = 'totalpage'></el-pagination>
        </div>
    </div>
</template>

<script>
import { fetchCourseList } from 'api/article_table';    /// 调用获取列表的接口方法

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
            CourseCover: '',
            uptoken: '',
            courseimg: '',
            NewStartTime: null,
            NewEndTime: null,
            startT: null,
            endT : null,
            oldStartTime: null,
            oldendTime: null

        }
    },
    filters:{
        timeStemp: function(val) {
            let d = new Date(parseInt(val) * 1000)
            return (d.getFullYear()) + '-' + (d.getMonth() + 1 > 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)) + '-' + (d.getDate() > 9 ? d.getDate() : '0' + d.getDate())
        }
    },
    methods: {
        tasktime: function(start,end) {
            this.oldStartTime = start;
            this.oldendTime = end;
        },
        getList: function() {
            this.listLoading = true;
            fetchCourseList().then(response => {
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
                    for(var n = 0; n < this.alllist.length; n++) {
                        this.alllist[n].money = this.alllist[n].money / 100.0;
                        console.log(this.alllist[n].money);
                    }
                    for (var i = (this.currentPage -1) * this.pagesize; i < currentSize; i++) {
                        this.alllist[i].money
                        this.courselist.push(this.alllist[i]);
                    }
                    this.getuptoken();
                }
                else{
                    this.listLoading = true;
                }
            })
        },
        goDetail: function( val ) {
            // this.$router.push('/courselib/CourseDetailList?courseid=' + val);
            this.$router.push({name:'课程月份目录列表', params:{courseid: val}});
        },
        goAdd: function() {
            this.$router.push('/courselib/AddCourse');
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
        confirm(val) {
            var self = this;
            this.$confirm('是否删除？','提示', {
                conofirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                self.delet(val)
            }).catch(() => {});
       },
        delet: function(val) {                               /// 删除书本的函数
          var self = this
          this.$http.post('http://reading.dingjiantaoke.cn/reading/coursemanager/deletecourse', { id: val })   // 需要添加删除的后台url
              .then(function(res) {
                var data = res.data;
                if (data.code === 0) {
                  self.$message('删除成功');
                  this.getList();
                }
                else {
                  self.$message('删除失败');
                }
              })
              .catch(function(err){
                console.log(err);
                self.$message('删除失败');
              })
        },
        getuptoken: function() {                                    /// 从后台获取向qiniu传图片所必需的token，返回相应的key
          var self = this;
          this.$http.get('http://wxmp.gatao.cn/mypic/gettoken')    /// 通过get方法获取token
             .then((response) => {
           var data = response.data;       /// 解析从后台得到的数据
           self.uptoken = data.token;    /// 将token赋值给外部变量， 以便其他的方法的调用
            for(var i in self.alllist) 
            {
                self.upload(i);
            }
            
            })
            .catch((error) => {
                console.log(error)      /// 错误在控制台输出
            })           
        },
        upload: function(val) {             /// 通过qiniu上传图片函数
          var self = this;
          var uploader = Qiniu.uploader({
          runtimes: 'html5,flash,html4', //上传模式,依次退化
          browse_button: val+'img' , //上传选择的点选按钮，**必需**
          uptoken: self.uptoken,
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
            mime_types: [{
                title: "Image files",
                extensions: "jpg,png,x-icon,gif,jpeg"
              } // 限定flv后缀上传格式上传
            ]
          },
          multi_selection: true,
          init: {
            'UploadProgress': function(up, file) { //上传中
            },
            'FileUploaded': function(up, file, info) {
              var domain = up.getOption('domain');
              var res = JSON.parse(info);
              var urlImg = 'http://7xld1x.com1.z0.glb.clouddn.com/' + res.key;
              // console.log("img="+urlImg);
              file.imgUrl = urlImg;
              console.log(urlImg);
              self.CourseCover = urlImg;
              console.log(self.CourseCover)
              // console.log(self.files[0].imgUrl)
            },
            'Error': function(up, err, errTip) {
              //上传出错时，处理相关的事情
              console.log("上传出错，请刷新重新上传");
            }
          }       
         });
       },
        //中国标准时间转换成时间戳
        formatTen:function (num) { 
        return num > 0 ? (num + "") : ("0" + num); 
        },
        timeChange: function(date){
          var year = date.getFullYear(); 
          var month = date.getMonth() + 1; 
          var day = date.getDate(); 
          var hour = date.getHours(); 
          var minute = date.getMinutes(); 
          var second = date.getSeconds(); 
          return year + "-" + this.formatTen(month) + "-" + this.formatTen(day);    
        },
       updateCourse: function(val) {
           var self = this;
           if(self.NewStartTime == null){
             self.startT = this.oldStartTime;
             self.endT =  this.oldendTime;
           }
           else{
             var Stime = self.timeChange(self.NewStartTime);
             var Etime = self.timeChange(self.NewEndTime);

                self.startT = new Date(Stime).getTime()/1000;
                self.endT = new Date(Etime).getTime()/1000;
           }

           if(self.CourseCover != ""){
               self.courseimg = self.CourseCover;
           }
           else{
               self.courseimg = val.cover
           }
           this.$http.post('http://reading.dingjiantaoke.cn/reading/coursemanager/updatecourse',{
               id: val.id,
               courseType: Number.parseInt(val.courseType),
               courseNum: Number.parseInt(val.courseNum),
               name: val.name,
               introduction: val.introduction,
               cover: self.courseimg,
               startTime: self.startT,
               endTime: self.endT,
               money: val.money*100
           })
               .then(function(res) {
                   var data = res.data;
                   if(data.code === 0){
                       self.$message('更新成功');
                       self.getList();
                   }
               })
               .catch(function(err) {
                   console.log(err);
                   self.$message('更新失败');
               })
       }
    },
    created(){
       this.getList();
    }
}
</script>