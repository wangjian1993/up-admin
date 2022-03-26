<!--
 * @Author: max
 * @Date: 2021-10-14 16:15:42
 * @LastEditTime: 2022-03-26 12:39:22
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/erp/EcnVariation/VariationInfo.vue
-->
<template>
  <div>
    <a-drawer :visible="visible" title="BOM信息" placement="right" @close="close" :get-container="false" :wrap-style="{ position: 'absolute' }"  width="100%" :footer="null" centered>
      <a-spin tip="loading..." :spinning="loading">
        <div>
          <a-descriptions :column="5" bordered size="small">
            <a-descriptions-item label="工厂名称">
              {{ info.PLANT_NAME }}
            </a-descriptions-item>
            <a-descriptions-item label="变更原因">
              {{ info.DESCRIPTION_1 }}
            </a-descriptions-item>
            <a-descriptions-item label="主办人">
              {{ info.EMPLOYEE_NAME_T }}
            </a-descriptions-item>
            <a-descriptions-item label="单据类型">
              {{ info.DOC_NAME }}
            </a-descriptions-item>
            <a-descriptions-item label="变更原因说明">
              {{ info.REASON_DESC }}
            </a-descriptions-item>
            <a-descriptions-item label="专案负责人">
              {{ info.EMPLOYEE_NAME }}
            </a-descriptions-item>
            <a-descriptions-item label=" 单号">
              {{ info.DOC_NO }}
            </a-descriptions-item>
            <a-descriptions-item label=" 变更范围">
              {{ info.CONTENT }}
            </a-descriptions-item>
            <a-descriptions-item label="变更部门">
              {{ info.ADMIN_UNIT_NAME_T }}
            </a-descriptions-item>
            <a-descriptions-item label="单据日期">
              {{ splitData(info.DOC_DATE) }}
            </a-descriptions-item>
            <a-descriptions-item label="紧急等级">
              {{ info.DESCRIPTION_2 }}
            </a-descriptions-item>
            <a-descriptions-item label="审核吗">
              {{ splitData(info.ApproveStatus) }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
        <div>
          <a-card title="BOM变更" class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
            <a-table
              :columns="columns"
              :data-source="list"
              :size="size"
              :scroll="{ y: 300, x: 1500 }"
              :pagination="pagination"
              :customRow="handleClickRow"
              @change="handleTableChange"
              :rowKey="(list) => list.BOM_D_ID"
              bordered
              :rowClassName="
                (record, index) => {
                  return index === selectIndex ? 'active' : '';
                }
              "
              :components="components"
            >
              <template slot="index" slot-scope="text, record, index">
                <div>
                  <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
                </div>
              </template>
              <template slot="CHANGE_TYPE" slot-scope="text">
                <span>{{ variationType(text) }}</span>
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
          <a-card title="BOM变更明细" class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
            <a-table :columns="columns1" :data-source="detailData" :loading="dateilLoading" :size="size" :scroll="{ y: 300, x: 1500 }" :pagination="pagination2" @change="handleTableChange2" :rowKey="(list) => list.BOM_D_ID" bordered :components="components1">
              <template slot="index" slot-scope="text, record, index">
                <div>
                  <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
                </div>
              </template>
              <template slot="CHANGE_TYPE" slot-scope="text">
                <span>{{ variationType(text) }}</span>
              </template>
              <template slot="ITEM_TYPE" slot-scope="text">
                <span>{{ feedSystem(text) }}</span>
              </template>
              <template slot="EFFECTIVE_DATE" slot-scope="text">
                <span>{{ splitData(text) }}</span>
              </template>
              <template slot="EXPIRY_DATE" slot-scope="text">
                <span>{{ splitData(text) }}</span>
              </template>
              <template slot="EXPRITY_DATE" slot-scope="text">
                <span>{{ splitData(text) }}</span>
              </template>
            </a-table>
          </a-card>
        </div>
      </a-spin>
    </a-drawer>
  </div>
</template>

<script>
const columns = [
  {
    title: "变更序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 80,
  },
  {
    title: "变更类型",
    dataIndex: "CHANGE_TYPE",
    scopedSlots: { customRender: "CHANGE_TYPE" },
    align: "center",
    width: 80,
  },
  {
    title: "主件品号",
    dataIndex: "ITEM_CODE",
    scopedSlots: { customRender: "ITEM_CODE" },
    align: "left",
    width: 150,
  },
  {
    title: "品名",
    dataIndex: "ITEM_NAME",
    scopedSlots: { customRender: "ITEM_NAME" },
    align: "left",
    width: 150,
  },
  {
    title: "规格",
    dataIndex: "ITEM_SPECIFICATION",
    scopedSlots: { customRender: "ITEM_SPECIFICATION" },
    align: "left",
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
    title: "工厂",
    dataIndex: "PLANT_NAME_P",
    scopedSlots: { customRender: "PLANT_NAME_P" },
    align: "center",
    width: 50,
  },
  {
    title: "原引用工厂",
    dataIndex: "PLANT_NAME_O",
    scopedSlots: { customRender: "PLANT_NAME_O" },
    align: "center",
    width: 80,
  },
  {
    title: "引用工厂",
    dataIndex: "PLANT_NAME_R",
    scopedSlots: { customRender: "PLANT_NAME_R" },
    align: "center",
    width: 80,
  },
  {
    title: "原版次",
    dataIndex: "ORIGINAL_VERSION_TIMES",
    scopedSlots: { customRender: "ORIGINAL_VERSION_TIMES" },
    align: "center",
    width: 60,
  },
  {
    title: "版次",
    dataIndex: "VERSION_TIMES",
    scopedSlots: { customRender: "VERSION_TIMES" },
    align: "center",
    width: 60,
  },
  {
    title: "原标准批量",
    dataIndex: "ORIGINAL_STANDARD_BATCH_QTY",
    scopedSlots: { customRender: "ORIGINAL_STANDARD_BATCH_QTY" },
    align: "center",
    width: 80,
  },
  {
    title: "标准批量",
    dataIndex: "STANDARD_BATCH_QTY",
    scopedSlots: { customRender: "STANDARD_BATCH_QTY" },
    align: "center",
    width: 80,
  },
  {
    title: "原产品良率",
    dataIndex: "ORIGINAL_YIELD_RATE",
    scopedSlots: { customRender: "ORIGINAL_YIELD_RATE" },
    align: "center",
    width: 80,
  },
  {
    title: "原备注",
    dataIndex: "ORIGINAL_REMARK",
    scopedSlots: { customRender: "ORIGINAL_REMARK" },
    align: "center",
    width: 70,
  },
  {
    title: "备注",
    dataIndex: "REMARK",
    scopedSlots: { customRender: "REMARK" },
    align: "center",
    width: 50,
  },
  {
    title: "变更原因",
    dataIndex: "DESCRIPTION",
    scopedSlots: { customRender: "DESCRIPTION" },
    align: "center",
    width: 150,
  },
];
const columns1 = [
  {
    title: "变更序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 80,
  },
  {
    title: "单据类型",
    dataIndex: "CHANGE_TYPE",
    scopedSlots: { customRender: "CHANGE_TYPE" },
    align: "center",
    width: 80,
  },
  {
    title: "类别",
    dataIndex: "ITEM_CATEGORY",
    scopedSlots: { customRender: "ITEM_CATEGORY" },
    align: "center",
    width: 80,
  },
  {
    title: "BOM序号",
    dataIndex: "SequenceNumber",
    scopedSlots: { customRender: "SequenceNumber" },
    align: "center",
    width: 80,
  },
  {
    title: "元件品号",
    dataIndex: "ITEM_CODE",
    scopedSlots: { customRender: "ITEM_CODE" },
    align: "center",
    width: 150,
  },
  {
    title: "元件型号",
    dataIndex: "ITEM_NAME",
    scopedSlots: { customRender: "ITEM_NAME" },
    align: "center",
    width: 150,
  },
  {
    title: "元件规格",
    dataIndex: "ITEM_SPECIFICATION",
    scopedSlots: { customRender: "ITEM_SPECIFICATION" },
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
    width: 80,
  },
  {
    title: "插件位置",
    dataIndex: "HANDLE",
    scopedSlots: { customRender: "HANDLE" },
    align: "center",
    width: 80,
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
    title: "取替代方式",
    dataIndex: "ALTERNATIVE_REPLACE",
    scopedSlots: { customRender: "ALTERNATIVE_REPLACE" },
    align: "center",
    width: 100,
  },
  {
    title: "超领率",
    dataIndex: "ISSUE_OVERRUN_RATE",
    scopedSlots: { customRender: "ISSUE_OVERRUN_RATE" },
    align: "center",
    width: 80,
  },
  {
    title: "缺领率",
    dataIndex: "ISSUE_SHORTAGE_RATE",
    scopedSlots: { customRender: "ISSUE_SHORTAGE_RATE" },
    align: "center",
    width: 80,
  },
  {
    title: "投料间距",
    dataIndex: "ISSUE_MATERIAL_PERIOD",
    scopedSlots: { customRender: "ISSUE_MATERIAL_PERIOD" },
    align: "center",
    width: 70,
  },
  {
    title: "供料方式",
    dataIndex: "ITEM_TYPE",
    scopedSlots: { customRender: "ITEM_TYPE" },
    align: "center",
    width: 50,
  },
  {
    title: "变更原因",
    dataIndex: "REASON",
    scopedSlots: { customRender: "REASON" },
    align: "center",
    width: 50,
  },
  {
    title: "生效日期",
    dataIndex: "EFFECTIVE_DATE",
    scopedSlots: { customRender: "EFFECTIVE_DATE" },
    align: "center",
    width: 50,
  },
  {
    title: "失效日期",
    dataIndex: "EXPIRY_DATE",
    scopedSlots: { customRender: "EXPIRY_DATE" },
    align: "center",
    width: 50,
  },
];
import { getERPReportAction } from "@/services/erp.js";
import { splitData } from "@/utils/util.js";
import { feedSystem, modelType, stateType, variationType } from "@/utils/BomParmas.js";
import { resizeableTitle } from "@/utils/resizeableTitle.js";
export default {
  props: ["info"],
  data() {
    this.components = {
      header: {
        cell: (h, props, children) => resizeableTitle(h, props, children, this.columns),
      },
    };
    this.components1 = {
      header: {
        cell: (h, props, children) => resizeableTitle(h, props, children, this.columns1),
      },
    };
    return {
      size: "small",
      columns,
      columns1,
      visible: true,
      list: [],
      detailData: [],
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
      pagination2: {
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
      dateil: [],
      dateilLoading: false,
      selectIndex: -1,
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
    variationType,
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
        ecnchangeorder: this.info.DOC_NO,
      };
      getERPReportAction(parmas, "getbomchangeinfo").then((res) => {
        if (res.data.success) {
          this.list = res.data.data.list;
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination = pagination;
          this.dateil = this.list[0];
          this.getDateil();
          this.loading = false;
          this.isSearch = false;
        } else {
          this.loading = false;
        }
      });
    },
    getDateil() {
      this.dateilLoading = true;
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        ecnid: this.dateil.ECN_ID,
        ecndid: this.dateil.ECN_D_ID,
      };
      getERPReportAction(parmas, "getbomchangedetailinfo").then((res) => {
        if (res.data.success) {
          this.detailData = res.data.data.list;
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination2 = pagination;
        }
        this.dateilLoading = false;
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
    handleTableChange2(pagination) {
      this.pagination2.current = pagination.current;
      this.pagination2.pageSize = pagination.pageSize;
      this.getDateil();
    },
    handleClickRow(record, index) {
      return {
        style: {
          // 行背景色
          cursor: "pointer",
        },
        on: {
          click: () => {
            // this.isModelInfo = true;
            // this.modelData = record;
            this.selectIndex = index;
            this.dateil = record;
            this.getDateil();
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
/deep/.ant-modal {
  height: 100%;
}
/deep/.active {
  background: rgb(24, 151, 20);
}
/deep/.ant-table {
  font-size: 10px;
}
/deep/.ant-table-row-cell-break-word {
  white-space: nowrap;
  overflow: hidden;
}
</style>
