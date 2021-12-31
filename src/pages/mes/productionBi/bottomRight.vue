<!--
 * @Author: max
 * @Date: 2021-12-10 09:39:43
 * @LastEditTime: 2021-12-31 09:07:36
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/productionBi/bottomRight.vue
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
  data() {
    return {
      config: {
        header: ["产线", "工单", "品名", "计划数量", "拉上数量", "开工时间", "已生产小时数", "已入库数量"],
        data: [],
        rowNum: 7, //表格行数
        headerHeight: 50,
        headerBGC: "#0f1325", //表头
        oddRowBGC: "#0f1325", //奇数行
        evenRowBGC: "#171c33", //偶数行
        index: false,
        align: ["center", "center", "center", "center", "center", "center", "center", "center"],
      },
    };
  },
  components: {},
  mounted() {},
  methods: {},
};
</script>

<style lang="less" scoped>
@box-height: 370px;
@box-width: 840px;
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
      width: 840px;
      height: 390px;
    }
  }
}
::v-deep .dv-scroll-board .rows .row-item {
  font-size: 14px;
}
::v-deep .dv-scroll-board .header .header-item {
  font-size: 16px;
}
</style>
