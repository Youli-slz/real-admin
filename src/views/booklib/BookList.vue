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
          <!--<span>{{ key }}</span>-->
        </template>
      </el-table-column>

      <el-table-column width="220px" align="center" label="书籍">
        <template scope="scope">
          <el-input type="text" v-show="scope.row.edit" size v-model="scope.row.bookName"></el-input>
          <span v-show="!scope.row.edit">{{scope.row.bookName}}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="作者">
        <template scope="scope">
          <el-input type="textarea" :row="3" v-show="scope.row.edit" size v-model="scope.row.author"></el-input>
          <span v-show="!scope.row.edit">{{scope.row.author}}</span>
        </template>
      </el-table-column>
      
      <el-table-column width="180px" align="center" label="图片">
        <template scope="scope">
            <div class="am-form-group am-form-file" :id="scope.$index" v-show="scope.row.edit">
              <label type="button" class="btn btn-default" :for="scope.$index+'img'">
                  <i class="glyphicon glyphicon-open-file"></i>请点击选择图片
                  <input type="file" :id="scope.$index + 'img'" style="display:none;"/>                 
              </label>
            <img :src="Book.cover" alt="" width="100" >
          </div>
          <img  v-show="!scope.row.edit" :src="scope.row.cover" alt="" width="100">
        </template>
      </el-table-column>

      <el-table-column min-width="300px"  label="简介">
        <template scope="scope">
          <el-input  type="textarea" :rows="3" v-show="scope.row.edit" size="small" v-model="scope.row.abstract"></el-input>
          <span v-show="!scope.row.edit">{{ scope.row.abstract }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="编辑" width="320" fixed="right">
        <template scope="scope">
          <div v-show="!scope.row.edit">
            <el-button type="primary" @click="goCatalog(scope.row.id)" size="small" icon="more" style="margin-bottom: 2px;">目录</el-button><br/>
            <el-button  type="primary"  @click='goDetail(scope.row.id)' size="small" icon="search" style="margin-bottom: 2px;">章节</el-button><br/>
            <el-button type="primary"  @click='confirm(scope.row.id)' size="small" icon="close" style="margin-bottom: 2px;">删除</el-button><br/>
            <el-button type="primary" @click='scope.row.edit=true' size="small" icon="edit">更新</el-button>
          </div>
          <el-button type="primary" v-show="scope.row.edit" @click='updateBook(scope.row),scope.row.edit=false'  size="small" icon="check">确定</el-button>
          <el-button type="primary" v-show="scope.row.edit" @click='scope.row.edit=false'  size="small" icon="check">取消</el-button>          

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
          Book: {
            bookName: '',
            abstract: null,
            author: '',
            cover: ''
          },
          alllist: [],
          booklist: [],
          pagesize: 100,
          totalpage: 2,
          currentPage: 1,
          uptoken:'',
          bookimg:''
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
                this.getuptoken();
                console.log(response)
              console.log(this.alllist);
              this.totalpage = this.list.length
              this.booklist = []
              var currentSize = this.currentPage * this.pagesize    // 当前页数乘每一页的数据条数
              if (currentSize > this.alllist.length) {            // 当整个数组的长度比currentSize多时，
                currentSize = this.alllist.length                   // currentSize即为整个列表的长度
              }
              for (var i = (this.currentPage - 1) * this.pagesize; i < currentSize; i++) {
                this.booklist.push(this.alllist[i]);
              }
            }
          })
        },
        goCatalog: function(val){
          this.$router.push({name:'书籍目录', params: {id: val}});
        },
        goDetail: function(val) {                              /// 跳转到书本的章节列表页面，同时传一个书的id给章节列表页面
          // this.$router.push('/booklib/ListDetail?id=' + val);
          this.$router.push({name:'书籍详情列表', params: {id: val}});
        },
        goAdd: function() {                                 /// 跳转到书本增加的页面
          this.$router.push('/booklib/AddBook');
        },
        goUpdate: function(val) {
          this.$router.push('/booklib/UpdateBook?id=' + val);
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
          var self = this;
          console.log(val);
          this.$http.post('http://reading.dingjiantaoke.cn/reading/coursemanager/deletebook', { id: val })   // 需要添加删除的后台url
              .then(function(res) {
                var data = res.data
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
                extensions: "jpg,png"
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
              self.Book.cover = urlImg;
              console.log(self.Book.cover)
              // console.log(self.files[0].imgUrl)
            },
            'Error': function(up, err, errTip) {
              //上传出错时，处理相关的事情
              console.log("上传出错，请刷新重新上传");
            }
          }       
         });
       },
       getuptoken: function() {                                    /// 从后台获取向qiniu传图片所必需的token，返回相应的key
          var self = this;
          this.$http.get('http://wxmp.gatao.cn/mypic/gettoken')    /// 通过get方法获取token
             .then((response) => {
           var data = response.data;       /// 解析从后台得到的数据
           console.log(data)
           self.uptoken = data.token;    /// 将token赋值给外部变量， 以便其他的方法的调用
           console.log(self.alllist)
        for(var i in self.alllist) 
        {
          self.upload(i);
        }
           
        })
        .catch((error) => {
          console.log(error)      /// 错误在控制台输出
        })           
       },
      //  Uconfirm: function(val) {
      //   console.log(val);
      //   var self = this;
      //     this.$confirm('是否更新？', '提示', {
      //       confirmButtonText: '确定',
      //       cancelButtonText: '取消',
      //       type: 'warning'
      //     })
      //     .then((response) => {
      //       self.updateBook(val);
      //     })
      //       .catch(() => {
      //     });
      //  },
       updateBook: function(val) {
        var self = this;
        if(self.Book.cover != ""){
          self.bookimg = self.Book.cover;
        }
        else {
          self.bookimg = val.cover;
        }
        console.log(val);
        this.$http.post('http://reading.dingjiantaoke.cn/reading/coursemanager/updatebook',{
          id: val.id,
          bookName: val.bookName,
          author: val.author,
          abstract: val.abstract,
          cover: self.bookimg
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
      }
    }
</script>

<style>
/*.am-form-file {
  width:100px;
  height:30px;
  text-align:center;
  background:#3879d9;
  color:#fff;
  border-radius:3px;
  margin-left:40px;
}*/
</style>