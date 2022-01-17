<!--
 * @Author: max
 * @Date: 2021-11-25 13:58:47
 * @LastEditTime: 2022-01-17 11:04:45
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/productionBi/bottomLeft.vue
-->
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
  props: ["linePlanData"],
  data() {
    return {
      config: {
        header: [],
        data: [],
        rowNum: 5, //表格行数
        headerHeight: 50,
        headerBGC: "#0f1325", //表头
        oddRowBGC: "#0f1325", //奇数行
        evenRowBGC: "#171c33", //偶数行
        index: true,
        waitTime: 3000,
        indexHeader: "序号",
        align: ["center", "center", "center", "center", "left", "center", "center", "center", "center", "center", "center", "center"],
        columnWidth: [],
      },
    };
  },
  components: {},
  watch: {
    linePlanData() {
      this.getListData();
    },
  },
  mounted() {
    this.getListData();
  },
  methods: {
    paramsSplit(str) {
      let s = str.split("=");
      return s[1];
    },
    getListData() {
      console.log("更新====");
      let paramsArray = this.$route.path.split("&");
      let type = this.paramsSplit(paramsArray[1]);
      console.log(type)
      this.dataType = type;
      this.config.data = [];
      if (this.dataType === "lh") {
        this.config.header = ["产线", "工单", "品名", "接收数量", "转移数量", "老化开始时间", "已老化小时数"];
        this.config.columnWidth = [40, 100, 160, 200, 100, 100, 110, 110];
      } else {
        this.config.header = ["产线", "工单", "品名", "计划/入库数量", "拉上数量", "开工时间", "已生产小时数"];
        this.config.columnWidth = [50, 100, 150, 200, 120, 100, 100];
      }
      this.linePlanData.map((item) => {
        let list = [];
        let progress = this.progress(item);
        if (this.dataType === "lh") {
          list.push(item.LineName);
          list.push(item.MoCode);
          list.push(`<p style="color:rgb(255,255,153);font-size:16px;margin:0">${item.ProName}</p>`);
          list.push(item.StartQty);
          list.push(item.FinishedQty);
          list.push(`<p style="color:rgb(0,255,255);font-size:16px;margin:0">${this.ageingDate(item.StartTime)}</p>`);
          list.push(item.ProHours);
        } else {
          list = [item.LineName, item.MoCode, `<p style="color:rgb(255,255,153);font-size:14px;margin:0">${item.ProName}</p>`, progress, item.OnlineQty, `<p style="color:rgb(0,255,255);font-size:16px;margin:0">${this.ageingDate(item.StartTime)}</p>`, item.ProHours];
          // list = [item.LineName, item.MoCode, `<p style="color:rgb(255,255,153);font-size:16px;margin:0">${item.ProName}</p>`, item.PlanQty, item.OnlineQty, `<p style="color:rgb(0,255,255);font-size:16px;margin:0">${this.ageingDate(item.StartTime)}</p>`, item.ProHours, item.FinishedQty];
        }
        this.config.data.push(list);
      });
      this.config = { ...this.config };
    },
    progress(item) {
      let num = this.getPercent(item.FinishedQty, item.PlanQty);
      console.log(num);
      // let percent = num >= 100 ? 100 : item.ReachProportion;
      return `<div><p style="width:${num};background:#349969;margin:0;display:flex;">${item.PlanQty + "/" + item.FinishedQty}</div>`;
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
  padding-bottom: 20px;
  .bg-color-black {
    height: 100%;
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
      // height: 360px;
    }
  }
}
@media (min-width: 1440px) {
  ::v-deep .dv-scroll-board .rows .row-item {
    font-size: 12px;
  }
  ::v-deep .dv-scroll-board .header .header-item {
    font-size: 10px;
    white-space: initial;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
@media (min-width: 1920px) {
  ::v-deep .dv-scroll-board .rows .row-item {
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
