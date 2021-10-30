<!--
 * @Author: max
 * @Date: 2021-10-29 15:55:46
 * @LastEditTime: 2021-10-30 15:09:14
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/scm/supplierReply/DeliveryProcess.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="交期确认处理" :footer="null" @cancel="close" centered width="70%">
      <a-descriptions columns="4">
        <a-descriptions-item label="生产工厂">
          {{ disposeData.PlantName }}
        </a-descriptions-item>
        <a-descriptions-item label="计划批次">
          {{ disposeData.BatchNo }}
        </a-descriptions-item>
        <a-descriptions-item label="物料编码">
          {{ disposeData.MitemCode }}
        </a-descriptions-item>
        <a-descriptions-item label="物料名称">
          {{ disposeData.MitemName }}
        </a-descriptions-item>
        <a-descriptions-item label="需求日期">
          {{ splitData(disposeData.RequirementDate) }}
        </a-descriptions-item>
        <a-descriptions-item label="需求数量">
          {{ disposeData.RequirementQty }}
        </a-descriptions-item>
        <a-descriptions-item label="物料状态">
          {{ disposeData.MatchStatusName }}
        </a-descriptions-item>
      </a-descriptions>
      <div>
        <div class="tab">
          <a-table :columns="columns" :data-source="list" size="small" :scroll="{ y: 600 }" :pagination="false" :rowKey="(list, index) => index" bordered>
            <template slot="action" slot-scope="text, record">
              <div>
                <a style="margin-right: 8px" @click="consent(record)" :disabled="!hasPerm('consent')">
                  <a-icon type="check-square" />
                  同意交期
                </a>
              </div>
              <div v-if="record.PurchaseId != undefined || record.PurchaseId != null">
                <a style="margin-right: 8px" @click="adjustDate(record)" :disabled="!hasPerm('adjust')">
                  <a-icon type="profile" />
                  调整交期
                </a>
              </div>
            </template>
          </a-table>
        </div>
      </div>
    </a-modal>
    <adjust-date v-if="isAdjust" :adjustData="adjustItem" @closeModal="closeModal"></adjust-date>
  </div>
</template>
<script>
const columns = [
  {
    title: "供应商名称",
    dataIndex: "MitemCode",
    scopedSlots: { customRender: "MitemCode" },
    align: "center",
  },
  {
    title: "采购订单号",
    dataIndex: "PurchaseOrderNo",
    scopedSlots: { customRender: "PurchaseOrderNo" },
    align: "center",
  },
  {
    title: "物料编码",
    dataIndex: "MitemName",
    scopedSlots: { customRender: "MitemName" },
    align: "center",
  },
  {
    title: "行项目号",
    dataIndex: "LineItemNum",
    scopedSlots: { customRender: "LineItemNum" },
    align: "center",
    width: 50,
  },
  {
    title: "需求数量",
    dataIndex: "RequirementQty",
    scopedSlots: { customRender: "RequirementQty" },
    align: "center",
  },
  {
    title: "匹配需求日期",
    dataIndex: "RequirementDate",
    scopedSlots: { customRender: "RequirementDate" },
    align: "center",
    customRender: (text) => {
      return splitData(text);
    },
  },
  {
    title: "供应商回复交期",
    dataIndex: "SupplierReplyDate",
    scopedSlots: { customRender: "SupplierReplyDate" },
    align: "center",
    customRender: (text) => {
      return splitData(text);
    },
  },
  {
    title: "供应商回复数量",
    dataIndex: "SupplierReplyQty",
    scopedSlots: { customRender: "SupplierReplyQty" },
    align: "center",
  },
  {
    title: "采购沟通结果",
    dataIndex: "PurchaseReplyResult",
    scopedSlots: { customRender: "PurchaseReplyResult" },
    align: "center",
  },
  {
    title: "采购调整交期",
    dataIndex: "PurchaseChangeDate",
    scopedSlots: { customRender: "PurchaseChangeDate" },
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];
import { getSupplierAction, setSupplierAction } from "@/services/web.js";
import { splitData } from "@/utils/util.js";
import AdjustDate from "./AdjustDate.vue";
export default {
  components: { AdjustDate },
  props: ["disposeData"],
  data() {
    return {
      columns,
      size: "small",
      visible: true,
      list: [],
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
      isAdjust: false,
      adjustItem: [],
    };
  },
  created() {
    this.getDatile();
  },
  methods: {
    splitData,
    close() {
      this.$emit("closeModal");
    },
    closeModal() {
      this.isAdjust = false;
      this.$emit("succeed");
      this.$emit("closeModal");
    },
    adjustDate(item) {
      this.isAdjust = true;
      this.adjustItem = item;
      this.adjustItem.BatchNo = this.disposeData.BatchNo;
      console.log(this.adjustItem);
    },
    //获取物料信息
    getDatile() {
      let parmas = {
        detailid: this.disposeData.Id,
      };
      getSupplierAction(parmas, "reply/getconfirmlist").then((res) => {
        if (res.data.success) {
          this.list = res.data.data;
          this.list.map((item) => {
            item.RequirementDate = this.splitData(this.disposeData.RequirementDate);
          });
        }
      });
    },
    consent(item) {
      let parmas = {
        BatchId: item.BatchId,
        DetailId: item.DetailId,
        PurchaseId: item.PurchaseId,
      };
      setSupplierAction(parmas, "reply/agree").then((res) => {
        if (res.data.success) {
          this.$message.success("同意供应商交期成功!");
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
