<!--
 * @Author: max
 * @Date: 2021-12-08 10:33:42
 * @LastEditTime: 2022-01-12 16:55:15
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/productionBi/index.vue
-->
<template>
  <!-- <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }"> -->
  <a-drawer v-if="visible" :title="`${titleType}看板`" placement="right" destroyOnClose closable @close="onClose" :visible="visible" width="100%" :headerStyle="{ padding: '5px 20px' }" :bodyStyle="{ padding: '0px 0px' }">
    <dv-full-screen-container>
      <div class="bg">
        <dv-loading v-if="loading">Loading...</dv-loading>
        <div v-else class="host-body">
          <div class="d-flex jc-center">
            <dv-decoration-10 class="dv-dec-10" />
            <div class="d-flex jc-center">
              <dv-decoration-8 class="dv-dec-8" :color="['#568aea', '#000000']" />
              <div class="title">
                <span class="title-text">{{ titleType }}车间作业实时看板</span>
                <dv-decoration-6 class="dv-dec-6" :reverse="true" :color="['#50e3c2', '#67a1e5']" />
              </div>
              <dv-decoration-8 class="dv-dec-8" :reverse="true" :color="['#568aea', '#000000']" />
            </div>
            <dv-decoration-10 class="dv-dec-10-s" />
          </div>
          <div class="px-2 d-flex jc-between">
            <dv-decoration-3 style="width:250px;height:30px;" />
            <div class="d-flex aside-width">
              <div class="mr-3 react-right bg-color-blue">
                <span class="text fw-b" style="color:#fff">民爆光电</span>
              </div>
              <div class="mr-3 react-right react-l-s">
                <span class="react-after"></span>
                <span class="text" style="color:#fff">{{ dateYear }} {{ dateWeek }} {{ dateDay }}</span>
              </div>
            </div>
          </div>
          <div class="body-box">
            <div class="content-box">
              <!-- 生产进度 -->
              <div class="grid-box">
                <center :TodayProqtyData="TodayProqtyData" />
                <div style="height:750px">
                  <dv-border-box-11 title="生产进度">
                    <centerRight1 :ScheduleData="ScheduleData" />
                  </dv-border-box-11>
                </div>
              </div>
              <!-- 拉线生产中情况 -->
              <div class="grid-box grid-box-right">
                <div style="height:420px">
                  <dv-border-box-11 title="拉线生产中情况">
                    <bottomLeft :linePlanData="linePlanData" />
                  </dv-border-box-11>
                </div>
                <dv-decoration-10 style="width:100%;height:5px;" />
                <div style="height:420px">
                  <dv-border-box-11 title="历史欠数订单">
                    <bottomRight />
                  </dv-border-box-11>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </dv-full-screen-container>
  </a-drawer>
  <!-- </a-card> -->
</template>

<script>
import drawMixin from "./utils/drawMixin";
import { formatTime } from "./utils/index.js";
import centerRight1 from "./centerRight1";
import center from "./center";
import bottomLeft from "./bottomLeft";
import bottomRight from "./bottomRight";
import axios from "axios";
var timer = 0;
export default {
  mixins: [drawMixin],
  data() {
    return {
      timing: null,
      dataTime: null,
      loading: true,
      dateDay: null,
      dateYear: null,
      dateWeek: null,
      weekday: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
      visible: true,
      titleType: "",
      BASE_URL: "http://192.168.0.240:8081",
      TBASE_URL: "http://192.168.1.245:6688",
      params: [],
      TodayProqtyData: [], //计划数量
      ScheduleData: [], //生产进度
      linePlanData: [], //拉线生产计划
    };
  },
  components: {
    centerRight1,
    center,
    bottomLeft,
    bottomRight,
  },
  mounted() {
    if (process.env.NODE_ENV == "production") {
      //正式服
      this.BASE_URL = window.location.host === "218.17.19.58:7003" ? "http://218.17.19.58:7004" : "http://192.168.0.240:8081";
    } else {
      //测试
      this.BASE_URL = process.env.VUE_APP_API_BASE_URL;
    }
    let type = this.$route.path.split("&")[1];
    console.log(type);
    this.titleType = type == "zz" ? "组装" : type == "lh" ? "老化" : "包装";
    switch (type) {
      case "zz":
        this.params = {
          plantcode: "01",
          processcode: "ASSEMBLE_PROCESS",
          workshopcode: "111",
        };
        break;
      case "lh":
        this.params = {
          plantcode: "01",
          processcode: "AGEING_PROCESS",
          workshopcode: "LH01",
        };
        break;
      case "bz":
        this.params = {
          plantcode: "01",
          processcode: "PACKING_PROCESS",
          workshopcode: "PACK01",
        };
        break;
      default:
        this.params = {
          plantcode: "01",
          processcode: "PACKING_PROCESS",
          workshopcode: "PACK01",
        };
        break;
    }
    this.timeFn();
    this.cancelLoading();
    this.getTodayProqty();
    this.getSchedule();
    this.getLinePlan();
  },
  activated() {
    console.log("显示======");
    this.visible = true;
    this.loopData();
  },
  destroyed() {
    clearInterval(this.timing);
    window.clearInterval(this.dataTime);
    console.log("关闭======", this.dataTime);
    this.dataTime = null;
    this.timing = null;
  },
  methods: {
    loopData() {
      timer = window.setInterval(() => {
        this.getTodayProqty();
        this.getSchedule();
        this.getLinePlan();
      }, 120000);
    },
    onClose() {
      this.visible = false;
      window.clearInterval(timer);
    },
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
    getTodayProqty() {
      axios
        .get(this.BASE_URL + "/api/kanban/production/workshop/gettodayproqty", { params: this.params })
        .then((res) => {
          this.TodayProqtyData = res.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getSchedule() {
      axios
        .get(this.BASE_URL + "/api/kanban/production/workshop/getprogress", { params: this.params })
        .then((res) => {
          if (res.data.data.length > 0) {
            this.ScheduleData = res.data.data;
          } else {
            this.linePlanData = [];
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getLinePlan() {
      axios
        .get(this.BASE_URL + "/api/kanban/production/workshop/getlineprogress", { params: this.params })
        .then((res) => {
          if (res.data.data.length > 0) {
            this.linePlanData = res.data.data;
            // this.linePlanData.map((item) => {
            //   item.MoCode = item.MoCode + new Date();
            // });
          } else {
            this.linePlanData = [];
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
<style lang="less" scoped>
/deep/.ant-drawer-close {
  width: 36px;
  height: 36px;
  line-height: 36px;
}
</style>
<style lang="less">
@import "./style/index.less";
.title-text {
  color: #fff;
}
@media screen and (max-width: 1280px) {
  #dv-full-screen-container {
    position: static;
    height: 100%;
  }
}
#dv-full-screen-container {
  position: static;
}
</style>
