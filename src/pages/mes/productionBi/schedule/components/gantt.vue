<!--
 * @Author: max
 * @Date: 2022-08-01 17:38:08
 * @LastEditTime: 2022-08-01 18:01:24
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/productionBi/schedule/components/gantt.vue
-->
<template>
  <div>
    <div ref="ganttId"></div>
  </div>
</template>

<script>
import gantt from "dhtmlx-gantt"; // 引入模块
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
export default {
  name: "gantt",
  props: {
    tasks: {
      type: Object,
      default() {
        return { data: [], links: [] };
      },
    },
  },
  mounted: function() {
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
      { name: "text", label: "产线", width: "40", align: "center" },
      { name: "mocode", label: "工单", width: "120", align: "center" },
      { name: "StartTime", label: "开始时间", width: "130", align: "center" },
      { name: "EndTime", label: "结束时间", width: "130", align: "center" },
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
      return "<b>产线:</b> " + task.text + "<br/><b>工作时间:</b> " + new Date(start).getHours() + ":" + new Date(start).getMinutes() + " - " + new Date(end).getHours() + ":" + new Date(end).getMinutes();
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
    // this.tasks.sort(this.up());
    console.log("tasks数据===", this.tasks);
    // gantt.init(this.$refs.gantt);
    // gantt.parse(this.tasks);
    gantt.init(this.$refs.ganttId);
    gantt.parse(this.tasks);
  },
  methods: {
    reload() {
      gantt.clearAll();
      gantt.parse(this.$props.tasks);
      gantt.render();
    },
  },
};
</script>

<style></style>
