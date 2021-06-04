<template>
  <v-container
    class="pa-0"
    style="background: #1a237e; border: 3px solid white; border-radius: 3px"
  >
    <v-row
      v-for="(tetromino, i) in normalizedOrientations"
      :key="i"
      class="d-flex flex-column ma-0"
      style="position:relative;"
      :style="{right: moveRight(tetromino) ? '0.5rem' : ''}"
    >
      <v-col class="pa-4 align-center">
        <div
          v-for="(row, r) in tetromino"
          class="previewRow"
          :key="r"
        >
          <div
            v-for="(col, c) in row"
            :key="r * 10 + c"
            class="previewCell"
            :class="col"
          ></div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: ["nextFour"],

  computed: {
    normalizedOrientations() {
      //Isolate tetromino coords and make them all length 4 for consistent display in component.

      let orientations = this.nextFour
        ?.map(t => t.orientation
          .filter(r => r.some(c => c))
        );

      let normalized = orientations?.map(o => {
       let orientation = o.slice();
       
       return orientation?.map(a => {
         if (a.length === 3) {
           return [""].concat(a);
         } else {
           return a;
         }
       })
      });

      return normalized;
    }
  },

  methods: {
    moveRight(tetromino) {
      //Used to center 3-wide tetrominos in display.
      return !tetromino[0].includes('I') && !tetromino[0].includes("O");
    }
  }
};
</script>

<style>
.previewTetromino {
  margin: 10px;
}
.previewRow {
  /* width: 200px; */
  /* height: 20px; */
  display: flex;
  margin: auto;
}
.previewCell {
  display: inline;
  aspect-ratio: 1/1;
  height: 1rem;
  /* width: 10%; */
}
</style>