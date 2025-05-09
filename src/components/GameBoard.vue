<template>
  <div class="board-box">
    <div class="board-area" :style="{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }">
      <canvas id="board" ref="canvasBoard" :width="renderWidth" :height="renderHeight"></canvas>
      <canvas id="piece" ref="canvasPiece" :width="renderWidth" :height="renderHeight"></canvas>
      <canvas id="info" ref="canvasInfo" :width="renderWidth" :height="renderHeight" class="needsclick"
        @contextmenu.prevent @mousedown="onMouseDown" @touchstart="onMouseDown"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useQuasar, throttle, debounce } from 'quasar'
import { Move, isInBoard, makeCoord, unpackCoord } from 'src/services/game-types';
import { BoardProps, CanvasConfig, drawBoardLayer, drawPieceLayer, drawInfoLayer } from './GameBoard';

defineOptions({
  name: 'GameBoard',
});

const props = defineProps<BoardProps>()
const emit = defineEmits<{
  clickMove: [move: Move, button: number]
}>()

const paddingScale = computed(() => $q.screen.width > 640 && $q.screen.height > 800 ? 2 : 1)
const canvasPadding = computed(() => 26 * paddingScale.value)
const canvasPaddingUp = computed(() => 10 * paddingScale.value)
const canvasWidth = computed(() => {
  const MinWidth = 300
  const DownMargin = 200
  return Math.max(Math.min($q.screen.width, $q.screen.height - DownMargin), MinWidth)
})
const canvasHeight = computed(() => {
  return canvasWidth.value - canvasPadding.value + canvasPaddingUp.value
})
const renderRatio = computed(() => {
  return window.devicePixelRatio || 1
})
const renderWidth = computed(() => {
  return Math.round(canvasWidth.value * renderRatio.value)
})
const renderHeight = computed(() => {
  return Math.round(canvasHeight.value * renderRatio.value)
})

const $q = useQuasar()
const canvasBoard = ref<HTMLCanvasElement>()
const canvasPiece = ref<HTMLCanvasElement>()
const canvasInfo = ref<HTMLCanvasElement>()
let selectedMove = ref<Move | null>(null)


function drawLayers(layerStartIndex: number) {
  const canvasConfig = {
    width: canvasWidth.value,
    height: canvasHeight.value,
    padding: canvasPadding.value,
    paddingUp: canvasPaddingUp.value,
    boardPixels: canvasWidth.value - 2 * canvasPadding.value,
    renderRatio: renderRatio.value,
    isImageExport: false,
  } as CanvasConfig

  if (layerStartIndex <= 0 && canvasBoard.value) {
    const ctx = canvasBoard.value.getContext('2d')
    if (ctx) drawBoardLayer(ctx, canvasConfig, props)
  }
  if (layerStartIndex <= 1 && canvasPiece.value) {
    const ctx = canvasPiece.value.getContext('2d')
    if (ctx) drawPieceLayer(ctx, canvasConfig, props)
  }
  if (layerStartIndex <= 2 && canvasInfo.value) {
    const ctx = canvasInfo.value.getContext('2d')
    if (ctx) drawInfoLayer(ctx, canvasConfig, props, selectedMove.value)
  }
}

function eventInfoFromEvent(event: MouseEvent | TouchEvent) {
  let eventInfo = { clientX: -1, clientY: -1, button: 0 }
  if (event.type == 'touchstart' || event.type == 'touchmove' || event.type == 'touchend') {
    event.preventDefault()
    const touchEvent = event as TouchEvent
    eventInfo.clientX = touchEvent.touches[0].clientX
    eventInfo.clientY = touchEvent.touches[0].clientY
  } else {
    const mouseEvent = event as MouseEvent
    eventInfo.clientX = mouseEvent.clientX
    eventInfo.clientY = mouseEvent.clientY
    eventInfo.button = mouseEvent.button
  }
  return eventInfo
}

function onMouseDown(event: MouseEvent | TouchEvent) {
  if (!canvasBoard.value) return
  const eventInfo = eventInfoFromEvent(event)
  const cellSize = (canvasWidth.value - 2 * canvasPadding.value) / props.boardSize
  const xPixels = eventInfo.clientX - canvasBoard.value.getBoundingClientRect().left
  const yPixels = eventInfo.clientY - canvasBoard.value.getBoundingClientRect().top
  const x = Math.floor((xPixels - canvasPadding.value) / cellSize)
  const y = Math.floor((yPixels - canvasPaddingUp.value) / cellSize)
  const coord = makeCoord(x, props.boardSize - 1 - y)

  if (props.settings.clickBehavior == 'direct' || eventInfo.button != 0 || props.noCoordSelection) {
    if (isInBoard(coord, props.boardSize))
      emit('clickMove', coord, eventInfo.button)
    else if (x == props.boardSize && y == props.boardSize)
      emit('clickMove', 'pass', eventInfo.button)
  } else if (props.settings.clickBehavior == 'second') {
    if (selectedMove.value) {
      const [selectedX, selectedY] = selectedMove.value == 'pass'
        ? [props.boardSize, -1]
        : unpackCoord(selectedMove.value);
      const dx = Math.abs(x - selectedX)
      const dy = Math.abs(props.boardSize - 1 - y - selectedY)
      if (Math.max(dx, dy) <= 1)
        emit('clickMove', selectedMove.value, eventInfo.button)
      selectedMove.value = null
    } else if (isInBoard(coord, props.boardSize))
      selectedMove.value = coord
    else if (x == props.boardSize && y == props.boardSize)
      selectedMove.value = 'pass'
  } else if (props.settings.clickBehavior == 'slide') {
    const coord = makeCoord(x, props.boardSize - y)
    selectedMove.value = isInBoard(coord, props.boardSize) ? coord :
      x == props.boardSize && y == props.boardSize ? 'pass' : null
  }
}

function onMouseMove(event: MouseEvent | TouchEvent) {
  if (!canvasBoard.value) return
  if (props.settings.clickBehavior != 'slide') return
  if (!selectedMove.value) return

  const eventInfo = eventInfoFromEvent(event)
  const cellSize = (canvasWidth.value - 2 * canvasPadding.value) / props.boardSize
  const xPixels = eventInfo.clientX - canvasBoard.value.getBoundingClientRect().left
  const yPixels = eventInfo.clientY - canvasBoard.value.getBoundingClientRect().top
  const x = Math.floor((xPixels - canvasPadding.value) / cellSize)
  const y = Math.floor((yPixels - canvasPaddingUp.value) / cellSize)
  const coord = makeCoord(x, props.boardSize - y)
  if (coord != selectedMove.value)
    selectedMove.value = isInBoard(coord, props.boardSize) ? coord :
      x == props.boardSize && y == props.boardSize ? 'pass' : null
}

function onMouseUp(event: MouseEvent | TouchEvent) {
  if (!canvasBoard.value) return
  if (props.settings.clickBehavior != 'slide') return
  if (!selectedMove.value) return

  const eventInfo = eventInfoFromEvent(event)
  if (selectedMove.value == 'pass' || isInBoard(selectedMove.value, props.boardSize))
    emit('clickMove', selectedMove.value, eventInfo.button)
  selectedMove.value = null
}

const debouncedRrawAllLayers = debounce(() => drawLayers(0), 50)
const throttledDrawInfoLayer = throttle(() => drawLayers(2), 10)
watch([() => $q.screen.width, () => $q.screen.height, () => props.boardSize], debouncedRrawAllLayers)
watch(() => props.settings, debouncedRrawAllLayers, { deep: true })
watch([() => props.history, () => props.nextMove, () => props.winline, () => props.forbids, () => props.previewPV], () => drawLayers(1), { deep: true })
watch(() => props.multiPVInfo, throttledDrawInfoLayer, { deep: true })
watch(() => props.startIndex, () => drawLayers(1))
watch(() => props.thinking, () => drawLayers(2))
watch(selectedMove, throttledDrawInfoLayer)

onMounted(() => {
  drawLayers(0)
  window.addEventListener('mousemove', throttle(onMouseMove, 50))
  window.addEventListener('mouseup', onMouseUp)
  window.addEventListener('touchmove', throttle(onMouseMove, 50), { passive: false })
  window.addEventListener('touchend', onMouseUp, { passive: false })
})

</script>

<style lang="scss" scoped>
.board-box {
  width: 100%;
}

.board-area {
  position: relative;
  margin: 0 auto;
}

canvas {
  position: absolute;
  width: 100%;
  height: 100%;
  touch-action: none;

  #board {
    z-index: 1;
  }

  #piece {
    z-index: 2;
  }

  #info {
    z-index: 3;
  }
}
</style>
