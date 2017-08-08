<template>
  <div class="app-container">
    
    <div style="margin-bottom: 20px;">
      <label>封面上传:</label>
      </div>
      <div style="margin-bottom: 20px;">
      <!--<Upload v-model="postForm.image_uri"></Upload>  -->
      <div>
        <div class="am-form-group am-form-file" id="btnwrap">
          <label type="button" class="btn btn-default">
              <i class="glyphicon glyphicon-open-file"></i> 请选择需要上传的文件
              <input type="file" id="qrcode_url" style="display: none"/>
          </label>
        </div>
        <div class="picList">
          <ul>
            <li :id="item.id" class="picItem" v-for="item in files">
              <div class="picProgress">
                <div class="picProgress-info">
                  <span>{{ item.name }}</span>
                  <span class="percent">上传进度：0%</span>
                </div>
                <div class="upPercent"></div>
              </div>
            </li>
          </ul>
        </div>
        <div style="padding-left:40px;">
          <img :src="Course.cover" alt="" width="100" height="100">
        </div>
      </div>
    </div>
    <div style="margin-bottom: 20px;">
      <label>封面网址上传:</label>
      </div>
    <div style="margin-bottom: 20px;">
      <el-input v-model="Course.cover"></el-input>  
    </div>
    <div style="margin-bottom: 20px;">
    <label>课程名称:</label>
    </div>
    <div style="margin-bottom: 20px;">
    <el-input type="text" v-model="Course.name"></el-input>
    </div>
    <div style="margin-bottom: 20px;">
    <label>课程类型:</label>
    </div>
    <div style="margin-bottom: 20px;">
    <select v-model="Course.courseType">
        <option v-for="option in options" v-bind:value="option.value">
            {{ option.text }}
        </option>
    </select>
    <!-- <span>{{ Course.courseType }}</span> -->
    </div>
    <div style="margin-bottom: 20px;">
    <label>课程期数:</label>
    </div>
    <div style="margin-bottom: 20px;">
    <el-input type="text" v-model="Course.courseNum"></el-input>
    </div>
    <div style="margin-bottom: 20px;">
    <label>课程金额(精确到分):</label>
    </div>
    <div style="margin-bottom: 20px;">
    <el-input type="text" v-model="Course.money"></el-input>
    </div>
    <div style="margin-bottom: 20px;">
    <label>课程开始时间--结束时间:</label>
    </div>
    <div style="margin-bottom: 20px" >
    <el-date-picker  v-model="Course.startTime" type="datetime" format="yyyy-MM-dd" placeholder="选择日期时间" ></el-date-picker> --------
    <el-date-picker v-model="Course.endTime" type="datetime" format="yyyy-MM-dd " placeholder="选择日期时间"></el-date-picker>
    </div>
    <div style="margin-bottom: 20px;">
    <label>课程介绍:</label>
    </div>
    <div style="margin-bottom: 20px;">
      <el-input  type="textarea" :rows="5" v-model="Course.introduction"></el-input>
    </div>
      <div>

        <el-button type="primary" @click="onSubmit">立即提交</el-button> 
      </div>     
  </div>
</template>

<script>

 export default{
    name: 'add-section',
      data() {
        return {
          Course: {
            courseType: 1,
            courseNum: null,
            name: '',
            introduction: '',
            cover: '',
            startTime: null,
            endTime: null,
            money: null
        },
          options: [
            {text: "小鹿微课共读计划" , value:1},
            {text: "测试课程" , value:1000}
          ],
          uptoken: '',
          files: [],
          imgInfo: [],
          IMGURL:'',
          startT: null,
          endT: null
        }
      },
      methods: {
        //中国标准时间转换成时间戳
        formatTen:function (num) { 
        return num > 0 ? (num + "") : ("0" + num); 
        },
        timeChange: function(date){
          var year = date.getFullYear(); 
          var month = date.getMonth() + 1; 
          var day = date.getDate(); 
          var hour = date.getHours(); 
          var minute = date.getMinutes(); 
          var second = date.getSeconds(); 
          return year + "-" + this.formatTen(month) + "-" + this.formatTen(day);    
        },
        /// 提交方法
        onSubmit: function() {
          var self = this;
          var Stime = self.timeChange(self.Course.startTime);
          var Etime = self.timeChange(self.Course.endTime);
          self.startT = new Date(Stime).getTime()/1000;
          self.endT = new Date(Etime).getTime()/1000;
          console.log(self);
          this.$http.post('http://reading.dingjiantaoke.cn/reading/coursemanager/createcourse', {         /// 以下是向后台传输的数据
            courseType: Number.parseInt(self.Course.courseType),
            courseNum: Number.parseInt(self.Course.courseNum),
            name: self.Course.name,
            introduction: self.Course.introduction,
            cover: self.Course.cover,
            startTime: self.startT,
            endTime: self.endT,
            money: Number.parseInt(self.Course.money)
          })
              .then(function(res) {
                console.log(res.data)
                var data = res.data;      /// 获取提交后返回的信息
                if (data.code == 0) {
                  self.$message('提交成功');
                }
              })
              .catch(function(err) {
                console.log(err)
                self.$message('提交失败');
              });
          this.goCourseList();
        },
        goCourseList: function(){                    /// 提交完成后跳转到列表页面 
          this.$router.push('/courselib/CourseList');
       },
       upload: function() {             /// 通过qiniu上传图片函数
          var self = this;
          var uploader = Qiniu.uploader({
          runtimes: 'html5,flash,html4', //上传模式,依次退化
          browse_button: 'qrcode_url', //上传选择的点选按钮，**必需**
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
              } // 限定flv后缀上传格式上传
            ]
          },
          multi_selection: true,
          init: {
            FilesAdded: function(up, files) { //文件上传前
              self.files = [];
              self.imgInfo = [];
              if (files.length > 10) {
                // self.showPop("一次最多只能上传10张图片");
                uploader.destroy();
              } else {
                // console.log(files);
                self.files = files;
                for(var i = 0; i < files.length; i++){
                  // console.log(self.getPicName(files[i].name))
                  self.files[i].fname = self.getPicName(files[i].name)
                }
                uploader.start();
              }
            },
            UploadProgress: function(up, file) { //上传中，显示进度条
              var percent = file.percent;
              $("#" + file.id).find('.upPercent').css({
                "width": percent + "%"
              });
              $("#" + file.id).find(".percent").text("上传进度：" + percent + "%");
            },
            'FileUploaded': function(up, file, info) {
              var domain = up.getOption('domain');
              var res = JSON.parse(info);
              var urlImg = 'http://7xld1x.com1.z0.glb.clouddn.com/' + res.key;
              // console.log("img="+urlImg);
              file.imgUrl = urlImg;
              console.log(urlImg);
              self.Course.cover = urlImg;
              console.log(self.Course.cover)
              // console.log(self.files[0].imgUrl)
            },
            'Error': function(up, err, errTip) {
              //上传出错时，处理相关的事情
              // self.showPop("上传出错，请刷新重新上传")
              console.log(err)
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
           self.upload();
        })
        .catch((error) => {
          console.log(error)      /// 错误在控制台输出
        })           
       },
      getPicName: function(value){    /// 获取图片的名字
        // console.log(value)
        var index = value.indexOf('.')
        // console.log("index="+index)
        return value.substring(0,index)
       }
      },
      created: function() {
        this.getuptoken();     /// 在页面创建时所做的操作
      }
    }
</script>

<style scoped>
h1 {
  color: #42b983;
}

select {
    padding-left: 10px;
    padding-right:35px;
    padding-top:3px;
    padding-bottom:3px;
    border-radius:3px;
    height: 38px;
    width: 200px;
}

input {
    padding-left: 10px;
    padding-right: 10px;
    padding-top:3px;
    padding-bottom:3px;
    border-radius: 5px;
    height: 38px;
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