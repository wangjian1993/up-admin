<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <div id="index" ref="appRef">
      <div class="bg">
        <dv-loading v-if="loading">Loading...</dv-loading>
        <div v-else class="host-body">
          <div class="d-flex jc-center">
            <dv-decoration-10 class="dv-dec-10" />
            <div class="d-flex jc-center">
              <dv-decoration-8 class="dv-dec-8" :color="['#568aea', '#000000']" />
              <div class="title">
                <span class="title-text">包装车间作业实时看板</span>
                <dv-decoration-6 class="dv-dec-6" :reverse="true" :color="['#50e3c2', '#67a1e5']" />
              </div>
              <dv-decoration-8 class="dv-dec-8" :reverse="true" :color="['#568aea', '#000000']" />
            </div>
            <dv-decoration-10 class="dv-dec-10-s" />
          </div>

          <!-- 第二行 -->
          <div class="px-2 d-flex jc-between">
            <dv-decoration-3 style="width:250px;height:30px;" />
            <!-- <dv-decoration-1 style="width:200px;height:50px;" /> -->
            <div class="d-flex aside-width">
              <div class="mr-3 react-right bg-color-blue">
                <span class="text fw-b">民爆光电</span>
              </div>
              <div class="mr-4 react-right react-l-s">
                <span class="react-after"></span>
                <span class="text">{{ dateYear }} {{ dateWeek }} {{ dateDay }}</span>
              </div>
            </div>
          </div>

          <div class="body-box">
            <!-- 第三行数据 -->
            <div class="content-box">
              <!-- 中间 -->
              <div class="grid-box">
                <center />
                <div style="height:850px">
                  <dv-border-box-11 title="生产进度">
                    <centerRight1 />
                  </dv-border-box-11>
                </div>
              </div>
              <!-- 中间 -->
              <div class="grid-box grid-box-right">
                <div style="height:500px">
                  <dv-border-box-11 title="拉线生产中情况">
                    <bottomLeft />
                  </dv-border-box-11>
                </div>
                <dv-decoration-10 style="width:100%;height:5px;" />
                <div style="height:450px">
                  <dv-border-box-11 title="历史欠数订单">
                    <bottomRight />
                  </dv-border-box-11>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script>
import drawMixin from "./utils/drawMixin";
import { formatTime } from "./utils/index.js";
import centerRight1 from "./centerRight1";
import center from "./center";
import bottomLeft from "./bottomLeft";
import bottomRight from "./bottomRight";

export default {
  mixins: [drawMixin],
  data() {
    return {
      timing: null,
      loading: true,
      dateDay: null,
      dateYear: null,
      dateWeek: null,
      weekday: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
    };
  },
  components: {
    centerRight1,
    center,
    bottomLeft,
    bottomRight,
  },
  mounted() {
    this.timeFn();
    this.cancelLoading();
  },
  beforeDestroy() {
    clearInterval(this.timing);
  },
  methods: {
    timeFn() {
      this.timing = setInterval(() => {
        this.dateDay = formatTime(new Date(), "HH: mm: ss");
        this.dateYear = formatTime(new Date(), "yyyy-MM-dd");
        this.dateWeek = this.weekday[new Date().getDay()];
      }, 1000);
    },
    cancelLoading() {
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
  },
};
</script>

<style lang="less">
@import "./style/index.less";
</style>
