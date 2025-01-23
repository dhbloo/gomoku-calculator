<template>
  <div class="bestline-box">
    <div v-for="(pos, index) in bestline" :key="index">
      <div class="move" @mouseover="() => mouseoverPV(index)" @mouseleave="mouseleavePV"
        @dblclick="() => dblclickPV(index)">
        {{ String.fromCharCode('A'.charCodeAt(0) + pos[0]) + (boardSize - pos[1]).toString() }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Bestline',
  props: {
    bestline: Array,
    boardSize: Number,
  },
  data: function () {
    return {
      selectIndex: null,
    }
  },
  methods: {
    getPVResult(index) {
      return {
        position: this.$store.state.ai.lastThinkPosition,
        pv: this.bestline
          .slice(0, index + 1),
      }
    },
    mouseoverPV(index) {
      this.selectIndex = index
      this.$emit('pvPreview', this.getPVResult(index))
    },
    mouseleavePV() {
      this.selectIndex = null
      this.$emit('pvPreview', null)
    },
    dblclickPV(index) {
      this.$emit('pvSet', this.getPVResult(index))
    },
  },
  watch: {
    bestline: function (bestline) {
      if (this.selectIndex) {
        if (this.selectIndex >= bestline.length) {
          this.selectIndex = null
          this.$emit('pvPreview', null)
        } else {
          this.$emit('pvPreview', this.getPVResult(this.selectIndex))
        }
      }
    },
  },
}
</script>

<style lang="less" scoped>
.bestline-box {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  align-content: flex-start;
}

.move {
  margin: 0px;
  padding: 2px 4px;
  line-height: 20px;
  border: 1px solid transparent;
  border-radius: 0px;
}

.move:hover {
  background-color: #aed6f1;
}
</style>
