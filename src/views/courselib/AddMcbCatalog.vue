<template>
  <div class="app-container">
    <div class="addList" v-for="(item, key) in Catalog">
      <div style="margin-bottom: 20px;">
        <label>序号:</label>
        </div>
      <div style="margin-bottom: 20px;">
        <el-input v-model="item.indexId"></el-input>  
      </div>

      <div style="margin-bottom: 20px;">
      <label>标题:</label>
      </div>
      <div style="margin-bottom: 20px;">
      <el-input type="text" v-model="item.title"></el-input>
      </div>

      <div style="margin-bottom: 20px;">
      <label>任务时间:</label>
      </div>
      <div style="margin-bottom: 20px" >
      <el-date-picker  v-model="item.taskTime" type="datetime" format="yyyy-MM-dd" placeholder="选择日期时间" ></el-date-picker>
      </div>
    </div>

      <div>
        <el-button type="primary" @click="getAdd">继续添加目录</el-button>
        <el-button type="primary" @click="onSubmit">立即提交</el-button>
      </div>     
  </div>
</template>

<script>

 export default{
    name: 'add-section',
      data() {
        return {
          Catalog: [{
            indexId: null,
            courseId: null,
            monthCourseId: null,
            bookId: null,
            title: '',
            taskTime: null
        }],
          taskT: null,
          // indexId: null
        }
      },
      methods: {
        //中国标准时间转换成时间格式
        formatTen:function (num) { 
        return num > 0 ? (num + "") : ("0" + num); 
        },
        timeChange: function(date){
          var year = date.getFullYear(); 
          var month = date.getMonth() + 1; 
          var day = date.getDate(); 
          var hour = 0; 
          var minute = 0; 
          var second = 0; 
          return year + "-" + this.formatTen(month) + "-" + this.formatTen(day) + " " + this.formatTen(hour) + ":" + this.formatTen(minute);    
        },
        // 继续添加按钮
        getAdd: function () {
          var self = this;
          var len = self.Catalog.length-1;
          self.Catalog.push({indexId: self.Catalog[len].indexId+1,courserId:null,monthCourseId:null,bookId:null,title:'',taskTime:null});
        },
        /// 提交方法
        onSubmit: function() {
          var self = this;
          for (var i = 0; i < self.Catalog.length; i++) {
            var item = self.Catalog[i];
            if(item.title == '' || !item.taskTime) {
              continue;
            }
            var Stime = self.timeChange(item.taskTime);
            self.taskT = Date.parse(Stime)/1000;
            item.courseId = Number.parseInt(this.$route.params.courseid);
            item.monthCourseId = Number.parseInt(this.$route.params.monthcourseid);
            item.bookId = Number.parseInt(this.$route.params.bookid);
            console.log(item);
            this.$http.post('http://reading.dingjiantaoke.cn/reading/coursemanager/createmcbcatalog', {         /// 以下是向后台传输的数据
              courseId: item.courseId,
              monthCourseId: item.monthCourseId,
              bookId: item.bookId,
              indexId: Number.parseInt(item.indexId),
              title: item.title,
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
          }
        },
        goCourseList: function(val){                    /// 提交完成后跳转到列表页面 
          this.$router.push({name:'月份书籍目录', params: {courseid: val.Catalog[0].courseId, monthcourseid: val.Catalog[0].monthCourseId,bookid: val.Catalog[0].bookId}});
       }
      },
      created(){
        this.Catalog[0].indexId = Number.parseInt(this.$route.params.indexid) +1;
      }
    }
</script>