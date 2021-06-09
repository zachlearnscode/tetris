<template>
  <div>
    <div v-for="(row, r) in tetromino" class="previewRow" :key="r">
      <div
        v-for="(col, c) in row"
        :key="r * 4 + c"
        :class="[col, screenSize === 'xs' ? 'previewCell_xs' : 'previewCell']"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["tetromino", "screenSize"],
};
</script>

<style>
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