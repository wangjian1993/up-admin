<!--
 * @Author: max
 * @Date: 2021-09-08 09:21:40
 * @LastEditTime: 2021-09-15 15:05:48
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/quote/purchase/list/Details.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="报价单详情" @cancel="close" width="90%" :footer="null" centered>
      <a-spin tip="loading..." :spinning="loading">
        <div>
          <a-descriptions title="基本信息" :column="4" bordered>
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
        <div style="padding-top:10px">
          <a-descriptions title="配置费用" :column="6" bordered>
            <a-descriptions-item v-for="(item, index) in ConfigList" :key="index" :label="item.CostName">
              {{ item.Amount }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
        <div>
          <a-card title="物料列表" class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
            <a-tabs default-active-key="1">
              <a-tab-pane key="1" tab="展开显示">
                <a-table :columns="columns" :data-source="list" :size="size" :scroll="{ y: true }" :pagination="pagination" :rowKey="(list) => list.IndexNo + 'tab1'" bordered>
                  <div slot="e10" slot-scope="text, record">
                    <p>{{ record.PriceErpSource == "" ? text : text + `(${record.PriceErpSource})` }}</p>
                  </div>
                </a-table>
              </a-tab-pane>
              <a-tab-pane key="2" tab="收缩显示">
                <a-table :columns="columns" :data-source="treeData" :size="size" :scroll="{ y: true }" :pagination="pagination" :rowKey="(treeData) => treeData.IndexNo + 'tab2'" bordered>
                  <div slot="e10" slot-scope="text, record">
                    <p>{{ record.PriceErpSource == "" ? text : text + `(${record.PriceErpSource})` }}</p>
                  </div>
                </a-table>
              </a-tab-pane>
            </a-tabs>
          </a-card>
        </div>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
const columns = [
  {
    title: "阶次",
    dataIndex: "LvNo",
    width: "10%",
    align: "left",
  },
  {
    title: "序号",
    dataIndex: "IndexNo",
    align: "center",
    width: "4%",
  },
  {
    title: "类型",
    dataIndex: "Property",
    scopedSlots: { customRender: "Property" },
    width: "5%",
    align: "center",
  },
  {
    title: "上阶料号",
    dataIndex: "LastCode",
    width: "10%",
    align: "center",
  },
  {
    title: "料号",
    dataIndex: "ChildCode",
    align: "center",
  },
  {
    title: "料名",
    dataIndex: "ChildName",
    align: "center",
  },
  {
    title: "料规格",
    dataIndex: "ChildSpecification",
    align: "center",
  },
  {
    title: "单位",
    dataIndex: "UnitName",
    align: "center",
    width: "4%",
  },
  {
    title: "E10单价",
    dataIndex: "PriceErp",
    scopedSlots: { customRender: "e10" },
    align: "center",
    width: "10%",
  },
  {
    title: "单价",
    dataIndex: "Price",
    scopedSlots: { customRender: "Price" },
    align: "center",
    width: "5%",
  },
  {
    title: "用量",
    dataIndex: "Yl",
    align: "center",
    width: "5%",
  },
  {
    title: "金额",
    dataIndex: "Amount",
    align: "center",
    width: "5%",
  },
  {
    title: "提示",
    dataIndex: "Tips",
    scopedSlots: { customRender: "Tips" },
    align: "center",
    width: "5%",
  },
  {
    title: "备注",
    dataIndex: "Remark",
    scopedSlots: { customRender: "action" },
    align: "center",
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
      treeData: [],
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
          this.treeData = this.initTree(this.info.ItemCode);
          this.calField(this.treeData);
        }
        this.loading = false;
      });
    },
    calField(tree) {
      tree.forEach((node) => {
        if (node.children && node.children.length > 0 ) {
          // console.log(node.children)
          this.calField(node.children);
          node.Amount = node.children.reduce((sum, item) => ((sum += item.Amount), parseFloat(sum.toFixed(4))), 0);
        } else {
          let sum = node.Amount * 1;
          node.Amount = parseFloat(sum.toFixed(4));
          delete node.children;
        }
      });
      return tree;
    },
    treeDone(data) {
      data.forEach((item) => {
        if (item.children && item.children.length > 0) {
          item = this.treeDone(item.children);
        } else {
          delete item.children;
        }
        return item;
      });
      return data;
    },
    initTree(parent_id) {
      // jsonArray 变量数据
      // 第一次以后：根据id去查询parent_id相同的（相同为子数据）
      // 第一次：查找所有parent_id为-1的数据组成第一级
      const child = this.list.filter((item) => item.LastCode == parent_id);
      // 第一次：循环parent_id为-1数组
      return child.map((item) => ({
        ...item,
        // 当前存在id（id与parent_id应该是必须有的）调用initTree() 查找所有parent_id为本id的数据
        // childs字段写入
        children: this.initTree(item.ChildCode),
      }));
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
/deep/.ant-descriptions-bordered .ant-descriptions-item-label {
  background: rgba(0, 0, 0, 0.05);
}
/deep/.ant-card-head {
  padding: 0;
}
</style>
