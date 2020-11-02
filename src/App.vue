<template>
  <div id="app">
    <div id="text-editor" v-show="!dashboard">
      <textarea name="name" style="display: none" v-model="content"></textarea>
    </div>
    <div v-show="dashboard" style="padding:10px;">
      <div :class="{modal:true, 'is-active':want_to_delete}">
        <div class="modal-background"></div>
        <div class="modal-content">
          <p>Sei sicura di voler eliminare <b>{{file_to_delete.title}}</b>?</p>
          <div class="buttons is-centered">
            <div class="button is-success" @click="delete_file(file_to_delete)">
              Si, ELIMINA
            </div>
            <div class="button is-danger" @click="want_to_delete=false;">
              NO, ci penso!
            </div>
          </div>
        </div>
      </div>
      <div v-if="notification"
        :class="{
          'notification':true,
          'is-danger': !notification.ok,
          'is-coq': notification.ok
          }"
          style="position: absolute;
                z-index: 100;
                right: 0;
                min-width: 200px;
                margin-right: 10px;"
        >
        <button class="delete" @click="notification=false;"></button>
        <p class="is-size-4">{{notification.title}}</p>
        <p>{{notification.expl}}</p>
      </div>
      <div class="tile is-ancestor">
        <div class="tile is-vertical is-12">
          <div class="tile">
            <div class="tile is-3 is-parent is-vertical is-paddingless" style="height:100vh;">
              <article class="tile is-child notification is-coq" style="height:50vh; margin-bottom:0!important;">
                <p class="is-size-4" style="text-align:initial;">Home</p>
                    <figure class="image">
                      <img :src="home_image">
                    </figure>
                    <br>
                    <div class="button is-small" @click="set_home">
                      Setta immagine home
                    </div>

                    <div class="box" style="margin-top: 15px;">
                      <p v-if="site">Visita il tuo sito: <a :href="'https://'+site">{{site}}</a></p>
                    </div>

              </article>
              <article class="tile is-child notification is-light">
                <div class="container" style="height:40vh; overflow-y:auto; padding:10px;">
                  <p class="is-size-4" style="text-align:initial;">Azioni</p>
                  <div class="buttons are-small">
                    <button class="button" @click="set_default_dir">Cartella di lavoro</button>
                    <button :class="{'button is-success':true, 'is-loading':wait_publish}" @click="publish">Pubblica</button>
                  </div>
                  <p class="is-size-4" style="text-align:initial;">Profilo</p>
                  <div class="buttons are-small">
                    <button class="button" @click="toggle_cred">{{credbutton}}</button>
                    </div>
                    <template v-if="credinput">
                    <div class="field is-small" style="text-align:initial;">
                      <label class="help">Username</label>
                      <div class="control">
                        <input class="input is-small" type="text" placeholder="Your username" v-model="us">
                      </div>
                    </div>
                    <div class="field is-small" style="text-align:initial;">
                      <label class="help">Author</label>
                      <div class="control">
                        <input class="input is-small" type="text" placeholder="Your username" v-model="author">
                      </div>
                    </div>
                    <div class="field is-small" style="text-align:initial;">
                      <label class="help">Mail</label>
                      <div class="control">
                        <input class="input is-small" type="text" placeholder="Your username" v-model="mail">
                      </div>
                    </div>
                      <div class="field is-small" style="text-align:initial;">
                      <label class="help">Password</label>
                      <div class="field is-small has-addons" style="text-align:initial;">

                        <div class="control is-expanded">
                          <input class="input is-small" :type="(pwdvisible ? 'text': 'password')" placeholder="your password" v-model="pwd">
                        </div>
                        <div class="control">
                          <a class="button is-small" @click="pwdvisible = !pwdvisible">
                            <span v-if="!pwdvisible">Mostra</span>
                            <span v-if="pwdvisible">Nascondi</span>
                          </a>
                        </div>
                      </div>
                      </div>
                      <div class="field is-small" style="text-align:initial;">
                        <label class="help">Site</label>
                        <div class="control">
                          <input class="input is-small" type="text" placeholder="Your username" v-model="site">
                        </div>
                      </div>

                    <div class="field is-grouped">
                      <div class="control">
                        <button class="button is-success" @click="credentials">Setta</button>
                      </div>
                      <div class="control">
                        <button class="button" @click="toggle_cred">Chiudi</button>
                      </div>
                    </div>
                  </template>

                </div>

              </article>
            </div>
            <div class="tile is-parent is-paddingless" style="height:100vh">
              <article class="tile is-child notification is-white">
                <p class="is-size-4" style="text-align:initial;">I tuoi post</p>
                <div class="" style="overflow-y:auto; height:85vh;">
                <template v-if="has_entries">
                  <p style="margin-top: 20%;">Non hai ancora nessun post!</p>
                </template>
                <template v-else>
                  <article v-for="b in blog_data.entries" :key="b.title" class="media">
                    <figure class="media-left" @click="set_preview(b)" style="cursor: pointer;">
                      <p class="image is-128x128">
                        <img v-if="b.preview" :src="img_data(b.preview)">
                        <img v-else src="https://bulma.io/images/placeholders/128x128.png">
                      </p>
                    </figure>
                    <div class="media-content">
                      <div class="content">
                        <p style="margin:0;"><strong class="is-size-4">{{b.title}}</strong></p>
                        <p class="help is-size-6"> <small>Sezione: {{b.type}} | Data di creazione: {{date(b.created)}}</small></p>
                      </div>
                      <nav class="level is-mobile">
                        <div class="level-left">
                            <div class="level-item button is-small is-coq" @click="edit_file(b)">
                              edit
                            </div>
                            <div class="level-item button is-small is-danger" @click="delete_file_ask(b)">
                              delete
                            </div>
                        </div>
                      </nav>
                    </div>
                    <div class="media-right">
                      <div class="field is-grouped is-grouped-multiline">
                        <div class="control">
                          <div class="tags has-addons">
                            <span class="tag is-dark">Status</span>
                            <template v-if="b.published">
                              <span v-if="b.ismodified" class="tag is-warning"><i class="status">Modificato</i></span>
                              <span v-else class="tag is-success"><i class="status">Pubblicato</i></span>
                            </template>
                            <template v-else>
                              <span class="tag is-coq"><i class="status">Bozza</i></span>
                            </template>
                          </div>
                        </div>
                        </div>
                    </div>
                  </article>
                </template>
                </div>
                <button class="button is-success is-large" style="float:right; margin-top:10px;" @click="new_post"><b>Nuovo post</b></button>
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const path = require('path')
const fs = require('fs')
const http = require('isomorphic-git/http/node')
import Stackedit from 'stackedit-js'
import git from 'isomorphic-git'

const stackedit = new Stackedit

export default {
  name: 'App',
  data(){
    return {
      content: "",
      blog:'',
      editing:false,
      blog_data:{},
      dashboard: true,
      default_dir:'',
      cred:'',
      credinput:false,
      us:'',
      pwd:'',
      author: '',
      mail: '',
      site: '',
      pwdvisible: false,
      wait_publish:false,
      notification:false,
      want_to_delete:false,
      file_to_delete:{},
      is_edited:'',
    };
  },
  mounted(){
    // const el = document.querySelector('textarea');
    let root = this;
    this.default_dir = this.electron_store.get('default-directory');
    this.cred = this.electron_store.get('cred') ? this.electron_store.get('cred') : ['','','','',''];
    this.us = this.cred[0] || '';
    this.pwd = this.cred[1] || '';
    this.author = this.cred[2] || '';
    this.mail = this.cred[3] || '';
    this.site = this.cred[4] || '';
    this.blog = path.join(this.default_dir, 'blog.json');
    fs.readFile(root.blog, 'utf8', function (err, data) {
      root.blog_data = JSON.parse(data);
    });

    // document.domain = 'null'
      // Open the iframe
      // stackedit.openFile({
      //   name: 'Filename', // with an optional filename
      //   content: {
      //     text: root.content // and the Markdown content.
      //   }
      // });


      // Listen to StackEdit events and apply the changes to the textarea.
      stackedit.on('fileChange', (file) => {
        root.content = file.content.text;
      });

      stackedit.on('close', (arg) => {
        console.log(arg);
        root.save_file()

      })
      this.ipcRenderer.on('NEW_FILE', filename => {
        root.editing = false;
        root.content = '';
        stackedit.openFile({
          name: filename, // with an optional filename
          content: {
            text: root.content // and the Markdown content.
          }
        });
      })

      this.ipcRenderer.on('FILE_OPEN', (event, args) => {
        fs.readFile(args[0], 'utf8', function (err, data) {
          if (err) return console.log(err);
          root.content = data;
          root.editing = true;
          stackedit.openFile({
            name: 'Filename', // with an optional filename
            content: {
              text: root.content // and the Markdown content.
            }
          });
        });
      })

      this.ipcRenderer.on('FILE_SAVE', (event, args) => {
        console.log(args);
        fs.writeFile(args.file, root.content, function (err) {
          if (err) return console.log(err);
          fs.readFile(root.blog, 'utf8', function (err, data) {
            root.blog_data = JSON.parse(data);
            let date = new Date;
            if(!root.editing){
              root.blog_data.entries[args.name] = {
                title: args.name,
                type: args.type,
                preview: args.preview,
                published: false,
                created:date.toJSON(),
                modified:date.toJSON(),
              };
            } else {
              root.blog_data.entries[args.name].modified = date.toJSON();
            }

            fs.writeFile(root.blog, JSON.stringify(root.blog_data), function (err) {
              if (err) return console.log(err);
            });
          });
        });
      })
      this.ipcRenderer.on('DASH', () => {
        root.dashboard = true;
      });
      // document.getElementsByClassName('stackedit-container')[0].style.display = "none";
  },
  methods:{
    set_default_dir() {
      this.dialog.showOpenDialog({
        title: "Set the default directory",
        properties: ['openDirectory']
      })
      .then(function(fileObj) {
         // the fileObj has two props
         if (!fileObj.canceled) {
           this.electron_store.set('default-directory', fileObj.filePaths[0]);
         }
      })
      .catch(function(err) {
         console.error(err)
      })
    },
    async publish() {
      this.wait_publish = true;
      const data = JSON.parse(fs.readFileSync(this.blog, 'utf8'));
      const old_data = JSON.parse(JSON.stringify(data));

      for(let entry in data.entries){
        data.entries[entry].published = true;
        data.entries[entry].ismodified = false;
      }
      fs.writeFile(this.blog, JSON.stringify(data), function (err) {
        if(err) {
          root.notification = {
            title: 'Abbiamo problemi sul tuo computer!',
            expl: err,
            ok:false,
          }
          return;
        } else {
          root.blog_data = data;
        }
      })
      const root = this;
      const globby = require('globby');
      const _dir = this.default_dir;
      const dir = path.join(_dir, '../..')
      const paths = await globby(_dir, { gitignore: true });
      for (const filepath of paths) {
          const rel_path = path.relative(dir, filepath)
          await git.add({ fs, dir:dir, filepath:rel_path });
      }

      const email = this.email;
      const author = this.author;
      const date = new Date();
      await git.commit({
        fs,
        dir: dir,
        author: {
          name: author,
          email: email,
        },
        message: 'posting on ' + date.toJSON()
      })
      let pushResult = await git.push({
        fs,
        http,
        dir: dir,
        remote: 'origin',
        ref: 'master',
        onAuth: url => {
          console.log(url);
          let auth = {username:this.us, password: this.pwd}
          if (auth) return auth

          if (confirm('This repo is password protected. Ready to enter a username & password?')) {
            auth = {
              username: prompt('Enter username'),
              password: prompt('Enter password'),
            }
            return auth
          } else {
            return { cancel: true }
          }
        },
      })
      if(pushResult.ok){
        this.wait_publish = false;
        this.notification = {
          title: 'Pubblicato con successo!',
          expl: 'Attendi qualche minuto per vedere le modifiche live',
          ok:true,
        }
      } else {
        this.notification = {
          title: 'Qualcosa è andato storto!',
          expl: pushResult.error,
          ok:false,
        }
        fs.writeFile(this.blog, JSON.stringify(old_data), function (err) {
          if(err) {
            root.notification = {
              title: 'Abbiamo problemi con il rollback dei dati! Contatta TOPO!',
              expl: err,
              ok:false,
            }
            return;
          } else {
            root.blog_data = old_data;
          }
        })
      }
      // .then(function(resp){
      //     console.log(resp);
      // })
      // .catch(function(err){
      //   console.log(err);
      // })
    },
    save_file(){
      const root = this;
      this.dialog.showSaveDialog({
        filters: [{
           name: 'markdown (.md)',
           extensions: ['md']
         }],
        defaultPath: (this.editing ? this.is_edited : this.default_dir),
        title: "Save File"
      })
      .then(function(fileObj) {
         // the fileObj has two props
         if (!fileObj.canceled) {
           const dir = path.parse(fileObj.filePath).dir;
           const name = path.parse(fileObj.filePath).name
           const els = dir.split(path.sep);
           const type = els[els.length-1];
           const file = fileObj.filePath;
           const preview = '';
           fs.writeFile(file, root.content, function (err) {
             if (err) return console.log(err);
             fs.readFile(root.blog, 'utf8', function (err, data) {
               root.blog_data = JSON.parse(data);
               let date = new Date;
               if(!root.editing){
                 root.blog_data.entries[name] = {
                   title: name,
                   type: type,
                   preview: preview,
                   published: false,
                   ismodified: false,
                   created:date.toJSON(),
                   modified:date.toJSON(),
                 };
               } else {
                 root.blog_data.entries[name].modified = date.toJSON();
                 root.blog_data.entries[name].ismodified = true;
               }
               fs.writeFile(root.blog, JSON.stringify(root.blog_data), function (err) {
                 if (err) return console.log(err);
               });
             });
           });
         }
      })
      .catch(function(err) {
         console.error(err)
      })
    },
    set_preview(file){
      const root = this;
      console.log(file);
      this.dialog.showOpenDialog({
        properties: ['openFile'],
        title: "Open File",
        defaultPath: path.join(root.default_dir, 'images'),
      })
      .then(function(fileObj) {
         // the fileObj has two props
         if (!fileObj.canceled) {
           console.log(root.blog);
           const data = JSON.parse(fs.readFileSync(root.blog, 'utf8'));
           data.entries[file.title].preview = path.parse(fileObj.filePaths[0]).base;
           fs.writeFile(root.blog, JSON.stringify(data), function (err) {
             if(err) console.log(err);
             root.blog_data = data;
           })
         }
      })
      .catch(function(err) {
         console.error(err)
      })
    },
    delete_file_ask(file) {
      this.want_to_delete = true;
      this.file_to_delete = file;
    },
    delete_file(file) {
      const filename = path.join(this.default_dir, file.type, file.title+'.md');
      const root = this;
      let removed = false;
      try {
        fs.unlinkSync(filename)
        removed = true;
      } catch(err) {
        console.error(err)
      }
      if(removed){
        const data = JSON.parse(fs.readFileSync(this.blog, 'utf8'));
        delete data.entries[file.title]
        fs.writeFile(root.blog, JSON.stringify(data), function (err) {
          if(err) {
            root.notification = {
              title: 'Qualcosa è andato storto!',
              expl: err,
              ok:false,
            }
          } else {
            root.want_to_delete = false;
            root.notification = {
              title: 'Eliminato con successo!',
              expl: 'Brava e bella!',
              ok:true,
            }
            root.blog_data = data;
          }
        })
      }
    },
    edit_file(file) {
      const filename = path.join(this.default_dir, file.type, file.title+'.md')
      this.is_edited = filename;
      const root = this;
      fs.readFile(filename, 'utf8', function (err, data) {
        if (err) return console.log(err);
        root.content = data;
        root.editing = true;
        stackedit.openFile({
          name: 'Filename', // with an optional filename
          content: {
            text: root.content // and the Markdown content.
          }
        });
      });
    },
    toggle_cred(){
      this.credinput = !this.credinput;
    },
    credentials() {
      this.electron_store.set('cred', [this.us, this.pwd, this.author, this.mail, this.site]);
    },
    continue_post() {
      this.dashboard = false;
    },
    new_post() {
      // this.dashboard = false;
      this.editing = false;
      this.content = '';
      stackedit.openFile({
        name: 'new', // with an optional filename
        content: {
          text: this.content // and the Markdown content.
        }
      });
    },
    date(date) {
      const _date = new Date(date).toLocaleDateString();
      const _time = new Date(date).toLocaleTimeString();
      return `${_date} alle ${_time}`
    },
    img_data(name) {
      const data = fs.readFileSync(path.join(this.default_dir, 'images', name))
      return `data:image/${name.split('.')[1]};base64, ${Buffer.from(data).toString('base64')}`
    },
    set_home() {
      const root = this;
      this.dialog.showOpenDialog({
        properties: ['openFile'],
        title: "Open File",
        defaultPath: path.join(root.default_dir, 'images'),
      })
      .then(function(fileObj) {
         // the fileObj has two props
         if (!fileObj.canceled) {
           console.log(root.blog);
           const data = JSON.parse(fs.readFileSync(root.blog, 'utf8'));
           data.home.image = fileObj.filePaths[0];
           fs.writeFile(root.blog, JSON.stringify(data), function (err) {
             if(err) console.log(err);
             root.blog_data = data;
           })
         }
      })
      .catch(function(err) {
         console.error(err)
      })
    },
  },
  computed: {
    has_entries() {
      if(this.blog_data.entries){
        return Object.keys(this.blog_data.entries).length === 0
      } else {
        return false;
      }

    },
    credbutton() {
      if(this.credinput){
        return "Nascondi Credenziali";
      } else {
        return 'Mostra Credenziali';
      }
    },
    home_image() {
      let image = false;
      try {
        image = this.blog_data.home.image;
      } catch (e) {
        image = false;
      }
      if(image){
        const data = fs.readFileSync(image);
        return 'data:image/jpg;base64, ' + Buffer.from(data).toString('base64');
      } else {
        return "https://bulma.io/images/placeholders/640x480.png";
      }
    },
  },
  components: {
  },
  watch:{
    // dashboard() {
    //   // if(n){
    //   //   document.getElementsByClassName('stackedit-container')[0].style.display = "none";
    //   // } else {
    //   //   document.getElementsByClassName('stackedit-container')[0].style.display = "block";
    //   // }
    // }
  }
}
</script>

<style>

@import "./assets/bulma-c.css";
.stackedit-iframe-container{
  top: 10% !important;
  left: 10% !important;
  right: 10% !important;
  width: 80% !important;
  bottom: 10% !important;
  height: 80% !important;
}

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

.tags .status{
  transition: all 0.3 ease;
  display: none;
}
.status:hover{
display:block;

}
.tags:hover .status{
display: block;
}

</style>
