<template>
  <div class="tetris">
    <div v-if="isLandscape" class="--landscape">
      Turn me, please
    </div>

    <template v-else>
      <template v-if="isShowGame">
        <div class="--header">
          <div class="--menu" @click.prevent="isPause = true">
            <img src="@/assets/hamburger.svg">
          </div>
          <div class="--score">
            <div>{{ stat.score }} / {{ stat.lines }}</div>
          </div>
          <div class="--grid -mini">
            <div :key="n"
                 v-for="(row, n) in block.next"
                 class="--row">
              <div :key="i"
                   v-for="(cell, i) in row"
                   class="--cell"
                   :class="{[color.next]: cell}">
              </div>
            </div>
          </div>
        </div>

        <div class="--main" ref="main">
          <div class="--grid">
            <div :key="n"
                 v-for="(row, n) in grid"
                 class="--row">
              <div :key="i"
                   v-for="(cell, i) in row"
                   class="--cell"
                   :class="{[cell.color]: cell.state}">
              </div>
            </div>
          </div>
        </div>

        <div class="--footer">
          <div class="--nav-arrow" @touchstart.prevent="touchStart($event, toLeft)" @touchend="touchEnd">&larr;</div>
          <div class="--nav-arrow" @touchstart.prevent="touchStart($event, toRight)" @touchend="touchEnd">&rarr;</div>
          <div class="--nav-arrow" @click.prevent="rotateBlock">&uarr;</div>
          <div class="--nav-arrow" @touchstart.prevent="touchStart($event, toDown)" @touchend="touchEnd">&darr;</div>
        </div>
      </template>
      <TetrisMenu
          v-if="isPause"
          :has-game-progress="hasGameProgress"
          @tetris:new-game="onClickNewGame"
          @tetris:resume="onClickResume"/>
    </template>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'
  import TetrisMenu from '../TetrisMenu'
  import { Block, Color, Stat, State } from '../../types'

  const progress = namespace('progress')

  @Component({
    name: 'Tetris',
    components: { TetrisMenu },
  })
  export default class Tetris extends Vue {
    @progress.Getter getProgress
    @progress.Getter getScore

    @progress.Action setProgress
    @progress.Action setScore

    rows: number = 20
    cells: number = 10

    rowIndex: number = -1
    cellIndex: number = 0

    touchIntervalId: any
    gameIntervalId: any

    grid: State[][] = []

    isPause: boolean = true
    hasGameProgress: boolean = false
    isShowGame: boolean = false
    isLandscape: boolean = false

    stat: Stat = {
      score: 0,
      lines: 0,
    }

    color: Color = {
      current: '',
      next: '',
    }

    colors: string[] = ['-green', '-red', '-blue', '-orange']

    block: Block = {
      current: [],
      next: [],
      process: [],
    }

    blocks: number[][][] = [
      [
        [1, 1, 1, 1],
      ],
      [
        [0, 1, 0],
        [1, 1, 1],
      ],
      [
        [1, 1, 0],
        [0, 1, 1],
      ],
      [
        [0, 1, 1],
        [1, 1, 0],
      ],
      [
        [1, 0, 0],
        [1, 1, 1],
      ],
      [
        [0, 0, 1],
        [1, 1, 1],
      ],
      [
        [1, 1],
        [1, 1],
      ],
    ]

    created() {
      const progress = this.getProgress

      if(Object.keys(progress).length) {
        this.hasGameProgress = true
        this.isShowGame = true

        this.stat = progress.stat
        this.block = progress.block
        this.color = progress.color
        this.grid = progress.grid
      }
    }

    mounted() {
      this.bindEvents()
    }

    createGrid(): void {
      this.grid = []

      for(let n = 0; n < this.rows; n++) {
        this.grid.push([])
        for(let i = 0; i < this.cells; i++) {
          this.grid[n].push({
            state: 0,
            color: '',
          })
        }
      }
    }

    onKeyDown(e: KeyboardEvent): void {
      if(!this.isPause) {
        switch(e.keyCode) {
          case 37:
            this.toLeft()
            break
          case 39:
            this.toRight()
            break
          case 40:
            this.toDown()
            break
          case 38:
            this.rotateBlock()
            break
          case 32:
            this.isPause = true
            break
        }
      }
    }

    isFirstStep(): boolean {
      return !this.block.process.length
    }

    go(): boolean {
      const process: [number, number][] = []
      let amountCells: number = 0

      if(this.isFirstStep()) {
        this.cellIndex = Math.floor((this.cells - this.block.current[0].length) / 2)
      }

      this.block.current.forEach((row, n) => {
        row.forEach((cell, i) => {
          if(cell) {
            const realRow = this.rowIndex + n
            const realCell = this.cellIndex + i

            amountCells++

            if(this.grid[realRow] && this.grid[realRow][realCell] && this.grid[realRow][realCell].state !== -1) {
              process.push([realRow, realCell])
            }
          }
        })
      })

      if(amountCells === process.length) {
        this.block.process.forEach(item => this.grid[item[0]][item[1]].state = 0)

        process.forEach(item => {
          this.grid[item[0]][item[1]].color = this.color.current
          this.grid[item[0]][item[1]].state = 1
        })

        this.block.process = process

        return true
      }

      return false
    }

    toDown(): void {
      let lines: number = 0
      this.rowIndex++

      if(!this.go()) {
        if(this.isFirstStep()) {
          this.touchEnd()

          if(this.stat.score) {
            this.setScore(this.stat)
          }

          this.setProgress({})
          this.hasGameProgress = false
          this.isPause = true
          return
        }

        this.block.process.forEach((item: [number, number]) => this.grid[item[0]][item[1]].state = -1)

        this.block.process.forEach((item: [number, number]) => {
          if(this.grid[item[0]] && this.grid[item[0]].filter((cell: any) => cell.state === -1).length === 10) {
            lines++
            this.stat.score += (item[0] + 1) * lines
            this.grid[item[0]].forEach((cell: any) => cell.state = 0)
            this.grid.unshift(this.grid.splice(item[0], 1)[0])
          }
        })

        this.stat.lines += lines

        this.setDefaultOptions()
        this.setProgress({
          stat: this.stat,
          block: this.block,
          color: this.color,
          grid: this.grid,
        })
        this.toDown()
      }
    }

    toLeft(): void {
      this.cellIndex--

      if(!this.go()) {
        this.cellIndex++
      }
    }

    toRight(): void {
      this.cellIndex++

      if(!this.go()) {
        this.cellIndex--
      }
    }

    rotateBlock(): void {
      let prevCellIndex: number
      let prevBlock: number[][]
      let rules: number[][] = []

      if(this.block.process.length) {
        [...this.block.current].reverse().forEach(line => {
          line.forEach((item, n) => {
            if(!rules[n]) {
              rules[n] = []
            }

            rules[n].push(item)
          })
        })

        const cellIndex = (rules.length - this.block.current.length) / 2
        prevCellIndex = this.cellIndex
        prevBlock = this.block.current
        this.cellIndex += cellIndex > 0 ? Math.floor(cellIndex) : Math.ceil(cellIndex)
        this.block.current = rules

        if(!this.go()) {
          this.cellIndex = prevCellIndex || this.cellIndex
          this.block.current = prevBlock || this.block.current
        }
      }
    }

    setDefaultOptions(): void {
      this.block.process = []
      this.rowIndex = -1
      this.cellIndex = 0

      if(!this.color.current || !this.block.current) {
        this.setNextParams()
      }

      this.color.current = this.color.next
      this.block.current = this.block.next

      this.setNextParams()
    }

    setNextParams(): void {
      this.color.next = this.colors[this.getRandomInt(0, this.colors.length)]
      this.block.next = this.blocks[this.getRandomInt(0, this.blocks.length)]
    }

    getRandomInt(min: number, max: number): number {
      return Math.floor(Math.random() * (max - min)) + min
    }

    onClickNewGame(): void {
      this.isPause = false
      this.hasGameProgress = true
      this.isShowGame = true
      this.color.current = ''
      this.stat.score = 0
      this.stat.lines = 0
      this.createGrid()
      this.setDefaultOptions()
      this.$nextTick(this.onResize)
      this.setProgress({})
    }

    onClickResume(): void {
      this.isPause = false
    }

    touchStart(e: TouchEvent, fn: (() => void)): void {
      if(e.touches.length === 1) {
        fn()
        this.touchIntervalId = setInterval(fn, 100)
      }
    }

    touchEnd(): void {
      clearInterval(this.touchIntervalId)
    }

    checkOrientation(): void {
      this.isLandscape = Math.abs(<number>window.orientation) === 90
    }

    onResize(): void {
      const main = this.$refs.main as HTMLElement
      main.style.width = `${main.offsetHeight / 2}px`
    }

    bindEvents(): void {
      document.addEventListener('keydown', this.onKeyDown)
      window.addEventListener('blur', () => this.isPause = true)

      window.addEventListener('resize', this.onResize)
      this.onResize()

      window.addEventListener('orientationchange', this.checkOrientation)
      this.checkOrientation()
    }

    @Watch('isPause', { immediate: true })
    handler(val: boolean) {
      if(val) {
        clearInterval(this.gameIntervalId)
      } else {
        this.$nextTick(() => this.toDown())
        this.gameIntervalId = setInterval(this.toDown, 500)
      }
    }
  }
</script>

<!--Short BEM-->
<style lang="scss" scoped>
  $headerHeight: 60px;
  $footerHeight: 30px;

  $footerTouchHeight: 80px;

  .tetris {
    display: flex;
    flex-direction: column;

    .--header {
      display: flex;
      height: $headerHeight;
    }

    .--menu {
      width: 20%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }

    .--score {
      width: 50%;
      color: #fff;
      font-size: 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .--footer {
      display: flex;
      height: $footerHeight;

      @include to(md) {
        height: $footerTouchHeight;
      }
    }

    .--nav-arrow {
      width: 25%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.5rem;
      color: #fff;
      font-weight: bold;
      user-select: none;
      @include from(lg) {
        display: none;
      }
    }

    .--landscape {
      position: absolute;
      left: 50%;
      top: 50%;
      font-size: 1.2rem;
      color: #fff;
      transform: translate(-50%, -50%);
    }

    .--main {
      position: relative;
      width: 100%;
      flex: 1 0 auto;
      display: flex;
      flex-direction: column;
      border: 1px solid #2f2f2f;
    }

    .--grid {
      background: rgba(0, 0, 0, 0.6);
      width: 100%;
      display: flex;
      flex-direction: column;
      flex: 1 0 auto;

      &.-mini {
        width: 30%;
        justify-content: center;
        align-items: center;

        .--row {
          flex-basis: auto;
        }

        .--cell {
          width: 1rem;
          height: 1rem;
          flex-basis: auto;
        }
      }
    }

    .--row {
      flex-basis: 5%;
      display: flex;
    }

    .--cell {
      flex-basis: 10%;
      border: 1px solid rgba(35, 35, 35, 0);

      &.-green {
        background: #176d00;
        box-shadow: inset 0 0 4px 2px #28c100;
      }
      &.-red {
        background: #821200;
        box-shadow: inset 0 0 4px 2px #ee000e;
      }
      &.-blue {
        background: #020084;
        box-shadow: inset 0 0 4px 2px #0004ee;
      }
      &.-orange {
        background: #914a00;
        box-shadow: inset 0 0 4px 2px #ee7e00;
      }
    }
  }
</style>