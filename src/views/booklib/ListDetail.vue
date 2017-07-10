<template>
  <div class="app-container">
  <div style="width: 400px;padding: 10px">
          <el-button type="primary" size="small" v-on:click="goAddSection" style="margin-bottom: 10px">添加章节</el-button>
    </div>
    <!--<button v-on:click="test" class="hidden">获取url按钮</button>-->
   <br>
   <template>
    <el-table :data="cataloglist"  border fit highlight-current-row  style="width: 100%">

      <el-table-column align="center" label="序号" width="200">
        <template scope="scope">
          <span>{{scope.row.indexId}}</span>
        </template>
      </el-table-column>

      <el-table-column width="800px" align="center" label="章节">
        <template scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="编辑" width="320">
        <template scope="scope">
          <el-button type="primary" @click='goDetail(scope.row.id)' size="small" icon="edit">编辑</el-button>
          <el-button type="primary" @click='confirm(scope.row.id)' size="small" icon="close">删除</el-button>
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
  import { fetchChapterList } from 'api/article_table';

  export default {
    name: 'book_list_detail',
    data() {
      return {
        id: '',
        article: [],
        cataloglist: [],
        pagesize: 100,
        totalpage: 8,
        currentPage: 1,
        list:[]
      }
    },
    methods: {
      // test: function() {
      //   this.id = Number.parseInt(this.$route.query.id)   // 获取URL上的id的值，并将这个id赋值给自己定义的id
      //   console.log(this.id)
      // },
      getList() {
        this.id = Number.parseInt(this.$route.query.id);
        this.listLoading = true;
        fetchChapterList(this.id).then(response => {
          this.list = response.data.data.map(v => {
            v.edit = false;
            return v
          });
          if (response.data.code === 0) {
            this.listLoading = false;
            this.article = this.list;     // 将得到的数据传给alllist数组
            this.totalpage = this.list.length;
            this.cataloglist = [];
            var currentSize = this.currentPage * this.pagesize;    // 当前页数乘每一页的数据条数
            if (currentSize > this.article.length) {            // 当整个数组的长度比currentSize多时，
              currentSize = this.article.length;                   // currentSize即为整个列表的长度
            }
            for (var i = (this.currentPage - 1) * this.pagesize; i < currentSize; i++) {
              this.cataloglist.push(this.article[i]);
            }
          }
        })
      },
      handleSizeChange: function() {
        const self = this;
        self.cataloglist = [];
        const j = self.currentPage === Math.ceil(self.article.length / self.pagesize) ? self.article.length : self.currentPage * self.pagesize;
        for (let i = (self.currentPage - 1) * self.pagesize; i < j; i++) {
          self.cataloglist.push(self.article[i]);
        }
      },
      handleCurrentChange(val) {
        const self = this;
        self.cataloglist = [];
        const j = val === Math.ceil(self.article.length / self.pagesize) ? self.article.length : val * self.pagesize;
        for (let i = (val - 1) * self.pagesize; i < j; i++) {
          self.cataloglist.push(self.article[i]);
        }
      },
      goAddSection() {
        this.id = Number.parseInt(this.$route.query.id)
        this.$router.push('/booklib/AddSection?id=' + this.id)
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
        delet: function(val) {
          var self = this
          this.$http.post('http://reading.dingjiantaoke.cn/reading/coursemanager/deletechapter', { id: val })   // 需要添加删除的后台url
              .then(function(res) {
                var data = res.data
                if (data.code === 0) {
                  self.$message('删除成功');
                  this.getList();
                }
                else {
                  self.$message('删除失败')
                }
              })
              .catch(function(err) {
                console.log(err)
                self.$message('删除失败')
              })
        },
        goDetail: function(val) {
          this.$router.push('/booklib/SectionDetail?id=' + val)
        }
    },
    created() {
      this.getList();
    }
  }
</script>