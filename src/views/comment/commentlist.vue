<template>
  <div class="app-container calerndar-list-container">
    <div class="header" style="width: 400px;padding: 10px">
      <label>状态选择&nbsp;&nbsp;&nbsp;</label>
      <select v-model="publicstatus" @change="getcomlist(publicstatus,1)" placeholder="请选择">
        <option v-for="item in comStatus" :key="item.value" :label="item.label" :value="item.value">
        </option>
      </select>
    </div>
    <template>
      <el-table :data="comlist" v-loading.body="comLoading" border fit highlight-current-row style="width: 100%">
  
        <el-table-column align="center" label="序号" width="80">
          <template scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
  
        <el-table-column width="220px" align="center" label="微信昵称">
          <template scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
  
        <el-table-column width="80px" align="center" label="姓名">
          <template scope="scope">
            <span>{{scope.row.realName}}</span>
          </template>
        </el-table-column>
  
        <el-table-column width="120px" align="center" label="微信头像">
          <template scope="scope">
            <img :src="scope.row.avatarUrl" width="50px" height="50px">
          </template>
        </el-table-column>
  
        <el-table-column min-width="300px" label="评论">
          <template scope="scope">
            <span>{{ scope.row.comment }}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="200px" label="评论文章" align="center">
          <template scope="scope">
            <span>{{ scope.row.title }}</span>
          </template>
        </el-table-column>
  
        <el-table-column width="120px" align="center" label="评论时间">
          <template scope="scope">
            <span>{{scope.row.createdAtStr}}</span>
          </template>
        </el-table-column>

        <el-table-column width="120px" align="center" label="状态">
          <template scope="scope">
            <select v-model="scope.row.status" @change="changeStatus(scope.row.status,scope.row.id)" placeholder="请选择" :id="scope.row.id">
              <option v-for="item in comStatus" :key="item.value" :label="item.label" :value="item.value">
              </option>
            </select>
          </template>
        </el-table-column>     
  
        <el-table-column width="100px" align="center" label="回复" >
          <template scope="scope">
            <el-button @click="showreply = true,pubid = scope.row.id">回 复</el-button>
          </template>
        </el-table-column>
  
      </el-table>
    </template>
    <div style="margin-bottom: 40px">
      <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size='pagesize' ayout="total, prev, pager, next" :total='totalpage'></el-pagination>
    </div>
    <el-dialog title="评论回复" v-model="showreply">
      <el-row :gutter="20" style="margin-bottom:20px;">
        <el-col :span="4">
          <label>回复人:</label>
        </el-col>
        <el-col :span="20">
          <el-input type="text" v-model="replyuser"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-bottom:20px;">
        <el-col :span="4">
          <label>回复内容:</label>
        </el-col>
        <el-col :span="20">
          <el-input type="textarea" :row=3 v-model="newcomment"></el-input>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" @click="replycomment">确定</el-button>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="showreply = false">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { fetchcommentlist } from 'api/article_table';

export default {
  name: 'commentlist',
  data() {
    return {
      list: [],
      allcommentlist: [],
      comlist: [],
      comLoading: false,
      pagesize: 100,
      totalpage: 1,
      currentPage: 1,
      showreply: false,
      publicstatus: 0,
      newcomment:'',
      replyuser:'',
      pubid: null,
      comStatus: [
        { label: '未处理', value: 0 },
        { label: '发布', value: 1 },
        { label: '忽略不显示', value: 2 }
      ],
      styleArr: [
        { background: '	#218868', border: '1px solid 	#218868' },
        { background: '#32CD32', border: '1px solid #32CD32' },
        { background: '#A52A2A', border: '1px solid #A52A2A' },
      ]
    }
  },
  methods: {
    getcomlist: function (statval, setval) {
      this.comLoading = true;
      var offval = (setval - 1) * this.pagesize;
      fetchcommentlist(statval, offval, this.pagesize).then(response => {
        this.allcommentlist = response.data.data.list;
        this.comlist = [];
        if (response.data.code == 0) {
          this.comLoading = false;
          this.totalpage = response.data.data.count;
          for (var i in this.allcommentlist) {
            this.comlist.push({
              id: this.allcommentlist[i].courseComment.id,
              comment: this.allcommentlist[i].courseComment.comment,
              status: this.allcommentlist[i].courseComment.status,
              createdAtStr: this.allcommentlist[i].courseComment.createdAtStr,
              name: this.allcommentlist[i].user.name,
              avatarUrl: this.allcommentlist[i].user.avatarUrl,
              realName: this.allcommentlist[i].user.realName,
              title: this.allcommentlist[i].monthCourseCatalog.title
            })
          }
          console.log(this.comlist);
        }
      })
    },
    handleCurrentChange: function (val) {
      this.getlist(this.publicstatus,val);
    },
    changeStatus: function (newstatus, newid) {
      this.$http.post('http://reading.dingjiantaoke.cn/reading/course/updatecomment',{
        id: newid,
        status: newstatus
      })
        .then(function(res) {
          var data = res.data;
          if(data.code == 0){
            this.$message('更新成功');
            this.getcomlist(this.publicstatus,this.currentPage);
          }
        })
        .catch(function(err) {
          console.log(err);
          this.$message("更新失败");
        })
    },
    replycomment: function(){
      if(this.replyuser == '' || this.newcomment == ''){
        this.$message("请填写完整信息");
        return false;
      }
      else{
            this.$http.post('http://reading.dingjiantaoke.cn/reading/course/replycomment',{
            id: Number.parseInt(this.pubid),
            replyUser: this.replyuser,
            replyComment: this.newcomment
          })
            .then(function(res) {
              var data = res.data;
              if(data.code == 0){
                this.$message('回复成功');
                this.showreply = false;
              }
              else{
                this.$message('回复失败');
              }
            })
            .catch(function(err) {
              console.log(err);
              this.$message("回复失败");
            })
        }
    }
  },
  created(){
    this.getcomlist(0,1);
  }
}
</script>

<style>
select {
  width: 100px;
  height: 30px;
  border-radius: 5px;
}
</style>
