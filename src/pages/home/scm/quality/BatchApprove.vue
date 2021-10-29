<!--
 * @Author: max
 * @Date: 2021-10-07 15:16:07
 * @LastEditTime: 2021-10-16 09:09:34
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/scm/quality/BatchApprove.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="批量审批" @cancel="close" @ok="handleOk" centered width="70%">
      <div>
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <a-table :columns="columns" :data-source="batchData" :size="size" :pagination="pagination" bordered>
            <div slot="QTQty" slot-scope="text, record">
              <a-input-number allowClear :min="0" :value="record.QTQty" v-model="record.QTQty" />
            </div>
            <div slot="QualifiedQty" slot-scope="text, record">
              <a-input-number allowClear :min="0" :value="record.QualifiedQty" v-model="record.QualifiedQty" />
            </div>
            <div slot="ReturnQty" slot-scope="text, record">
              <a-input-number allowClear :min="0" :value="record.ReturnQty" v-model="record.ReturnQty" />
            </div>
            <div slot="ScrapQty" slot-scope="text, record">
              <a-input-number allowClear :min="0" :value="record.ScrapQty" v-model="record.ScrapQty" />
            </div>
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
    width: "5%",
  },
  {
    title: "生产工厂",
    dataIndex: "PlantName",
    scopedSlots: { customRender: "PlantName" },
    align: "center",
    width: "100px",
  },
  {
    title: "供应商",
    dataIndex: "SupplierName",
    scopedSlots: { customRender: "SupplierName" },
    align: "center",
    width: "10%",
  },
  {
    title: "品号",
    dataIndex: "MitemCode",
    scopedSlots: { customRender: "MitemCode" },
    align: "center",
  },
  {
    title: "品名",
    dataIndex: "MitemName",
    scopedSlots: { customRender: "MitemName" },
    align: "center",
  },
  {
    title: " 产品规格",
    dataIndex: "MitemSpec",
    align: "center",
    width: "20%",
  },
  {
    title: "行项目",
    dataIndex: "SequenceNumber",
    scopedSlots: { customRender: "SequenceNumber" },
    align: "center",
    width: "80px",
  },
  {
    title: "到货数量",
    dataIndex: "Qty",
    scopedSlots: { customRender: "Qty" },
    align: "center",
    width: "80px",
  },
  {
    title: "检验数量",
    dataIndex: "QTQty",
    scopedSlots: { customRender: "QTQty" },
    align: "center",
    width: "80px",
  },
  {
    title: "合格数量",
    dataIndex: "QualifiedQty",
    scopedSlots: { customRender: "QualifiedQty" },
    align: "center",
    width: "80px",
  },
  {
    title: "退货数量",
    dataIndex: "ReturnQty",
    scopedSlots: { customRender: "ReturnQty" },
    align: "center",
    width: "80px",
  },
  {
    title: "报废数量",
    dataIndex: "ScrapQty",
    scopedSlots: { customRender: "ScrapQty" },
    align: "center",
    width: "80px",
  },
];
import { setQualityAction } from "@/services/web.js";
export default {
  props: ["batchData"],
  data() {
    return {
      columns,
      size: "small",
      visible: true,
      pagination: false,
    };
  },
  created() {},
  methods: {
    close() {
      this.$emit("closeModal");
    },
    handleOk() {
      let parmas = [];
      this.batchData.forEach((item) => {
        console.log(item);
        parmas.push({
          PlantCode: item.PlantCode,
          OrderNo: item.OrderNo,
          MitemCode: item.MitemCode,
          SequenceNumber: item.SequenceNumber,
          QTQty: item.QTQty || 0,
          QualifiedQty: item.QualifiedQty || 0,
          ReturnQty: item.ReturnQty || 0,
          ScrapQty: item.ScrapQty || 0,
        });
      });
      setQualityAction(parmas, "approvedmultiple").then((res) => {
        if (res.data.success) {
          this.$message.success("审核成功!");
          this.$emit("succeed");
          this.$emit("closeModal");
        }
      });
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
