<!--
 * @Author: max
 * @Date: 2021-08-23 15:07:06
 * @LastEditTime: 2021-11-01 16:56:20
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/admin/log/trace.vue
-->
<template>
  <div>
    <a-modal :visible="visible" :width="1400" :footer="null" centered @cancel="handleCancel">
      <div class="trace-title">
        <p>API地址:{{ traceInfo.ApiUrl }}</p>
        <p>API执行耗时(毫秒):{{ traceInfo.ElapseTime }}</p>
        <p>API执行用户:{{ traceInfo.UserName }}</p>
      </div>
      <div>
        <a-table :columns="columns" :data-source="data" size="small" :loading="loading" :pagination="pagination" bordered @change="handleTableChange">
          <template slot="index" slot-scope="text, record, index">
            <div>
              <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
            </div>
          </template>
          <a slot="ReturnResult" slot-scope="text" @click="result(text)">查看结果</a>
          <template slot="action" slot-scope="text, record">
            <div>
              <a style="margin-right: 8px" @click="detail(record)" :disabled="!hasPerm('details')">
                <a-icon type="edit" />
                详情
              </a>
              <a style="margin-right: 8px" :disabled="!hasPerm('trace')" @click="trace(record)">
                <a-icon type="profile" />
                跟踪
              </a>
            </div>
          </template>
        </a-table>
      </div>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: "5%",
  },
  {
    title: "执行时间",
    dataIndex: "DateTimeCreated",
    scopedSlots: { customRender: "DateTimeCreated" },
    align: "center",
    width: "15%",
    ellipsis: true,
  },
  {
    title: "执行语句",
    dataIndex: "ExecuSqlString",
    scopedSlots: { customRender: "ExecuSqlString" },
    align: "center",
    width: "20%",
    ellipsis: true,
  },
  {
    title: "语句参数",
    dataIndex: "SqlParams",
    scopedSlots: { customRender: "SqlParams" },
    align: "center",
    width: "10%",
    ellipsis: true,
  },
  {
    title: "执行状态",
    dataIndex: "Type",
    scopedSlots: { customRender: "Type" },
    align: "center",
    width: "6%",
    ellipsis: true,
  },
  {
    title: "执行方法",
    dataIndex: "MethodName",
    scopedSlots: { customRender: "MethodName" },
    align: "center",
    width: "8%",
    ellipsis: true,
  },
  {
    title: "链接数据源",
    dataIndex: "DataSource",
    scopedSlots: { customRender: "DataSource" },
    align: "center",
    width: "10%",
    ellipsis: true,
  },
  {
    title: "执行耗时(秒)",
    dataIndex: "ExecuTimeSecond",
    scopedSlots: { customRender: "ExecuTimeSecond" },
    align: "center",
    width: "10%",
    ellipsis: true,
  },
];
import { getLogAction } from "@/services/admin.js";
export default {
  props: ["traceId"],
  data() {
    return {
      visible: true,
      data: [],
      traceInfo: [],
      pagination: {
        current: 1,
        total: 0,
        pageSize: 20, //每页中显示10条数据
        showSizeChanger: true,
        showLessItems: true,
        showQuickJumper: true,
        pageSizeOptions: ["10", "20", "50", "100"], //每页中显示的数据
        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
      }, //每页中显示10条数据},
      loading: true,
      columns,
    };
  },
  created() {
    console.log(this.traceId);
    this.getLoTraceList();
  },
  methods: {
    handleCancel() {
      this.$emit("close");
    },
    handleTableChange(pagination) {
       this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
    },
    getLoTraceList() {
      console.log("this.TraceId", this.traceId);
      let params = {
        traceid: this.traceId,
      };
      getLogAction(params, "gettrace").then((res) => {
        if (res.data.success) {
          this.data = res.data.data.SqlExecuLogs;
          this.traceInfo = res.data.data;
          this.loading = false;
          const pagination = { ...this.pagination };
          pagination.total =  this.data.length;
          this.pagination = pagination;
        }
      });
    },
  },
};
</script>
<style type="text/css" lang="less">
.trace-title {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}
/deep/ .ant-table {
  min-height: 0;
}
</style>
