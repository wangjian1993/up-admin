<!--
 * @Author: max
 * @Date: 2021-10-14 16:15:42
 * @LastEditTime: 2021-10-16 18:06:47
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/erp/components/ErpDosage.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="BOM信息" @cancel="close" width="90%" :footer="null" centered>
      <a-spin tip="loading..." :spinning="loading">
        <div>
          <a-descriptions :column="5" bordered size="small">
            <a-descriptions-item label="主件品号">
              {{ info.ITEM_CODE }}
            </a-descriptions-item>
            <a-descriptions-item label="快捷码">
              {{ info.SHORTCUT }}
            </a-descriptions-item>
            <a-descriptions-item label="品号类型">
              {{ modelType(info.ITEM_PROPERTY) }}
            </a-descriptions-item>
            <a-descriptions-item label="版次">
              {{ info.VERSION_TIMES }}
            </a-descriptions-item>
            <a-descriptions-item label="单位">
              {{ info.UNIT_NAME }}
            </a-descriptions-item>
            <a-descriptions-item label="产品型号" :span="2">
              {{ info.ITEM_NAME }}
            </a-descriptions-item>
            <a-descriptions-item label=" 备注">
              {{ info.REMARK }}
            </a-descriptions-item>
            <a-descriptions-item label=" 工厂">
              {{ info.PLANT_NAME_P }}
            </a-descriptions-item>
            <a-descriptions-item label="引用工厂">
              {{ info.PLANT_CODE_R }}
            </a-descriptions-item>
            <a-descriptions-item label=" 图号">
              {{ info.DRAWING_NO }}
            </a-descriptions-item>
            <a-descriptions-item label=" 标准批量">
              {{ info.STANDARD_BATCH_QTY }}
            </a-descriptions-item>
            <a-descriptions-item label=" 创建日期:">
              {{ splitData(info.CreateDate) }}
            </a-descriptions-item>
            <a-descriptions-item label=" 生效状态">
              {{ stateType(info.ApproveStatus) }}
            </a-descriptions-item>
            <a-descriptions-item label=" 最后修改日期">
              {{ splitData(info.LastModifiedDate) }}
            </a-descriptions-item>
            <a-descriptions-item label=" 规格" :span="5">
              {{ info.ITEM_SPECIFICATION }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
        <div>
          <a-card title="BOM用量信息" class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
            <a-table :columns="columns" :data-source="list" :size="size" :scroll="{ y: 500, x: 2700 }" :pagination="pagination" :customRow="handleClickRow" @change="handleTableChange" :rowKey="(list) => list.BOM_D_ID" bordered>
              <template slot="index" slot-scope="text, record, index">
                <div>
                  <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
                </div>
              </template>
              <template slot="action" slot-scope="text, record">
                <div>
                  <a style="margin-right: 8px" @click="detail(record)">
                    <a-icon type="profile" />
                    查看
                  </a>
                </div>
              </template>
              <template slot="ITEM_PROPERTY" slot-scope="text">
                <span>{{ modelType(text) }}</span>
              </template>
              <template slot="ITEM_TYPE" slot-scope="text">
                <span>{{ feedSystem(text) }}</span>
              </template>
              <template slot="APPROVEDATE_ECN" slot-scope="text">
                <span>{{ splitData(text) }}</span>
              </template>
              <template slot="ApproveDate" slot-scope="text">
                <span>{{ splitData(text) }}</span>
              </template>
              <template slot="EXPRITY_DATE" slot-scope="text">
                <span>{{ splitData(text) }}</span>
              </template>
            </a-table>
          </a-card>
        </div>
      </a-spin>
    </a-modal>
    <model-info v-if="isModelInfo" :modelData="modelData" @closeModal="closeModal"></model-info>
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
    title: "主件品号",
    dataIndex: "ITEM_CODE",
    scopedSlots: { customRender: "ITEM_CODE" },
    align: "center",
    width: 250,
  },
  {
    title: "快捷码",
    dataIndex: "SHORTCUT",
    scopedSlots: { customRender: "SHORTCUT" },
    align: "center",
    width: 150,
  },
  {
    title: "产品型号",
    dataIndex: "ITEM_NAME",
    scopedSlots: { customRender: "ITEM_NAME" },
    align: "center",
    width: 250,
    ellipsis: true,
  },
  {
    title: "规格",
    dataIndex: "ITEM_SPECIFICATION",
    scopedSlots: { customRender: "ITEM_SPECIFICATION" },
    align: "center",
    width: 300,
    ellipsis: true,
  },
  {
    title: "组成用量",
    dataIndex: "QTY_PER",
    scopedSlots: { customRender: "QTY_PER" },
    align: "center",
    width: 80,
  },
  {
    title: "插件位置",
    dataIndex: "COMPONENT_LOCATION",
    scopedSlots: { customRender: "COMPONENT_LOCATION" },
    align: "center",
    width: 80,
  },
  {
    title: "图号",
    dataIndex: "DRAWING_NO",
    scopedSlots: { customRender: "DRAWING_NO" },
    align: "center",
    width: 200,
  },
  {
    title: "单位",
    dataIndex: "UNIT_NAME",
    scopedSlots: { customRender: "UNIT_NAME" },
    align: "center",
    width: 50,
  },
  {
    title: "品号类型",
    dataIndex: "ITEM_PROPERTY",
    scopedSlots: { customRender: "ITEM_PROPERTY" },
    align: "center",
    width: 80,
  },
  {
    title: "供料方式",
    dataIndex: "ITEM_TYPE",
    scopedSlots: { customRender: "ITEM_TYPE" },
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
    title: "ECN变更状态",
    dataIndex: "ECNSTATUS",
    scopedSlots: { customRender: "ECNSTATUS" },
    align: "center",
    width: 110,
  },
  {
    title: "ECN变更日期",
    dataIndex: "APPROVEDATE_ECN",
    scopedSlots: { customRender: "APPROVEDATE_ECN" },
    align: "center",
    width: 110,
  },
  {
    title: "固定损耗量",
    dataIndex: "FIXED_LOSS_RATE",
    scopedSlots: { customRender: "FIXED_LOSS_RATE" },
    align: "center",
    width: 100,
  },
  {
    title: "变动损耗",
    dataIndex: "DYNAMIC_LOSS_RATE",
    scopedSlots: { customRender: "DYNAMIC_LOSS_RATE" },
    align: "center",
    width: 80,
  },
  {
    title: "超领率",
    dataIndex: "ISSUE_OVERRUN_RATE",
    scopedSlots: { customRender: "ISSUE_OVERRUN_RATE" },
    align: "center",
    width: 60,
  },
  {
    title: "缺领率",
    dataIndex: "ISSUE_SHORTAGE_RATE",
    scopedSlots: { customRender: "ISSUE_SHORTAGE_RATE" },
    align: "center",
    width: 60,
  },
  {
    title: "默认仓库",
    dataIndex: "WAREHOUSE_CODE",
    scopedSlots: { customRender: "WAREHOUSE_CODE" },
    align: "center",
    width: 80,
  },
  {
    title: "仓库名称",
    dataIndex: "WAREHOUSE_NAME",
    scopedSlots: { customRender: "WAREHOUSE_NAME" },
    align: "center",
    width: 120,
  },
  {
    title: "仓库库存",
    dataIndex: "INVENTORY_QTY",
    scopedSlots: { customRender: "INVENTORY_QTY" },
    align: "center",
    width: 80,
  },
  {
    title: "生效日期",
    dataIndex: "ApproveDate",
    scopedSlots: { customRender: "ApproveDate" },
    align: "center",
    width: 120,
  },
  {
    title: "失效时间",
    dataIndex: "EXPRITY_DATE",
    scopedSlots: { customRender: "EXPRITY_DATE" },
    align: "center",
    width: 120,
  },
  {
    title: "备注",
    dataIndex: "REMARK",
    scopedSlots: { customRender: "REMARK" },
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
    fixed: "right",
    width: 100,
  },
];
import { getERPReportAction } from "@/services/erp.js";
import { splitData } from "@/utils/util.js";
import { feedSystem, modelType,stateType} from "@/utils/BomParmas.js";
import ModelInfo from "./ModelInfo.vue";
export default {
  components: { ModelInfo },
  props: ["info"],
  data() {
    return {
      size: "small",
      columns,
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
      ConfigList: [],
      loading: false,
      treeData: [],
      isModelInfo: false,
      modelData: [],
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
      this.loading = true;
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        bomid: this.info.BOM_ID,
      };
      getERPReportAction(parmas, "getbomusinginfo").then((res) => {
        if (res.data.success) {
          this.list = res.data.data.list;
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination = pagination;
          this.loading = false;
          this.isSearch = false;
        } else {
          this.loading = false;
        }
      });
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
/deep/div {
  -moz-user-select: none; /*火狐*/
  -webkit-user-select: none; /*webkit浏览器*/
  -ms-user-select: none; /*IE10*/
  -khtml-user-select: none; /*早期浏览器*/
  user-select: none;
}
/deep/.ant-modal{
    height:100%;
}
</style>
