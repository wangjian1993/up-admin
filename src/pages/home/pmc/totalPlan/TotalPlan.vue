<!--
 * @Author: max
 * @Date: 2021-08-31 09:36:32
 * @LastEditTime: 2021-09-15 19:08:40
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/pmc/totalPlan/TotalPlan.vue
-->
<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-tabs type="card">
      <a-tab-pane key="1" tab="处理物料计划">
        <action></action>
      </a-tab-pane>
      <a-tab-pane key="2" tab="物料需求总计划">
        <total></total>
      </a-tab-pane>
      <a-tab-pane key="3" tab="物料需求总计划明细">
        <detail></detail>
      </a-tab-pane>
      <a-tab-pane key="4" tab="物料需求总计划明细合并">
        <detail-merge></detail-merge>
      </a-tab-pane>
      <a-tab-pane key="5" tab="物料需求总计划(供应商回复)">
        <reply></reply>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>
<script>
import DetailMerge from "./DetailMerge.vue";
import Action from "./Action.vue";
import Detail from "./Detail.vue";
import Total from "./Total.vue";
import Reply from "./Reply.vue";
import { getMitemrequirement } from "@/services/web.js";
import { mapActions } from "vuex";
export default {
  components: { Action, Detail, Total, Reply, DetailMerge },
  data() {
    return {
      plantList: [],
    };
  },
  created() {
    this.getPlant();
  },
  methods: {
    ...mapActions("plan", ["planListAction"]),
    //获取需求工厂
    getPlant() {
      let parmas1 = {
        entertypecode: "PLANT",
      };
      getMitemrequirement(parmas1, "masterplan/getlistbytypecode").then((res) => {
        if (res.data.success) {
          // this.planListAction(res.data.data);
          // this['plan/planListAction'].then(res => {
          //   console.log("1111",res)
          // })
        }
      });
    },
  },
};
</script>
<style>
.ant-form-item {
  margin-bottom: 5px;
}
</style>
