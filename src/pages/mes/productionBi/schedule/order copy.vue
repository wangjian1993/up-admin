<!--
 * @Author: max
 * @Date: 2022-07-07 14:31:51
 * @LastEditTime: 2022-08-29 16:15:34
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/productionBi/schedule/order.vue
-->
<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-spin :spinning="spinning">
      <h2 style="text-align: center">{{ Title }}</h2>
      <div class="time-box">
        <a-icon @click="timeBefore" type="left-circle" :style="{ fontSize: '20px', color: '#e7e7e7' }" />
        <a-date-picker v-model="dayTime" class="date-box" @change="dateChange" />
        <a-icon @click="timeAfter" type="right-circle" :style="{ fontSize: '20px', color: '#e7e7e7' }" />
        <div style="margin-left:20px">
          <span>产线:</span
          ><a-select style="width: 120px" @change="lineChange">
            <a-select-option value="">
              全部
            </a-select-option>
            <a-select-option :value="item.LineCode" v-for="item in lineList" :key="item.LineCode">
              {{ item.LineName }}
            </a-select-option>
          </a-select>
        </div>
      </div>
      <!-- <div class="app-container">
        <div ref="gantt" class="left-container" />
      </div> -->
      <a-table :columns="columns" :data-source="dataSource" size="small" :scroll="{ y: scrollY }" :loading="loading" :pagination="pagination" @change="handleTableChange" :rowKey="(dataSource, index) => dataSource.DocNo + '_' + index" bordered>
        <template slot="index" slot-scope="text, record, index">
          <div>
            <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
          </div>
        </template>
        <template slot="Enable" slot-scope="record">
          <div>
            <a-tag color="green" v-if="record == 'Y'">启用</a-tag>
            <a-tag color="red" v-else>禁用</a-tag>
          </div>
        </template>
        <template slot="action" slot-scope="text, record">
          <div>
            <a style="margin-right: 8px" @click="print(record)" :disabled="!hasPerm('print')">
              <a-icon type="print" />
              打印
            </a>
          </div>
        </template>
      </a-table>
    </a-spin>
  </a-card>
</template>
<script>
import moment from "moment"; // moment格式化时
var time = "";
export default {
  name: "ganttEchart",
  data() {
    return {
      Title: "生产工单总进度看板",
      timeValue: "",
      dayTime: "",
      spinning: false,
      lineList: [],
      process: "",
      plant: "",
      workshop: "",
      line: "",
      tasks: {
        data: [],
      },
    };
  },
  methods: {
    timeBefore() {
      var diyDate = new Date(this.timeValue);
      let date = new Date(diyDate.setDate(diyDate.getDate() - 1));
      let time = date.getFullYear() + "-" + (date.getMonth() + 1 > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)) + "-" + (date.getDate() > 9 ? date.getDate() : "0" + date.getDate());
      // console.log(time);
      this.dayTime = time;
      this.getDataList(time);
    },
    timeAfter() {
      var diyDate = new Date(this.timeValue);
      let date = new Date(diyDate.setDate(diyDate.getDate() + 1));
      let time = date.getFullYear() + "-" + (date.getMonth() + 1 > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)) + "-" + (date.getDate() > 9 ? date.getDate() : "0" + date.getDate());
      // console.log(time);
      this.dayTime = time;

      this.getDataList(time);
    },
    lineChange(e) {
      console.log("产线");
      this.line = e;
      this.getDataList(this.dayTime);
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
    paramsSplit(str) {
      let s = str.split("=");
      return s[1];
    },
    getLine() {},
  },
  destroyed() {
    clearInterval(time);
    console.log("guanbi=-=====");
  },
  beforeDestroy() {
    console.log("销毁=-=====");
    clearInterval(time); //关闭
  },
  mounted() {
    let date = moment().format("YYYY-MM-DD");
    let paramsArray = this.$route.path.split("&");
    this.process = this.paramsSplit(paramsArray[1]);
    this.plant = this.paramsSplit(paramsArray[2]);
    this.workshop = this.paramsSplit(paramsArray[3]);
    this.line = this.paramsSplit(paramsArray[4]);
    this.dayTime = date;
    this.getDataList(date);
    this.getLine();
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
.gantt_tree_content {
  font-size: 10px;
}
</style>
