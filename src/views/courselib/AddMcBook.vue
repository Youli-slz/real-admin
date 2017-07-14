<template>
  <div class="app-container">

    <div style="margin-bottom: 20px;">
      <label>序号:</label>
      </div>
    <div style="margin-bottom: 20px;">
      <el-input v-model="McBook.indexId"></el-input>  
    </div>

    <div style="margin-bottom: 20px;">
    <label>书籍id:</label>
    </div>
    <div style="margin-bottom: 20px;">
    <el-input type="text" v-model="McBook.bookId"></el-input>
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
          McBook: {
            courseId:null,
            indexId: null,
            bookId: null,
            monthCourseId: null
        }
        }
      },
      methods: {
        /// 提交方法
        onSubmit: function() {
          var self = this;
           self.McBook.courseId = Number.parseInt(this.$route.query.courseid);
           self.McBook.monthCourseId = Number.parseInt(this.$route.query.monthcourseid);

          this.$http.post('http://reading.dingjiantaoke.cn/reading/coursemanager/createmcbook', {         /// 以下是向后台传输的数据
            courseId: Number.parseInt(self.McBook.courseId),
            indexId: Number.parseInt(self.McBook.indexId),
            bookId: Number.parseInt(self.McBook.bookId),
            monthCourseId: Number.parseInt(self.McBook.monthCourseId),

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
          //var courseid = Number.parseInt(this.$route.query.courseid); 
          this.$router.push('/courselib/McBookList?courseid='+ this.McBook.courseId + '&monthcourseid='+ this.McBook.monthCourseId);
       }
      }
    }
</script>