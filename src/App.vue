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
      content: "bla bla",
      blog:'',
      editing:false,
      blog_data:{}
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
        root.editing = false;
        root.content = '';
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
          root.editing = true;
          root.stackedit.openFile({
            name: 'Filename', // with an optional filename
            content: {
              text: root.content // and the Markdown content.
            }
          });
        });
      })

      this.ipcRenderer.on('FILE_SAVE', (event, args) => {
        console.log(args);
        root.fs.writeFile(args.file, root.content, function (err) {
          if (err) return console.log(err);
          let def = root.electron_store.get('default-directory');
          root.blog = root.path.join(def, 'blog.json');
          root.fs.readFile(root.blog, 'utf8', function (err, data) {
            root.blog_data = JSON.parse(data);
            let date = new Date;
            if(!root.editing){
              root.blog_data.entries[args.name] = {
                title: args.name,
                type: args.type,
                preview: args.preview,
                created:date.toJSON(),
                modified:date.toJSON(),
              };
            } else {
              root.blog_data.entries[args.name].modified = date.toJSON();
            }

            root.fs.writeFile(root.blog, JSON.stringify(root.blog_data), function (err) {
              if (err) return console.log(err);
            });
          });
        });
      })
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
