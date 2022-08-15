<!--
 * @Author: max
 * @Date: 2022-07-07 14:31:51
 * @LastEditTime: 2022-08-01 18:02:12
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/productionBi/schedule/index copy.vue
-->
<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-spin :spinning="spinning">
      <h2 style="text-align: center">{{ Title }}</h2>
      <div class="time-box">
        <a-icon @click="timeBefore" type="left-circle" :style="{ fontSize: '20px', color: '#e7e7e7' }" />
        <a-date-picker v-model="dayTime" class="date-box" @change="dateChange" />
        <a-icon @click="timeAfter" type="right-circle" :style="{ fontSize: '20px', color: '#e7e7e7' }" />
      </div>
      <div class="app-container">
        <gantt ref="ganttchart" class="left-container" :tasks="dataSource"></gantt>
      </div>
    </a-spin>
  </a-card>
</template>

<script>
import moment from "moment"; // moment格式化时间
import Gantt from "./components/gantt.vue";
import axios from "axios";
export default {
  name: "ganttEchart",
  components: { Gantt },
  data() {
    return {
      Title: "",
      timeValue: "",
      dayTime: "",
      spinning: false,
      dataSource: { data: [] },
    };
  },
  methods: {
    timeBefore() {
      var diyDate = new Date(this.timeValue);
      let date = new Date(diyDate.setDate(diyDate.getDate() - 1));
      let time = date.getFullYear() + "-" + (date.getMonth() + 1 > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)) + "-" + (date.getDate() > 9 ? date.getDate() : "0" + date.getDate());
      // console.log(time);
      this.dayTime = time;
      this.getDataList(time, true);
    },
    timeAfter() {
      var diyDate = new Date(this.timeValue);
      let date = new Date(diyDate.setDate(diyDate.getDate() + 1));
      let time = date.getFullYear() + "-" + (date.getMonth() + 1 > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)) + "-" + (date.getDate() > 9 ? date.getDate() : "0" + date.getDate());
      // console.log(time);
      this.dayTime = time;
      this.getDataList(time, true);
    },
    dateChange(e) {
      let date = e.format("YYYY-MM-DD");
      this.dayTime = date;
      this.getDataList(date);
    },
    timeFormatting(time) {
      // console.log("time===", time);
      let t = time.split("T");
      let h = t[1].split(".");
      // console.log(t[0] + " " + h[0]);
      return t[0] + " " + h[0];
    },
    up(x, y) {
      return x.DATA_DATE - y.DATA_DATE;
    },
    paramsSplit(str) {
      let s = str.split("=");
      return s[1];
    },
    getDataList(date) {
      let paramsArray = this.$route.path.split("&");
      // console.log("paramsArray", paramsArray);
      let process = this.paramsSplit(paramsArray[1]);
      let plant = this.paramsSplit(paramsArray[2]);
      let workshop = this.paramsSplit(paramsArray[3]);
      let line = this.paramsSplit(paramsArray[4]);
      this.timeValue = date;
      // console.log(" window.location.host ===", window.location.host);
      // var BASE_URL_MOCK = window.location.host === "113.106.78.83:7003" ? "http://113.106.78.83:7004" : window.location.host === "192.168.0.240:8080" ? "http://192.168.0.240:8081" : "http://192.168.1.245:6688";
      var BASE_URL_MOCK = "http://192.168.0.240:8081";
      // console.log("BASE_URL_MOCK===", BASE_URL_MOCK);
      axios({
        method: "GET",
        url: BASE_URL_MOCK + "/api/kanban/mo/progress/getall?pageindex=1&pagesize=10&process=" + process + "&plant=" + plant + "&workshop=" + workshop + "&line=" + line + "&date=" + date,
      }).then((response) => {
        const { data } = response;
        if (data.success) {
          if (!data.data) {
            return;
          }
          this.ecItem = data.data.Data;
          this.Title = data.data.Title;
          let bgColor;
          this.ecItem.forEach((item, index) => {
            item.List.forEach((listItem, indexs) => {
              switch (listItem.ColorNum) {
                case 0:
                  bgColor = "rgba(0,187,255,.4)";
                  break;
                case 1:
                  bgColor = "rgba(80,227,194,.4)";
                  break;
                case 2:
                  bgColor = "rgba(255,115,115,.4)";
                  break;
                case 3:
                  bgColor = "rgba(255,207,107,.4)";
                  break;
                case 4:
                  bgColor = "rgba(80,207,107,.4)";
                  break;
                case 5:
                  bgColor = "rgba(255,80,107,.4)";
                  break;
                case 6:
                  bgColor = "rgba(255,207,80,.4)";
                  break;
                case 7:
                  bgColor = "rgba(107,157,107,.4)";
                  break;
                case 8:
                  bgColor = "rgba(255,107,107,.4)";
                  break;
                case 9:
                  bgColor = "rgba(0,207,107,.4)";
                  break;
                default:
                  bgColor = "rgba(0,187,255,.4)";
              }
              this.dataSource.data.push({
                id: index + "_" + indexs,
                text: item.Line,
                start_date: this.timeFormatting(listItem.StartTime),
                end_date: this.timeFormatting(listItem.EndTime),
                mocode: listItem.MoCode,
                qty: listItem.Quantity,
                StartTime: this.timeFormatting(listItem.StartTime),
                EndTime: this.timeFormatting(listItem.EndTime),
                color: bgColor,
              });
            });
          });
          this.$refs.ganttchart.reload();
        }
      });
      this.spinning = false;
    },
  },
  activated() {
    //  this.initData();
  },
  created() {
    // this.initData();
    console.log("刷新====");
    let date = moment().format("YYYY-MM-DD");
    this.dayTime = date;
    this.getDataList(date);
    // this.tasks.data = [];
    // this.$nextTick(() => {
    //   this.getDataList("2022-07-12");
    // });
  },
};
</script>

<style scoped>
.left-container {
  height: 600px;
  /* background: url("../../../../assets/img/pageBg.png") no-repeat;
  background-size: cover; */
}
.time-box {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px;
}
.date-box {
  margin: 0 10px;
}
</style>
