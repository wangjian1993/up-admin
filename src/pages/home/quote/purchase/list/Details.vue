<!--
 * @Author: max
 * @Date: 2021-09-08 09:21:40
 * @LastEditTime: 2021-09-09 10:24:56
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/quote/purchase/list/Details.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="报价单详情" @cancel="close" width="90%" :footer="null" centered>
      <a-spin tip="loading..." :spinning="loading">
        <div>
          <a-descriptions title="报价单" :column="4">
            <a-descriptions-item label="需求公司">
              {{ info.EnterpriseName }}
            </a-descriptions-item>
            <a-descriptions-item label="需求工厂">
              {{ info.PlantName }}
            </a-descriptions-item>
            <a-descriptions-item label="品号">
              {{ info.ItemCode }}
            </a-descriptions-item>
            <a-descriptions-item label="品名">
              {{ info.ItemName }}
            </a-descriptions-item>
            <a-descriptions-item label="产品大类">
              {{ info.ItemSort }}
            </a-descriptions-item>
            <a-descriptions-item label="物料成本">
              {{ info.MaterialCost }}
            </a-descriptions-item>
            <a-descriptions-item label="最终成本">
              {{ info.FinalCost }}
            </a-descriptions-item>
            <a-descriptions-item label="备注">
              {{ info.Remark }}
            </a-descriptions-item>
            <a-descriptions-item label="规格">
              {{ info.ItemSpecification }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
        <div>
          <a-descriptions :column="6" bordered>
            <a-descriptions-item v-for="(item, index) in ConfigList" :key="index" :label="item.CostName">
              {{ item.Amount }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
        <div>
          <a-table :columns="columns" :data-source="list" :size="size" :scroll="{ y: true }" :pagination="pagination" :rowKey="(list) => list.Id" bordered>
            <template slot="index" slot-scope="text, record, index">
              <div>
                <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
              </div>
            </template>
            <template slot="enable" slot-scope="record">
              <div>
                <a-tag color="green" v-if="record == 'Y'">启用</a-tag>
                <a-tag color="red" v-else>禁用</a-tag>
              </div>
            </template>
          </a-table>
        </div>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
const columns = [
  {
    title: "序号",
    dataIndex: "IndexNo",
    align: "center",
    width: "4%",
  },
  {
    title: "阶次",
    dataIndex: "LvNo",
    width: "5%",
  },
  {
    title: "类型",
    dataIndex: "Property",
    scopedSlots: { customRender: "Property" },
    width: "5%",
  },
  {
    title: "上阶料号",
    dataIndex: "LastCode",
    width: "10%",
  },
  {
    title: "料号",
    dataIndex: "ChildCode",
  },
  {
    title: "料名",
    dataIndex: "ChildName",
  },
  {
    title: "料规格",
    dataIndex: "ChildSpecification",
  },
  {
    title: "单位",
    dataIndex: "UnitName",
    width: "5%",
  },
  {
    title: "E10单价",
    dataIndex: "PriceErp",
    scopedSlots: { customRender: "e10" },
    width: "5%",
  },
  {
    title: "单价",
    dataIndex: "Price",
    scopedSlots: { customRender: "Price" },
  },
  {
    title: "用量",
    dataIndex: "Yl",
    width: "5%",
  },
  {
    title: "金额",
    dataIndex: "Amount",
  },
  {
    title: "提示",
    dataIndex: "Tips",
    scopedSlots: { customRender: "Tips" },
    width: "5%",
  },
  {
    title: "备注",
    dataIndex: "Remark",
    scopedSlots: { customRender: "action" },
  },
];
import { getCostConfig } from "@/services/web.js";
export default {
  props: ["detailsId"],
  data() {
    return {
      size: "small",
      visible: true,
      columns,
      list: [],
      info: [],
      pagination: false,
      ConfigList: [],
      loading: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    close() {
      this.$emit("closeModal");
    },
    getList() {
      this.loading = true;
      let parmas = {
        Id: this.detailsId,
      };
      getCostConfig(parmas, "getquotedetail").then((res) => {
        if (res.data.success) {
          this.list = res.data.data.ItemInfo.ItemChildList;
          this.info = res.data.data.ItemInfo;
          this.ConfigList = res.data.data.ConfigList;
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
