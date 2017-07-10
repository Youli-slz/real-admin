<template>
  <div class="app-container">
    
    <div style="margin-bottom: 20px;">
      <label>图片上传:</label>
      </div>
      <div style="margin-bottom: 20px;">
      <Upload v-model="postForm.image_uri"></Upload>  
    </div>
    <div style="margin-bottom: 20px;">
      <label>图片网址上传:</label>
      </div>
    <div style="margin-bottom: 20px;">
      <el-input v-model="postForm.image_uri"></el-input>  
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
        <Tinymce :height=400 ref="editor" v-model="postForm.content"></Tinymce>
      </div>
      </div>
      <div>
        <el-button type="primary" @click="onSubmit">立即更新</el-button> 
      </div>     
  </div>
</template>

<script>
    import Upload from 'components/Upload/singleImage3'
    import Tinymce from 'components/Tinymce'

    export default{
      name: 'add-section',
      components: { Upload, Tinymce },
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
        }
      },
      methods: {
        onSubmit: function() {
          var self = this;
          self.postForm.bookid = Number.parseInt(this.$route.query.id)
          this.$http.post('http://reading.dingjiantaoke.cn/reading/coursemanager/createchapter', {
            bookId: self.postForm.bookid,
            indexId: Number(self.postForm.indexid),
            title: self.postForm.title,
            cover: self.postForm.image_uri,
            content: self.postForm.content
          })
              .then(function(res) {
                var data = res.data
                if (data.code === 0) {
                  self.$message('提交成功')
                }
              })
              .catch(function(err) {
                console.log(err)
                self.$message('提交失败')
              });
            this.goListDetail(self.postForm.bookid);
        },
        goListDetail: function(val) {
          this.$router.push('/booklib/ListDetail?id=' + val);
        }
      }
    }
</script>
