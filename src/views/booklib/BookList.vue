<template>
  <div class="app-container calendar-list-container">
    <div style="width: 400px;padding: 10px">
          <el-button type="primary" size="small" @click="goAdd()" style="margin-bottom: 10px">添加图书</el-button>
    </div>
   <template>
    <el-table :data="booklist" v-loading.body="listLoading" border fit highlight-current-row  style="width: 100%">

      <el-table-column align="center" label="序号" width="80">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column width="220px" align="center" label="书籍">
        <template scope="scope">
          <span>{{scope.row.bookName}}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="作者">
        <template scope="scope">
          <span>{{scope.row.author}}</span>
        </template>
      </el-table-column>
      
      <el-table-column width="180px" align="center" label="图片">
        <template scope="scope">
          <img :src="scope.row.cover" alt="" width="100">
        </template>
      </el-table-column>

      <el-table-column min-width="300px" align="center" label="简介">
        <template scope="scope">
          <el-input v-show="scope.row.edit" size="small" v-model="scope.row.title"></el-input>
          <span v-show="!scope.row.edit">{{ scope.row.abstract }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="编辑" width="320">
        <template scope="scope">
          <el-button  type="primary" @click='goDetail(scope.row.id)' size="small" icon="edit">编辑</el-button>
          <el-button type="primary"  @click='confirm(scope.row.id)' size="small" icon="close">删除</el-button>
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
    import { fetchList } from 'api/article_table';    /// 调用获取列表的接口方法

    export default {
      name: 'booklist',
      data() {
        return {
          list: null,
          listLoading: true,
          listQuery: {
            page: 1,
            limit: 10
          },
          alllist: [],
          booklist: [],
          pagesize: 100,
          totalpage: 2,
          currentPage: 1
        }
      },
      created() {
        this.getList();
      },
      methods: {
        getList() {                               /// 调用api中的方法，从后台得到书籍的列表
          this.listLoading = true;
          fetchList().then(response => {
            this.list = response.data.data.map(v => {
              v.edit = false;
              return v
            });
            if (response.data.code === 0) {
              this.listLoading = false
              this.alllist = this.list      // 将得到的数据传给alllist数组
              this.totalpage = this.list.length
              this.booklist = []
              var currentSize = this.currentPage * this.pagesize    // 当前页数乘每一页的数据条数
              if (currentSize > this.alllist.length) {            // 当整个数组的长度比currentSize多时，
                currentSize = this.alllist.length                   // currentSize即为整个列表的长度
              }
              for (var i = (this.currentPage - 1) * this.pagesize; i < currentSize; i++) {
                this.booklist.push(this.alllist[i])
              }
            }
          })
        },
        goDetail: function(val) {                              /// 跳转到书本的章节列表页面，同时传一个书的id给章节列表页面
          this.$router.push('/booklib/ListDetail?id=' + val)
        },
        goAdd: function() {                                 /// 跳转到书本增加的页面
          this.$router.push('/booklib/AddBook')
        },
        handleSizeChange: function() {
          const self = this
          self.booklist = []
          const j = self.currentPage === Math.ceil(self.alllist.length / self.pagesize) ? self.alllist.length : self.currentPage * self.pagesize
          for (let i = (self.currentPage - 1) * self.pagesize; i < j; i++) {
            self.booklist.push(self.alllist[i])
          }
        },
        handleCurrentChange: function(val) {
          const self = this
          self.booklist = []
          const j = val === Math.ceil(self.alllist.length / self.pagesize) ? self.alllist.length : val * self.pagesize
          for (let i = (val - 1) * self.pagesize; i < j; i++) {
            self.booklist.push(self.alllist[i])
          }
        },
        confirm(val) {
          var self = this
          this.$confirm('是否删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            self.delet(val)
          }).catch(() => {
          });
        },
        delet: function(val) {                               /// 删除书本的函数
          var self = this
          this.$http.post('', { id: val })   // 需要添加删除的后台url
              .then(function(res) {
                var data = res.data
                if (data.code === 0) {
                  self.$message('删除成功')
                }
                else {
                  self.$message('删除失败')
                }
              })
              .catch(function(err){
                console.log(err)
                self.$message('删除失败')
              })
        }
      }
    }
</script>
