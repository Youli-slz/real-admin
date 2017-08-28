<template>
  <div class="app-container calendar-list-container">
    <div style="width: 400px; padding: 10px">
      <el-button type="primary" size="small" @click="showaddchapter = true" style="margin-bottom: 10px;">添加目录</el-button>
      <el-button type="primary" size="small" @click="goback()" style="margin-bottom: 10px;">返回</el-button>
    </div>
  
    <el-dialog title="新增目录章节" v-model="showaddchapter">
      <div class="caozuo" style="margin-bottom:20px;">
        <el-button type="primary" @click="addchapter">添加</el-button>
        <el-button type="primary" @click="showaddchapter = false">取消</el-button>
      </div>
      <template>
        <el-checkbox-group v-model="chapter">
          <input type="checkbox" @click="checkAll()">全选&nbsp;&nbsp;
          (已选章节数{{ chapter.length }})

          <el-table :data="chapterlist" style="width: 100%;margin-bottom: 80px" v-loading="lloading" element-loading-text="拼命加载中" >
            <el-table-column table="章节序号">
              <template scope="scope">
                <!-- <el-checkbox :label="scope.row.indexId"></el-checkbox> -->
                <input type="checkbox" :id="scope.row.id" :value="scope.row" v-model="chapter">
              </template>
            </el-table-column>

            <el-table-column align="center" label="标题">
              <template scope="scope">
                <span>{{ scope.row.title }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-checkbox-group>
      </template>
    </el-dialog>
  
    <template>
      <el-table :data="catachapterlist" v-loading.body="Loading" border fit highlight-current-row style="width: 100%">
        <el-table-column align="center" label="章节序号" width="120">
          <template scope="scope">
            <span>{{ scope.row.indexId }}</span>
          </template>
        </el-table-column>
  
        <el-table-column align="center" label="书籍id">
          <template scope="scope">
            <span>{{ scope.row.bookId }}</span>
          </template>
        </el-table-column>
  
        <el-table-column align="center" label="目录id">
          <template scope="scope">
            <span>{{scope.row.bookCatalogId}}</span>
          </template>
        </el-table-column>
  
        <el-table-column align="center" label="操作" fixed="right">
          <template scope="scope">
            <el-button type="primary" size="small" @click="confirm(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div style="margin-bottom: 40px">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size='pagesize' ayout="total, prev, pager, next" :total='totalpage'></el-pagination>
    </div>
  </div>
</template>

<script>
import { fetchcatachapter,fetchChapterList } from 'api/article_table';

export default {
  data() {
    return {
      showaddchapter: false,
      lloading:false,
      catachapterlist: [],
      Loading: false,
      alllist: [],
      pagesize: 100,
      totalpage: 1,
      currentPage: 1,
      chapterlist:[],
      chapter:[],         // 储存选中的章节id
      ischeckall:false, // 全选按钮是否选中
      checkall: false,
      numpack:[]
    }
  },
  methods: {
    addchapter: function(){
      var self = this;
      this.numpack = [];
      for(var i in this.chapter){
        this.numpack.push({
          bookCatalogId: Number.parseInt(this.$route.params.bookCatalogid),        // 书籍目录唯一id
          bookId: Number.parseInt(this.$route.params.bookid),                // 书籍id
          chapterId: self.chapter[i].id,             // 章节id
          indexId: self.chapter[i].indexId
        })
      }
      console.log(this.numpack);
      this.$http.post('http://reading.dingjiantaoke.cn/reading/coursemanager/createbcchapters',this.numpack)
        .then(function(res){
          var data = res.data;
          if(data.code == 0){
            self.$message('添加成功');
            self.showaddchapter = false;
            self.chapter = [];
            self.getlist();
          }
          else{
            self.$message('添加失败');
          }
        })
          .catch(function(err){
            console.log(err);
            self.$message('添加失败');
          })
    },
    goback: function () {
      var bookid = Number.parseInt(this.$route.params.bookid);
       this.$router.push({name:'书籍目录', params: {id: bookid}});
    },
    getlist: function () {
      var bookCatalogid = Number.parseInt(this.$route.params.bookCatalogid);
      fetchcatachapter(bookCatalogid).then((response) => {
        var data = response.data;
        if (data.code == 0) {
          this.alllist = data.data;
          this.totalpage = this.alllist.length;
          this.catachapterlist = [];
          var currentSize = this.currentPage * this.pagesize;
          if (currentSize > this.alllist.length) {
            currentSize = this.alllist.length;
          }
          for (var i = (this.currentPage - 1) * this.pagesize; i < currentSize; i++) {
            this.catachapterlist.push(this.alllist[i]);
          }
        }
      })
    },
    handleSizeChange: function () {
      const self = this
      self.catachapterlist = []
      const j = self.currentPage === Math.ceil(self.alllist.length / self.pagesize) ? self.alllist.length : self.currentPage * self.pagesize
      for (let i = (self.currentPage - 1) * self.pagesize; i < j; i++) {
        self.catachapterlist.push(self.alllist[i])
      }
    },
    handleCurrentChange: function (val) {
      const self = this
      self.catachapterlist = []
      const j = val === Math.ceil(self.alllist.length / self.pagesize) ? self.alllist.length : val * self.pagesize
      for (let i = (val - 1) * self.pagesize; i < j; i++) {
        self.catachapterlist.push(self.alllist[i])
      }
    },
    getchapterList:function(){
      var bookid = Number.parseInt(this.$route.params.bookid);
      var self = this;
      fetchChapterList(bookid).then(function(response){
        var data = response.data;
        self.chapterlist = [];
        if(data.code == 0){
          self.chapterlist = data.data;
        }
      })
    },
    checkAll:function() {
      if(!this.checkall){
        this.chapter = [];
        this.chapterlist.forEach((item) =>{
          this.chapter.push(item);
        });
        this.checkall= true;
      }
      else{
        this.chapter = [];
        this.checkall = false;
      }
    },
    confirm:function(val){
      var self = this;
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=> {
        self.delete(val);
      }).catch(() => {
      })
    },
    delete:function(val){
      var self= this;
      this.$http.post('http://reading.dingjiantaoke.cn/reading/coursemanager/deletebcchapter',{
        id: val
      })
      .then(function(res){
        var data = res.data;
        if(data.code == 0){
          self.$message('删除成功');
          self.getlist();
        }
        else{
          self.$message('删除失败');
        }
      })
      .catch(function(err){
        console.log(err);
        self.$message('删除失败');
      })
    }
  },
  created() {
    this.getlist();
    this.getchapterList();
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
