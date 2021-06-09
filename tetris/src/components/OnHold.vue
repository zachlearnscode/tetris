<template>
  <v-container class="pa-0 tray">
    <v-row class="d-flex flex-column align-center ma-0">
      <v-col v-if="onHold" class="d-flex flex-column align-center justify-space-between pb-0">
        <div
          v-for="(row, r) in onHold.orientation.filter((r) => r.some((c) => c))"
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
        <span class="text-center white--text font-weight-thin mt-3">HOLD</span>
      </v-col>
      <v-col v-else class="d-flex flex-column align-center justify-space-between pb-0">
        <div v-for="(row, r) in empty" class="previewRow" :key="r">
          <div
            v-for="(col, c) in row"
            :key="r * 10 + c"
            class="previewCell"
            :class="col"
          ></div>
        </div>
        <span class="text-center white--text mt-1">HOLD</span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: ["onHold"],

  data() {
    return {
      empty: [
        ["", "", "", ""],
        ["", "", "", ""],
      ],
    };
  },
};
</script>

<style>
</style>