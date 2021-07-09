<template>
  <div class="advanced-table">
    <div class="actions">
      <a-tooltip title="刷新"
        ><a-icon
          @click="refresh"
          class="action"
          :type="loading ? 'loading' : 'reload'"
      /></a-tooltip>
      <action-size v-model="sSize" class="action" />
      <a-tooltip title="列配置">
        <action-columns
          :columns="columns"
          @reset="onColumnsReset"
          class="action"
        >
          <template :slot="slot" v-for="slot in slots">
            <slot :name="slot"></slot>
          </template>
        </action-columns>
      </a-tooltip>
      <a-tooltip title="全屏"
        ><a-icon
          @click="toggleScreen"
          class="action"
          :type="fullScreen ? 'fullscreen-exit' : 'fullscreen'"
      /></a-tooltip>
    </div>
  </div>
</template>

<script>
import ActionSize from "@/components/table/advance/ActionSize";
import ActionColumns from "@/components/table/advance/ActionColumns";
export default {
  components: { ActionSize, ActionColumns },
  name: "HeaderTool",
  props: {
    columns: Array,
    dataSource: Array,
    loading: Boolean,
    size: String,
  },
  provide() {
    return {
      table: this,
    };
  },
  data() {
    return {
      sSize: this.size || "default",
      fullScreen: false,
      conditions: {},
    };
  },
  computed: {
    slots() {
      return Object.keys(this.$slots).filter((slot) => slot !== "title");
    },
    visibleColumns() {
      return this.columns.filter((col) => col.visible);
    },
  },
  created() {
    this.addListener();
  },
  beforeDestroy() {
    this.removeListener();
  },
  methods: {
    toggleScreen() {
      if (this.fullScreen) {
        this.outFullScreen();
      } else {
        this.inFullScreen();
      }
    },
    outFullScreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      this.$refs.table.classList.remove("beauty-scroll");
    },
    refresh() {
      this.$emit("refresh", this.conditions);
    },
    inFullScreen() {
      const el = this.$refs.table;
      el.classList.add("beauty-scroll");
      if (el.requestFullscreen) {
        el.requestFullscreen();
        return true;
      } else if (el.webkitRequestFullScreen) {
        el.webkitRequestFullScreen();
        return true;
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen();
        return true;
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
        return true;
      }
      this.$message.warn("对不起，您的浏览器不支持全屏模式");
      el.classList.remove("beauty-scroll");
      return false;
    },
    onColumnsReset(conditions) {
      this.$emit("reset", conditions);
    },
    addListener() {
      document.addEventListener("fullscreenchange", this.fullScreenListener);
      document.addEventListener(
        "webkitfullscreenchange",
        this.fullScreenListener
      );
      document.addEventListener("mozfullscreenchange", this.fullScreenListener);
      document.addEventListener("msfullscreenchange", this.fullScreenListener);
    },
    removeListener() {
      document.removeEventListener("fullscreenchange", this.fullScreenListener);
      document.removeEventListener(
        "webkitfullscreenchange",
        this.fullScreenListener
      );
      document.removeEventListener(
        "mozfullscreenchange",
        this.fullScreenListener
      );
      document.removeEventListener(
        "msfullscreenchange",
        this.fullScreenListener
      );
    },
    fullScreenListener(e) {
      if (e.target.id === this.id) {
        this.fullScreen = !this.fullScreen;
      }
    },
  },
};
</script>

<style scoped lang="less">
.advanced-table {
  overflow-y: auto;
  background-color: @component-background;
  .actions {
    text-align: right;
    font-size: 17px;
    color: @text-color;
    .action {
      margin: 0 8px;
      cursor: pointer;
      &:hover {
        color: @primary-color;
      }
    }
  }
}
</style>
