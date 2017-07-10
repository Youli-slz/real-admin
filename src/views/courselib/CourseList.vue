<!--<template>
    <div class="app-container calerndar-list-container">
        <div style="width: 400px;padding: 10px">
            <el-button type="primary" size="small" @click="goAdd()" style="margin-buttom: 10px">添加课程</el-button>
        </div>
        <template>
            <el-table :data="" v-loading.body = "listLoading" border fit highlight-current-row style="width:100%">
                <el-table-column align="center" label="序号" width="80">
                    <template scope="scope">
                      <span>{{ scope.row.id }}</span>
                    </template>
                </el-table-column>

                <el-table-column width="220px" align="center" label="课程">
                    <template scope="scope"> 
                        <span>{{ scope.row.name }}</span>
                    </template>
                </el-table-column>

                <el-table-column width="120px" align="center" label="作者">
                    <template scope="scope">
                        <span>{{ scope.row.author }}</span>
                    </template>
                </el-table-column>

                <el-table-column width="180px" align="center" label="图片">
                    <template scope="scope">
                        <span>{{ scope.row.img }}</span>
                    </template>
                </el-table-column>

                <el-table-column min-width="300" align="center" label="简介">
                    <template scope="scope">
                        <span> {{ scope.row.abstract }}</span>
                    </template>
                </el-table-column>

                <el-table-column width="320" align="center" label="操作">
                    <template scope="scope">
                        <el-button type="primary" @click='goDetail(scope.row.id)'>编辑</el-button>
                        <el-button type="primary" @click='confirm(scope.row.id)'>删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <div style="margin-bottom: 40px;">
            <el-pagination 
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage" :page-size='pagesize' ayout="total, prev, pager, next" :total = 'totalpage'></el-pagination>
        </div>
    </div>
</template>-->

<script>
// export default {
//     name: 'courselist',
//     data() {
//         return {
//             list: null,
//             listLoading: true,
//             alllist: [],
//             courselist: [],
//             pagesize: 100,
//             totalpage:1,
//             currentPage:1
//         }
//     },
//     methods: {
//         getList: function() {
//             this.listLoading = true;
//             fetchCourseList().then(response => {
//                 this.list = response.data.data.map(v => {
//                     v.edit= false;
//                     return v;
//                 });
//                 if (response.data.code === 0) {
//                     this.listLoading = false;
//                     this.alllist = this.list;
//                     this.totalpage = this.lsit.length;
//                     this.courselist = [];
//                     var crrentSize = this.currentPage * this.pagesize;
//                     if (currentSzie > thhis.alllist.length) {
//                         currentSzie = this.alllist.length;
//                     }
//                     for (var i = (this.currentPage -1) * this.pagesize; i < currentSize; i++) {
//                         this.courselist.push(this.alllist[i]);
//                     }
//                 }
//             })
//         },
//         goDetail: function( val ) {
//             this.$router.push('/courselist/CourseList?id=' + val);
//         },
//         goAdd: function() {
//             this.$router.push('/courselist/AddCourse');
//         },
//         handleSizeChange: function() {
//             const self= this;
//             self.courselist =[];
//             const j = self.currentPage === Math.ceil(self.alllist.length / self.pagesize) ? self.alllist.length: self.currentPage * self.pageszie;
//             for (let i = (self.currentPage - 1) * self.pagesize; i < j; i++) {
//                 self.courselist.push(self.alllist[i]);
//            }
//         },
//         confirm(val) {
//             var self = this;
//             this.$confirm('是否删除？','提示', {
//                 conofirmButtonText: '确定',
//                 cancelButtonText: '取消',
//                 type: 'warning'
//             }).then(() => {
//                 self.delet(val)
//             }).catch(() => {});
//        },
//         delet: function(val) {                               /// 删除书本的函数
//           var self = this
//           this.$http.post('', { id: val })   // 需要添加删除的后台url
//               .then(function(res) {
//                 var data = res.data
//                 if (data.code === 0) {
//                   self.$message('删除成功')
//                 }
//                 else {
//                   self.$message('删除失败')
//                 }
//               })
//               .catch(function(err){
//                 console.log(err)
//                 self.$message('删除失败')
//               })
//         }
//     }
// }
</script>