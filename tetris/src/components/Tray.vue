<template>
  <v-container class="tray">
    <v-row
      v-for="(tetromino, i) in normalizedOrientations"
      :key="i"
      style="position: relative;"
      :style="move(tetromino)"
    >
      <v-col cols="auto" :class="screenSize === 'xs' ? '' : 'pa-4'">
        <div v-for="(row, r) in tetromino" class="previewRow" :key="r">
          <div
            v-for="(col, c) in row"
            :key="r * 4 + c"
            :class="[
              col,
              screenSize === 'xs' ? 'previewCell_xs' : 'previewCell',
            ]"
          ></div>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="!items || items.length < 4">
      <v-col class="text-center pa-0 mb-2" style="color:white;">HOLD</v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: ["items", "screenSize"],

  computed: {
    normalizedOrientations() {
      //Isolate tetromino coords and make them all length 4 for consistent display in component.

      let orientations = this.items ? this.items.map((t) => {
        if (t.name === "I") {
          //Retain two rows of I Tetromino to prevent tray from resizing.
          return t.orientation.slice(1, 3);
        } else {
          return t.orientation.filter((r) => r.some((c) => c));
        }
      }) : [
        [
          ["", "", "", ""],
          ["", "", "", ""],
        ]
      ];

      let normalized = orientations?.map((o) => {
        let orientation = o.slice();

        return orientation?.map((a) => {
          if (a.length === 3) {
            return [""].concat(a);
          } else {
            return a;
          }
        });
      });

      return normalized;
    },
  },

  methods: {
    move(tetromino) {
      let shape = tetromino.flat().filter(c => c)[0];

      if (shape !== "I" && shape !== "O") {
        if (this.screenSize !== 'xs') {
          return {right: '.5rem'};
        } else {
          return {right: '.25rem'};
        }
      }
      
      if (shape === "I") {
        if (this.screenSize === 'xs') {
          return {top: '.25rem'};
        } else {
          return {top: '.5rem'};
        }
      }

      return;
    },
  },
};
</script>

<style>
.tray {
  background: #1a237e;
  border: 1px solid white;
  border-radius: 3px;
}
.previewRow {
  display: flex;
  margin: auto;
}
.previewCell {
  display: inline;
  width: 1rem;
  height: 1rem;
}
.previewCell_xs {
  display: inline;
  width: 0.5rem;
  height: 0.5rem;
}
</style>