<template>
  <a-tabs defaultActiveKey="1">
    <a-tab-pane tab="节点" key="1">
      <a-row align="middle">
        <a-col :span="8">Border Color</a-col>
        <a-col :span="14">
          <a-input type="color" :value="globalGridAttr.nodeStroke" style="width: 100%" @change="onStrokeChange"/>
        </a-col>
      </a-row>
      <a-row align="middle">
        <a-col :span="8">Border Width</a-col>
        <a-col :span="12">
          <a-slider :min="1" :max="5" :step="1" :value="globalGridAttr.nodeStrokeWidth" @change="onStrokeWidthChange"/>
        </a-col>
        <a-col :span="2">
          <div class="result">{{ globalGridAttr.nodeStrokeWidth }}</div>
        </a-col>
      </a-row>
      <a-row align="middle">
        <a-col :span="8">Fill</a-col>
        <a-col :span="14">
          <a-input type="color" :value="globalGridAttr.nodeFill" style="width: 100%" @change="onFillChange"/>
        </a-col>
      </a-row>
    </a-tab-pane>
    <a-tab-pane tab="文本" key="2">
      <a-row align="middle">
        <a-col :span="8">Font Size</a-col>
        <a-col :span="12">
          <a-slider :min="8" :max="16" :step="1" :value="globalGridAttr.nodeFontSize" @change="onFontSizeChange"/>
        </a-col>
        <a-col :span="2">
          <div class="result">{{ globalGridAttr.nodeFontSize }}</div>
        </a-col>
      </a-row>
      <a-row align="middle">
        <a-col :span="8">Font Color</a-col>
        <a-col :span="14">
          <a-input type="color" :value="globalGridAttr.nodeColor" style="width: 100%" @change="onColorChange"/>
        </a-col>
      </a-row>
    </a-tab-pane>
    <a-tab-pane tab="属性" key="3">
      <a-row align="middle">
        <a-col :span="8">Assign Users</a-col>
        <a-col :span="14">
          <a-input :value="globalGridAttr.nodeUsers" style="width: 100%" @change="onUsersChange"/>
        </a-col>
      </a-row>
      <a-row align="middle">
        <a-col :span="8">跳转地址</a-col>
        <a-col :span="14">
          <a-input :value="globalGridAttr.nodeUrl" style="width: 100%" @change="onUrlChange"/>
        </a-col>
      </a-row>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import { nodeOpt } from './method'

export default {
  name: 'Index',
  props: {
    globalGridAttr: {
      type: Object,
      default: null,
      require: true
    },
    id: {
      type: String,
      default: null,
      require: true
    }
  },
  data () {
    return {
      curCel: ''
    }
  },
  computed: {
    nodeIdCpt () {
      return {
        id: this.id
      }
    }
  },
  watch: {
    nodeIdCpt: {
      handler (nv) {
        this.curCel = nodeOpt(nv, this.globalGridAttr)
      },
      immediate: false,
      deep: false
    }
  },
  methods: {
    onStrokeChange (e) {
      const val = e.target.value
      this.globalGridAttr.nodeStroke = val
      this.curCel.attr('body/stroke', val)
    },
    onStrokeWidthChange (val) {
      this.globalGridAttr.nodeStrokeWidth = val
      this.curCel.attr('body/strokeWidth', val)
    },
    onFillChange (e) {
      const val = e.target.value
      this.globalGridAttr.nodeFill = val
      this.curCel.attr('body/fill', val)
    },
    onFontSizeChange (val) {
      this.globalGridAttr.nodeFontSize = val
      this.curCel.attr('text/fontSize', val)
    },
    onColorChange (e) {
      const val = e.target.value
      this.globalGridAttr.nodeColor = val
      this.curCel.attr('text/fill', val)
    },
    onUsersChange (e) {
      const val = e.target.value
      this.globalGridAttr.nodeUsers = val
      this.curCel.attr('approve/users', val)
    },
    onUrlChange(e){
      const val = e.target.value
      this.globalGridAttr.nodeUrl = val
      this.curCel.attr('item/url', val)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
