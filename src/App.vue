<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    export default{
      name: 'APP',
      methods:{
          getCookie: function (name) {
              var arr,reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)");
              if(arr= document.cookie.match(reg)){
                 return unescape(arr[2]);
               }
               else{
                   return null;
               }
          },
          checklogin: function(){
              self = this;
            //   alert(111111);
              var ca = this.getCookie('token');
              this.$http.get('http://wxmp.gatao.cn/realtech/check_login?token=' + ca)
                  .then(function(res){
                      var data = res.data;
                      if(data.code == 0){
                          this.$router.push('/booklib/BookList');
                      }
                      else{
                          self.$router.push('/');
                      }
                  })
          }
      },
      created(){
          this.checklogin();
      }
    }
</script>

<style lang="scss">
  @import './styles/index.scss'; // 全局自定义的css样式
</style>
