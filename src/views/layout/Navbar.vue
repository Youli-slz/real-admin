<template>
    <el-menu class="navbar" mode="horizontal">
        <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
        <levelbar></levelbar>
          <!-- <tabs-view></tabs-view>   -->
        <error-log v-if="log.length>0" class="errLog-container" :logsList="log"></error-log>
        <screenfull class='screenfull'></screenfull>
        <el-dropdown class="avatar-container" trigger="click">
            <div class="avatar-wrapper">
                <img class="user-avatar" src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif">
                <i class="el-icon-caret-bottom"></i>
            </div>
            <el-dropdown-menu class="user-dropdown" slot="dropdown">
                <router-link class='inlineBlock' to="/booklib/BookList">
                    <el-dropdown-item>
                        首页
                    </el-dropdown-item>
                </router-link>
               <!-- <a target='_blank' href="https://github.com/Youli-slz/real-admin">
                    <el-dropdown-item>
                        项目地址
                    </el-dropdown-item>
                </a>-->
                <el-dropdown-item divided><span @click="logout" style="display:block;">退出登录</span></el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </el-menu>
</template>

<script>
    import { mapGetters } from 'vuex';
    import Levelbar from './Levelbar';
    import TabsView from './TabsView';
    import Hamburger from 'components/Hamburger';
    import Screenfull from 'components/Screenfull';
    import ErrorLog from 'components/ErrLog';
    import errLogStore from 'store/errLog';

    export default {
      components: {
        Levelbar,
        TabsView,
        Hamburger,
        ErrorLog,
        Screenfull
      },
      data() {
        return {
          log: errLogStore.state.errLog
        }
      },
      computed: {
        ...mapGetters([
          'sidebar',
          'name',
          'avatar'
        ])
      },
      methods: {
        toggleSideBar() {
          this.$store.dispatch('ToggleSideBar')
        },
        getCookie: function(name){
            var arr,reg = new RegExp("(^| )" + name+"=([^;]*)(;|$)");

            if(arr=document.cookie.match(reg)){
                return unescape(arr[2]);
            }
            else{
                return null;
            }
        },
        logout() {
          var self = this;
          var ca = self.getCookie('token');
          this.$http.get('http://wxmp.gatao.cn/realtech/logout?token='+ca)
              .then((response) => {
                  var data = response.data;
                  if(data.code == 0){
                      self.$router.push("/");
                  }
              },(response) =>{
                  console.logg(response);
              });
        }
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .navbar {
        height: 50px;
        line-height: 50px;
        border-radius: 0px !important;
        .hamburger-container {
            line-height: 58px;
            height: 50px;
            float: left;
            padding: 0 10px;
        }
        .errLog-container {
            display: inline-block;
            position: absolute;
            right: 150px;
        }
        .screenfull{
             position: absolute;
             right: 90px;
             top: 16px;
             color: red;
        }
        .avatar-container {
            height: 50px;
            display: inline-block;
            position: absolute;
            right: 35px;
            .avatar-wrapper {
                cursor: pointer;
                margin-top:5px;
                position: relative;
                .user-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }
                .el-icon-caret-bottom {
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
</style>



