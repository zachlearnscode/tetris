<template>
  <v-container class="pa-0">
    <v-row class="d-flex flex-column align-center ma-0">
      <v-col v-if="onHold">
        <div
          v-for="(row, r) in onHold.orientation.filter((r) =>
            r.some((c) => c)
          )"
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
  props: ['onHold']
}
</script>

<style>

</style>