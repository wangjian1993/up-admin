<template>
  <div id="centerRight1">
    <div class="bg-color-black">
      <div class="d-flex jc-center body-box">
        <dv-scroll-board class="dv-scr-board" :config="config" @LoopOver="LoopOver" />
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
        rowNum: 7, //表格行数
        headerBGC: "#0f1325", //表头
        oddRowBGC: "#0f1325", //奇数行
        evenRowBGC: "#171c33", //偶数行
        index: true,
        waitTime: 3000,
        align: ["center", "center", "center", "center", "center", "center", "center", "center", "center", "center", "center", "center", "center"],
        columnWidth: [],
      },
    };
  },
  watch: {
    ScheduleData() {
      console.log("更新====");
      this.getListData();
    },
  },
  components: {},
  mounted() {
    this.getListData();
  },
  methods: {
    LoopOver() {
      console.log("完了====");
    },
    getListData() {
      let type = this.$route.path.split("&");
      this.dataType = type[1];
      this.config.data = [];
      if (this.dataType === "lh") {
        this.config.header = ["工单", "品名", "计划数量", "状态", "老化时间", "已老化小时数", "返工数量", "转移数量", "不良品数量", "不良率%"];
        this.config.columnWidth = [60, 140, 180, 70, 70, 70, 70, 70, 70, 70, 80, 80];
      } else {
        this.config.header = ["产线", "工单", "品名", "计划数量", "状态", "开工时间", "完工数量", "完工时间", "返工数量", "不良数量", "达成率%", "不良率%"];
        this.config.columnWidth = [50, 60, 120, 140, 60, 70, 70, 70, 70, 70, 60, 70, 60];
      }
      this.ScheduleData.map((item) => {
        let list = [];
        let stateStr = this.setState(item.StatusName);
        if (this.dataType === "lh") {
          list.push(item.MoCode);
          list.push(`<p class="fontSize16" style="color:rgb(255,255,153);margin:0">${item.ProName}</p>`);
          list.push(item.PlanQty);
          list.push(stateStr);
          list.push(`<p class="fontSize16" style="color:rgb(0,255,255);margin:0">${this.ageingDate(item.StartTime)}</p>`);
          list.push(item.AgeingHour);
          list.push(item.ReworkQty);
          list.push(item.FinishedQty);
          list.push(`<p class="fontSize18" style="color:red;margin:0">${item.DefectiveQty}</p>`);
          list.push(`<p class="fontSize18" style="color:red;margin:0">${item.DefectiveProportion}</p>`);
        } else {
          list = [
            item.LineName,
            item.MoCode,
            `<p class="fontSize16" style="color:rgb(255,255,153);margin:0">${item.ProName}</p>`,
            item.PlanQty,
            stateStr,
            `<p class="fontSize16" style="color:rgb(0,255,255);margin:0">${this.ageingDate(item.StartTime)}</p>`,
            item.FinishedQty,
            `<p class="fontSize16" style="color:rgb(0,255,255);margin:0">${this.ageingDate(item.FinishedTime)}</p>`,
            item.ReworkQty,
            item.DefectiveQty,
            `<p class="fontSize16" style="color:red;margin:0">${item.ReachProportion}</p>`,
            `<p class="fontSize16" style="color:red;margin:0">${item.DefectiveProportion}</p>`,
          ];
        }
        // const { config } = this;
        this.config.data.push(list);
      });
      this.config = { ...this.config };
    },
    setState(state) {
      let str = "";
      if (state == "已开工") {
        str = `<p  style="background:#fecb31;color:#000;margin:0;font-size:14px">${state}</p>`;
      } else if (state == "未开工") {
        str = `<p  style="background:#ff0004;color:#000;margin:0;font-size:14px">${state}</p>`;
      } else if (state == "部分完工") {
        str = `<p  style="background:#32c5e9;color:#000;margin:0;font-size:14px">${state}</p>`;
      } else if (state == "已完工") {
        str = `<p style="background:#349969;color:#000;margin:0;font-size:14px">${state}</p>`;
      } else {
        str = state;
      }
      return str;
    },
    ageingDate(time) {
      if (time == null) {
        return "";
      }
      let str = time.split("T");
      let d = str[0].split("-");
      let t = str[1].split(":");
      return d[1] + "/" + d[2] + " " + t[0] + ":" + t[1];
    },
    ageingStart(time) {
      if (time == null) {
        return "";
      }
      let str = time.split("T");
      let d = str[1].split(":");
      return d[0] + ":" + d[1];
    },
  },
};
</script>

<style lang="less" scoped>
@box-height: 100%;
@box-width: 100%;
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
      width: 100%;
      height: 100%;
    }
  }
}
@media (min-width: 1440px) {
  ::v-deep .dv-scroll-board .rows .row-item {
    font-size: 12px;
  }
  .fontSize18 {
    font-size: 14px;
  }
  .fontSize16 {
    font-size: 12px;
  }
  .fontSize14 {
    font-size: 10px;
  }
  ::v-deep .dv-scroll-board .header .header-item {
    font-size: 10px;
    white-space: initial;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
@media (min-width: 1680px) {
  .fontSize14 {
    font-size: 14px;
  }
  ::v-deep .dv-scroll-board .rows .row-item {
    font-size: 16px;
  }
  .fontSize18 {
    font-size: 18px;
  }
  .fontSize16 {
    font-size: 16px;
  }
  ::v-deep .dv-scroll-board .header .header-item {
    font-size: 14px;
    white-space: initial;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
