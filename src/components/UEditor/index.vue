<template>
  <div>
    <script id="editor" type="text/plain"></script>
  </div>
</template>
<script>
  export default {
    name: 'UE',
    data () {
      return {
        editor: null
      }
    },
    props: {
      defaultMsg: {
        type: String
      },
      config: {
        type: Object
      }
    },
    watch: {
      defaultMsg: function value(val, oldVal) {
        this.editor = UE.getEditor('editor');
        if(val !== null){
          this.editor.setContent(val);
        }
      }
    },
    mounted() {
      const _this = this;
      this.editor = UE.getEditor('editor', this.config); // 初始化UE
      this.editor.addListener("ready", function () {
        _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
      });
      // this.editor.ready(function(){
      //   _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
      // })
    },
    methods: {
      getUEContent() { // 获取内容方法
        return this.editor.getContent()
      }
    },
    destroyed() {
      this.editor.destroy();
    }
  }
</script>

<style>
.edui-default .edui-editor-iframeholder {    
     background-color:transparent; 
 }  
</style>