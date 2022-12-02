<!--
 * @Author: max
 * @Date: 2021-12-22 16:01:33
 * @LastEditTime: 2022-12-02 17:00:51
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/power/qrcode/linkDetail.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="关联明细" @cancel="close" :footer="null" centered width="70%">
      <div>
        <a-descriptions :column="3">
          <a-descriptions-item label="采购订单">
            {{ orderInfo.PurchaseNo }}
          </a-descriptions-item>
          <a-descriptions-item label="料号">
            {{ orderInfo.MitemCode }}
          </a-descriptions-item>
          <a-descriptions-item label="料名">
            {{ orderInfo.MitemName }}
          </a-descriptions-item>
        </a-descriptions>
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <a-table :columns="columns" :data-source="data" :pagination="false" :size="size" :rowKey="(orderSelectList) => orderSelectList.Id" :scroll="{ y: 600 }" bordered>
            <template slot="index" slot-scope="text, record, index">
              <div>
                <span>{{index + 1 }}</span>
              </div>
            </template>
            <template slot="ReportQty" slot-scope="text, record">
              <a-input-number v-if="!record.IsWrite" disabled :min="0" v-model="record.ReportQty" />
              <a-input-number v-else :disabled="!record.isInput" :min="0" v-model="record.ReportQty" />
            </template>
            <template slot="ScrapedQty" slot-scope="text, record">
              <a-input-number :disabled="!record.isInput" :min="0" v-model="record.ScrapedQty" />
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
    dataIndex: "indexNo",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 50,
  },
  {
    title: "工单号",
    dataIndex: "MoCode",
    scopedSlots: { customRender: "MoCode" },
    align: "center",
    width: 120,
  },
  {
    title: "投料时间",
    dataIndex: "DateTimeReleased",
    scopedSlots: { customRender: "DateTimeReleased" },
    align: "center",
    width: 120,
  },
  {
    title: "投料数量",
    dataIndex: "ReleasedQty",
    scopedSlots: { customRender: "ReleasedQty" },
    align: "center",
    width: 120,
  },
  {
    title: "供应商编码",
    dataIndex: "UserReleased",
    scopedSlots: { customRender: "UserReleased" },
    align: "center",
    width: 120,
  },
  {
    title: "供应商名称",
    dataIndex: "SupplierName",
    scopedSlots: { customRender: "SupplierName" },
    align: "center",
    width: 120,
  },
];
import { splitData } from "@/utils/util.js";
import { getQrCodeList } from "@/services/mes.js";
export default {
  props: ["detailInfo"],
  data() {
    return {
      data: [],
      columns,
      size: "small",
      visible: true,
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
      isPrint: false,
      orderInfo: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    splitData,
    closeModal() {
      this.isPrint = true;
    },
    close() {
      this.$emit("closeModal");
    },
    getList() {
      let params = {
        purchaseno: this.detailInfo.PurchaseNo,
        mitemcode: this.detailInfo.MitemCode,
      };
      getQrCodeList(params, "getrelation").then((res) => {
        console.log("res----", res);
        if (res.data.success) {
          this.data = res.data.data.List;
          this.orderInfo = res.data.data.Top;
        }
      });
    },
    handleOk() {
      this.$emit("success", this.data);
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
