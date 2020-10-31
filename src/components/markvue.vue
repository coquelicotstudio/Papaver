<template lang="html">
<div class="is-overlay has-background-dark"
  style="z-index: 1000;background: hsla(0, 0%, 21%, 0.44) !important;"
  >
  <div class="container" style="position:absolute; top:10%; bottom:10%; left:10%; right:10%;">
    <div class="navbar is-dark">
      <div v-for="(section, key) in editing" :key="key" class="field has-addons" style="margin-top:5px;margin-left:20px; margin-bottom:5px;">
        <p v-for="button in section" :key="button.title" class="control">
          <button class="button is-light is-text">
            <div class="image">
              <img :src="'icons/'+button.icon" alt="" style="width:13px;">
            </div>
            <span></span>
          </button>
        </p>
      </div>
    </div>
    <div class="columns is-marginless">
      <div class="column is-half has-background-light" style="height: calc(100% - 35px);position: absolute; border-right: solid 1px gray; cursor:text;">
        <div class="" contenteditable="true">

        </div>
      </div>
      <div class="column is-half has-background-light" style="position: absolute;left: 50%;height: calc(100% - 35px);">

      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'markvue',
  data () {
    return {
      editing:{
          general: [
            {
              title:'Save',
              exe: 'save',
              icon: 'save.svg'
            },
            {
              title:'Undo',
              exe: 'undo',
              icon: 'undo.svg'
            },
            {
              title:'Redo',
              exe: 'redo',
              icon: 'redo.svg'
            },
          ],
          font:[
            {
              title:'Bold',
              exe: 'bold',
              icon: 'bold.svg'
            },
            {
              title:'Italic',
              exe: 'italic',
              icon: 'italic.svg'
            },
            {
              title:'Strikethrough',
              exe: 'strikethrough',
              icon: 'strikethrough.png'
            },
            {
              title:'Heading',
              exe: 'heading',
              icon: 'heading.svg'
            }
          ],
          bullets: [
            {
              title:'Bullet list',
              exe: 'ul',
              icon: ''
            },
            {
              title:'Numbered list',
              exe: 'ol',
              icon: 'listol.svg'
            }
          ],
          insert: [
            {
              title:'Image',
              exe: 'image',
              icon: 'image.svg'
            },
            {
              title:'Table',
              exe: 'table',
              icon: 'table.svg'
            },
            {
              title:'Code',
              exe: 'code',
              icon: 'code.svg'
            },
            {
              title:'Quote',
              exe: 'quote',
              icon: 'quote.svg'
            }
          ],
      },
      close: {

      }
    }
  },
  created(){

  }
}
</script>

<style lang="css" scoped>
</style>
