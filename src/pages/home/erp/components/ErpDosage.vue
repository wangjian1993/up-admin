<!--
 * @Author: max
 * @Date: 2021-10-14 16:15:42
 * @LastEditTime: 2023-05-29 17:35:43
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/erp/components/ErpDosage.vue
-->
<template>
  <div>
    <a-drawer :visible="visible" title="BOM信息" placement="right" @close="close" :get-container="false"  width="100%" :footer="null" :wrap-style="{ position: 'absolute',height:'100%' }" centered :headerStyle="{ padding: '5px 20px' }" :bodyStyle="{ padding: '5px 10px' }">
      <a-spin tip="loading..." :spinning="loading">
        <div class="clone-btn" v-if="isCloneBtn" @click="close">
          <img src="@/assets/img/guanbi.png" alt="" />
        </div>
        <div ref="backTop">
          <a-descriptions :column="5" bordered size="small" :class="antDescriptionsRow">
            <a-descriptions-item label="主件品号">
              {{ info.ITEM_CODE }}
              <a @click="unfold" style="margin-left: 8px">展开</a>
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
            <a-descriptions-item label="品名" :span="2">
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
          <a-card title="BOM用量信息" class="card" :bordered="false" :headerStyle="{ padding: '5px 20px' }" :bodyStyle="{ padding: '5px' }">
            <a-table :columns="columns" :data-source="list" :size="size" :scroll="{ y: scrollY, x: 2500 }" :pagination="false" :customRow="handleClickRow" :rowKey="(list) => list.BOM_D_ID" bordered :rowClassName="rowClassName" :components="components">
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
              <template slot="APPROVEDATE_ECN" slot-scope="text" v-if="text !== '1900-01-01T00:00:00'">
                <span>{{ splitData(text) }}</span>
              </template>
              <template slot="EFFECTIVE_DATE" slot-scope="text">
                <span>{{ splitData(text) }}</span>
              </template>
              <template slot="EXPRITY_DATE" slot-scope="text">
                <span>{{ splitData(text) }}</span>
              </template>
              <template slot="ITEM_NAME" slot-scope="text">
                <a-tooltip placement="topLeft" :overlayStyle="{ fontSize: '10px' }">
                  <template slot="title">
                    {{ text }}
                  </template>
                  {{ text }}
                </a-tooltip>
              </template>
              <template slot="ITEM_SPECIFICATION" slot-scope="text">
                <a-tooltip placement="topLeft" :overlayStyle="{ fontSize: '10px' }">
                  <template slot="title">
                    {{ text }}
                  </template>
                  {{ text }}
                </a-tooltip>
              </template>
            </a-table>
          </a-card>
        </div>
      </a-spin>
    </a-drawer>
    <model-info v-if="isModelInfo" :modelData="modelData" @closeModal="closeModal"></model-info>
    <BomUnfold v-if="isUnfold" :ModelInfo="info" @closeModal="closeModal" />
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
    title: "元件品号",
    dataIndex: "ITEM_CODE",
    scopedSlots: { customRender: "ITEM_CODE" },
    align: "left",
    width: 110,
  },
  {
    title: "品名",
    dataIndex: "ITEM_NAME",
    scopedSlots: { customRender: "ITEM_NAME" },
    align: "left",
    width: 100,
  },
  {
    title: "规格",
    dataIndex: "ITEM_SPECIFICATION",
    scopedSlots: { customRender: "ITEM_SPECIFICATION" },
    align: "left",
    width: 200,
  },
  {
    title: "组成用量",
    dataIndex: "QTY_PER",
    scopedSlots: { customRender: "QTY_PER" },
    align: "center",
    width: 75,
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
    width: 75,
  },
  {
    title: "单位",
    dataIndex: "UNIT_NAME",
    scopedSlots: { customRender: "UNIT_NAME" },
    align: "center",
    width: 50,
  },
  {
    title: "图号",
    dataIndex: "DRAWING_NO",
    scopedSlots: { customRender: "DRAWING_NO" },
    align: "center",
    width: 80,
  },
  {
    title: "备注",
    dataIndex: "REMARK",
    scopedSlots: { customRender: "REMARK" },
    align: "center",
    width: 80,
  },
 
  {
    title: "ECN变更",
    dataIndex: "ECNSTATUS",
    scopedSlots: { customRender: "ECNSTATUS" },
    align: "center",
    width: 80,
  },
  {
    title: "ECN变更日期",
    dataIndex: "APPROVEDATE_ECN",
    scopedSlots: { customRender: "APPROVEDATE_ECN" },
    align: "center",
    width: 105,
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
    title: "固定损耗量",
    dataIndex: "FIXED_LOSS_RATE",
    scopedSlots: { customRender: "FIXED_LOSS_RATE" },
    align: "center",
    width: 90,
  },
  {
    title: "变动损耗",
    dataIndex: "DYNAMIC_LOSS_RATE",
    scopedSlots: { customRender: "DYNAMIC_LOSS_RATE" },
    align: "center",
    width: 75,
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
    width: 80,
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
    dataIndex: "EFFECTIVE_DATE",
    scopedSlots: { customRender: "EFFECTIVE_DATE" },
    align: "center",
    width: 80,
  },
  {
    title: "失效时间",
    dataIndex: "EXPRITY_DATE",
    scopedSlots: { customRender: "EXPRITY_DATE" },
    align: "center",
    width: 80,
  },
  {
    title: "快捷码",
    dataIndex: "SHORTCUT",
    scopedSlots: { customRender: "SHORTCUT" },
    align: "left",
    width: 80,
  },
];
import { getERPReportAction } from "@/services/erp.js";
import { splitData } from "@/utils/util.js";
import { feedSystem, modelType, stateType } from "@/utils/BomParams.js";
import ModelInfo from "./ModelInfo.vue";
import BomUnfold from "./BomUnfold.vue";
import { resizeableTitle } from "@/utils/resizeableTitle.js";
export default {
  components: { ModelInfo, BomUnfold },
  props: ["info"],
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
      isUnfold: false,
      isCloneBtn: false,
      scrollY: "",
    };
  },
  created() {
    this.$nextTick(() => {
      console.log("啊哈哈哈哈====", document.getElementsByClassName("ant-table-thead"));
      let tHeader = document.getElementsByClassName("ant-table-thead")[2];
      console.log("啊哈哈哈哈====", tHeader.getBoundingClientRect());
      let tHeaderBottom = tHeader.getBoundingClientRect().bottom;
      console.log("tHeaderBottom---", tHeaderBottom);
      let height = `calc(100vh - 200px)`;
      this.scrollY = height;
    });
    this.getList();
    //设置详情字体颜色
    this.info.ApproveStatus == "N" ? (this.antDescriptionsRow = "rowColor1") : this.info.ApproveStatus == "V" ? (this.antDescriptionsRow = "rowColor2") : "";
  },
  methods: {
    splitData,
    modelType,
    feedSystem,
    stateType,
    handleScroll() {
      // 页面滑动的距离
      let scrollTop = this.$refs.backTop.getBoundingClientRect().top;
      // 当页面滑动的距离大于300px时元素显示，否则不显示
      if (scrollTop < 100) {
        this.isCloneBtn = true;
      } else {
        this.isCloneBtn = false;
      }
    },
    close() {
      this.$emit("closeModal");
    },
    closeModal() {
      this.isModelInfo = false;
      this.isUnfold = false;
    },
    //物料需求详情
    detail(item) {
      this.isModelInfo = true;
      this.modelData = item;
    },
    getList() {
      this.loading = true;
      let params = {
        bomid: this.info.BOM_ID || this.info.ITEM_BUSINESS_ID,
      };
      getERPReportAction(params, "getbomusinginfo").then((res) => {
        if (res.data.success) {
          this.list = res.data.data.list;
          const pagination = { ...this.pagination };
          pagination.total = this.list.length;
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
      this.isUnfold = false;
    },
    rowClassName(record) {
      return record.ApproveStatus == "V" ? "color2" : record.ApproveStatus == "N" ? "color1" : "";
    },
    unfold() {
      this.isUnfold = true;
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
/deep/.ant-table {
  font-size: 10px;
}
/deep/.ant-table-row-cell-break-word {
  white-space: nowrap;
  overflow: hidden;
}
/deep/.ant-descriptions-item-content {
  font-size: 10px;
}
/deep/.ant-descriptions-item-label {
  font-size: 10px;
}
/deep/.ant-drawer-close {
  width: 36px;
  height: 36px;
  line-height: 36px;
}
.clone-btn {
  position: fixed;
  top: 30%;
  right: 0px;
  background: #f2f2f2;
  width: 40px;
  height: 30px;
  border-radius: 10px 0px 0px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  cursor: pointer;
  img {
    width: 26px;
    height: 26px;
  }
}
/deep/.ant-table {
  min-height: 60vh;
}
</style>
