<template>
    <div class="app-container calerndar-list-container">
        <el-row :gutter="20">
            <el-col :xs="8" :sm="6" :md="4" :lg="4">
               <el-button type="primary" @click="goAdd()" style="margin-buttom: 10px">添加课程月份书籍目录</el-button>
            </el-col>
            <el-col :xs="8" :sm="6" :md="4" :lg="3">
                <el-button type="primary"  @click="goback()">返回</el-button>
            </el-col>
        </el-row>
        <br/>
        <template>
            <el-table :data="courselist" v-loading.body = "listLoading" border fit highlight-current-row style="width:100%">
                <el-table-column align="center" label="序号" width="80">
                    <template scope="scope">
                        <el-input type="text" v-show="scope.row.edit" size v-model="scope.row.indexId"></el-input>
                        <span v-show="!scope.row.edit">{{ scope.row.indexId }}</span>
                    </template>
                </el-table-column>

                <el-table-column width="120px" align="center" label="课程ID">
                    <template scope="scope"> 
                        <el-input type="text" v-show="scope.row.edit" size v-model="scope.row.courseId"></el-input>
                        <span v-show="!scope.row.edit">{{ scope.row.courseId }}</span>
                    </template>
                </el-table-column>

                <el-table-column width="120px" align="center" label="书籍ID">
                    <template scope="scope"> 
                        <el-input type="text" v-show="scope.row.edit" size v-model="scope.row.bookId"></el-input>
                        <span v-show="!scope.row.edit">{{ scope.row.bookId }}</span>
                    </template>
                </el-table-column>

                <el-table-column min-width="300" align="center" label="标题">
                    <template scope="scope">
                        <el-input type="textarea" :rows="3" v-show="scope.row.edit" size="small" v-model="scope.row.title"></el-input>
                        <span v-show="!scope.row.edit"> {{ scope.row.title }}</span>
                    </template>
                </el-table-column>

                <el-table-column min-width="300" align="center" label="任务时间">
                    <template scope="scope">
                        <div class=""  v-show="scope.row.edit">
                           <el-date-picker  v-model="NewTaskTime" type="datetime" format="yyyy-MM-dd" placeholder="选择日期时间" ></el-date-picker> <br>
                        </div>
                        <span v-show="!scope.row.edit"> {{ scope.row.taskTime | timeStemp}}</span>
                    </template>
                </el-table-column>

                <el-table-column min-width="300" align="center" label="创建时间">
                    <template scope="scope">
                        <span>{{ scope.row.createdAt | timeStemp}}</span>
                    </template>
                </el-table-column>

                <el-table-column width="250" align="center" label="操作">
                    <template scope="scope">
                        <el-button type="primary" v-show="!scope.row.edit" @click='goDetail(scope.row)' size="small" icon="search">详情</el-button>
                        <el-button type="primary" v-show="!scope.row.edit" @click='tasktime(scope.row.taskTime),scope.row.edit=true' size="small"  icon="edit">更新</el-button>
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
import { fetchmcbcataloglist } from 'api/article_table';    /// 调用获取列表的接口方法

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
            monthcourseid: null,
            bookid: null,
            lastIndex: null,
            oldTaskTime:null

        }
    },
    filters:{
        timeStemp: function(val) {
          let d = new Date(parseInt(val) * 1000)
            return (d.getFullYear()) 
            + '-' 
            + (d.getMonth() + 1 > 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)) 
            + '-' 
            + (d.getDate() > 9 ? d.getDate() : '0' + d.getDate())
            + ' '
            + (d.getHours() > 9 ? d.getHours() : '0' + d.getHours())
            + ':'
            + (d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes())
            + ':'
            + (d.getSeconds() > 9 ? d.getSeconds() : '0' + d.getSeconds())
        }
    },
    methods: {
        tasktime:function(val){
            this.oldTaskTime = val;
            console.log(this.oldTaskTime)
        },
        getList: function() {
            this.courseid = Number.parseInt(this.$route.params.courseid);
            this.monthcourseid = Number.parseInt(this.$route.params.monthcourseid);
            this.bookid = Number.parseInt(this.$route.params.bookid);
            fetchmcbcataloglist(this.courseid, this.monthcourseid, this.bookid).then(response => {
                this.list = response.data.data.map(v =>{
                    v.edit = false;
                    return v;
                })
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
                    for(var i= 0; i< this.alllist.length; i++){
                        if(i == this.alllist.length-1){
                            this.lastIndex = this.alllist[i].indexId;
                            console.log(this.lastIndex);
                        }
                    }
                }
                else{
                    this.listLoading = true;
                }
            })
        },
        goDetail: function( val ) {
            // this.$router.push('/courselib/McbcChapterList?id=' + val.id+ '&bookid='+ this.bookid + '&courseid=' + this.courseid + '&monthcourseid='+this.monthcourseid);
            this.$router.push({name:'月份书籍章节', params:{id: val.id, bookid: this.bookid, courseid: this.courseid, monthcourseid: this.monthcourseid}})
        },
        goAdd: function() {
            if(this.lastIndex == null){
                this.lastIndex = 0;
            }
            console.log(this.lastIndex);
            this.$router.push({name:'添加月份书籍目录', params: {courseid: this.courseid, monthcourseid: this.monthcourseid,bookid: this.bookid,indexid: this.lastIndex}});
        },
        goback: function() {
            // this.$router.push('/courselib/McBookList?courseid='+ this.courseid + '&monthcourseid='+this.monthcourseid)
            this.$router.push({name:'月份书籍列表', params: {courseid: this.courseid, monthcourseid: this.monthcourseid}});
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
          this.$http.post('http://reading.dingjiantaoke.cn/reading/coursemanager/deletemcbcatalog', { id: val })   // 需要添加删除的后台url
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
        //中国标准时间转换成时间格式
        formatTen:function (num) { 
        return num > 0 ? (num + "") : ("0" + num); 
        },
        timeChange: function(date){
          var year = date.getFullYear(); 
          var month = date.getMonth() + 1; 
          var day = date.getDate(); 
          var hour = 0; 
          var minute = 0; 
          var second = 0; 
          return year + "-" + this.formatTen(month) + "-" + this.formatTen(day) + " " + this.formatTen(hour) + ":" + this.formatTen(minute);    
        },
       updateCourse: function(val) {
           var self = this;
           if(self.NewTaskTime == null){
               self.taskT = this.oldTaskTime;
           }
           else{
                var Stime = self.timeChange(self.NewTaskTime);
                self.taskT = Date.parse(Stime)/1000;
            }

            console.log(self.taskT);
           this.$http.post('http://reading.dingjiantaoke.cn/reading/coursemanager/updatemcbcatalog',{
               id: val.id,
               courseId: Number.parseInt(val.courseId),
               monthCourseId: Number.parseInt(val.monthCourseId),
               bookId: Number.parseInt(val.bookId),
               indexId: Number.parseInt(val.indexId),
               title: val.title,
               taskTime: self.taskT,
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