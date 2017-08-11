<template>
  <div class="app-container clendar-list-container">
    <div style="width: 400px; padding: 10px">
      <el-button type="primary" @click="showaddtype = true">添加课程类别</el-button>
    </div>
    <template>
      <el-table :data="typelist" v-loading.body="listloading" border fit highlight-current-row style="width:100%">
        <el-table-column align="center" label="序号">
            <template scope="scope">
                <span>{{ scope.row.id }}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="类型">
            <template scope="scope">
                <span>{{ scope.row.courseType }}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="类型详情" >
            <template scope="scope">
                <span>{{ scope.row.desc }}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="创建时间">
            <template scope="scope">
                <span>{{formate(scope.row.createdAt)}}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="操作">
            <template scope="scope">
                <el-button :disabled="scope.row.id == 1 ? true : false" @click="getchannellist(scope.row.courseType)">渠道</el-button>
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
    <el-dialog title="新增课程类型" v-model="showaddtype">
        <el-row :gutter="20" style="margin-bottom:20px">
            <el-col :span="4">
                <label>课程类型:</label>
            </el-col>
            <el-col :span="20">
                <el-input type="text" v-model="newcourseType"></el-input>
            </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 20px">
            <el-col :span="4">
                <label>详情:</label>
            </el-col>
            <el-col :span="20">
                <el-input type="text" v-model="newdesc"></el-input>
            </el-col>
        </el-row>
        <el-row type="flex" justify="center">
            <el-col :span="6"><el-button type="primary" @click="addtype">确定</el-button></el-col>
            <el-col :span="6"><el-button type="primary" @click="canceladd">取消</el-button></el-col>
        </el-row>
    </el-dialog>

    <el-dialog title="新增渠道" v-model="showaddchannl">
        <el-row :gutter="20" style="margin-bottom:20px">
            <el-col :span="4">
                <label>课程类型:</label>
            </el-col>
            <el-col :span="20">
                <el-input type="text" v-model="chacourseType" readonly></el-input>
            </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 20px">
            <el-col :span="4">
                <label>详情:</label>
            </el-col>
            <el-col :span="20">
                <el-input type="text" v-model="chadesc"></el-input>
            </el-col>
        </el-row>
        <el-row type="flex" justify="center">
            <el-col :span="6"><el-button type="primary" @click="channelsub">确定</el-button></el-col>
            <el-col :span="6"><el-button type="primary" @click="getchannellist(chacourseType)">取消</el-button></el-col>
        </el-row>
    </el-dialog>

    <el-dialog title="渠道列表" v-model="showchannlist">
        <div style="margin-bottom:20px;">
           <el-button @click="addchannl">新增渠道</el-button>
        </div>
        <template>
        <el-table :data="channellist" border fit highlight-current-row style="width:100%">
            <el-table-column align="center" label="序号">
                <template scope="scope">
                    <span>{{ scope.row.id }}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="类型">
                <template scope="scope">
                    <span>{{ scope.row.courseType }}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="类型详情">
                <template scope="scope">
                    <span>{{ scope.row.desc }}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="链接">
                <template scope="scope">
                    <span>{{ scope.row.url }}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="创建时间">
                <template scope="scope">
                    <span>{{formate(scope.row.createdAt)}}</span>
                </template>
            </el-table-column>

             <el-table-column align="center" label="操作" >
                <template scope="scope">
                    <el-button type="primary" @click="confirm(scope.row.id,scope.row.courseType)">删除</el-button>
                </template>
            </el-table-column> 
        </el-table>
        </template>
        <div style="margin-bottom: 40px">
            <el-pagination
            @size-change="chahandleSizeChange"
            @current-change="chahandleCurrentChange"
            :current-page="chacurrentPage" :page-size = 'chapagesize' ayout="total, prev, pager, next" :total = 'chatotalpage'></el-pagination>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchCourseType, fetchcoursechannellist } from 'api/article_table';

export default {
    name:'typelist',
    data() {
        return{
            list: [],
            list2:[],
            listloading: false,
            typelist: [],
            alllist:[],
            pagesize: 100,
            totalpage: 1,
            currentPage: 1,
            newcourseType:null,
            newdesc: '',
            showaddtype: false,
            lastid: null,
            chapagesize: 100,
            chatotalpage: 1,
            chacurrentPage: 1,
            channellist: [],
            chaall: [],
            showchannlist:false,
            showaddchannl: false,
            chacourseType: null,
            chadesc: ''
        }
    },
    methods: {
        channelsub: function () {
            var self = this;
            if(this.chadesc == '') {
                this.$message("请填写完整信息");
                return false;
            }
            else{
                this.$http.post('http://reading.dingjiantaoke.cn/reading/statistics/createcoursechannel', {
                    courseType: Number.parseInt(this.chacourseType),
                    desc: this.chadesc
                })
                    .then(function(res) {
                        var data = res.data;
                        if(data.code == 0) {
                            self.$message("添加成功");
                            self.showaddchannl = false;
                            self.showchannlist = true;
                            self.getchannellist(self.chacourseType);
                        }
                    })
                    .catch(function(err) {
                        console.log(err);
                        self.$message("添加失败");
                    })
            }
        },
        addchannl: function() {
            this.showchannlist = false;
            this.showaddchannl = true;
        },
        canceladd: function () {
            this.showaddtype = false;
            this.newcourseType = this.lastid;
            this.newdesc = '';
        },
        addtype: function () {
            var self = this;
            for( var i=0; i < this.alllist.length; i++) {
                if (this.newcourseType == this.alllist[i].id) {
                    this.$message("不能重复填写相同的类型");
                    return false;
                }
            }
            if(this.newdesc == '') {
                this.$message("请填写完整信息");
                return false;
            }
            else {
                this.$http.post('http://reading.dingjiantaoke.cn/reading/statistics/createcoursetype', {
                    courseType: Number.parseInt(this.newcourseType),
                    desc: this.newdesc
                })
                    .then(function(res) {
                        var data = res.data;
                        if(data.code == 0) {
                            self.$message("添加成功");
                            self.showaddtype = false;
                            self.getList();
                        }
                    })
                    .catch(function(err) {
                        console.log(err);
                        self.$message("添加失败");
                    })
            }
        },
        formate: function (t) {
            var d = new Date(t * 1000);
            var year = d.getFullYear();
            var day = d.getDate();
            var month = d.getMonth() + 1;
            var hour = d.getHours();
            var minute = d.getMinutes();
            var f = year + "-" + this.init(month) + "-" + this.init(day) + " " + this.init(hour) + ":" + this.init(minute);
            return f;
        },
        init: function (d) {
            return d > 9 ? d : "0" + d;
        },
        getList() {
            this.listloading = true;
            fetchCourseType().then(response => {
                this.list = response.data.data.map(v => {
                    return v;
                })
                if (response.data.code == 0) {
                    this.listloading = false;
                    this.alllist = [];
                    this.alllist= this.list;
                    this.totalpage = this.list.length;
                    this.typelist = [];
                    var currentSize = this.currentPage * this.pagesize;
                    if( currentSize > this.alllist.length) {
                        currentSize = this.alllist.length;
                    }
                    for (var i = (this.currentPage - 1) * this.pagesize; i < currentSize; i++) {
                        this.typelist.push(this.alllist[i]);
                    }
                    for (var i=0; i < this.alllist.length; i++) {
                        if(i == this.alllist.length-1) {
                            this.newcourseType = this.alllist[i].id + 1;
                            this.lastid = this.newcourseType;  // 备份
                            console.log(this.newcourseType);
                        }
                    }
                }
            })
        },
        handleSizeChange: function() {
            const self = this;
            self.typelist = [];
            const j = val === Math.ceil(self.alllist.length / self.pagesize) ? self.alllist.length : self.currentPage * self.pagesize;
            for (let i = (val - 1) * self.pagesize; i < j; i++) {
                self.typelist.push(self.alllist[i]);       
            }
        },
        handleCurrentChange: function(val) {
            const self = this;
            self.typelist = [];
            const j = val === Math.ceil(self.alllist.length / self.pagesize) ? self.alllist.length : val * self.pagesize;
            for (let i = (va - 1) * self.pagesize; i < j; i++) {
                self.typelist.push(self.alllist[i]);
            }
        },
        getchannellist: function(val) {
            this.showchannlist = true;
            this.chacourseType = val;
            fetchcoursechannellist(val).then(response => {
                this.list2 = response.data.data.map(v => {
                    v.edit = false;
                    return v;
                })
                this.chaall = [];
                if(response.data.code == 0) {
                    this.chaall = this.list2;
                    this.chatotalpage = this.list2.length;
                    this.channellist = [];
                    for(var i = 0; i < this.chaall.length; i++) {
                        this.$set(this.chaall[i], 'url', 'http://reading.dingjiantaoke.cn/reading/register/signup/'+ val + '?src='+ this.chaall[i].id)
                    }
                    console.log(this.chaall);
                    var chacurrentSize = this.chacurrentPage * this.chapagesize;
                    if(chacurrentSize > this.chaall.length) {
                        chacurrentSize = this.chaall.length;
                    }
                    for(var i = (this.chacurrentPage - 1) * this.chapagesize; i < chacurrentSize; i++) {
                        this.channellist.push(this.chaall[i]);
                    }
                }
            })
        },
        chahandleSizeChange: function() {
            const self = this;
            self.channellist = [];
            const j = val === Math.ceil(self.chaall.length / self.chapagesize) ? self.chaall.length : self.chacurrentPage * self.chapagesize;
            for (let i = (val - 1) * self.chapagesize; i < j; i++) {
                self.channellist.push(self.chaall[i]);       
            }
        },
        chahandleCurrentChange: function(val) {
            const self = this;
            self.channellist = [];
            const j = val === Math.ceil(self.chaall.length / self.chapagesize) ? self.chaall.length : val * self.chapagesize;
            for (let i = (va - 1) * self.chapagesize; i < j; i++) {
                self.channellist.push(self.chaall[i]);
            }
        },
        confirm:function(val,type){
        var self = this;
        console.log()
        this.$confirm('是否删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(()=> {
            self.delete(val,type);
        }).catch(() => {
        })
        },
        delete:function(val,type){
            console.log(type);
        var self= this;
        this.$http.post('http://reading.dingjiantaoke.cn/reading/statistics/deletecoursechannel',{
            id: val
        })
        .then(function(res){
            var data = res.data;
            if(data.code == 0){
            self.$message('删除成功');
            self.getchannellist(type);
            }
            else{
            self.$message('删除失败');
            }
        })
        .catch(function(err){
            console.log(err);
            self.$message('删除失败');
        })
        }
    },
    created() {
        this.getList();
    }
}
</script>

<style>
  
</style>
