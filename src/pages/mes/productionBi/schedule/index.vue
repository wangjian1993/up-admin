<!--
 * @Author: max
 * @Date: 2022-07-07 14:31:51
 * @LastEditTime: 2022-07-20 13:44:16
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
export default {
  name: "ganttEchart",
  data() {
    return {
      Title: "",
      timeValue: "",
      dayTime: "",
      spinning: false,
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
      console.log(time);
      this.dayTime = time;
      this.getDataList(time, true);
    },
    timeAfter() {
      var diyDate = new Date(this.timeValue);
      let date = new Date(diyDate.setDate(diyDate.getDate() + 1));
      let time = date.getFullYear() + "-" + (date.getMonth() + 1 > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)) + "-" + (date.getDate() > 9 ? date.getDate() : "0" + date.getDate());
      console.log(time);
      this.dayTime = time;
      this.getDataList(time, true);
    },
    dateChange(e) {
      let date = e.format("YYYY-MM-DD");
      this.dayTime = date;
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
        { name: "text", label: "产线", width: "80", align: "center" },
        { name: "mocode", label: "工单", width: "120", align: "center" },
        { name: "StartTime", label: "开始时间", width: "60", align: "center" },
        { name: "EndTime", label: "结束时间", width: "60", align: "center" },
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
        return "<b>工单:</b> " + task.text + "<br/><b>工作时间:</b> " + new Date(start).getHours() + ":" + new Date(start).getMinutes() + " - " + new Date(end).getHours() + ":" + new Date(end).getMinutes();
      };
      gantt.templates.task_text = function(start, end, task) {
        return `
            <span style="color:white;">${task.qty}</span>
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
      console.log("tasks===", this.tasks);
    },
    timeFormatting(time) {
      console.log("time===", time);
      let t = time.split("T");
      let h = t[1].split(".");
      console.log(t[0] + " " + h[0]);
      return t[0] + " " + h[0];
    },
    paramsSplit(str) {
      let s = str.split("=");
      return s[1];
    },
    getDataList(date) {
      let paramsArray = this.$route.path.split("&");
      console.log("paramsArray", paramsArray);
      let process = this.paramsSplit(paramsArray[1]);
      let plant = this.paramsSplit(paramsArray[2]);
      let workshop = this.paramsSplit(paramsArray[3]);
      let line = this.paramsSplit(paramsArray[4]);
      this.tasks.data = [];
      this.timeValue = date;
      axios({
        method: "GET",
        url: "http://192.168.0.240:8081/api/kanban/mo/progress/getall?pageindex=1&pagesize=10&process=" + process + "&plant=" + plant + "&workshop=" + workshop + "&line=" + line + "&date=" + date,
      }).then((response) => {
        const { data } = response;
        if (data.success) {
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
                default:
                  bgColor = "rgba(0,187,255,.4)";
              }
              this.tasks.data.push({
                id: index + "_" + indexs,
                text: item.Line,
                start_date: this.timeFormatting(listItem.StartTime),
                end_date: this.timeFormatting(listItem.EndTime),
                mocode: listItem.MoCode,
                qty: listItem.Quantity,
                StartTime: listItem.StartTime.substring(11, 16),
                EndTime: listItem.EndTime.substring(11, 16),
                color: bgColor,
              });
              console.log(this.tasks.data);
            });
          });
          this.initData();
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
  created() {
    // this.$nextTick(() => {
    //   this.getDataList("2022-07-12");
    // });
  },
  mounted() {
    let date = moment().format("YYYY-MM-DD");
    this.dayTime = date;
    this.getDataList(date);
  },
};
</script>

<style scoped>
.left-container {
  height: 600px;
  background: url("../../../../assets/img/pageBg.png") no-repeat;
  background-size: cover;
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
