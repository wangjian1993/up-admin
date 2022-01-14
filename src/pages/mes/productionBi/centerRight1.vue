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
        rowNum: 8, //表格行数
        headerBGC: "#0f1325", //表头
        oddRowBGC: "#0f1325", //奇数行
        evenRowBGC: "#171c33", //偶数行
        index: true,
        waitTime: 2000,
        indexHeader: "序号",
        align: ["center", "center", "center", "center", "left", "center", "center", "center", "center", "center", "center", "center", "center"],
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
        this.config.header = ["工单", "品名", "完工/计划数量", "老化时间", "已老化小时数", "返工/不良数量", "不良率%"];
        this.config.columnWidth = [50, 100, 140, 180, 120, 110, 80];
      } else {
        this.config.header = ["产线", "工单", "品名", "完工/计划数量", "返工/不良数量", "开工时间", "完工时间", "不良率%"];
        this.config.columnWidth = [50, 100, 140, 180, 120, 110, 80, 80];
      }
      this.ScheduleData.map((item) => {
        let list = [];
        let stateStr = this.setState(item.StatusName, item.MoCode);
        let PlanQty_FinishedQty = this.progress(item);
        if (this.dataType === "lh") {
          list.push(item.MoCode);
          list.push(`<p class="fontSize16" style="color:rgb(255,255,153);margin:0">${item.ProName}</p>`);
          list.push(PlanQty_FinishedQty);
          list.push(stateStr);
          list.push(`<p class="fontSize16" style="color:rgb(0,255,255);margin:0">${this.ageingDate(item.StartTime)}</p>`);
          list.push(item.AgeingHour);
          list.push(item.ReworkQty);
          list.push(`<p class="fontSize18" style="color:red;margin:0">${item.DefectiveQty}</p>`);
          list.push(`<p class="fontSize18" style="color:red;margin:0">${item.DefectiveProportion}</p>`);
        } else {
          list = [
            item.LineName,
            stateStr,
            `<p class="fontSize16" style="color:rgb(255,255,153);margin:0">${item.ProName}</p>`,
            PlanQty_FinishedQty,
            item.ReworkQty + "/" + item.DefectiveQty,
            `<p class="fontSize16" style="color:rgb(0,255,255);margin:0">${this.ageingDate(item.StartTime)}</p>`,
            `<p class="fontSize16" style="color:rgb(0,255,255);margin:0">${this.ageingDate(item.FinishedTime)}</p>`,
            `<p class="fontSize16" style="color:red;margin:0">${item.DefectiveProportion}</p>`,
          ];
        }
        this.config.data.push(list);
        this.config.rowNum = 8; //表格行数
        this.config.waitTime = 2000;
      });
      this.config = { ...this.config };
    },
    progress(item) {
      // let num = this.getPercent(item.FinishedQty,item.PlanQty);
      let num = parseInt(item.ReachProportion);
      console.log(num);
      // let num = item.ReachProportion.split(".");
      let percent = num >= 100 ? 100 : num;
      return `<div><p style="width:${percent}%;background:#349969;margin:0;display:flex;">${item.FinishedQty + "/" + item.PlanQty}</p><p style="color:red;font-size:16px;margin:0;text-align:center;padding-top:5px">${num}%</p></div>`;
    },
    /**
     * 求百分比
     * @param  num 当前数
     * @param  total 总数
     */
    getPercent(num, total) {
      num = parseFloat(num);
      total = parseFloat(total);
      if (isNaN(num) || isNaN(total)) {
        return "-";
      }
      return total <= 0 ? "0%" : Math.round((num / total) * 10000) / 100.0 + "%";
    },
    setState(state, text) {
      let str = "";
      if (state == "已开工") {
        str = `<p style="background:#fecb31;color:#000;font-size:14px;margin:0">${text}</p>`;
      } else if (state == "未开工") {
        str = `<p style="color:#fff;font-size:14px;margin:0">${text}</p>`;
      } else if (state == "部分完工") {
        str = `<p style="background:#32c5e9;color:#000;font-size:14px;margin:0">${text}</p>`;
      } else if (state == "已完工") {
        str = `<p style="background:#349969;color:#000;font-size:14px;margin:0">${text}</p>`;
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
  height: 100%;
  width: @box-width;
  border-radius: 5px;
  overflow: hidden;
  .bg-color-black {
    height: 100%;
    border-radius: 10px;
  }
  .text {
    color: #c3cbde;
  }
  .body-box {
    height: 100%;
    border-radius: 10px;
    overflow: hidden;
    .dv-scr-board {
      width: 100%;
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
