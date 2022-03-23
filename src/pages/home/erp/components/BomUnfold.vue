<!--
 * @Author: max
 * @Date: 2021-12-02 17:34:40
 * @LastEditTime: 2022-03-23 11:15:51
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/erp/components/BomUnfold.vue
-->
<template>
  <div>
    <a-drawer :visible="visible" title="BOM展开" placement="right" @close="close" :get-container="false" :wrap-style="{ position: 'absolute' }" width="100%" :footer="null" centered :headerStyle="{ padding: '5px 20px' }" :bodyStyle="{ padding: '5px 10px' }">
      <a-spin tip="loading..." :spinning="loading">
        <div>
          <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
            <a-table :columns="columns" :data-source="list" :size="size" :scroll="{x: 2000 }" :pagination="false" :customRow="handleClickRow" @change="handleTableChange" :rowKey="(list, index) => list.ITEM_CODE + '_' + index" bordered :components="components"> </a-table>
          </a-card>
        </div>
      </a-spin>
    </a-drawer>
    <model-info v-if="isModelInfo" :modelData="modelData" @closeModal="closeModal"></model-info>
  </div>
</template>

<script>
const columns = [
  {
    title: "阶层",
    dataIndex: "LOWLEVEL",
    scopedSlots: { customRender: "LOWLEVEL" },
    align: "left",
    width: 100,
  },
  {
    title: "序号",
    dataIndex: "INDEX",
    scopedSlots: { customRender: "INDEX" },
    align: "center",
    width: 60,
  },
  {
    title: "上阶品号",
    dataIndex: "LAST_ITEM_CODE",
    scopedSlots: { customRender: "LAST_ITEM_CODE" },
    align: "left",
    width: 120,
  },
  {
    title: "元件品号",
    dataIndex: "ITEM_CODE",
    scopedSlots: { customRender: "ITEM_CODE" },
    align: "left",
    width: 120,
  },
  {
    title: "快捷码",
    dataIndex: "SHORTCUT",
    scopedSlots: { customRender: "SHORTCUT" },
    align: "left",
    width: 120,
  },
  {
    title: "元件品名",
    dataIndex: "ITEM_NAME",
    scopedSlots: { customRender: "ITEM_NAME" },
    align: "left",
    width: 150,
  },
  {
    title: "元件规格",
    dataIndex: "ITEM_SPECIFICATION",
    scopedSlots: { customRender: "ITEM_SPECIFICATION" },
    align: "left",
    width: 250,
  },
  {
    title: "单位",
    dataIndex: "UNIT_NAME",
    scopedSlots: { customRender: "UNIT_NAME" },
    align: "center",
    width: 50,
  },
  {
    title: "组成用量",
    dataIndex: "QTY_PER",
    scopedSlots: { customRender: "QTY_PER" },
    align: "center",
    width: 80,
  },
  {
    title: "底数",
    dataIndex: "DENOMINATOR",
    scopedSlots: { customRender: "DENOMINATOR" },
    align: "center",
    width: 50,
  },
  {
    title: "插件位置",
    dataIndex: "COMPONENT_LOCATION",
    scopedSlots: { customRender: "COMPONENT_LOCATION" },
    align: "center",
    width: 80,
  },
  {
    title: "变动损耗",
    dataIndex: "DYNAMIC_LOSS_RATE",
    scopedSlots: { customRender: "DYNAMIC_LOSS_RATE" },
    align: "center",
    width: 80,
  },
  {
    title: "生效日期",
    dataIndex: "EFFECTIVE_DATE",
    scopedSlots: { customRender: "EFFECTIVE_DATE" },
    align: "center",
    width: 120,
    customRender: (text) => {
      return splitData(text);
    },
  },
  {
    title: "失效时间",
    dataIndex: "EXPRITY_DATE",
    scopedSlots: { customRender: "EXPRITY_DATE" },
    align: "center",
    width: 120,
    customRender: (text) => {
      return splitData(text);
    },
  },
  {
    title: "备注",
    dataIndex: "REMARK",
    scopedSlots: { customRender: "REMARK" },
    align: "center",
    width: 80,
  },
  {
    title: "BOM生效状态",
    dataIndex: "ApproveStatus",
    scopedSlots: { customRender: "ApproveStatus" },
    align: "center",
    width: 120,
    customRender: (text) => {
      return text == "Y" ? "已生效" : text == "N" ? "未生效" : "失效";
    },
  },
  {
    title: "图号",
    dataIndex: "DRAWING_NO",
    scopedSlots: { customRender: "DRAWING_NO" },
    align: "center",
    width: 150,
    ellipsis: true,
  },
  {
    title: "品号类型",
    dataIndex: "ITEM_PROPERTY",
    scopedSlots: { customRender: "ITEM_PROPERTY" },
    align: "center",
    width: 120,
  },
  {
    title: "BOM生效日期",
    dataIndex: "ApproveDate",
    scopedSlots: { customRender: "ApproveDate" },
    align: "center",
    width: 120,
    customRender: (text) => {
      return splitData(text);
    },
  },
  {
    title: "BOM生效者",
    dataIndex: "EMPLOYEE_NAME_A",
    scopedSlots: { customRender: "EMPLOYEE_NAME_A" },
    align: "center",
    width: 120,
  },
  {
    title: "BOM创建日期",
    dataIndex: "CreateDate",
    scopedSlots: { customRender: "CreateDate" },
    align: "center",
    width: 120,
    customRender: (text) => {
      return splitData(text);
    },
  },
];
import { getERPReportAction } from "@/services/erp.js";
import { splitData } from "@/utils/util.js";
import { feedSystem, modelType, stateType } from "@/utils/BomParmas.js";
import ModelInfo from "./ModelInfo.vue";
import { resizeableTitle } from "@/utils/resizeableTitle.js";
export default {
  components: { ModelInfo },
  props: ["ModelInfo"],
  data() {
    this.components = {
      header: {
        cell: (h, props, children) => resizeableTitle(h, props, children, this.columns),
      },
    };
    return {
      size: "small",
      columns,
      visible: true,
      list: [],
      pagination: {
        current: 1,
        total: 0,
        pageSize: 100, //每页中显示10条数据
        showSizeChanger: true,
        showLessItems: true,
        showQuickJumper: true,
        pageSizeOptions: ["10", "20", "50", "100"], //每页中显示的数据
        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
      },
      ConfigList: [],
      loading: false,
      treeData: [],
      isModelInfo: false,
      modelData: [],
      antDescriptionsRow: "",
    };
  },
  created() {
    this.getList();
  },
  methods: {
    splitData,
    modelType,
    feedSystem,
    stateType,
    close() {
      this.$emit("closeModal");
    },
    closeModal() {
      this.isModelInfo = false;
    },
    //物料需求详情
    detail(item) {
      this.isModelInfo = true;
      this.modelData = item;
    },
    getList() {
      console.log(this.ModelInfo);
      this.loading = true;
      let parmas = {
        plantid: this.ModelInfo.plantId,
        itemcode: this.ModelInfo.ITEM_CODE,
      };
      getERPReportAction(parmas, "getbomchildlevel").then((res) => {
        if (res.data.success) {
          this.list = res.data.data.list;
          this.list = this.initTree(this.ModelInfo.ITEM_CODE);
          this.calField(this.list);
          this.loading = false;
        } else {
          this.loading = false;
        }
      });
    },
    calField(tree) {
      tree.forEach((node) => {
        if (node.children && node.children.length > 0) {
          // console.log(node.children)
          this.calField(node.children);
          // node.Amount = node.children.reduce((sum, item) => ((sum += item.Amount), parseFloat(sum.toFixed(4))), 0);
        } else {
          // let sum = node.Amount * 1;
          // node.Amount = parseFloat(sum.toFixed(4));
          delete node.children;
        }
      });
      return tree;
    },
    initTree(parent_id) {
      // jsonArray 变量数据
      // 第一次以后：根据id去查询parent_id相同的（相同为子数据）
      // 第一次：查找所有parent_id为-1的数据组成第一级
      const child = this.list.filter((item) => item.LAST_ITEM_CODE == parent_id);
      // 第一次：循环parent_id为-1数组
      return child.map((item) => ({
        ...item,
        // 当前存在id（id与parent_id应该是必须有的）调用initTree() 查找所有parent_id为本id的数据
        // childs字段写入
        children: this.initTree(item.ITEM_CODE),
      }));
    },
    //查看详情
    onClose() {
      this.isDrawer = false;
    },
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.getList();
    },
    handleClickRow(record) {
      return {
        style: {
          // 行背景色
          cursor: "pointer",
        },
        on: {
          dblclick: () => {
            this.isModelInfo = true;
            this.modelData = record;
            this.modelData.plantid = this.ModelInfo.plantId;
          },
        },
      };
    },
    //关闭对话框
    handleCancel() {
      this.isAddModal = false;
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
/deep/.ant-descriptions-bordered .ant-descriptions-item-label {
  background: rgba(0, 0, 0, 0.05);
}
/deep/.ant-card-head {
  padding: 0;
}
/deep/.color2 {
  color: red;
}
/deep/.color1 {
  color: #0000ff;
}
/deep/.rowColor1 {
  color: #0000ff;
  th {
    color: #0000ff;
  }
  td {
    color: #0000ff;
  }
}
/deep/.rowColor2 {
  color: red;
  td {
    color: red;
  }
  th {
    color: red;
  }
}
</style>
