<!--
 * @Author: max
 * @Date: 2021-12-22 16:01:33
 * @LastEditTime: 2022-11-12 14:47:40
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/power/qrcode/listDetail.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="投料明细" @cancel="close" :footer="null" centered width="70%">
      <div>
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <a-table :columns="columns" :data-source="data" :size="size" :rowKey="(orderSelectList) => orderSelectList.Id" :scroll="{y:600}" bordered>
            <template slot="index" slot-scope="text, record, index">
              <div>
                <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
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
    title: "追溯码",
    dataIndex: "QrCode",
    scopedSlots: { customRender: "QrCode" },
    align: "center",
    width: 120,
  },
  {
    title: "品号",
    dataIndex: "ProCode",
    scopedSlots: { customRender: "ProCode" },
    align: "center",
    width: 120,
  },
  {
    title: "品名",
    dataIndex: "ProName",
    scopedSlots: { customRender: "ProName" },
    align: "center",
    width: 120,
  },
  {
    title: "投料料号",
    dataIndex: "MitemCode",
    scopedSlots: { customRender: "MitemCode" },
    align: "center",
    width: 120,
  },
  {
    title: "投料料名",
    dataIndex: "MitemName",
    scopedSlots: { customRender: "MitemName" },
    align: "center",
    width: 120,
  },
  {
    title: "投料采购单号",
    dataIndex: "MoCode",
    scopedSlots: { customRender: "MoCode" },
    align: "center",
    width: 120,
  },
  {
    title: "投料工序",
    dataIndex: "ProcessName",
    scopedSlots: { customRender: "ProcessName" },
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
    title: "投料人",
    dataIndex: "UserReleased",
    scopedSlots: { customRender: "UserReleased" },
    align: "center",
    width: "80px",
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
      printData: [],
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
        qrcode: this.detailInfo.QrCode,
      };
      getQrCodeList(params, "getdetails").then((res) => {
        console.log("res----", res);
        if (res.data.success) {
          this.data = res.data.data;
        }
      });
    },
    handleOk() {
      this.$emit("success",this.data);
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
