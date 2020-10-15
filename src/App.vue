<template>
  <div id="app">
    <textarea name="name" style="visibility: hidden"></textarea>
  </div>
</template>

<script>

export default {
  name: 'App',
  data(){
    return {

    };
  },
  mounted(){
    const el = document.querySelector('textarea');

    // document.domain = 'null'
      // Open the iframe
      this.stackedit.openFile({
        name: 'Filename', // with an optional filename
        content: {
          text: el.value // and the Markdown content.
        }
      });

      // Listen to StackEdit events and apply the changes to the textarea.
      this.stackedit.on('fileChange', (file) => {
        el.value = file.content.text;
      });

      this.dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] });
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
