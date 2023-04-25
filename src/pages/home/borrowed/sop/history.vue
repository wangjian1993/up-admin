<!--
 * @Author: max
 * @Date: 2021-09-08 09:21:40
 * @LastEditTime: 2023-04-25 15:24:58
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/borrowed/sop/history.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="历史记录" @cancel="close" width="60%" :footer="null" centered>
      <a-spin tip="loading..." :spinning="loading">
        <div>
          <a-descriptions :column="3">
            <a-descriptions-item label="文件夹编号">
              {{ editData.FolderNo }}
            </a-descriptions-item>
            <a-descriptions-item label="文件名称">
              {{ editData.FileName }}
            </a-descriptions-item>
            <a-descriptions-item label="编号">
              {{ editData.No }}
            </a-descriptions-item>
            <a-descriptions-item label="版本">
              {{ editData.Version }}
            </a-descriptions-item>
            <a-descriptions-item label="文件编号">
              {{ editData.FileNo }}
            </a-descriptions-item>
            <a-descriptions-item label="页数">
              {{ editData.PageCount }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
        <div>
          <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
            <a-table :columns="columns" :data-source="dataSource" :size="size" :scroll="{ y: 600 }" :pagination="pagination" :rowKey="(dataSource) => dataSource.Id" bordered>
              <template slot="index" slot-scope="text, record, index">
                <div>
                  <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
                </div>
              </template>
              <template slot="Status" slot-scope="record">
                <div>
                  <a-tag color="orange" v-if="record === '已借出'">{{ record }}</a-tag>
                  <a-tag color="green" v-if="record === '已归还'">{{ record }}</a-tag>
                </div>
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
    title: "借出时间",
    dataIndex: "DatetimeLend",
    scopedSlots: { customRender: "DatetimeReturn" },
    align: "center",
  },
  {
    title: "借出人",
    dataIndex: "UserLend",
    align: "center",
    width: 100,
  },
  {
    title: "借出页数",
    dataIndex: "DatetimeLend",
    scopedSlots: { customRender: "DatetimeReturn" },
    align: "center",
  },
  {
    title: "归还时间",
    dataIndex: "DatetimeReturn",
    align: "center",
  },
  {
    title: "归还人",
    dataIndex: "UserReturn",
    align: "center",
  },
  {
    title: "归还页数",
    dataIndex: "DatetimeLend",
    scopedSlots: { customRender: "DatetimeReturn" },
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "Status",
    scopedSlots: { customRender: "Status" },
    align: "center",
  },
  {
    title: "借出备注",
    dataIndex: "HowLongLended",
    align: "center",
  },
  {
    title: "归还备注",
    dataIndex: "Remark",
    align: "center",
  },
  {
    title: "归还备注",
    dataIndex: "Remark",
    align: "center",
  },
];
import { getBorrowedSop } from "@/services/web.js";
export default {
  props: ["editData"],
  data() {
    return {
      size: "small",
      visible: true,
      columns,
      dataSource: [],
      loading: false,
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
      isBorrowed: false,
      returnData: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    close() {
      this.$emit("closeModal");
    },
    success() {
      this.$emit("closeModal");
      this.$emit("success");
    },
    returnBtn(record) {
      this.isBorrowed = true;
      this.returnData = record;
    },
    getList() {
      this.loading = true;
      let params = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        id: this.editData.Id,
      };
      getBorrowedSop(params, "single").then((res) => {
        if (res.data.success) {
          this.dataSource = res.data.data.list;
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination = pagination;
        }
        this.loading = false;
      });
    },
    //查看详情
    onClose() {
      this.isDrawer = false;
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
</style>
