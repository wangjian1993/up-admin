<!--
 * @Author: max
 * @Date: 2021-11-13 14:50:17
 * @LastEditTime: 2021-11-13 15:40:51
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/dailyPlan/details.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="查看领料" :footer="null" @cancel="close" centered width="70%">
      <div>
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <a-table :columns="columns" :data-source="dataSource" :scroll="{ y: 600 }" @change="handleTableChange" :size="size" :pagination="pagination" bordered>
            <template slot="index" slot-scope="text, record, index">
              <div>
                <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
              </div>
            </template>
          </a-table>
        </a-card>
      </div>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 50,
  },
  {
    title: "工单号",
    dataIndex: "MoCode",
    scopedSlots: { customRender: "MoCode" },
    align: "center",
    width: 150,
  },
  {
    title: "业务单号",
    dataIndex: "SupplierName",
    scopedSlots: { customRender: "SupplierName" },
    align: "center",
    width: 150,
  },
  {
    title: "物料品号",
    dataIndex: "MitemCode",
    scopedSlots: { customRender: "MitemCode" },
    align: "center",
    width: 150,
  },
  {
    title: "品名",
    dataIndex: "MitemName",
    scopedSlots: { customRender: "MitemName" },
    align: "center",
    width: 150,
  },
  {
    title: " 需求数量",
    dataIndex: "RequisitionQty",
    align: "center",
    width: 80,
  },
  {
    title: "库存数量",
    dataIndex: "InventoryQty",
    scopedSlots: { customRender: "InventoryQty" },
    align: "center",
    width: 80,
  },
  {
    title: "所在仓库",
    dataIndex: "WarehouseName",
    scopedSlots: { customRender: "WarehouseName" },
    align: "center",
    width: "80px",
  },
];
import { getDailyPlanAction } from "@/services/web.js";
export default {
  props: ["detailsId"],
  data() {
    return {
      columns,
      size: "small",
      visible: true,
      dataSource: [],
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
    };
  },
  created() {
    this.getList();
    console.log("detailsId", this.detailsId);
  },
  methods: {
    close() {
      this.$emit("closeModal");
      console.log("guan")
    },
    getList() {
      this.loading = true;
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        mocode: this.detailsId,
      };
      getDailyPlanAction(parmas, "kanban/getmopicks").then((res) => {
        if (res.data.success) {
          this.dataSource = res.data.data;
          const pagination = { ...this.pagination };
          pagination.total = this.dataSource.length;
          this.pagination = pagination;
          this.loading = false;
        } else {
          this.loading = false;
        }
      });
    },
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
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
/deep/.ant-form-item {
  margin-bottom: 5px;
}
/deep/.ant-table {
  min-height: 0vh;
}
</style>
