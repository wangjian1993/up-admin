<!--
 * @Author: max
 * @Date: 2021-11-25 13:58:47
 * @LastEditTime: 2021-12-30 13:48:16
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
        index: false,
        align: ["center", "center", "center", "center", "center", "center", "center", "center", "center", "center", "center", "center"],
        columnWidth: [],
      },
    };
  },
  components: {},
  mounted() {
    let type = this.$route.path.split("&");
    this.dataType = type[1];
    if (this.dataType === "lh") {
      this.config.header = ["产线", "工单", "品名", "接收数量", "转移数量", "老化开始时间", "已老化小时数"];
      this.config.columnWidth = [100, 160, 200, 100, 100, 110, 110];
    } else {
      this.config.header = ["产线", "工单", "品名", "计划数量", "拉上数量", "开工时间", "已上传小时数", "已入库数量"];
      this.config.columnWidth = [90, 160, 200, 90, 100, 110, 110,100];
    }
    this.linePlanData.map((item) => {
      let list = [];
      if (this.dataType === "lh") {
        list.push(item.LineName);
        list.push(item.MoCode);
        list.push(item.ProName);
        list.push(item.PlanQty);
        list.push(item.FinishedQty);
        list.push(this.ageingStart(item.StartTime));
        list.push(item.ProHours);
        // list = [item.LineName, item.MoCode, item.ProName, item.PlanQty, `<span style="color:#32c5e9;">${item.StatusName}</span>`, "", "", item.AgeingHour, item.ReworkQty, item.FinishedQty, item.DefectiveQty, item.DefectiveProportion];
      } else {
        list = [item.LineName, item.MoCode, item.ProName, item.PlanQty, item.StatusName, item.StartTime, item.FinishedQty, item.FinishedTime, item.ReworkQty, item.DefectiveQty, item.ReachProportion, item.DefectiveProportion];
      }
      this.config.data.push(list);
    });
  },
  methods: {
    ageingStart(time) {
      if (time == null) {
        return;
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
      width: 930px;
      height: 360px;
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
