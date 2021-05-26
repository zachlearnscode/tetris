<template>
  <div id="app">
    <div v-for="(row, r) in board" :key="r">
      <div v-for="(col, c) in row" :key="(r * 10) + c" class="cell">{{col}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},

  data() {
    return {
      board: undefined,
      tetrominos: [],
    };
  },

  methods: {
    buildBoard() {
      let board = [];

      for (let r = 0; r < 20; r++) {
        let row = [];
        for (let c = 0; c < 10; c++) {
          row[c] = "O";
        }
        board[r] = row;
      }

      return board;
    },
  },

  created() {
    this.board = this.buildBoard();
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  /* margin-top: 60px; */
}
.cell {
  display: inline;
}
</style>
