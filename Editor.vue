<template>
  <div id="app">
    <Header class="Header">
      <h1>
        <a href="https://github.com/egoist/vue-template-live-editor">
          Vue Template Live Editor (vue@{{ version }})
        </a>
      </h1>
      <div class="actions">
        <label class="action">
          <input type="checkbox" v-model="stripWith"> Strip with
        </label>
      </div>
    </Header>
    <div class="Main">
      <code-mirror-editor ref="editor" @change="handleChange" v-model="code" :options="editorOptions" />
      <pre class="CodeMirror output cm-s-base16-dark"><code v-html="output.code"></code></pre>
    </div>
  </div>
</template>

<script>
import CodeMirror from 'codemirror'
import CodeMirrorEditor from 'vue-cm'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/mode/javascript/javascript'
import { compile } from 'vue-template-compiler'
import highlight from 'cm-highlight'
import stripWith from 'vue-template-es2015-compiler'
import beautify from 'js-beautify'
import progress from 'nprogress'
import emmet from 'codemirror-emmet'
import lzString from 'lz-string'

emmet(CodeMirror)

export default {
  components: {
    CodeMirrorEditor
  },

  data() {
    return {
      code: `<FinalForm :submit="handleSubmit">
  <form slot-scope="props" @submit="props.handleSubmit">
    <FinalField name="email">
      <div slot-scope="props">
        <input v-on="props.events" type="email">
      </div>
    </FinalField>
  </form>
</FinalForm>`,
      editorOptions: {
        mode: 'htmlmixed',
        lineNumbers: true,
        extraKeys: {
          Tab(cm) {
            // Indent, or place 2 spaces
            if (cm.somethingSelected()) {
              cm.indentSelection('add')
            } else if (cm.getOption('mode').indexOf('html') > -1) {
              try {
                cm.execCommand('emmetExpandAbbreviation')
              } catch (err) {
                console.error(err)
              }
            } else {
              const spaces = Array(cm.getOption('indentUnit') + 1).join(' ')
              cm.replaceSelection(spaces, 'end', '+input')
            }
          },
          Enter: 'emmetInsertLineBreak'
        }
      },
      stripWith: true,
      version: process.env.VERSION
    }
  },
  created() {
    if (this.$route.query.encoded) {
      this.decode(this.$route.query.encoded)
    }
  },
  computed: {
    output() {
      const res = compile(this.code)
      let code = `function render() {${res.render.toString()}}`
      if (this.stripWith) {
        code = stripWith(code)
      }
      return {
        code: highlight(beautify(code, { indent_size: 2 }), { mode: 'javascript' })
      }
    }
  },
  methods: {
    async updateQuery() {
      const base64 = lzString.compressToBase64(this.code)
      this.$router.push({ query: { encoded: base64 } })
    },
    async decode(base64) {
      this.code = lzString.decompressFromBase64(base64)
    },
    handleChange() {
      this.updateQuery()
    }
  }
}
</script>

<style src="nprogress/nprogress.css"></style>
<style src="codemirror/lib/codemirror.css"></style>
<style src="codemirror/theme/base16-dark.css"></style>

<style>
body {
  margin: 0;
  font: 14px/1 -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
}

html, body, #app {
  height: 100%;
}

pre {
  margin: 0;
}

* {
  box-sizing: border-box;
}

.CodeMirror {
  height: 100%;
  width: 50%;
  background: #f5f5f5;
}

.CodeMirror-gutters {
  background: #f5f5f5;
  border-right: none;
}

label {
  user-select: none;
}
</style>

<style scoped>
.Header {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  justify-content: space-between;
}
.Header h1 {
  margin: 0;
  font-weight: 300;
  font-size: 1.25rem;
}
.Header h1 a {
  color: black;
  text-decoration: none;
}
.Main {
  height: calc(100% - 50px);
  display: flex;
}

.output {
  padding: 5px;
}

.actions {
  display: flex;
}

.action {
  margin-left: 10px;
}
</style>
