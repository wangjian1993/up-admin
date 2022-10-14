<!--
 * @Author: max
 * @Date: 2022-03-31 09:19:37
 * @LastEditTime: 2022-10-12 17:36:39
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/admin/task/result.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="运行结果" :footer="null" @cancel="close" centered width="60%">
      <div>
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <a-table
            :columns="columns"
            :data-source="dataSource"
            :size="size"
            :pagination="pagination"
            :scroll="{ y: 400 }"
            :rowKey="(docsFile) => docsFile.Id"
            @change="handleTableChange"
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
                <a style="margin-right: 8px" v-if="record.FileType == 'xlsx' || record.FileType == 'word'" @click="download(record)">
                  <a-icon type="download" />
                  下载
                </a>
              </div>
            </template>
          </a-table>
        </a-card>
      </div>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  {
    title: "序号",
    dataIndex: "index",
    scopedSlots: { customRender: "index" },
    align: "center",
    width:50
  },
   {
    title: "启动时间",
    dataIndex: "StartTime",
    scopedSlots: { customRender: "StartTime" },
    align: "center",
  },
  {
    title: "结束时间",
    dataIndex: "EndTime",
    scopedSlots: { customRender: "EndTime" },
    align: "center",
  },
  {
    title: "运行结果",
    dataIndex: "Result",
    scopedSlots: { customRender: "Result" },
    align: "center",
  },
  {
    title: "执行人",
    dataIndex: "RunUser",
    scopedSlots: { customRender: "RunUser" },
    align: "center",
  },
  {
    title: "运行耗时",
    dataIndex: "RunTime",
    scopedSlots: { customRender: "RunTime" },
    align: "center",
    width:100
  }
];
import { getJob } from "@/services/admin.js";
export default {
  props: ["resultId"],
  data() {
    return {
      dataSource: [],
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
      docsFile: [],
      isPreview: false,
      previewRecord: [],
    };
  },
  created() {
    console.log(this.documentItem);
    this.getResult();
  },
  methods: {
    closeModal() {
      this.isPreview = false;
    },
    close() {
      this.$emit("closeModal");
    },
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.getResult();
    },
    getResult() {
      let params = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        id: this.resultId,
      };
      getJob(params, "getresult").then((res) => {
        if (res.data.success) {
          this.dataSource = res.data.data.list;
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.totalCount;
          this.pagination = pagination;
          this.isSearch = 2;
        }
        this.loading = false;
      });
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
