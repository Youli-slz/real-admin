<template>
  <div class="app-container clendar-list-container">
    <div style="margin-bottom:20px;">
      <label>课程类型&nbsp;</label>
      <el-select v-model="typeNum" placeholder="请选择" @change="getchannellist(typeNum)">
        <el-option
        v-for="item in typeList"
        :key="item.courseType"
        :label="item.desc"
        :value="item.courseType">
        </el-option>
      </el-select>
      <label v-show="showchannel" style="margin-left:20px;">渠道&nbsp;</label>
      <el-select v-model="channelNum" placeholder="请选择" v-show="showchannel">
          <el-option
          v-for="item in channelList"
          :key="item.id"
          :label="item.desc"
          :value="item.id">
          </el-option>
      </el-select>
      <label style="margin-left:20px;">选择时间范围&nbsp;</label>
      <el-date-picker v-model="start" type="datetime"  placeholder="选择起始日期时间" style="margin-right:10px;"></el-date-picker>——
      <el-date-picker v-model="end" type="datetime"  placeholder="选择结束日期时间" style="margin-left:20px;"></el-date-picker>
      <el-button type="primary" style="margin-left:20px;" @click="getuserinfo">查询</el-button>
    </div>
    <div style="margin-bottom:20px;">
      总人数<span style="color:red">{{ richmanlist.length }}</span>人 &nbsp;&nbsp;&nbsp;&nbsp;
      总金额<span style="color:red">{{ count }}</span>元
    </div>
    <template>
      <el-table :data="richmanlist" v-loading.body="listloading" border fit highlight-current-row style="width:100%">

        <el-table-column align="center" label="微信号" width="150">
          <template scope="scope">
            <span>{{ scope.row.wechat }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="微信头像" width="200">
          <template scope="scope">
            <img :src="scope.row.avatarUrl" width="50px" height="50px">
          </template>
        </el-table-column>

        <el-table-column align="center" label="姓名" width="100">
          <template scope="scope">
            <span>{{ scope.row.realName }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="手机号" width="130">
          <template scope="scope">
            <span>{{ scope.row.phone }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="参加课程">
          <template scope="scope">
            <span>{{ scope.row.courseName }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="课程期数" width="120">
          <template scope="scope">
            <span>{{ scope.row.courseNum }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="缴费金额" width="100">
          <template scope="scope">
            <span>{{ scope.row.money }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="缴费时间" width="200">
          <template scope="scope">
            <span>{{ formate(scope.row.paytime) }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="渠道">
          <template scope="scope">
            <span>{{ scope.row.source }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="100">
          <template scope="scope">
            <el-button @click="consfirm(scope.row.usercourseid)">退款</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>

<script>
import { fetchCourseType,
         fetchcoursechannellist, 
         fetchdatastatistics
        } from 'api/article_table';

export default {
  data() {
    return{
      listloading: false,
      typeNum: null,
      channelNum: null,
      typeList:[],
      channelList:[{
        id:0, desc: '全部渠道'
      }],
      list:[],
      list2:[],
      list3:[],
      showchannel: false,
      start: null,
      startN: null,
      endN: null,
      end: null,
      richmanlist:[],
      userinfo:[],
      _init: 0,
      inittype: null,
      count: 0
    }
  },
  methods:{ 
    consfirm: function(val) {
      var self = this;
      this.$confirm("是否退款", '提示', {
        bonfirmButtonText:'确定',
        cancelButtonText:'取消',
        type: 'warning'
      }).then(() =>{
        self.refund(val);
      }).catch(() => {

      });
    },
    refund: function(val){
      var self = this;
      this.$http.post('http://reading.dingjiantaoke.cn/reading/statistics/setusercourserefund',{
        id:val
      })
        .then(function(res) {
          var data = res.data;
          if (data.code == 0) {
            self.$message('退款成功');
            this.getuserinfo();
          }
          else {
            self.$message('退款失败');
          }
        })
        .catch(function(err){
          console.log(err);
          self.$message('退款失败');
        })
    },
      formate:function(t){
        var d = new Date(t*1000);
        var year = d.getFullYear();
        var day = d.getDate();
        var month = d.getMonth()+1;
        var hour = d.getHours();
        var minute = d.getMinutes();
        var f = year + "-" +this.init(month) + "-" + this.init(day) + " " + this.init(hour) + ":" + this.init(minute);
        return f;
      },
      init: function(d){
        return d>9?d:"0"+d;
      },
    getcoursetype: function () {
        this.typeList = [];
        fetchCourseType().then(response => {
            this.list = response.data.data.map(v =>{
                return v;
            })
            if (response.data.code == 0) {
                this.typeList = this.list;
            }
            console.log(this.typeList);
        })
    },
    getchannellist: function(val) {
      this.channelList = [{id:0, desc: '全部渠道'}];
      this.showchannel = false;
      fetchcoursechannellist(val).then(response => {
        this.list2 = response.data.data.map(v => {
          return v;
        })
        if (response.data.code == 0) {
          // this.channelList = this.list2;
          for(var i=0; i<this.list2.length; i++) {
            this.channelList.push(this.list2[i]);
          }
          console.log(this.channelList);
        }
        if (this.channelList.length > 0) {
          this.showchannel = true;
          this.channelNum = this.channelList[0].id;
        }
      })
      if(this.showchannel == false) {
        this.channelNum = 0;
      }
      this._init = 1;
      var time = Date.now() / 1000;
      var today = new Date(this.fortime(time)).getTime() / 1000;
      this.start = this.formate(today);
      this.end =  this.formate(Number.parseInt(time));
      this.startN = today;
      this.endN = Number.parseInt(time);
      this.getuserinfo();


    },
    getuserinfo: function () {
      this.userinfo = [];
      this.richmanlist = [];
      this.count = 0;
      if (this._init == 0) {
        this.startN = Math.floor(new Date(this.start).getTime() / 1000);
        this.endN = Math.floor(new Date(this.end).getTime() / 1000);
        console.log(this.startN);
        console.log(this.endN);
      }
      fetchdatastatistics(this.typeNum, this.channelNum, this.startN, this.endN).then(response => {
        this.list3 = response.data.data.map(v => {
          return v;
        })
        if (response.data.code == 0) {
          this.userinfo = this.list3;
        }
        console.log(this.userinfo);
        for(var i in this.userinfo) {
          this.count = this.count + this.userinfo[i].userCourse.money;
          this.richmanlist.push({
            usercourseid: this.userinfo[i].userCourse.id,
            wechat: this.userinfo[i].user.name,
            avatarUrl: this.userinfo[i].user.avatarUrl,
            realName: this.userinfo[i].user.realName,
            courseName: this.userinfo[i].course.name,
            courseNum: this.userinfo[i].course.courseNum,
            money: this.userinfo[i].userCourse.money / 100,
            paytime: this.userinfo[i].userCourse.payTime,
            phone: this.userinfo[i].user.phone,
            source: '无渠道'
          })
        }
        this.count = this.count/100;
        if(this._init == 0){
          for(var i in this.userinfo) {
            if(this.userinfo[i].userCourse.source != 0){
              for(var j=0; j < this.channelList.length; j++){
                if(this.userinfo[i].userCourse.source == this.channelList[j].id){
                  this.richmanlist[i].source = this.channelList[j].desc;
                }
              }
            }
          }
        }
        console.log(this.richmanlist);
      })
      this._init = 0;
      
    },
        fortime:function(t){
            var d = new Date(t*1000);
            var year = d.getFullYear();
            var day = d.getDate();
            var month = d.getMonth()+1;
            var hour = d.getHours();
            var minute = d.getMinutes();
            var f = year + "-" +this.initime(month) + "-" + this.initime(day);
            return f;
        },
        initime:function (num) { 
            return num > 0 ? (num + "") : ("0" + num); 
        },
  },
  created() {
      this.getcoursetype();
      this._init = 1;
      var time = Date.now() / 1000;
      var today = new Date(this.fortime(time)).getTime() / 1000;
      this.start = this.formate(today);
      this.end =  this.formate(Number.parseInt(time));
      this.startN = today;
      this.endN = Number.parseInt(time);
      this.typeNum = 1;
      this.getuserinfo();
  }
}
</script>

<style>
  
</style>
