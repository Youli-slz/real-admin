<template>
  <div class="app-container">
    
    <div style="margin-bottom: 20px;">
      <label>图片上传:</label>
      </div>
      <div style="margin-bottom: 20px;">
      <!--<Upload v-model="postForm.image_uri"></Upload>-->
      <div>
        <div class="am-form-group am-form-file" id="btnwrap">
          <label type="button" class="btn btn-default">
            <i class="glyphicon glyphicon-open-file"></i>请选择需要上传的文件
            <input type="file" id="qrcode_url" style="display:none;" />
          </label>
        </div>
        <div class="picList">
          <ul>
            <li :id="item.id" class="picItem" v-for="item in files">
              <div class="picProgress">
                <div class="picProgress-info">
                  <span>{{ item.name }}</span>
                  <span class="percent">上传进度: 0%</span>
                </div>
                <div class="upPercent"></div>"
              </div>
            </li>
          </ul>
        </div>
        <div style="padding-left:40px;">
          <img :src="IMGURL" alt="" width="100" height="100">
        </div>
      </div>
    </div>
    <div style="margin-bottom: 20px;">
    <label>章节序号:</label>
    </div>
    <div style="margin-bottom: 20px;">
    <el-input type="text" v-model="postForm.indexid"></el-input>
    </div>
    <div style="margin-bottom: 20px;">
    <label>章节:</label>
    </div>
    <div style="margin-bottom: 20px;">
    <el-input type="text" v-model="postForm.title"></el-input>
    </div>
    <div style="margin-bottom: 20px;">
    <label>章节内容内容:</label>
    </div>
    <div style="margin-bottom: 20px;">
      <div class="editor-container">
        <!-- <el-button @click='xieru'>显示章节详情</el-button> -->
        <!-- <Tinymce :height=400 ref="editor" v-model="postForm.content"></Tinymce> -->
        <!-- <div id="editor" type="text/plain" style="width:1024px;height:500px;"></div>  -->
        <UE :defaultMsg="defaultMsg" :config="config" ref="ue"></UE>
      </div>
      </div>
      <div style="margin-bottom: 20px;">
        <el-button type="primary" @click="OnSubmit">确认更新</el-button>
      </div>
  </div>
  
</template>

<script>
    // import Tinymce from 'components/Tinymce';
    import UE from '../../components/UEditor/index.vue'
    import { fetchChapterDetail } from 'api/article_table';

    export default{
      name: 'app-container',
      // components: { Tinymce },
      components: {UE},
      data() {
        const validateRequire = (rule, value, callback) => {
          if (value === '') {
            this.$message({
              message: rule.field + '为必传项',
              type: 'error'
            });
            callback(null)
          } else {
            callback()
          }
        };
        const validateSourceUri = (rule, value, callback) => {
          if (value) {
            if (validateURL(value)) {
              callback()
            } else {
              this.$message({
                message: '外链url填写不正确',
                type: 'error'
              });
              callback(null)
            }
          } else {
            callback()
          }
        };
        return {
          postForm: {
            bookid: 0,
            indexid: 1,
            title: '', // 文章题目
            content: '', // 文章内容
            content_short: '', // 文章摘要
            source_uri: '', // 文章外链
            image_uri: '', // 文章图片
            source_name: '', // 文章外部作者
            display_time: undefined, // 前台展示时间
            id: undefined,
            platforms: ['a-platform']
          },
          id: '',
          popupFlag: false,
          popupContent: '',
          uptoken: '',
          files:[],
          imgInfo: [],
          ue: '',
          uedata: '',
          xirudata:'',
          defaultMsg: '',
          config:{
            initialFrameWidth: null,
            initialFrameHeight: 350
          },
          list:{
            bookid: 0,
            indexid: 0,
            content: '',
            title: '',
            cover:''
          },
          IMGURL: '',
          fetchSuccess: true,
          loading: false,
          userLIstOptions: [],
          platformsOptions: [
            { key: 'a-platform', name: 'a-platform' },
            { key: 'b-platform', name: 'b-platform' },
            { key: 'c-platform', name: 'c-platform' }
          ],
          rules: {
            image_uri: [{ validator: validateRequire }],
            title: [{ validator: validateRequire }],
            content: [{ validator: validateRequire }],
            source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
          }
        };
      },
        // mounted() { 
        //     this.ue = UE.getEditor('editor',{ 
        //     BaseUrl: '', 
        //     UEDITOR_HOME_URL: 'static/utf8-jsp/', 
        //   }); 

        // }, 
      methods: {
        OnSubmit: function() {
          var self = this;
          self.id = Number.parseInt(this.$route.query.id);
          console.log(self.id);
          self.postForm.content = this.$refs.ue.getUEContent();
            this.$notify({
              title: '获取成功',
              message: this.postForm.content,
              type: 'success'
          });
          console.log(self.postForm.indexid);
          this.$http.post('http://reading.dingjiantaoke.cn/reading/coursemanager/updatechapter', {
            id: self.id,
            indexId: Number.parseInt(self.postForm.indexid),
            title: self.postForm.title,
            cover: self.IMGURL,
            content: self.postForm.content
          })
              .then(function(res) {
                var data = res.data
                if (data.code === 0) {
                  console.log(data);
                  self.$message('更新成功')
                }
              })
              .catch(function(err) {
                console.log(err)
                self.$message('更新失败')
              });
          this.goListDetail(self.postForm.bookid);
        },

        upload: function() {
          var self = this;
          var uploader = Qiniu.uploader({
            runtimes: 'html5,flash,html4',  // 上传模式，一次退化
            browse_button: 'qrcode_url',     // 上传选择的点选按钮（input框）， **必须
            uptoken: this.uptoken,
            //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
            // uptoken : '<Your upload token>',
            //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
            // unique_names: true,
            // 默认 false，key为文件名。若开启该选项，SDK会为每个文件自动生成key（文件名）
            save_key: true,
            // 默认 false。 若在服务端生成uptoken的上传策略中指定了 ‘save_key’,则开启则开启，SDK在前端将不对key进行任何处理
            domain: 'http://oe3slowqt.bkt.clouddn.com/',
            //bucket 域名，下载资源时用到，**必需**
            container: 'btnwrap', //上传区域DOM ID，默认是browser_button的父元素，
            max_file_size: '5mb', //最大文件体积限制
            flash_swf_url: 'qiniu/Moxie.swf', //引入flash,相对路径
            max_retries: 3, //上传失败最大重试次数
            dragdrop: true, //开启可拖曳上传
            drop_element: 'container', //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
            chunk_size: '4mb', //分块上传时，每片的体积
            auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
            filters: {
              mime_types: [{
                title: "Image files",
                extensions: "jpg,png"
              }]   // 限定flv后缀上传格式上传
            },
            multi_selection: true,
            init: {
              FilesAdded: function(up, files) {
                self.files = [];
                self.imgInfo = [];
                if( files.length > 10) {
                  self.files = files;
                  for(var i = 0; i < files.length; i++)
                  {
                    self.files[i].fname = self.getPicName(files[i].name)
                  }
                  uploader.start();
                }
              },
              UploadProgress: function(up, file) {
                var percent = file.percent;
                $("#" + file.id).find(".upPercent").css({
                  "width": percent + "%"
                });
                 $("#" + file.id).find(".percent").text("上传进度：" + percent + "%");
              },
              'FileUploaded': function(up, file, info) {
                var domain = up.getOption('domain');
                var res = JSON.parse(info);
                var urlImg = 'http://oe3slowqt.bkt.clouddn.com/' + res.key;
                file.imgUrl = urlImg;
                self.IMGURL = urlImg;
                console.log(self.IMGURL);
              },
              'Error': function(up, err, errTip) {
                 alert("上传出错，请刷新后重新上传！");
              }
            }
          });
        },
        getuptoken: function() {
          var self = this;
          this.$http.get('http://wxmp.gatao.cn/mypic/gettoken')
              .then((response) => {
                var data = response.data;
                self.uptoken = data.token;
                self.upload();
              })
              .catch((error) => {
                console.log(error);
              })
        },
        getPicName: function(value) {
          var index = value.indexOf('.');
          return value.substring(0,index)
        },
        goListDetail: function(val) {
          this.$router.push('/booklib/ListDetail?id=' + val);
        },
        // xieru: function() {
        //   // UE.getEditor('editor').setContent(this.xirudata); 
        //   let content = this.$refs.ue.getUEContent();
        //   this.$notify({
        //     title: '获取成功, 可在控制台查看!',
        //     message: content,
        //     type: 'success'
        //   });
        //   console.log(content);
        // },
        getDetail: function() {
          var self = this;
          self.id = Number.parseInt(this.$route.query.id);
          fetchChapterDetail(self.id).then(response => {
            self.list = response.data.data;
            if (response.data.code === 0) {
              console.log(self.list);
              self.postForm.bookid = self.list.bookId;
              self.postForm.title = self.list.title;
              self.defaultMsg = self.list.content;
              self.postForm.indexid = self.list.indexId;
              self.IMGURL = self.list.cover;
              // this.$refs.ue.setContent(self.defaultMsg);
            }
          })
        }
      },
      created: function() {

        this.getuptoken();
        this.getDetail();
      }
    }
</script>

<style scoped>
h1 {
  color: #42b983;
}

.am-form-file {
  width:200px;
  height:30px;
  text-align:center;
  background:#3879d9;
  color:#fff;
  border-radius:3px;
  margin-left:40px;
}

.picList {
  margin: 30px 0;
}

.picItem {
  height: 35px;
  margin-bottom: 10px;
  overflow: hidden;
}

.picItem>div{
  display: inline-block;
}

.picProgress {
  position: relative;
  width: 460px;
  height: 34px;
  line-height: 34px;
  background: #eee;
  padding-left: 20px;
  margin-right: 50px;
}

.picProgress-info{
  position: relative;
  z-index: 99;
}

.picProgress-info>span {
  display: inline-block;
}

.picProgress-info>span:nth-child(1){
  width: 260px;
}

.upPercent{
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9;
  height: 34px;
  width: 0%;
  background: #e5ffef;
  opacity: 0.5
}

.picName>input{
  height: 32px;
}
/*弹窗样式*/

.popup {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(20, 20, 20, 0.6);
  overflow-x: hidden;
  z-index: 99999999;
}

.popbox {
  width: 540px;
  background: #fff;
  text-align: center;
  position: absolute;
  top: 460px;
  left: 50%;
  margin-left: -270px;
}

.popbox-footer {
  height: 44px;
  overflow: hidden;
  display: table;
  width: 100%;
  border-collapse: collapse;
}

.popbox-btn {
  display: table-cell!important;
  padding: 0 5px;
  height: 44px;
  -webkit-box-sizing: border-box!important;
  box-sizing: border-box!important;
  font-size: 16px;
  line-height: 44px;
  text-align: center;
  color: #0e90d2;
  display: block;
  word-wrap: normal;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
  border-right: 1px solid #dedede;
}

.popbox-btn:nth-last-child(1) {
  border-right: none;
}

.toastbox {
  width: 120px;
  background: rgb(100, 100, 100);
  text-align: center;
  position: absolute;
  top: 420px;
  left: 50%;
  margin-left: -60px;
  padding: 10px;
  font-size: 18px;
  color: #fff;
}

@media screen and (max-width: 640px) {
  .popbox {
    width: 270px;
    background: #fff;
    text-align: center;
    position: absolute;
    top: 400px;
    left: 50%;
    margin-left: -135px;
  }
}
</style>