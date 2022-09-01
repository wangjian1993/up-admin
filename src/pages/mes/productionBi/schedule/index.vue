<!--
 * @Author: max
 * @Date: 2022-07-07 14:31:51
 * @LastEditTime: 2022-08-24 14:09:50
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/productionBi/schedule/index.vue
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
      <div class="app-container">
        <div ref="gantt" class="left-container" />
      </div>
    </a-spin>
  </a-card>
</template>

<script>
import moment from "moment"; // moment格式化时间
import gantt from "dhtmlx-gantt"; // 引入模块
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import axios from "axios";
var time = "";
export default {
  name: "ganttEchart",
  data() {
    return {
      Title: "",
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
      gantt.clearAll();
      gantt.parse(this.tasks);
      gantt.render();
      this.getDataList(time);
    },
    timeAfter() {
      var diyDate = new Date(this.timeValue);
      let date = new Date(diyDate.setDate(diyDate.getDate() + 1));
      let time = date.getFullYear() + "-" + (date.getMonth() + 1 > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)) + "-" + (date.getDate() > 9 ? date.getDate() : "0" + date.getDate());
      // console.log(time);
      this.dayTime = time;
      gantt.clearAll();
      gantt.parse(this.tasks);
      gantt.render();
      this.getDataList(time);
    },
    lineChange(e) {
      console.log("产线");
      gantt.clearAll();
      gantt.render();
      this.line = e;
      this.getDataList(this.dayTime);
    },
    dateChange(e) {
      let date = e.format("YYYY-MM-DD");
      this.dayTime = date;
      gantt.clearAll();
      gantt.parse(this.tasks);
      gantt.render();
      this.getDataList(date);
    },
    initData() {
      gantt.i18n.setLocale("cn");
      //自适应甘特图的尺寸大小, 使得在不出现滚动条的情况下, 显示全部任务
      gantt.config.autosize = true;
      //是否显示左侧树表格
      gantt.config.show_grid = true;
      //当task的长度改变时，自动调整图表坐标轴区间用于适配task的长度
      gantt.config.fit_tasks = true;
      //只读模式
      gantt.config.readonly = true;
      gantt.config.date_format = "%Y-%m-%d %H:%i"; //设置数据中的时间格式，对应start_date格式
      gantt.config.columns = [
        //设置列
        { name: "text", label: "产线", width: "60", align: "center" },
        { name: "mocode", label: "工单", width: "120", align: "center" },
        { name: "ProName", label: "产品名称", width: "220", align: "left" },
      ];
      gantt.plugins({
        tooltip: true, //鼠标划过任务是否显示明细
        // auto_scheduling: true,//根据任务之间的关系自动安排任务
        // multiselect: true, //为任务激活多任务选择
      });
      gantt.config.duration_unit = "minute";
      // gantt.templates.tooltip_date_format=function (date){
      // 	var formatFunc = gantt.date.date_to_str("%Y-%m-%d %H:%i");
      // 	return formatFunc(date);
      // };
      //自定义工具栏
      gantt.templates.tooltip_text = function(start, end, task) {
        return "<b>工单:</b> " + task.mocode + "<br/><b>开工时间:</b> " + task.StartTime + "<br/><b>完工时间:</b>" + task.EndTime + "<br/><b>数量:</b>" + task.qty + "<br/><b>产品名称</b>:</b>" + task.ProName;
      };
      gantt.templates.task_text = function(start, end, task) {
        return `
            <span style="color:#000000;font-weight:700;">${task.qty}</span>
          `;
      };
      //监测到鼠标已经离开包裹着ghtml的div的解决方案
      // gantt.ext.tooltips.tooltipFor({
      //   selector: '.gantt_grid [' + gantt.config.task_attribute + ']',
      //   global: true
      // })
      gantt.config.start_date = new Date(this.dayTime + " 08:00"); //时间刻度的开始时间
      gantt.config.end_date = new Date(this.dayTime + " 23:59"); //时间刻度的结束时间
      gantt.config.scales = [
        { unit: "hour", step: 1, format: "%H:%i" }, //时间刻度的显示单位
      ];
      // gantt.attachEvent("onGanttReady", function(){
      // 	var tooltips = gantt.ext.tooltips;
      // 	tooltips.tooltip.setViewport(gantt.$task_data);
      // });

      // gantt.config.multiselect = false
      // gantt.config.multiselect_one_level = true; //在一个或任何级别内是否可以使用多任务选择
      gantt.config.readonly = true; //只读模式的甘特图
      // 初始化
      gantt.init(this.$refs.gantt);
      gantt.parse(this.tasks);
      // 数据解析
      // console.log("tasks===", this.tasks);
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
    getLine() {
      var BASE_URL_MOCK = window.location.host === "113.106.78.83:7003" ? "http://113.106.78.83:7004" : window.location.host === "192.168.0.240:8080" ? "http://192.168.0.240:8081" : "http://192.168.1.245:6688";
      axios({
        method: "GET",
        url: BASE_URL_MOCK + "/api/kanban/mo/progress/getlines?plant=" + this.plant + "&workshop=" + this.workshop,
      }).then((response) => {
        console.log(response);
        this.lineList = response.data.data;
      });
    },
    getDataList(date, isLoad = false) {
      this.tasks.data = [];
      this.timeValue = date;
      // console.log("process===", process.env.NODE_ENV);
      var BASE_URL_MOCK = window.location.host === "113.106.78.83:7003" ? "http://113.106.78.83:7004" : window.location.host === "192.168.0.240:8080" ? "http://192.168.0.240:8081" : "http://192.168.1.245:6688";
      axios({
        method: "GET",
        url: BASE_URL_MOCK + "/api/kanban/mo/progress/getall?pageindex=1&pagesize=10&process=" + this.process + "&plant=" + this.plant + "&workshop=" + this.workshop + "&line=" + this.line + "&date=" + date,
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
                  bgColor = "rgba(155,207,107,.4)";
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
                  bgColor = "rgba(25,107,107,.4)";
                  break;
                case 9:
                  bgColor = "rgba(0,207,107,.4)";
                  break;
                default:
                  bgColor = "rgba(0,187,255,.4)";
              }
              this.tasks.data.push({
                id: index + "_" + indexs,
                text: item.Line,
                start_date: this.timeFormatting(listItem.StartTime),
                end_date: this.timeFormatting(listItem.EndTime),
                mocode: listItem.MoCode,
                qty: listItem.Quantity + "/" + listItem.StartQty,
                StartTime: this.timeFormatting(listItem.StartTime),
                EndTime: this.timeFormatting(listItem.EndTime),
                color: bgColor,
                ProName: listItem.ProName,
              });
              // console.log(this.tasks.data);
            });
          });
          if (!isLoad) {
            this.initData();
          }
        }
      });
      this.spinning = false;
      // gantt.render();
      // // 初始化
      // gantt.init(this.$refs.gantt);
      // // 数据解析
      // gantt.parse(this.tasks);
    },
  },
  destroyed() {
    clearInterval(time);
    console.log("guanbi=-=====");
  },
  beforeDestroy() {
    console.log("销毁=-=====");
    clearInterval(time); //关闭
  },
  activated() {
    gantt.clearAll();
    gantt.parse(this.tasks);
    gantt.render();
    this.getDataList(this.dayTime);
  },
  created() {
    gantt.clearAll();
    gantt.parse(this.tasks);
    gantt.render();
    time = setInterval(() => {
      this.getDataList(this.dayTime, true);
    }, 180000);
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
