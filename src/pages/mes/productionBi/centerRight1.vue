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
        rowNum: 10, //表格行数
        headerBGC: "#0f1325", //表头
        oddRowBGC: "#0f1325", //奇数行
        evenRowBGC: "#171c33", //偶数行
        index: false,
        waitTime: 3000,
        align: ["center", "center", "center", "center", "center", "center", "center", "center", "center", "center", "center", "center"],
        columnWidth: [60, 130, 160],
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
    getListData() {
      let type = this.$route.path.split("&");
      this.dataType = type[1];
      this.config.data = [];
      if (this.dataType === "lh") {
        this.config.header = ["产线", "工单", "品名", "计划数量", "状态", "老化开始日期", "老化开始时间", "已老化小时数", "返工数量", "转移数量", "不良品数量", "不良率%"];
      } else {
        this.config.header = ["产线", "工单", "品名", "计划数量", "状态", "开工时间", "完工数量", "完工时间", "返工数量", "不良品数量", "达成率%", "不良率%"];
      }
      this.ScheduleData.map((item) => {
        let list = [];
        let stateStr = this.setState(item.StatusName);
        if (this.dataType === "lh") {
          list.push(item.LineName);
          list.push(item.MoCode);
          list.push(`<p style="color:rgb(255,255,153);font-size:10px;margin:0">${item.ProName}</p>`);
          list.push(item.PlanQty);
          list.push(stateStr);
          list.push(`<p style="color:rgb(0,255,255);font-size:10px;margin:0">${this.ageingDate(item.StartTime)}</p>`);
          list.push(`<p style="color:rgb(0,255,255);font-size:10px;margin:0">${this.ageingStart(item.StartTime)}</p>`);
          list.push(item.AgeingHour);
          list.push(item.ReworkQty);
          list.push(item.FinishedQty);
          list.push(`<p style="color:red;font-size:14px;margin:0">${item.DefectiveQty}</p>`);
          list.push(`<p style="color:red;font-size:14px;margin:0">${item.DefectiveProportion}</p>`);
        } else {
          list = [
            item.LineName,
            item.MoCode,
            `<p style="color:rgb(255,255,153);font-size:10px;margin:0">${item.ProName}</p>`,
            item.PlanQty,
            stateStr,
            `<p style="color:rgb(0,255,255);font-size:10px;margin:0">${this.ageingStart(item.StartTime)}</p>`,
            item.FinishedQty,
            `<p style="color:rgb(0,255,255);font-size:10px;margin:0">${this.ageingStart(item.FinishedTime)}</p>`,
            item.ReworkQty,
            item.DefectiveQty,
            `<p style="color:red;font-size:14px;margin:0">${item.ReachProportion}</p>`,
            `<p style="color:red;font-size:14px;margin:0">${item.DefectiveProportion}</p>`,
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
        str = `<p style="background:#fecb31;color:#000;font-size:10px;margin:0">${state}</p>`;
      } else if (state == "未开工") {
        str = `<p style="background:#ff0004;color:#000;font-size:10px;margin:0">${state}</p>`;
      } else if (state == "部分完工") {
        str = `<p style="background:#32c5e9;color:#000;font-size:10px;margin:0">${state}</p>`;
      } else if (state == "已完工") {
        str = `<p style="background:#349969;color:#000;font-size:10px;margin:0">${state}</p>`;
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
      return d[0] + "/" + d[1] + "/" + d[2];
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
