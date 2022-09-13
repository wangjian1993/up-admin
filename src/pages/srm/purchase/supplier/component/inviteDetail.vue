<!--
 * @Author: max
 * @Date: 2021-10-14 16:15:42
 * @LastEditTime: 2022-09-08 10:07:04
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/srm/purchase/supplier/component/inviteDetail.vue
-->
<template>
  <div>
    <a-drawer :visible="visible" title="供应商信息" placement="right" @close="close" :get-container="false" :wrap-style="{ position: 'absolute' }" width="100%" :footer="null" centered :bodyStyle="{ padding: '5px 10px' }">
      <a-tabs type="card">
        <a-tab-pane key="1" tab="供应商明细">
          <a-descriptions :column="5" bordered size="small">
            <a-descriptions-item v-for="(item, index) in info" :key="index" :label="item.title">
              {{ supplierInfo[item.dataIndex] }}
            </a-descriptions-item>
          </a-descriptions>
          <contacts :supplierId="supplierInfo.Id" :supplierList="supplierList" @success="getDetailList" />
        </a-tab-pane>
        <a-tab-pane key="2" tab="供应绩效"> </a-tab-pane>
      </a-tabs>
    </a-drawer>
  </div>
</template>

<script>
import { getSupplierAction } from "@/services/srm.js";
import { splitData } from "@/utils/util.js";
import { info } from "../data/detail";
import contacts from "./contacts.vue";
export default {
  props: ["detailId"],
  components: { contacts },
  data() {
    return {
      size: "small",
      info,
      visible: true,
      loading: false,
      supplierInfo: [],
      supplierList: [],
    };
  },
  created() {
    this.getDetailList();
  },
  methods: {
    splitData,
    close() {
      this.$emit("closeModal");
    },
    closeModal() {
      this.isModelInfo = false;
      this.isUnfold = false;
    },
    getDetailList() {
      this.loading = true;
      let params = {
        id: this.detailId,
      };
      getSupplierAction(params, "single").then((res) => {
        if (res.data.success) {
          this.supplierInfo = res.data.data.supplier;
          this.supplierList = res.data.data.contectList;
        }
        this.loading = false;
      });
    },
    //查看详情
    onClose() {
      this.isDrawer = false;
    },
    //关闭对话框
    handleCancel() {
      this.isAddModal = false;
      this.isUnfold = false;
    },
  },
};
</script>

<style lang="less" scoped>
p {
  padding: 0;
  margin: 0;
}
.rowActive {
  background: #000;
}
.form-box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
/deep/.ant-descriptions-bordered .ant-descriptions-item-label {
  background: rgba(0, 0, 0, 0.05);
}
/deep/.ant-card-head {
  padding: 0;
}
/deep/.ant-table {
  font-size: 10px;
}
/deep/.ant-descriptions-title {
  margin-bottom: 0;
}
/deep/.ant-table-row-cell-break-word {
  white-space: nowrap;
  overflow: hidden;
}
/deep/.ant-descriptions-item-content {
  font-size: 10px;
}
</style>
