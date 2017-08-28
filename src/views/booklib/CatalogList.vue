<template>
  <div class="app-container calendar-list-container">
    <div style="width: 400px; padding: 10px">
      <el-button type="primary" size="small" @click="showaddcatalog = true" style="margin-bottom: 10px;">添加目录</el-button>
      <el-button type="primary" size="small" @click="goback()" style="margin-bottom: 10px;">返回</el-button>
    </div>

    <el-dialog title="更新目录" v-model="showupcatalog">
        <el-row :gutter="20" style="margin-bottom:20px;">
          <el-col :span="4">
            <label>书籍id:</label>
          </el-col>
          <el-col :span="20">
            <el-input type="number" v-model="updata.bookId"></el-input>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom:20px;">
          <el-col :span="4">
            <label>标题:</label>
          </el-col>
          <el-col :span="20">
            <el-input type="text" v-model="updata.title"  ></el-input>
          </el-col>
        </el-row>
        <el-row type="flex"  justify="center" >
          <el-col :span="6"><el-button type="primary" @click="update">确定</el-button></el-col>
          <el-col :span="6"><el-button type="primary" @click="showupcatalog = false">取消</el-button></el-col>
        </el-row>
    </el-dialog>

    <el-dialog title="更新目录" v-model="showaddcatalog">
        <el-row :gutter="20" style="margin-bottom:20px;">
          <el-col :span="4">
            <label>书籍id:</label>
          </el-col>
          <el-col :span="20">
            <el-select v-model="addData.bookId" filterable  placeholder="请选择" >
              <el-option
              v-for="item in booklist"
              :key="item.id"
              :label="item.bookName"
              :value="item.id">        
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom:20px;">
          <el-col :span="4">
            <label>标题:</label>
          </el-col>
          <el-col :span="20">
            <el-input type="text" v-model="addData.title"  ></el-input>
          </el-col>
        </el-row>
        <el-row type="flex"  justify="center" >
          <el-col :span="6"><el-button type="primary" @click="addcatalog">确定</el-button></el-col>
          <el-col :span="6"><el-button type="primary" @click="showaddcatalog = false">取消</el-button></el-col>
        </el-row>
    </el-dialog>

    <template>
      <el-table :data="cataloglist" v-loading.body="Loading" border fit highlight-current-row style="width: 100%">
        <el-table-column align="center" label="序号" width="80">
          <template scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="书籍id" width="80">
          <template scope="scope">
            <span>{{ scope.row.bookId }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="标题">
          <template scope="scope">
            <span>{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        
        <el-table-column align="center" label="创建时间">
          <template scope="scope">
            <span>{{ formate(scope.row.createdAt) }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" fixed="right">
          <template scope="scope">
            <el-button type="primary" size="small" @click="confirm(scope.row.id)">删除</el-button>
            <el-button type="primary" size="small" @click="showupdate(scope.row)">更新</el-button>
            <el-button type="primary" size="small" @click="gochapter(scope.row.id)">章节</el-button>
          </template>
        </el-table-column>
      </el-table>  
    </template>
        <div style="margin-bottom: 40px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage" :page-size = 'pagesize' ayout="total, prev, pager, next" :total = 'totalpage'></el-pagination>
       </div>
  </div>
</template>

<script>
import { fetchCatalog, fetchList } from 'api/article_table';

export default {
  data(){
    return{
      cataloglist:[],
      alllist: [],
      pagesize: 100,
      totalpage: 1,
      currentPage: 1,
      Loading: false,
      showupcatalog: false,
      showaddcatalog: false,
      updata:{
        id: null,
        bookId:null,
        title:''
      },
      addData:{
        bookId: null,
        title: ''
      },
      booklist:[]
    }
  },
  methods:{
    showupdate: function(val){
      console.log(val);
      this.showupcatalog = true;
      this.updata.id = val.id;
      this.updata.bookId = val.bookId;
      this.updata.title = val.title;
    },
    getlist:function(){
      var bookid = Number.parseInt(this.$route.params.id);
      fetchCatalog(bookid).then((response) =>{
        var data = response.data;
        if(data.code == 0){
          this.alllist = data.data;
          this.totalpage = this.alllist.length;
          this.cataloglist = [];
          var currentSize = this.currentPage * this.pagesize;
          if(currentSize > this.alllist.length){
            currentSize = this.alllist.length;
          }
          for(var i=(this.currentPage -1) * this.pagesize; i< currentSize; i++) {
            this.cataloglist.push(this.alllist[i]);
          }
        }
      })
    },
    getbooklist: function(){
      var self = this;
      fetchList().then(function(response){
        var data = response.data;
        if(data.code == 0){
          self.booklist = data.data;
        }
        console.log(self.booklist);
      })
    },
    addcatalog: function (){
      var self = this;
      if(self.addData.bookId == null || self.addData.title == ''){
        self.$message("请填写完整信息");
        return false;
      }
      else{
        this.$http.post('http://reading.dingjiantaoke.cn/reading/coursemanager/createbookcatalog',{
          bookId: Number.parseInt(self.addData.bookId),
          title: self.addData.title
        })
          .then(function(res){
            var data = res.data;
            if(data.code == 0){
              self.$message('提交成功');
              self.getlist();
              self.showaddcatalog = false;
            }
            else{
              self.$message('提交失败');
            }
          }).catch(function(err){
            console.log(err);
            self.$message('提交失败');
          })
      }
    },
    goback: function() {
      this.$router.push('/booklib/BookList');
    },
    gochapter: function(val) {
      var id = Number.parseInt(this.$route.params.id);
      this.$router.push({ name: '目录章节', params:{bookCatalogid: val, bookid: id}});
    },
    handleSizeChange: function() {
      const self = this
      self.cataloglist = []
      const j = self.currentPage === Math.ceil(self.alllist.length / self.pagesize) ? self.alllist.length : self.currentPage * self.pagesize
      for (let i = (self.currentPage - 1) * self.pagesize; i < j; i++) {
        self.cataloglist.push(self.alllist[i])
      }
    },
    handleCurrentChange: function(val) {
      const self = this
      self.cataloglist = []
      const j = val === Math.ceil(self.alllist.length / self.pagesize) ? self.alllist.length : val * self.pagesize
      for (let i = (val - 1) * self.pagesize; i < j; i++) {
        self.cataloglist.push(self.alllist[i])
      }
    },
    formate: function (t) {
      var d = new Date(t * 1000);
      var year = d.getFullYear();
      var day = d.getDate();
      var month = d.getMonth() + 1;
      var hour = d.getHours();
      var minute = d.getMinutes();
      var f = year + "-" + this.init(month) + "-" + this.init(day) + " " + this.init(hour) + ":" + this.init(minute);
      return f;
    },
    init: function (d) {
      return d > 9 ? d : "0" + d;
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
      this.$http.post('http://reading.dingjiantaoke.cn/reading/coursemanager/deletebookcatalog',{
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
    },
    update:function(){
      console.log(this.updata.bookId);
      console.log(this.updata.title);
      var self = this;
      if(self.updata.bookId == null || self.updata.title == ''){
        self.$message('请填写完整信息');
        return false;
      }
      else{
        this.$http.post('http://reading.dingjiantaoke.cn/reading/coursemanager/updatebookcatalog',{
          bookId: Number.parseInt(this.updata.bookId),
          id: Number.parseInt(this.updata.id),
          title: this.updata.title
        })
          .then(function(res){
            var data = res.data;
            if(data.code == 0){
              self.$message('更新成功');
              self.showupcatalog = false;
              self.getlist();
            }
          })
          .catch(function(err){
            console.log(err);
            self.$message('更新失败');
          })
      }
    }
  },
  created(){
    this.getlist();
    this.getbooklist();
    this.addData.bookId = Number.parseInt(this.$route.params.id);
  }
}
</script>

<style>
  
</style>
