<template>
  <div class="app-container">
    
    <div style="margin-bottom: 20px;">
      <label>序号:</label>
      </div>
    <div style="margin-bottom: 20px;">
      <el-input v-model="Catalog.indexId"></el-input>  
    </div>

    <div style="margin-bottom: 20px;">
    <label>标题:</label>
    </div>
    <div style="margin-bottom: 20px;">
    <el-input type="text" v-model="Catalog.title"></el-input>
    </div>

    <div style="margin-bottom: 20px;">
    <label>任务时间:</label>
    </div>
    <div style="margin-bottom: 20px" >
    <el-date-picker  v-model="Catalog.taskTime" type="datetime" format="yyyy-MM-dd" placeholder="选择日期时间" ></el-date-picker>
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
          Catalog: {
            indexId: null,
            courseId: null,
            monthCourseId: null,
            bookId: null,
            title: '',
            taskTime: null
        },
          taskT: null
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
          var Stime = self.timeChange(self.Catalog.taskTime);
          self.taskT = new Date(Stime).getTime()/1000;
          self.Catalog.courseId = Number.parseInt(this.$route.params.courseid);
          self.Catalog.monthCourseId = Number.parseInt(this.$route.params.monthcourseid);
          self.Catalog.bookId = Number.parseInt(this.$route.params.bookid);

          console.log(self);
          this.$http.post('http://reading.dingjiantaoke.cn/reading/coursemanager/createmcbcatalog', {         /// 以下是向后台传输的数据
            courseId: self.Catalog.courseId,
            monthCourseId: self.Catalog.monthCourseId,
            bookId: self.Catalog.bookId,
            indexId: Number.parseInt(self.Catalog.indexId),
            title: self.Catalog.title,
            taskTime: self.taskT
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
          this.goCourseList(self);
        },
        goCourseList: function(val){                    /// 提交完成后跳转到列表页面 
          this.$router.push({name:'月份书籍目录', params: {courseid: val.Catalog.courseId, monthcourseid: val.Catalog.monthCourseId,bookid: val.Catalog.bookId}});
       }
      }
    }
</script>