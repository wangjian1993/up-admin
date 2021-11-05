<!--
 * @Author: max
 * @Date: 2021-11-04 14:55:52
 * @LastEditTime: 2021-11-04 15:06:22
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/erp/BomInventory/Dosage.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="存量余额明细信息" @cancel="close" width="70%" :footer="null" centered>
      <a-spin tip="loading..." :spinning="loading">
        <div>
          <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
            <a-table :columns="columns" :data-source="list" :size="size" :scroll="{ y: 500}" :pagination="false" :customRow="handleClickRow" @change="handleTableChange" :rowKey="(list) => list.ITEM_WAREHOUSE_BIN_ID" bordered :rowClassName="rowClassName">
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
              <template slot="APPROVEDATE_ECN" slot-scope="text" v-if="text == '1900-01-01T00:00:00'">
                <span>{{ splitData(text) }}</span>
              </template>
              <template slot="EFFECTIVE_DATE" slot-scope="text">
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
    title: "库位编号",
    dataIndex: "BIN_CODE",
    scopedSlots: { customRender: "BIN_CODE" },
    align: "center",
    width: 100,
  },
  {
    title: "库位名称",
    dataIndex: "BIN_NAME",
    scopedSlots: { customRender: "BIN_NAME" },
    align: "center",
    width: 100,
  },
  {
    title: "库存数量",
    dataIndex: "INVENTORY_QTY",
    scopedSlots: { customRender: "INVENTORY_QTY" },
    align: "center",
    width: 100,
    ellipsis: true,
  },
  {
    title: "批号",
    dataIndex: "LOT_CODE",
    scopedSlots: { customRender: "LOT_CODE" },
    align: "center",
    width: 100,
    ellipsis: true,
  },
  {
    title: "最后入库日",
    dataIndex: "LAST_RECEIPT_DATE",
    scopedSlots: { customRender: "LAST_RECEIPT_DATE" },
    align: "center",
    width: 100,
    customRender: (text) => {
        return splitData(text);
    }
  },
  {
    title: "最后出库日",
    dataIndex: "LAST_ISSUE_DATE",
    scopedSlots: { customRender: "LAST_ISSUE_DATE" },
    align: "center",
    width: 100,
    customRender: (text) => {
        return splitData(text);
    }
  },
  {
    title: "审核码",
    dataIndex: "ApproveStatus",
    scopedSlots: { customRender: "ApproveStatus" },
    align: "center",
    width: 50,
  },
  {
    title: "批号有效截止日期",
    dataIndex: "INEFFECTIVE_DATE",
    scopedSlots: { customRender: "INEFFECTIVE_DATE" },
    align: "center",
    width: 80,
  },
];
import { getERPReportAction } from "@/services/erp.js";
import { splitData } from "@/utils/util.js";
import { feedSystem, modelType, stateType } from "@/utils/BomParmas.js";
export default {
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
      this.loading = true;
      let parmas = {
        warehouseid: this.info.WAREHOUSE_ID,
        itemid: this.info.ITEM_ID,
      };
      getERPReportAction(parmas, "getstockrestinfo").then((res) => {
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
    },
    rowClassName(record) {
      return record.ApproveStatus == "V" ? "color2" : record.ApproveStatus == "N" ? "color1" : "";
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
