<template>
  <div id="app">
    <main>
      <tetris></tetris>
    </main>
    <div class="overlay"></div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import Tetris from './components/Tetris.vue';

  @Component({
    components: {
      Tetris
    },
  })
  export default class App extends Vue {
  }
</script>

<style src="./app.scss" lang="scss"></style>
