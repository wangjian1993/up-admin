<!--
 * @Author: max
 * @Date: 2021-11-30 15:41:07
 * @LastEditTime: 2021-12-01 11:23:50
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/oms/orderTracking/TotalQty.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="生产总数量" @cancel="close" width="80%" :footer="null" centered>
      <a-spin tip="loading..." :spinning="loading">
        <div>
          <a-descriptions columns="4">
            <a-descriptions-item label="销售公司">
              {{totalQtyData.CompanyName}}
            </a-descriptions-item>
            <a-descriptions-item label="品号">
              {{totalQtyData.MitemCode}}
            </a-descriptions-item>
            <a-descriptions-item label="销售订单">
              {{totalQtyData.SalesOrderNo}}
            </a-descriptions-item>
            <a-descriptions-item label="工单">
              {{totalQtyData.MoCode}}
            </a-descriptions-item>
          </a-descriptions>
          <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
            <a-table :columns="columns" :data-source="dataSource" :size="size" :scroll="{ y: 600 }" :pagination="false" :rowKey="(dataSource, index) => dataSource.ErpPlantId + index" @change="handleTableChange" bordered>
              <template slot="index" slot-scope="text, record, index">
                <div>
                  <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
                </div>
              </template>
            </a-table>
          </a-card>
        </div>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import { getOrderApi } from "@/services/web.js";
import { TotalDeficiencyQty } from "./order.data";
export default {
  props: ["totalQtyData","company"],
  data() {
    return {
      size: "small",
      visible: true,
      columns: TotalDeficiencyQty,
      dataSource: [],
      loading: false,
      pagination: {
        current: 1,
        total: 0,
        pageSize: 20, //每页中显示10条数据
        showSizeChanger: true,
        showLessItems: true,
        showQuickJumper: true,
        pageSizeOptions: ["10", "20", "50", "100"], //每页中显示的数据
        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
      },
      isDetail: false,
      detailList: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    close() {
      this.$emit("closeModal");
    },
    closeModal() {
      this.isDetail = false;
    },
    detail(item) {
      this.isDetail = true;
      this.detailList = item;
    },
    getList() {
      this.loading = true;
      let params = {
        company: this.company,
        salesno: this.totalQtyData.SalesOrderNo,
        lineitem: this.totalQtyData.LineItem,
        mitemcode:this.totalQtyData.MitemCode
      };
      getOrderApi(params, "getmodetail").then((res) => {
        if (res.data.success) {
          this.dataSource = res.data.data;
          const pagination = { ...this.pagination };
          pagination.total = this.dataSource.length;
          this.pagination = pagination;
        }
        this.loading = false;
      });
    },
    //分压
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.getList();
    },
  },
};
</script>

<style lang="less" scoped>
.rowActive {
  background: #000;
}
.form-box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
</style>
