<template>
  <div class="app-container">
    <div style="margin-bottom: 20px;">
      <label>课程章节序号:</label>
      </div>
    <div style="margin-bottom: 20px;">
      <el-input v-model="MCourse.indexId"></el-input>  
    </div>

    <div style="margin-bottom: 20px;">
    <label>年份:</label>
    </div>
    <div style="margin-bottom: 20px;">
    <el-input type="text" v-model="MCourse.year"></el-input>
    </div>

    <div style="margin-bottom: 20px;">
    <label>月份:</label>
    </div>
    <div style="margin-bottom: 20px;">
    <el-input type="text" v-model="MCourse.month"></el-input>
    </div>

    <div style="margin-bottom: 20px;">
    <label>标题:</label>
    </div>
    <div style="margin-bottom: 20px;">
    <el-input type="text" v-model="MCourse.title"></el-input>
    </div>

    <div style="margin-bottom: 20px;">
    <label>课程章节介绍:</label>
    </div>
    <div style="margin-bottom: 20px;">
      <el-input  type="textarea" :rows="5" v-model="MCourse.introduction"></el-input>
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
          MCourse: {
            courseId:null,
            indexId: null,
            year: null,
            month: null,
            introduction: '',
            title: ''
        }
        }
      },
      methods: {
        /// 提交方法
        onSubmit: function() {
          var self = this;
          var courseid = Number.parseInt(this.$route.params.courseid);
          console.log(self);
          this.$http.post('http://reading.dingjiantaoke.cn/reading/coursemanager/createmcourse', {         /// 以下是向后台传输的数据
            courseId: Number.parseInt(courseid),
            indexId: Number.parseInt(self.MCourse.indexId),
            year: Number.parseInt(self.MCourse.year),
            month: Number.parseInt(self.MCourse.month),
            title: self.MCourse.title,
            introduction: self.MCourse.introduction,

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
          var courseid = Number.parseInt(this.$route.params.courseid); 
          // this.$router.push('/courselib/CourseDetailList?courseid='+courseid);
          this.$router.push({name:'课程月份目录列表', params:{courseid: courseid}});
       }
      },
      created(){
        this.MCourse.indexId = Number.parseInt(this.$route.params.indexid) + 1;
      }
    }
</script>