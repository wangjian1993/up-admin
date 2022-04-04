<!--
 * @Author: max
 * @Date: 2022-04-04 13:38:31
 * @LastEditTime: 2022-04-04 13:56:09
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/esop/deviceBind/docsList.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="选择SOP文档" @cancel="close" @ok="handleOk" centered width="70%">
      <div>
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <a-table
            :columns="columns"
            :data-source="docsList"
            :size="size"
            :pagination="false"
            :rowKey="(docsList) => docsList.DocumentId"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
              type: 'radio',
            }"
            bordered
          >
            <template slot="index" slot-scope="text, record, index">
              <div>
                <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
              </div>
            </template>
            <template slot="FileSize" slot-scope="text">
              <p>{{ getFileSize(text) }}</p>
            </template>
            <template slot="action" slot-scope="text, record">
              <div>
                <a style="margin-right: 8px" @click="preview(record)">
                  <a-icon type="profile" />
                  预览
                </a>
              </div>
            </template>
          </a-table>
        </a-card>
      </div>
    </a-modal>
    <preview v-if="isPreview" :previewRecord="previewRecord" @close="closeModal" />
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
    title: "文档名称",
    dataIndex: "DocumentName",
    scopedSlots: { customRender: "DocumentName" },
    align: "center",
  },
  {
    title: "文档编号",
    dataIndex: "DocumentCode",
    scopedSlots: { customRender: "DocumentCode" },
    align: "center",
  },
  {
    title: "生产工厂",
    dataIndex: "PlantName",
    scopedSlots: { customRender: "PlantName" },
    align: "center",
  },
  {
    title: "产品大类",
    dataIndex: "ProType",
    scopedSlots: { customRender: "ProType" },
    align: "center",
  },
  {
    title: "产品系列",
    dataIndex: "ProTypeDetail",
    scopedSlots: { customRender: "ProTypeDetail" },
    align: "center",
  },
];
import { getSopDocument } from "@/services/esop.js";
import preview from "../components/preview.vue";
export default {
  props: ["documentItem", "deviceItem", "plantId"],
  components: { preview },
  data() {
    return {
      data: [],
      columns,
      size: "small",
      visible: true,
      selectedRowKeys: [],
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
      docsList: [],
      isPreview: false,
      previewRecord: [],
    };
  },
  created() {
    this.getDocsList();
  },
  methods: {
    closeModal() {
      this.isPreview = false;
    },
    getDocsList() {
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
      };
      getSopDocument(parmas, "get").then((res) => {
        if (res.data.success) {
          this.docsList = res.data.data.list;
        }
      });
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    close() {
      this.$emit("closeModal");
    },
    handleOk() {
      let record = this.docsList.find((item) => item.DocumentId == this.selectedRowKeys[0]);
      this.$emit("success", record);
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
/deep/.ant-form-item {
  margin-bottom: 5px;
}
/deep/.ant-table {
  min-height: 0vh;
}
</style>
