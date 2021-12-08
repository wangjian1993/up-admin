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
        data: [
          ["组件1", "<p>WK210203WK210203WK210203WK210203WK210203</p>", "<span  class='colorGrass'>↑75%</span>", "200", "20", "09:00", "2", "0"],
          ["组件2", "WK210203WK210203", "<span  class='colorRed'>↓33%</span>", "200", "20", "09:00", "2", "0"],
          ["组件3", "dev-3dev-3WK210203WK210203", "<span  class='colorGrass'>↑100%</span>", "200", "20", "09:00", "2", "0"],
          ["组件4", "rea-1WK210203WK210203", "<span  class='colorGrass'>↑94%</span>", "200", "20", "09:00", "2", "0"],
          ["组件5", "rea-2WK210203WK210203", "<span  class='colorGrass'>↑95%</span>", "200", "20", "09:00", "2", "0"],
          ["组件6", "fWK210203", "<span  class='colorGrass'>↑63%</span>", "200", "20", "09:00", "2", "0"],
          ["组件7", "fix-4", "<span  class='colorGrass'>↑84%</span>", "200", "20", "09:00", "2", "0"],
          ["组件8", "fix-7", "<span  class='colorRed'>↓46%</span>", "200", "20", "09:00", "2", "0"],
          ["组件9", "dev-2", "<span  class='colorRed'>↓13%</span>", "200", "20", "09:00", "2", "0"],
          ["组件10", "dev-9", "<span  class='colorGrass'>↑76%</span>", "200", "20", "09:00", "2", "0"],
          ["组件10", "dev-9", "<span  class='colorGrass'>↑76%</span>", "200", "20", "09:00", "2", "0"],
          ["组件10", "dev-9", "<span  class='colorGrass'>↑76%</span>", "200", "20", "09:00", "2", "0"],
          ["组件10", "dev-9", "<span  class='colorGrass'>↑76%</span>", "200", "20", "09:00", "2", "0"],
          ["组件10", "dev-9", "<span  class='colorGrass'>↑76%</span>", "200", "20", "09:00", "2", "0"],
          ["组件10", "dev-9", "<span  class='colorGrass'>↑76%</span>", "200", "20", "09:00", "2", "0"],
          ["组件1", "WK210203", "<span  class='colorGrass'>↑75%</span>", "200", "20", "09:00", "2", "0"],
          ["组件2", "WK210203", "<span  class='colorRed'>↓33%</span>", "200", "20", "09:00", "2", "0"],
          ["组件3", "dev-3", "<span  class='colorGrass'>↑100%</span>", "200", "20", "09:00", "2", "0"],
          ["组件4", "rea-1", "<span  class='colorGrass'>↑94%</span>", "200", "20", "09:00", "2", "0"],
          ["组件5", "rea-2", "<span  class='colorGrass'>↑95%</span>", "200", "20", "09:00", "2", "0"],
          ["组件6", "fWK210203", "<span  class='colorGrass'>↑63%</span>", "200", "20", "09:00", "2", "0"],
          ["组件7", "fix-4", "<span  class='colorGrass'>↑84%</span>", "200", "20", "09:00", "2", "0"],
          ["组件8", "fix-7", "<span  class='colorRed'>↓46%</span>", "200", "20", "09:00", "2", "0"],
          ["组件9", "dev-2", "<span  class='colorRed'>↓13%</span>", "200", "20", "09:00", "2", "0"],
          ["组件10", "dev-9", "<span  class='colorGrass'>↑76%</span>", "200", "20", "09:00", "2", "0"],
          ["组件10", "dev-9", "<span  class='colorGrass'>↑76%</span>", "200", "20", "09:00", "2", "0"],
          ["组件10", "dev-9", "<span  class='colorGrass'>↑76%</span>", "200", "20", "09:00", "2", "0"],
          ["组件10", "dev-9", "<span  class='colorGrass'>↑76%</span>", "200", "20", "09:00", "2", "0"],
          ["组件10", "dev-9", "<span  class='colorGrass'>↑76%</span>", "200", "20", "09:00", "2", "0"],
          ["组件10", "dev-9", "<span  class='colorGrass'>↑76%</span>", "200", "20", "09:00", "2", "0"],
        ],
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
@box-height: 500px;
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
      height: 430px;
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
