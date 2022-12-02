<!--
 * @Author: max
 * @Date: 2021-12-15 15:56:46
 * @LastEditTime: 2022-12-02 16:59:31
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/power/qrcode/WorkTable.vue
-->
<template>
  <div>
    <a-button v-if="tableType == 3" type="primary" icon="export" :disabled="orderList.length == 0" @click="exportExcel">导出</a-button>
    <a-table :columns="columnsData" :data-source="orderList" size="small" :scroll="{x: 1100 }" :pagination="false" bordered>
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
      <template slot="Action" slot-scope="text, record">
        <div>
          <a style="margin-right: 8px" @click="detail(record)">
            <a-icon type="save" />
            关联明细
          </a>
        </div>
      </template>
    </a-table>
    <LinkDetail v-if="isLinkDetail" :detailInfo="detailInfo" @closeModal="closeModal"/>
  </div>
</template>

<script>
import { columns, columns1, columns2, columns3 } from "./data.js";
import { PublicVar } from "@/mixins/publicVar.js";
import ExportExcel from "@/utils/ExportExcelJS";
import LinkDetail from './linkDetail.vue'
export default {
  mixins: [PublicVar],
  props: ["orderList", "tableType"],
  components: {LinkDetail},
  data() {
    return {
      columnsData: [],
      isLinkDetail:false,
      detailInfo:[]
    };
  },
  created() {
    if (this.tableType == 1) {
      this.columnsData = columns1;
    } else if (this.tableType == 2) {
      this.columnsData = columns2;
    } else if (this.tableType == 3) {
      this.columnsData = columns3;
    } else {
      this.columnsData = columns;
    }
  },
  methods: {
    closeModal(){
      this.isLinkDetail = false;
    },
    detail(item) {
      console.log("更新====");
      this.detailInfo = item;
      this.isLinkDetail = true;
    },
    exportExcel() {
      const dataSource = this.orderList.map((item) => {
        Object.keys(item).forEach((key) => {
          // 后端传null node写入会有问题
          if (item[key] === null) {
            item[key] = "";
          }
          if (Array.isArray(item[key])) {
            item[key] = item[key].join(",");
          }
        });
        return item;
      });
      const header = [];
      this.columnsData.map((item) => {
        if (item.dataIndex) {
          header.push({ key: item.dataIndex, title: item.title });
        }
      });
      var timestamp = Date.parse(new Date());
      try {
        ExportExcel(header, dataSource, `产品追溯码_${timestamp}.xlsx`);
        this.$message.success("导出数据成功!");
      } catch (error) {
        console.log(error);
        this.$message.error("导出数据失败");
      }
    },
  },
};
</script>

<style>
</style>
