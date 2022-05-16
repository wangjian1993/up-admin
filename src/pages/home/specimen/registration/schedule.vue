<template>
  <div>
    <a-modal v-model="visible" title="查看进度" @cancel="close" :footer="null" centered width="70%">
      <div>
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <a-descriptions size="small">
            <a-descriptions-item label="公司名称">
              {{dataSource.EnterpriseName}}
            </a-descriptions-item>
            <a-descriptions-item label="发起部门">
              {{dataSource.DepartmentName}}
            </a-descriptions-item>
            <a-descriptions-item label="条件">
             {{dataSource.Condition}}
            </a-descriptions-item>
          </a-descriptions>
          <a-table :columns="columns" :data-source="dataSource.TablePointList" :size="size" :pagination="false" :rowKey="(dataSource) => dataSource.EquimentId" bordered>
            <template slot="index" slot-scope="text, record, index">
              <div>
                <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
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
    title: "顺序",
    dataIndex: "SortNumber",
    scopedSlots: { customRender: "SortNumber" },
    align: "center",
  },
  {
    title: "接收部门",
    dataIndex: "DepartmentName",
    scopedSlots: { customRender: "DepartmentName" },
    align: "center",
  },
  {
    title: "接收人",
    dataIndex: "Receiver",
    scopedSlots: { customRender: "Receiver" },
    align: "center",
  },
  {
    title: "接收时间",
    dataIndex: "DatetimeReceive",
    scopedSlots: { customRender: "DatetimeReceive" },
    align: "center",
  },
  {
    title: "实际处理人",
    dataIndex: "BrandName",
    scopedSlots: { customRender: "BrandName" },
    align: "center",
  },
  {
    title: "实际处理时间",
    dataIndex: "DatetimeHandlerActual",
    scopedSlots: { customRender: "DatetimeHandlerActual" },
    align: "center",
  },
  {
    title: "处理耗时",
    dataIndex: "DatetimeHandlerSpend",
    scopedSlots: { customRender: "DatetimeHandlerSpend" },
    align: "center",
  },
  {
    title: "处理状态",
    dataIndex: "PointStatus",
    scopedSlots: { customRender: "PointStatus" },
    align: "center",
  },
  {
    title: "备注",
    dataIndex: "Remark",
    scopedSlots: { customRender: "Remark" },
    align: "center",
  },
  {
    title: "最后操作人",
    dataIndex: "LastUserModified",
    scopedSlots: { customRender: "LastUserModified" },
    align: "center",
  },
  {
    title: "最后操作时间",
    dataIndex: "LastDatetimeModified",
    scopedSlots: { customRender: "LastDatetimeModified" },
    align: "center",
  },
];
import { getMaterialSampleApi } from "@/services/web.js";
export default {
  props: ["registerid"],
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
    };
  },
  created() {
    this.getListAll();
    console.log("111");
  },
  methods: {
    closeModal() {
      this.isPreview = false;
    },
    getListAll() {
      this.loading = true;
      let params = {
        registerid: this.registerid,
      };
      getMaterialSampleApi(params, "getregisterflowsingle").then((res) => {
        if (res.data.success) {
          this.dataSource = res.data.data;
        }
      });
    },
    close() {
      this.$emit("closeModal");
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
