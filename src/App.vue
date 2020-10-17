<template>
  <div id="app">
    <textarea name="name" style="visibility: visible" v-model="content"></textarea>
  </div>
</template>

<script>

export default {
  name: 'App',
  data(){
    return {
      content: "bla bla"
    };
  },
  mounted(){
    // const el = document.querySelector('textarea');
    let root = this;

    // document.domain = 'null'
      // Open the iframe
      this.stackedit.openFile({
        name: 'Filename', // with an optional filename
        content: {
          text: root.content // and the Markdown content.
        }
      });

      // Listen to StackEdit events and apply the changes to the textarea.
      this.stackedit.on('fileChange', (file) => {
        root.content = file.content.text;
      });

      this.ipcRenderer.on('NEW_FILE', filename => {
        root.stackedit.openFile({
          name: filename, // with an optional filename
          content: {
            text: root.content // and the Markdown content.
          }
        });
      })

      this.ipcRenderer.on('FILE_OPEN', (event, args) => {
        root.fs.readFile(args[0], 'utf8', function (err, data) {
          if (err) return console.log(err);
          root.content = data;
          root.stackedit.openFile({
            name: 'Filename', // with an optional filename
            content: {
              text: root.content // and the Markdown content.
            }
          });
        });
      })

      this.ipcRenderer.on('FILE_SAVE', (event, args) => {
        root.fs.writeFile(args, root.content, function (err) {
          if (err) return console.log(err);
        });
      })

      // this.dialog.showOpenDialog({
      //   properties: ['openFile']
      //   }).then(result => {
      //     console.log(result);
      //     console.log(result.canceled)
      //     console.log(result.filePaths)
      //   }).catch(err => {
      //     console.log(err)
      //   })
  },
  components: {
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
