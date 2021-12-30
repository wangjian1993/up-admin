<template>
  <div id="centerRight1">
    <div class="bg-color-black">
      <div class="d-flex jc-center body-box">
        <dv-scroll-board class="dv-scr-board" :config="config" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["ScheduleData"],
  data() {
    return {
      config: {
        header: [],
        data: [],
        rowNum: 13, //表格行数
        headerBGC: "#0f1325", //表头
        oddRowBGC: "#0f1325", //奇数行
        evenRowBGC: "#171c33", //偶数行
        index: false,
        waitTime: 2000,
        align: ["center", "center", "center", "center", "center", "center", "center", "center","center", "center", "center", "center"],
        columnWidth:[60,130,160]
      },
    };
  },
  components: {},
  mounted() {
    let type = this.$route.path.split("&");
    this.dataType = type[1]
    if (this.dataType === "lh") {
      this.config.header = ["产线", "工单", "品名", "计划数量", "批次", "老化开始日期", "老化开始时间", "已老化小时数", "返工数量", "转移数量", "不良品数量", "不良率"];
    } else {
      this.config.header = ["产线", "工单", "品名", "计划数量", "状态", "开工时间", "完工数量", "完工时间", "返工数量", "不良品数量", "达成率", "不良率"];
    }
    this.ScheduleData.map((item) => {
      let list = [];
      if (this.dataType === "lh") {
        list.push(item.LineName);
        list.push(item.MoCode);
        list.push(item.ProName);
        list.push(item.PlanQty);
        if (item.StatusName == "已开工") {
          list.push(`<p style="background:#fecb31;color:#000;font-size:14px">${item.StatusName}</p>`);
        } else if (item.StatusName == "未开工") {
          list.push(`<p style="background:#ff0004;color:#000;font-size:14px">${item.StatusName}</p>`);
        } else if (item.StatusName == "部分完工") {
          list.push(`<p style="background:#32c5e9;color:#000;font-size:14px">${item.StatusName}</p>`);
        } else if (item.StatusName == "已完工") {
          list.push(`<p style="background:#349969;color:#000;font-size:14px">${item.StatusName}</p>`);
        } else {
          list.push(item.StatusName);
        }
        list.push("");
        list.push("");
        list.push(item.AgeingHour);
        list.push(item.ReworkQty);
        list.push(item.FinishedQty);
        list.push(item.DefectiveQty);
        list.push(item.DefectiveProportion);
        // list = [item.LineName, item.MoCode, item.ProName, item.PlanQty, `<span style="color:#32c5e9;">${item.StatusName}</span>`, "", "", item.AgeingHour, item.ReworkQty, item.FinishedQty, item.DefectiveQty, item.DefectiveProportion];
      } else {
        list = [item.LineName, item.MoCode, item.ProName, item.PlanQty, item.StatusName, item.StartTime, item.FinishedQty, item.FinishedTime, item.ReworkQty, item.DefectiveQty, item.ReachProportion, item.DefectiveProportion];
      }
      this.config.data.push(list);
    });
  },
  methods: {},
};
</script>

<style lang="less" scoped>
@box-height: 680px;
@box-width: 940px;
#centerRight1 {
  padding: 16px;
  padding-top: 45px;
  height: @box-height;
  width: @box-width;
  border-radius: 5px;
  .bg-color-black {
    height: @box-height - 30px;
    border-radius: 10px;
  }
  .text {
    color: #c3cbde;
  }
  .body-box {
    border-radius: 10px;
    overflow: hidden;
    .dv-scr-board {
      width: 940px;
      height: 690px;
    }
  }
}
::v-deep .dv-scroll-board .rows .row-item {
  font-size: 13px;
}
::v-deep .dv-scroll-board .header .header-item {
  font-size: 14px;
  white-space: initial;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
