<template>
    <div class="app-container calerndar-list-container">
        <div style="width: 400px;padding: 10px">
            <el-button type="primary" size="small" @click="goAdd()" style="margin-buttom: 10px">新建课程月份</el-button>
        </div>
        <template>
            <el-table :data="courselist" v-loading.body = "listLoading" border fit highlight-current-row style="width:100%">
                <el-table-column align="center" label="序号" width="80">
                    <template scope="scope">
                      <span>{{ scope.row.indexId }}</span>
                    </template>
                </el-table-column>

                <el-table-column width="150px" align="center" label="标题">
                    <template scope="scope"> 
                        <el-input type="text" v-show="scope.row.edit" size v-model="scope.row.title"></el-input>
                        <span v-show="!scope.row.edit">{{ scope.row.title }}</span>
                    </template>
                </el-table-column>

                <el-table-column width="80px" align="center" label="年份">
                    <template scope="scope"> 
                        <el-input type="text" v-show="scope.row.edit" size v-model="scope.row.year"></el-input>
                        <span v-show="!scope.row.edit">{{ scope.row.year }}</span>
                    </template>
                </el-table-column>

                <el-table-column width="80px" align="center" label="月份">
                    <template scope="scope"> 
                        <el-input type="text" v-show="scope.row.edit" size v-model="scope.row.month"></el-input>
                        <span v-show="!scope.row.edit">{{ scope.row.month }}</span>
                    </template>
                </el-table-column>

                <el-table-column width="100px" align="center" label="En月份">
                    <template scope="scope"> 
                        <el-input type="text" v-show="scope.row.edit" size v-model="scope.row.monthEn"></el-input>
                        <span v-show="!scope.row.edit">{{ scope.row.monthEn }}</span>
                    </template>
                </el-table-column>

                <el-table-column min-width="300" align="center" label="简介">
                    <template scope="scope">
                        <el-input type="textarea" :rows="3" v-show="scope.row.edit" size="small" v-model="scope.row.introduction"></el-input>
                        <span v-show="!scope.row.edit"> {{ scope.row.introduction }}</span>
                    </template>
                </el-table-column>

                <el-table-column min-width="200" align="center" label="创建时间">
                    <template scope="scope">
                        <span>{{ scope.row.createdAt | timeStemp}}</span>
                    </template>
                </el-table-column>

                <el-table-column width="320" align="center" label="操作">
                    <template scope="scope">
                        <el-button type="primary" v-show="!scope.row.edit" @click='goMcbooklist(scope.row.id)' icon="search">详情</el-button>
                        <el-button type="primary" v-show="!scope.row.edit" @click='scope.row.edit=true'  icon="edit">更新</el-button>
                        <el-button type="primary" v-show="scope.row.edit" @click='updateCourse(scope.row),scope.row.edit=false'  icon="check">确定</el-button>
                        <el-button type="primary" v-show="scope.row.edit" @click='scope.row.edit=false'  icon="check">取消</el-button>
                        <el-button type="primary" v-show="!scope.row.edit" @click='confirm(scope.row.id)' icon="close">删除</el-button>
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
import { fetchmcourselist } from 'api/article_table';    /// 调用获取列表的接口方法

export default {
    name: 'courselist',
    data() {
        return {
            list: null,
            listLoading: false,    /// 暂时改为false， 是等待的旋转框不出现
            alllist: [],
            courselist: [],
            pagesize: 100,    // 每页有一百列
            totalpage:1,
            currentPage:1,
            lastIndex: null
        }
    },
    filters:{
        timeStemp: function(val) {        // 将时间戳转换为正常时间的过滤器 显示的格式是 YYYY-mm-dd HH:ii:ss
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
        getList: function() {
            // this.listLoading = false;
            var courseid = Number.parseInt(this.$route.query.courseid);
            fetchmcourselist(courseid).then(response => {
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
                    for(var i= 0; i< this.alllist.length; i++){
                        if(i == this.alllist.length-1){
                            this.lastIndex = this.alllist[i].indexId;
                            console.log(this.lastIndex);
                        }
                    }
                }
                else {
                    this.listLoading = true;
                }
            })
        },
        goMcbooklist: function( val ) {
            var courseid = Number.parseInt(this.$route.query.courseid);
            this.$router.push('/courselib/McBookList?courseid='+courseid + '&monthcourseid='+val);
        },
        goAdd: function() {
            if(this.lastIndex == null){
                this.lastIndex = 0;
            }
            var courseid = Number.parseInt(this.$route.query.courseid);
            this.$router.push('/courselib/AddMCourse?courseid='+courseid + '&indexid=' + this.lastIndex);
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
          this.$http.post('http://reading.dingjiantaoke.cn/reading/coursemanager/deletemcourse', { id: val })   // 需要添加删除的后台url
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
       updateCourse: function(val) {
           var self = this;
           console.log(val.id);
           this.$http.post('http://reading.dingjiantaoke.cn/reading/coursemanager/updatemcourse',{
               id: val.id,
               courseId: val.courseId,
               indexId: val.indexId,
               year: val.year,
               month: val.month,
               title: val.title,
               introduction: val.introduction,
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