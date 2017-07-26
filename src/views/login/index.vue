<template>
    <div class="login-container">
        <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left"
                 label-width="0px"
                 class="card-box login-form">
            <h3 class="title">系统登录</h3>
            <el-form-item prop="email">
                <span class="svg-container"><wscn-icon-svg icon-class="jiedianyoujian"/></span>
                <el-input name="email" type="text" v-model="loginForm.email" autoComplete="on"
                          placeholder="邮箱"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <span class="svg-container"><wscn-icon-svg icon-class="mima"/></span>
                <el-input name="password" type="password" @keyup.enter.native="handleLogin(loginForm)" v-model="loginForm.password"
                          autoComplete="on" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin(loginForm)">
                    登录
                </el-button>
            </el-form-item>
            <!-- <div class='tips'>账号为:admin 密码随便3位</div> -->
        </el-form>
    </div>
</template>

<script>
    import { isWscnEmail } from 'utils/validate';
    import socialSign from './socialsignin';

    export default {
      components: { socialSign },
      name: 'login',
      data() {
        // const validateEmail = (rule, value, callback) => {
        //   if (!isWscnEmail(value)) {
        //     callback(new Error('请输入正确的合法邮箱'));
        //   } else {
        //     callback();
        //   }
        // };
        const validatePass = (rule, value, callback) => {
          if (value.length < 3) {
            callback(new Error('密码不能小于3位'));
          } else {
            callback();
          }
        };
        return {
          loginForm: {
            email: 'admin',
            password: ''
          },
          RealtechLoginSearch:{
            username: '',
            password: ''
          },
          loginRules: {     /// 登陆规则 ， 校验账号密码
            email: [
                { required: true, trigger: 'blur' }   /// validator: validatePass
            ],
            password: [
                { required: true, trigger: 'blur', validator: validatePass }
            ]
          },
          loading: false,
          showDialog: false
        }
      },
      methods: {
        handleLogin: function(loginForm) {
          // this.$refs.loginForm.validate(valid => {
          //   if (valid) {
          //     this.loading = true;
          //     this.$store.dispatch('LoginByEmail', this.loginForm).then(() => {
          //       this.loading = false;
          //       this.$router.push({ path: '/booklib/BookList' });      /// 登陆成功后，重定向到书籍列表页面
          //       // this.showDialog = true;
          //     }).catch(err => {
          //       this.$message.error(err);
          //       this.loading = false;
          //     });
          //   } else {
          //     console.log('error submit!!');
          //     return false;
          //   }
          // });
          // 调用后台接口的登录方法
          var self = this;
          self.RealtechLoginSearch.username = self.loginForm.email;
          self.RealtechLoginSearch.password = self.loginForm.password;
          this.$refs.loginForm.validate(valid => {
            if(valid) {
              self.$http.post('http://wxmp.gatao.cn/realtech/login',{RealtechLoginSearch : self.RealtechLoginSearch})
                  .then((response) => {
                    var data = response.data;
                    if(data.code == 0){
                      self.setCookie("token", data.msg.token, 60*60*30);
                      this.$router.push('/booklib/BookList');
                    }
                    else{
                      alert(data.msg);
                    }
                    console.log(data);
                  },(response) =>{
                    console.log(response);
                  });
            }else{
              console.log('error submit!!');
              return false;
            }
          });
        },
        setCookie: function(cname, cvalue, exdays){
          var expires = "expires=" + exdays;
          console.info(cname + "=" + cvalue + ";" + exdays);
          document.cookie = cname + "=" + cvalue + ";" + expires;
          console.info(document.cookie);
        },
        afterQRScan() {
          // const hash = window.location.hash.slice(1);
          // const hashObj = getQueryObject(hash);
          // const originUrl = window.location.origin;
          // history.replaceState({}, '', originUrl);
          // const codeMap = {
          //   wechat: 'code',
          //   tencent: 'code'
          // };
          // const codeName = hashObj[codeMap[this.auth_type]];
          // if (!codeName) {
          //   alert('第三方登录失败');
          // } else {
          //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
          //     this.$router.push({ path: '/' });
          //   });
          // }
        }
      },
      created() {
        // window.addEventListener('hashchange', this.afterQRScan);
      },
      destroyed() {
        // window.removeEventListener('hashchange', this.afterQRScan);
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    @import "src/styles/mixin.scss";
    .tips{
      font-size: 14px;
      color: #fff;
      margin-bottom: 5px;
    }
    .login-container {
        @include relative;
        height: 100vh;
        background-color: #2d3a4b;

        input:-webkit-autofill {
            -webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
            -webkit-text-fill-color: #fff !important;
        }
        input {
            background: transparent;
            border: 0px;
            -webkit-appearance: none;
            border-radius: 0px;
            padding: 12px 5px 12px 15px;
            color: #eeeeee;
            height: 47px;
        }
        .el-input {
            display: inline-block;
            height: 47px;
            width: 85%;
        }
        .svg-container {
            padding: 6px 5px 6px 15px;
            color: #889aa4;
        }

        .title {
            font-size: 26px;
            font-weight: 400;
            color: #eeeeee;
            margin: 0px auto 40px auto;
            text-align: center;
            font-weight: bold;
        }

        .login-form {
            position: absolute;
            left: 0;
            right: 0;
            width: 400px;
            padding: 35px 35px 15px 35px;
            margin: 120px auto;
        }

        .el-form-item {
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            color: #454545;
        }

        .forget-pwd {
            color: #fff;
        }
    }

</style>
