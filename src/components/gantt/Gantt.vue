<template>
  <div ref="gantt"></div>
</template>
 
<script>
import "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/locale/locale_cn.js";
import "dhtmlx-gantt/codebase/ext/dhtmlxgantt_marker.js";
import "dhtmlx-gantt/codebase/ext/dhtmlxgantt_tooltip.js";
 
export default {
  name: "gantt",
  props: {
    tasks: {
      type: Object,
      default() {
        return { data: [], links: [] };
      }
    }
  },
 
  mounted: function() {
    gantt.config.date_format = "%Y-%m-%d %H:%i:%s"; //  设置日期格式
    gantt.config.readonly = true;
    gantt.config.duration_unit = "day"; // minute, day, month
 
    // 日期列显示
    // gantt.config.min_column_width = 60;
    gantt.config.scale_height = 30 * 2;
    gantt.config.scales = [
      { unit: "year", step: 1, format: "%Y" },
      { unit: "month", step: 1, format: "%M" },
    ];
 
    // 表头配置显示列   //name:绑定数据的名称  align：对其方式  label显示在表头的名称
    gantt.config.columns = [
      {
        name: "text",
        tree: true,
        width: "*",
        align: "left",
        label: "产品/能力名称",
        resize: true
      },
      { name: "start_date", align: "center", width: 80, resize: true },
      {
        name: "cap_plan_end",
        align: "center",
        label: "结束时间",
        width: 80,
        resize: true,
        template:function(task){return task.cap_plan_end?task.cap_plan_end.substring(0,10):'';}
      }
    ];
 
    // task 文本
    gantt.templates.task_text = function(start, end, task) {
      if (task.cap_actl_start != undefined)
        return ("<b>能力:</b> " + task.text + " (" + task.progress * 100 + "%)");
      else
        return ("<b>" + task.text + "</b> ");
    };
    // gantt.templates.leftside_text = function(start, end, task) {
    //   return "<b>Priority: </b>" + task.priority;
    // };
    // gantt.templates.rightside_text = function(start, end, task) {
    //   return "<b>Holders: </b>" + task.users;
    // };
 
    // task tooltips
    gantt.templates.tooltip_text = function(start, end, task) {
      if (task.cap_actl_start != undefined){
        return (
          "<b>能力名称:</b> " + task.text + 
          "<br/><b>实际开始时间:</b> " + (task.cap_actl_start.substring(0,10)=="0000-00-00"?" - ":task.cap_actl_start.substring(0,10)) + 
          "<br/><b>实际结束时间:</b> " + (task.cap_actl_end.substring(0,10)=="0000-00-00"?" - ":task.cap_actl_end.substring(0,10)) + 
          "<br/><b>进度:</b> " + task.progress * 100 + "%"
        );
      }
      else {
        return (
          "<b>产品名称:</b> " + task.text
        );
      }
    };
 
    // task 选择事件
    // gantt.attachEvent("onTaskSelected", id => {
    //   let task = gantt.getTask(id);
    //   this.$emit("task-selected", task);
    // });
 
    // // 加载之前设置时间范围
    // gantt.attachEvent("onBeforeGanttRender", function(){
    //   var range = gantt.getSubtaskDates();
    //   console.log(range);
    //   var scaleUnit = gantt.getState().scale_unit;
    //   if(range.start_date && range.end_date){
    //     gantt.config.start_date = gantt.calculateEndDate(range.start_date, -4, scaleUnit);
    //     gantt.config.end_date = gantt.calculateEndDate(range.end_date, 5, scaleUnit);
    //   }
    // });
 
    this.addTodayLine();
    gantt.config.fit_tasks = true; 
    gantt.config.tooltip_hide_timeout = 2000;
    gantt.init(this.$refs.gantt);
    gantt.parse(this.$props.tasks);
  },
  methods: {
    reload() {
      gantt.clearAll();
      this.addTodayLine();
      gantt.parse(this.$props.tasks);
      gantt.render();
    },
    addTodayLine() {
      // 时间线
      var date_to_str = gantt.date.date_to_str(gantt.config.task_date);
      var today = new Date();
      gantt.addMarker({
        start_date: today,
        css: "today",
        text: "今天",
        title: "今天: " + date_to_str(today)
      });
    }
  }
};
</script>
 
<style>
@import "~dhtmlx-gantt/codebase/dhtmlxgantt.css";
</style>
