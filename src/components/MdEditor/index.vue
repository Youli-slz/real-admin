<template>
  <div class='simplemde-container' :style="{height:height+'px',zIndex:zIndex}">
    <textarea :id='id'>
    </textarea>
  </div>
</template>

<script>
import 'simplemde/dist/simplemde.min.css'
import SimpleMDE from 'simplemde'
export default {
  name: 'Sticky',
  props: {             // 组件为props做的制定的验证要求     // 当验证有错是，vue将拒绝在子组件上设置这个值
    value: String,   // 基础类型检测，值为字符串，如果为null则表示可以为任何类型
    id: {
      type: String,      // 必定传值为字符
      default: 'markdown-editor'        // 且有默认值
    },
    autofocus: {
      type: Boolean,      // 必定传值为布尔类型
      default: false                // 默认值为false，往下是相同的作用
    },
    placeholder: {
      type: String,
      default: ''
    },
    height: {
      type: Number,
      default: 150
    },
    zIndex: {
      type: Number,
      default: 10
    },
    toolbar: {
      type: Array    // 数组类型，没有默认值
    }
  },
  data() {
    return {
      simplemde: null,
      hasChange: false
    };
  },
  watch: {
    value(val) {
      if (val === this.simplemde.value() && !this.hasChange) return;
      this.simplemde.value(val);
    }
  },
  mounted() {
    this.simplemde = new SimpleMDE({
      element: document.getElementById(this.id),
      autofocus: this.autofocus,
      toolbar: this.toolbar,
      spellChecker: false,
      insertTexts: {
        link: ['[', ']( )']
      },
      // hideIcons: ['guide', 'heading', 'quote', 'image', 'preview', 'side-by-side', 'fullscreen'],
      placeholder: this.placeholder
    });
    if (this.value) {
      this.simplemde.value(this.value);
    }
    this.simplemde.codemirror.on('change', () => {
      if (this.hasChange) {
        this.hasChange = true
      }
      this.$emit('input', this.simplemde.value());
    });
  },
  destroyed() {
    this.simplemde = null;
  }
};
</script>

<style>
  .simplemde-container .CodeMirror {
    /*height: 150px;*/
    min-height: 150px;
  }
  .simplemde-container .CodeMirror-scroll{
     min-height: 150px;
  }

 .simplemde-container .CodeMirror-code{
   padding-bottom: 40px;
 }
  .simplemde-container  .editor-statusbar {
    display: none;
  }

  .simplemde-container .CodeMirror .CodeMirror-code .cm-link {
    color: #1482F0;
  }

  .simplemde-container .CodeMirror .CodeMirror-code .cm-string.cm-url {
    color: #2d3b4d;
    font-weight: bold;
  }

  .simplemde-container .CodeMirror .CodeMirror-code .cm-formatting-link-string.cm-url {
    padding: 0 2px;
    font-weight: bold;
    color: #E61E1E;
  }
</style>


