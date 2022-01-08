<!--
 * @Author: max
 * @Date: 2021-11-25 13:58:47
 * @LastEditTime: 2022-01-08 15:50:43
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
        rowNum: 7, //表格行数
        headerHeight: 50,
        headerBGC: "#0f1325", //表头
        oddRowBGC: "#0f1325", //奇数行
        evenRowBGC: "#171c33", //偶数行
        index: true,
        waitTime: 3000,
        align: ["center", "center", "center", "center", "center", "center", "center", "center", "center", "center", "center", "center"],
        columnWidth: [40, 60, 120, 140],
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
    getListData() {
      console.log("更新====");
      let type = this.$route.path.split("&");
      this.dataType = type[1];
      this.config.data = [];
      if (this.dataType === "lh") {
        this.config.header = ["产线", "工单", "品名", "接收数量", "转移数量", "老化开始时间", "已老化小时数"];
        this.config.columnWidth = [40, 100, 160, 200, 100, 100, 110, 110];
      } else {
        this.config.header = ["产线", "工单", "品名", "计划数量", "拉上数量", "开工时间", "已生产小时数", "已入库数量"];
        this.config.columnWidth = [40, 90, 150, 180, 90, 100, 100, 100, 100];
      }
      this.linePlanData.map((item) => {
        let list = [];
        if (this.dataType === "lh") {
          list.push(item.LineName);
          list.push(item.MoCode);
          list.push(`<p style="color:rgb(255,255,153);font-size:16px;margin:0">${item.ProName}</p>`);
          list.push(item.StartQty);
          list.push(item.FinishedQty);
          list.push(`<p style="color:rgb(0,255,255);font-size:16px;margin:0">${this.ageingDate(item.StartTime)}</p>`);
          list.push(item.ProHours);
        } else {
          list = [item.LineName, item.MoCode, `<p style="color:rgb(255,255,153);font-size:16px;margin:0">${item.ProName}</p>`, item.PlanQty, item.OnlineQty, `<p style="color:rgb(0,255,255);font-size:16px;margin:0">${this.ageingDate(item.StartTime)}</p>`, item.ProHours, item.FinishedQty];
        }
        this.config.data.push(list);
      });
      this.config = { ...this.config };
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
@box-height: 380px;
@box-width: 930px;
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
      height: 360px;
    }
  }
}
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
</style>
