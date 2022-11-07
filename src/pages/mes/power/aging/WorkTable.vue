<!--
 * @Author: max
 * @Date: 2021-12-15 15:56:46
 * @LastEditTime: 2021-12-27 16:03:21
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/components/WorkTable.vue
-->
<template>
  <div>
    <a-table :columns="columns" :data-source="orderList" size="small" :scroll="{ y: 500, x: 2000 }" :pagination="false" bordered>
      <template slot="index" slot-scope="text, record, index">
        <div>
          <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
        </div>
      </template>
      <template slot="ReportQty" slot-scope="text">
        {{ text }}
      </template>
      <template slot="ReportQtyTitle">
        <span>{{ tableType == 0 ? "开工数量" : tableType == 1 ? "进站数量" : tableType == 2 ? "报工数量" : "返工数量" }}</span>
      </template>
    </a-table>
  </div>
</template>

<script>
import { columns } from "./data.js";
import { PublicVar } from "@/mixins/publicVar.js";
export default {
  mixins: [PublicVar],
  props: ["orderList", "tableType"],
  data() {
    return {
      columns,
    };
  },
  components: {},
};
</script>

<style></style>
