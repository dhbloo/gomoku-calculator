<template>
  <div class="bestline-box">
    <div v-for="(coord, index) in bestline" :key="index">
      <div class="move-box" @mouseover="() => emitPVPreview(index)" @mouseleave="emitPVPreview(-1)"
        @dblclick="() => emitPVSet(index)">
        {{ moveToString(coord, true) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Coord, moveToString } from 'src/services/game-types';

defineOptions({
  name: 'BestLine',
});

const props = defineProps<{ bestline: Array<Coord> }>()
const emits = defineEmits<{
  pvPreview: [Array<Coord>],
  pvSet: [Array<Coord>],
}>()

let previousPV = Array<Coord>()

function getSelectedPV(index: number) {
  return props.bestline.slice(0, index + 1)
}
function emitPVPreview(index: number) {
  const pv = getSelectedPV(index)
  if (pv.length === previousPV.length && pv.every((coord, i) => coord === previousPV[i]))
    return
  previousPV = pv
  emits('pvPreview', pv)
}
function emitPVSet(index: number) {
  emits('pvSet', getSelectedPV(index))
}
</script>

<style scoped>
.bestline-box {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  align-content: flex-start;
}

.move-box {
  margin: 0px;
  padding: 2px 4px;
  line-height: 20px;
  border: 1px solid transparent;
  border-radius: 0px;
}

.move-box:hover {
  background-color: #aed6f1;
}
</style>
