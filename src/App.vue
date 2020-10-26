<template>
  <div id="app">
    <div id="text-editor" v-show="!dashboard">
      <textarea name="name" style="visibility: visible" v-model="content"></textarea>
    </div>
    <div v-show="dashboard" style="padding:10px;">
      <div class="tile is-ancestor">
        <div class="tile is-vertical is-12">
          <div class="tile">
            <div class="tile is-parent is-vertical" style="height:70vh;">
              <article class="tile is-child notification is-coq" style="height:50vh;">
                <p class="is-size-4" style="text-align:initial;">Home Customization</p>
                <div class="columns">
                  <div class="column is-half">
                    <figure class="image is-4by3">
                      <img src="https://bulma.io/images/placeholders/640x480.png">
                    </figure>
                    <br>
                    <div class="button" @click="set_home">
                      Set Home Image
                    </div>
                  </div>
                </div>
              </article>
              <article class="tile is-child notification is-light">
                <p class="is-size-4" style="text-align:initial;">Controls</p>
              </article>
            </div>
            <div class="tile is-parent">
              <article class="tile is-child notification is-white" style="height:70vh">
                <p class="is-size-4" style="text-align:initial;">I tuoi post</p>
                <div class="" style="overflow-y:auto; height:62vh;">


                <article v-for="b in blog_data.entries" :key="b.title" class="media">
                  <figure class="media-left">
                    <p class="image is-128x128">
                      <img :src="img_data(b.preview)">
                    </p>
                  </figure>
                  <div class="media-content">
                    <div class="content">
                      <p style="margin:0;"><strong class="is-size-4">{{b.title}}</strong></p>
                      <p class="help is-size-6"> <small>Sezione: {{b.type}} | Data di creazione: {{date(b.created)}}</small></p>
                    </div>
                    <nav class="level is-mobile">
                      <div class="level-left">
                          <div class="level-item button is-small is-coq">
                            edit
                          </div>
                          <div class="level-item button is-small is-danger">
                            delete
                          </div>
                      </div>
                    </nav>
                  </div>
                  <div class="media-right">
                    <button class="delete"></button>
                  </div>
                </article>
                </div>
              </article>
            </div>
          </div>
          <div class="tile is-parent">
            <article class="tile is-child notification is-coq">
              <p class="is-size-4" style="text-align:initial;">Wide tile</p>
              <div class="content">
                <!-- Content -->
              </div>
            </article>
          </div>
        </div>
      </div>
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
      def:'',
    };
  },
  mounted(){
    // const el = document.querySelector('textarea');
    let root = this;
    this.def = this.electron_store.get('default-directory');
    this.blog = this.path.join(this.def, 'blog.json');
    root.fs.readFile(root.blog, 'utf8', function (err, data) {
      root.blog_data = JSON.parse(data);
    });

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
  methods:{
    date(date) {
      const _date = new Date(date).toLocaleDateString();
      const _time = new Date(date).toLocaleTimeString();
      return `${_date} alle ${_time}`
    },
    img_data(name) {
      const data = this.fs.readFileSync(this.path.join(this.def, 'images', name))
      return 'data:image/jpg;base64, ' + Buffer.from(data).toString('base64');
    },
    set_home() {
      const root = this;
      this.dialog.showOpenDialog({
        properties: ['openFile'],
        title: "Open File",
        defaultPath: root.path.join(root.def, 'images'),
      })
      .then(function(fileObj) {
         // the fileObj has two props
         if (!fileObj.canceled) {
           const data = root.fs.readFileSync(root.blog);
           console.log(data);
           data.home.image = fileObj.filePaths[0];
           console.log(data);
           root.fs.writeFile(root.blog, data, function (err) {
             if(err) console.log(err);
           })
         }
      })
      .catch(function(err) {
         console.error(err)
      })
    },
  },
  components: {
  },
  watch:{
    dashboard(n) {
      if(n){
        console.log(n);
        window.ss = document.getElementsByClassName('stackedit-container')
        document.getElementsByClassName('stackedit-container')[0].style.display = "none";
      } else {
        console.log(n);
        document.getElementsByClassName('stackedit-container')[0].style.display = "block";
      }
    }
  }
}
</script>

<style>

@import "./assets/bulma-c.css";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
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
