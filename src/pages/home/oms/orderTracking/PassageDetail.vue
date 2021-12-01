<!--
 * @Author: max
 * @Date: 2021-11-27 10:14:45
 * @LastEditTime: 2021-12-01 11:22:17
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/oms/orderTracking/PassageDetail.vue
-->
<template>
  <div>
    <a-modal v-model="visible" :title="`采购在途明细:${detailList.MitemCode}`" @cancel="close" width="80%" :footer="null" centered>
      <a-spin tip="loading..." :spinning="loading">
        <div>
          <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
            <a-table :columns="columns" :data-source="dataSource" :size="size" :scroll="{ y: 600 }" :pagination="false" :rowKey="(dataSource) => dataSource.ErpPlantId" @change="handleTableChange" bordered>
              <template slot="index" slot-scope="text, record, index">
                <div>
                  <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
                </div>
              </template>
              <template slot="action" slot-scope="text, record">
                <div>
                  <a style="margin-right: 8px" @click="detail(record)">
                    查看在途明细
                  </a>
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
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 50,
  },
  {
    title: "供应商",
    dataIndex: "SupplierName",
    align: "center",
    width: 100,
  },
  {
    title: "采购订单",
    dataIndex: "PurchaseOrderNo",
    scopedSlots: { customRender: "PurchaseOrderNo" },
    align: "center",
    width: 100,
  },
  {
    title: "采购订单下单日期",
    dataIndex: "PruchaseOrderDate",
    align: "center",
    customRender: (text) => {
      return splitData(text);
    },
     width: 100,
  },
  {
    title: "品号",
    dataIndex: "MitemCode",
    align: "center",
    width: 80,
  },
  {
    title: "品名",
    dataIndex: "MitemName",
    align: "center",
     width: 100,
  },
  {
    title: " 规格",
    dataIndex: "MitemSpec",
    align: "center",
    width: 200,
  },
  {
    title: "订单数量",
    dataIndex: "PurchaseOrderQty",
    align: "center",
    width: 80,
  },
  {
    title: "已交货数量",
    dataIndex: "DeliveredQty",
    align: "center",
    width: 100,
  },
  {
    title: "欠数量",
    dataIndex: "DeficiencyQty",
    scopedSlots: { customRender: "DeficiencyQty" },
    align: "center",
    width: 80,
  },
  {
    title: "交期要求",
    dataIndex: "DeliveryRequirements",
    scopedSlots: { customRender: "DeliveryRequirements" },
    align: "center",
    width: 80,
  },
];
import { getOrderApi } from "@/services/web.js";
import { splitData } from "@/utils/util.js";
export default {
  props: ["detailList"],
  data() {
    return {
      size: "small",
      visible: true,
      columns,
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
    };
  },
  created() {
    this.getList();
    console.log("this.detailList",this.detailList)
  },
  methods: {
    close() {
      this.$emit("closeModal");
    },
    getList() {
      this.loading = true;
      let params = {
        erpplantid: this.detailList.ErpPlantId,
        mitemcode: this.detailList.MitemCode,
      };
      getOrderApi(params, "getpurmitems").then((res) => {
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
  components: {},
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
