<!--
 * @Author: max
 * @Date: 2021-12-02 17:34:40
 * @LastEditTime: 2021-12-02 17:55:26
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/erp/components/BomUnfold.vue
-->
<!--
 * @Author: max
 * @Date: 2021-10-14 16:15:42
 * @LastEditTime: 2021-12-02 17:32:53
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/erp/components/ErpDosage.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="BOM展开" @cancel="close" width="100%" :footer="null" centered>
      <a-spin tip="loading..." :spinning="loading">
        <div>
          <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
            <a-table :columns="columns" :data-source="list" :size="size" :scroll="{ y: 500, x: true }" :pagination="false" :customRow="handleClickRow" @change="handleTableChange" :rowKey="(list) => list.BOM_D_ID" bordered :rowClassName="rowClassName">
              <template slot="index" slot-scope="text, record, index">
                <div>
                  <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
                </div>
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
    title: "品号",
    dataIndex: "ITEM_CODE",
    scopedSlots: { customRender: "ITEM_CODE" },
    align: "center",
    width: 110,
  },
  {
    title: "品名",
    dataIndex: "SHORTCUT",
    scopedSlots: { customRender: "SHORTCUT" },
    align: "center",
    width: 80,
  },
];
import { getERPReportAction } from "@/services/erp.js";
import { splitData } from "@/utils/util.js";
import { feedSystem, modelType, stateType } from "@/utils/BomParmas.js";
import ModelInfo from "./ModelInfo.vue";
export default {
  components: { ModelInfo },
  props: ["ModelInfo"],
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
      console.log(this.ModelInfo);
      this.loading = true;
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        plantid: this.ModelInfo.plantId,
        itemcode: this.ModelInfo.ITEM_CODE,
        itemname:"",
        itemspecification:""
      };
      getERPReportAction(parmas, "getbomlist").then((res) => {
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
    unfold() {},
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
