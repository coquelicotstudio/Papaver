<template>
  <div id="app">
    <div class="">


    <div id="myModal" class="modal" :style="{display:(dashboard ? 'block' : 'none')}">

      <!-- Modal content -->
      <div class="modal-content">
        <span class="close">&times;</span>
        <p>Some text in the Modal..</p>
      </div>

    </div>
    <textarea name="name" style="visibility: visible" v-model="content"></textarea>
    </div>
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
      blog_data:{},
      dashboard: false,
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

      this.ipcRenderer.on('DASH', () => {
        root.dashboard = true;
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
.modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 2000000; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}

/* Modal Content/Box */
.modal-content {
  background-color: #fefefe;
  margin: 15% auto; /* 15% from the top and centered */
  padding: 20px;
  border: 1px solid #888;
  width: 80%; /* Could be more or less, depending on screen size */
}

</style>
