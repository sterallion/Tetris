<template>
  <div id="app" class="app">
    <main class="--container">
      <Tetris></Tetris>
    </main>
    <div class="--overlay-bg"></div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from "vue-property-decorator"
  import Tetris from "./components/Tetris"

  @Component({
    components: { Tetris },
  })
  export default class App extends Vue {
  }
</script>

<style src="./scss/app.scss" lang="scss"></style>

<!--Short BEM-->
<style lang="scss" scoped>
  .app {
    position: fixed;
    width: 100%;
    height: 100%;
    display: flex;

    .--container {
      position: relative;
      z-index: 1;
      display: flex;
      flex-basis: 100%;
      height: 100%;
      justify-content: center;
    }

    .--overlay-bg {
      position: absolute;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, .8);
      top: 0;
      left: 0;
    }
  }

</style>
