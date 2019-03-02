<template>
  <div class="tetris-menu">
    <div class="--box">
      <h1>Classic Tetris</h1>

      <button v-for="button in buttons"
              :class="button.class"
              v-if="button.isShow"
              @click="button.click">
        {{ button.name }}
      </button>

      <div v-if="isShow || isNewHighscore" class="--highscores">
        <div class="--cell-number --head-title">#</div>
        <div class="--cell-score --head-title">score</div>
        <div class="--cell-lines --head-title">lines</div>
        <div
            v-for="(item, i) in getScore"
            class="--row-score"
            :class="{'-active': i === indexScore && isNewHighscore}">
          <div class="--cell-number">{{ i + 1 }}</div>
          <div class="--cell-score">{{ item.score }}</div>
          <div class="--cell-lines">{{ item.lines }}</div>
        </div>
      </div>
    </div>
    <div class="--overlay"></div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'

  const progress = namespace('progress')

  @Component({
    name: 'TetrisMenu',
  })
  export default class Settings extends Vue {
    @Prop() hasGameProgress!: boolean

    @progress.State indexScore

    @progress.Getter getScore

    isShow: boolean = false

    get buttons():object[] {
      return [
        {
          name: 'Resume',
          class: 'btn-green',
          isShow: this.hasGameProgress,
          click: this.onClickResume,
        },
        {
          name: 'New game',
          class: this.hasGameProgress ? 'btn-orange' : 'btn-green',
          isShow: true,
          click: this.onClickNewGame,
        },
        {
          name: 'Highscores',
          class: 'btn-blue',
          isShow: this.getScore.length,
          click: this.onClickHighscores,
        },
      ]
    }

    get isNewHighscore(): boolean {
      return !!this.getScore[this.indexScore]
    }

    onClickResume(): void {
      this.$emit('tetris:resume')
    }

    onClickNewGame(): void {
      this.$emit('tetris:new-game')
    }

    onClickHighscores(): void {
      this.isShow = !this.isShow
    }
  }
</script>

<!--Short BEM-->
<style lang="scss" scoped>
  .tetris-menu {
    .--box {
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      transform: translateY(-50%);
      z-index: 1;
      text-align: center;
      font-size: 2rem;
      font-weight: bold;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #ffca00;
    }

    .--overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);
    }

    .--highscores {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      font-size: 1.2rem;
      font-weight: normal;
      width: 240px;
    }

    .--row-score {
      display: flex;
      margin-top: .3rem;

      &.-active {
        color: #009e1b;
        font-weight: bold;
      }
    }

    .--head-title {
      font-size: 1.5rem;
      font-weight: bold;
    }

    .--cell-number {
      width: 40px;
    }

    .--cell-score {
      width: 100px;
      text-align: left;
    }

    .--cell-lines {
      width: 100px;
      text-align: left;
    }
  }
</style>