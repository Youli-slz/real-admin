<template>
    <div class="upload-container">
        <div class="am-form-group am-form-file" id="btnwrap">
            <label type="button" class="btn btn-default">
                <i class="glyphicon glyphicon-open-file"></i> 请选择需要上传的文件
                <input type="file" id="qrcode_url" class="hide">
            </label>（图片必须是jpg、png，一次最多上传10张）
        </div>
        <!--<div class="image-preview image-app-preview">
            <div class="image-preview-wrapper" v-show="imageUrl.length>1">
                <div class='app-fake-conver'>&nbsp&nbsp全球 付费节目单 最热 经济</div>
                <img :src="imageUrl">
                <div class="image-preview-action">
                    <i @click="rmImage" class="el-icon-delete"></i>
                </div>
            </div>

        </div>
        
        
        <el-upload
                    class="image-uploader"
                    :data="dataObj"
                    drag
                    :multiple="false"
                    :show-file-list="false"
                    action="http://wxmp.gatao.cn/mypic/gettoken"
                    :on-success="getToken">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text" id="img">Drag或<em>点击上传</em></div>
            </el-upload>
        -->
        <div class="image-preview">
            <div class="image-preview-wrapper" v-show="imageUrl.length>1">
                <img :src="imageUrl">
                <div class="image-preview-action">
                    <i @click="rmImage" class="el-icon-delete"></i>
                </div>
                <div style="margin-bottom: 20px;">

                </div>
            </div>
        </div>
    </div>
</template>
<script>
    // 预览效果见文章
    import { getToken } from 'api/qiniu';
    export default {
      name: 'singleImageUpload',
      props: {
        value: String
      },
      computed: {
        imageUrl() {
          return this.value
        }
      },
      data() {
        return {
          tempUrl: '',
          dataObj: { token: '', key: '' },
          uptoken: ''
        };
      },
      methods: {
        rmImage() {
          this.emitInput('');
        },
        emitInput(val) {
          this.$emit('input', val);
        },
        handleImageScucess(file) {
          this.emitInput(file)
        },
        getToken(file) {
          this.uploadimg(file.token);
        },
        beforeUpload() {
          const _self = this;
          return new Promise((resolve, reject) => {
            getToken().then(response => {
              const key = response.data.qiniu_key;
              const token = response.data.qiniu_token;
              _self._data.dataObj.token = token;
              _self._data.dataObj.key = key;
              this.tempUrl = response.data.qiniu_url;
              resolve(true);
            }).catch(err => {
              console.log(err);
              reject(false)
            });
          });
        },
        uploadimg: function() {
            var self = this;
            var uploader = Qiniu.uploader({
              runtimes: 'html5,flash,html4', // 上传模式,依次退化
              browse_button: 'qrcode_url',
              uptoken: self.uptoken,
              container: 'btnwrap',
              save_key: true,
              domain: 'http://oe3slowqt.bkt.clouddn.com/',
              max_file_size: '5mb',
              flash_swf_url: 'qiniu/Moxie.swf',
              max_retries: 3,
              dragdrop: true,
              drop_element: 'btnwrap',
              chunk_size: true,
              filters: {
                mime_types: [
                    { title: 'Image files', extensions: 'jpg,png' }
                ]
              },
              multi_selection: false,
            init: {
               'UploadProgress': function(up, files) {
                   console.log(1111111);
                },
           'FileUploaded': function(up, file, info) {
               console.log(up);
            var domain = up.getOption('domain');
            var res = JSON.parse(info);
            var urlImg = 'http://oe3slowqt.bkt.clouddn.com/' + res.key;
            self.value = urlImg
            this.handleImageScucess(self.value)
            },
            'Error': function(up, err, errTip) {
                    //上传出错时，处理相关的事情
                    alert("上传出错，请刷新重新上传")
                }
         }
            })
        },
        getuptoken: function() {
            var self = this;
            this.$http.get('http://wxmp.gatao.cn/mypic/gettoken').then((response) => {
                var data = response.data
                    self.uptoken = data.token;
                    self.uploadimg();
                
            })
            .catch((error) => {
                console.log(error)
            })
        }
      },
      created() {
          this.getuptoken()
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/mixin.scss";
    .upload-container {
        width: 100%;
        position: relative;
        @include clearfix;
        .image-uploader {
            width: 15%;
            float: left;
        }
        .image-preview {
            width: 200px;
            height: 200px;
            position: relative;
            border: 1px dashed #d9d9d9;
            float: left;
            margin-left: 50px;
            .image-preview-wrapper {
                position: relative;
                width: 100%;
                height: 100%;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .image-preview-action {
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                cursor: default;
                text-align: center;
                color: #fff;
                opacity: 0;
                font-size: 20px;
                background-color: rgba(0, 0, 0, .5);
                transition: opacity .3s;
                cursor: pointer;
                text-align: center;
                line-height: 200px;
                .el-icon-delete {
                    font-size: 36px;
                }
            }
            &:hover {
                .image-preview-action {
                    opacity: 1;
                }
            }
        }
        .image-app-preview{
             width: 320px;
            height: 180px;
            position: relative;
            border: 1px dashed #d9d9d9;
            float: left;
            margin-left: 50px;
            .app-fake-conver{
                height: 44px;
                position: absolute;
                width: 100%;
                // background: rgba(0, 0, 0, .1);
               text-align: center;
               line-height: 64px;
               color: #fff;

            }
        }
    }
</style>
