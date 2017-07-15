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
            <!-- <span v-for="item in Chapterlist">{{ item.id }}, </span> -->

        </template>
        <div style="margin-bottom: 40px;">
            <el-pagination 
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage" :page-size='pagesize' ayout="total, prev, pager, next" :total = 'totalpage'></el-pagination>
        </div>

        <el-button @click='updateCourse'>创建</el-button>
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
            checkall: false

        }
    },
    methods: {
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
          this.$router.push('/courselib/McbcChapterList?id=' + this.monthcoursecatalogid+ '&bookid='+ this.bookid);
       }
    },
    created(){
       this.getList();
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