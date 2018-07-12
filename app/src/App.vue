<template>
  <div id="app">
    <main>
      <tetris></tetris>
    </main>
    <div class="overlay-bg"></div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import Tetris from './components/Tetris'

  @Component({
    components: { Tetris },
  })
  export default class App extends Vue {
  }
</script>

<style src="./scss/app.scss" lang="scss"></style>

<style lang="scss">
  #app {
    position: fixed;
    width: 100%;
    height: 100%;
    display: flex;
  }

  .overlay-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .8);
    top: 0;
    left: 0;
  }
</style>
