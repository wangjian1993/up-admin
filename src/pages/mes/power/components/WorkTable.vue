<!--
 * @Author: max
 * @Date: 2021-12-15 15:56:46
 * @LastEditTime: 2022-10-28 10:57:12
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/power/components/WorkTable.vue
-->
<template>
  <div>
    <a-table :columns="columnsData" :data-source="orderList" size="small" :scroll="{ y: 500, x: 1100 }" :pagination="false" bordered>
      <template slot="index" slot-scope="text, record, index">
        <div>
          <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
        </div>
      </template>
      <template slot="Plant" slot-scope="text, record"> {{ record.PlantName }} / {{ record.WorkshopName }} / {{ record.LineName }} </template>
      <!-- <template slot="ReportQty" slot-scope="text, record">
        <a-input-number :min="0" v-model="record.ReportQty" v-if="tableType == 2" />
        <span v-else>{{ text }}</span>
      </template>
      <template slot="ScrapedQty" slot-scope="text, record">
        <a-input-number :min="0" v-model="record.ScrapedQty" />
      </template> -->
      <template slot="action" slot-scope="text, record">
        <div>
          <a style="margin-right: 8px" @click="agingSave(record)" :disabled="!hasPerm('save')">
            <a-icon type="save" />
            保存
          </a>
        </div>
      </template>
    </a-table>
  </div>
</template>

<script>
import { columns, columns1, columns2 } from "./data.js";
import { PublicVar } from "@/mixins/publicVar.js";
export default {
  mixins: [PublicVar],
  props: ["orderList", "tableType"],
  data() {
    return {
      columnsData: [],
    };
  },
  created() {
    if (this.tableType == 1) {
      this.columnsData = columns1;
    } else if (this.tableType == 3) {
      this.columnsData = columns2;
    } else {
      this.columnsData = columns;
    }
  },
  methods: {
    agingSave(item) {
      console.log("更新====");
      this.$emit("listUpdate", item);
    },
  },
  components: {},
};
</script>

<style></style>
