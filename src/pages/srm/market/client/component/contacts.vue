<!--
 * @Author: max
 * @Date: 2022-04-29 17:25:15
 * @LastEditTime: 2022-09-05 10:23:15
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/srm/purchase/supplier/component/contacts.vue
-->
<template>
  <div>
    <a-spin tip="导出中..." :spinning="isExportLod">
      <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
        <div class="operator">
          <a-button type="primary" @click="add" :disabled="!hasPerm('add')" icon="plus">新增</a-button>
        </div>
        <a-table :columns="columns" :data-source="supplierList" size="small" :scroll="{ y: scrollY }" :loading="loading" :pagination="pagination" :rowKey="(dataSource) => dataSource.Id" bordered>
          <template slot="index" slot-scope="text, record, index">
            <div>
              <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
            </div>
          </template>
          <template slot="Enable" slot-scope="record">
            <div>
              <a-tag color="green" v-if="record == 'Y'">启用</a-tag>
              <a-tag color="red" v-else>禁用</a-tag>
            </div>
          </template>
          <template slot="action" slot-scope="text, record">
            <div>
              <a-popconfirm title="确定删除?" @confirm="() => onDelete(record)">
                <a style="margin-right: 8px" :disabled="!hasPerm('delete')">
                  <a-icon type="delete" />
                  删除
                </a>
              </a-popconfirm>
              <a style="margin-right: 8px" @click="edit(record)" :disabled="!hasPerm('edit')">
                <a-icon type="edit" />
                编辑
              </a>
            </div>
          </template>
        </a-table>
      </a-card>
      <contactsForm v-if="isForm" :isEdit="isEdit" :supplierId="supplierId" :editData="editData" @closeModal="closeModal" @success="success" />
    </a-spin>
  </div>
</template>

<script>
import { setSupplierAction } from "@/services/srm.js";
import { renderStripe } from "@/utils/stripe.js";
import { PublicVar } from "@/mixins/publicVar.js";
import { columns } from "../data/contacts";
import contactsForm from "./contactsForm.vue";
export default {
  mixins: [PublicVar],
  props: ["supplierId", "supplierList"],
  components: { contactsForm },
  data() {
    return {
      scrollY: "",
      advanced: true,
      columns,
      dataSource: [],
      plantList: [],
      isSearch: 0,
      isExportLod: false,
      editData: [],
      isEdit: false,
      isForm: false,
    };
  },
  updated() {
    renderStripe();
  },
  methods: {
    add() {
      this.isForm = true;
      this.isEdit = false;
      this.editData = [];
    },
    edit(record) {
      this.isForm = true;
      this.isEdit = true;
      this.editData = record;
    },
    success() {
      this.$emit("success");
    },
    closeModal() {
      this.isForm = false;
    },
    //单个删除
    onDelete(item) {
      let params = [];
      params.push(item.Id);
      setSupplierAction(params, "delete").then((res) => {
        if (res.data.success) {
          this.$message.success("删除成功!");
          this.success();
        }
      });
    },
    exportExcel() {},
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
</style>
