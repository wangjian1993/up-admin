<!--
 * @Author: max
 * @Date: 2021-07-08 09:23:52
 * @LastEditTime: 2021-08-27 11:17:20
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/process/process.vue
-->
<template>
  <div>
    <a-button type="" @click="showDrawer">流程图编辑器</a-button>
    <a-drawer placement="right" :closable="true" :visible="visible" width="100%" @close="onClose">
      <div class="wrap">
        <div class="content">
          <!--左侧工具栏-->
          <div id="flowStencil" class="sider" />
          <div class="panel">
            <!--流程图工具栏-->
            <div class="toolbar">
              <tool-bar v-if="isReady" />
            </div>
            <!--流程图画板-->
            <div id="flowContainer" class="x6-graph" />
          </div>
          <!--右侧工具栏-->
          <div class="config">
            <config-panel v-if="isReady" />
          </div>
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import FlowGraph from "./graph";
import ToolBar from "./components/ToolBar/index.vue";
import ConfigPanel from "./components/ConfigPanel/index.vue";

export default {
  name: "Index",
  components: {
    ToolBar,
    ConfigPanel,
  },
  data() {
    return {
      visible: false,
      isReady: false,
    };
  },
  created() {
    // this.showDrawer();
  },
  mounted() {},
  methods: {
    showDrawer() {
      setTimeout(() => {
        this.initGraph();
      }, 100);
      this.visible = true;
    },
    onClose() {
      FlowGraph.destroy();
      this.visible = false;
      this.isReady = false;
    },
    getContainerSize() {
      return {
        width: document.body.offsetWidth - 690,
        height: document.body.offsetHeight - 38,
      };
    },
    initGraph() {
      const graph = FlowGraph.init();
      this.isReady = true;
      const resizeFn = () => {
        const { width, height } = this.getContainerSize();
        graph.resize(width, height);
      };
      resizeFn();
      window.addEventListener("resize", resizeFn);
      return () => {
        window.removeEventListener("resize", resizeFn);
      };
    },
  },
};
</script>

<style scoped lang="less">
@import "./index.less";
</style>
