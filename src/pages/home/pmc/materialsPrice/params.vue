<!--
 * @Author: max
 * @Date: 2022-04-27 08:46:44
 * @LastEditTime: 2022-06-21 11:24:30
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/pmc/materialsPrice/params.vue
-->
<template>
  <div>
    <a-spin tip="导出中..." :spinning="isExportLod">
      <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
        <div>
          <a-button type="primary" @click="isImportExcel = true">导入</a-button>
          <a-button style="margin-left: 8px" @click="exportExcel">导出</a-button>
        </div>
        <a-table :columns="columns" :data-source="dataSource" size="small" :scroll="{ y: scrollY }" :loading="loading" :pagination="false" :rowKey="(dataSource, index) => dataSource.ItemCode + '_' + index" bordered>
          <template slot="index" slot-scope="text, record, index">
            <div>
              <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
            </div>
          </template>
          <template slot="TaxIncluded" slot-scope="text">
            <div>
              <a-tag :color="text === 'True' ? 'green' : 'red'">{{ text === "True" ? "是" : "否" }}</a-tag>
            </div>
          </template>
          <template slot="ComponentPrice" slot-scope="text">
            <div>
              <a-tag :color="text === 'True' ? 'green' : 'red'">{{ text === "True" ? "是" : "否" }}</a-tag>
            </div>
          </template>
          <template slot="EffectiveDate" slot-scope="text, record">
            <div>
              <p>{{ timeSplit(record.EffectiveDate) }}</p>
              <p v-if="record.EffectiveDateAfter != ''">{{ record.EffectiveDateAfter }}(修改后)</p>
            </div>
          </template>
          <template slot="Price" slot-scope="text, record">
            <div>
              <p>{{ record.Price }}</p>
              <p v-if="record.PriceAfter != ''">{{ record.PriceAfter }}(修改后)</p>
            </div>
          </template>
          <template slot="PriceD" slot-scope="text, record">
            <div>
              <p>{{ record.PriceD }}</p>
              <p v-if="record.PriceDAfter != ''">{{ record.PriceDAfter }}(修改后)</p>
            </div>
          </template>
        </a-table>
        <ImportExcel v-if="isImportExcel" @success="getListAll" />
      </a-card>
    </a-spin>
  </div>
</template>

<script>
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
import { splitData } from "@/utils/util.js";
import { PublicVar } from "@/mixins/publicVar.js";
import { columns } from "./params";
import ImportExcel from "./ImportExcel.vue";
import ExportExcel from "@/utils/ExportExcelJS";
export default {
  mixins: [PublicVar],
  components: { ImportExcel },
  data() {
    return {
      scrollY: "",
      columns,
      dataSource: [],
      isExportLod: false,
      isImportExcel: false,
    };
  },
  updated() {
    renderStripe();
  },
  created() {
    this.$nextTick(() => {
      this.scrollY = getTableScroll(70);
    });
  },
  methods: {
    splitData,
    //重置搜索
    getListAll(list) {
      this.dataSource = [];
      this.isImportExcel = false;
      this.dataSource = list;
    },
    exportExcel() {
      const dataSource = this.dataSource.map((item) => {
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
      this.columns.map((item) => {
        if (item.dataIndex) {
          header.push({ key: item.dataIndex, title: item.title });
        }
      });
      var timestamp = Date.parse(new Date());
      try {
        ExportExcel(header, dataSource, `提取参数_${timestamp}.xlsx`);
        this.$message.success("导出数据成功!");
      } catch (error) {
        // console.log(error);
        this.$message.error("导出数据失败");
      }
      this.isExportLod = false;
    },
  },
};
</script>

<style scoped lang="less">
/deep/.ant-table {
  min-height: 62vh;
}
.ant-form-item {
  margin-bottom: 5px;
}
/deep/.Rowactive > td {
  // background-color: #ed0e0e !important;
  color: #f60e0e !important;
}
</style>
