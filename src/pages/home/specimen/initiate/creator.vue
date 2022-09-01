<template>
  <div>
    <a-modal v-model="visible" title="创建人查询" @cancel="close" :footer="null" centered width="50%">
      <div>
        <a-form layout="horizontal" :form="searchForm">
          <div>
            <a-row>
              <a-col :md="8" :sm="24">
                <a-form-item label="品号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" placeholder="请输入品号" v-decorator="['itemcode']" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <span style="display: flex;justify-content: flex-end">
                  <a-button type="primary" @click="search">查询</a-button>
                  <a-button style="margin-left: 8px" @click="reset">重置</a-button>
                </span>
              </a-col>
            </a-row>
          </div>
        </a-form>
        <a-descriptions :column="2">
          <a-descriptions-item label="品号">{{dataSource.ItemCode}}</a-descriptions-item>
          <a-descriptions-item label="品名">{{dataSource.ItemName}}</a-descriptions-item>
          <a-descriptions-item label="创建人">{{dataSource.UserCreated}}</a-descriptions-item>
          <a-descriptions-item label="创建部门">{{dataSource.UserDepartment}}</a-descriptions-item>
        </a-descriptions>
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
    width: 50,
  },
  {
    title: "品号",
    dataIndex: "ItemCode",
    scopedSlots: { customRender: "ItemCode" },
    align: "center",
  },
  {
    title: "品名",
    dataIndex: "ItemName",
    scopedSlots: { customRender: "ItemName" },
    align: "center",
  },
  {
    title: "创建人",
    dataIndex: "UserCreated",
    scopedSlots: { customRender: "UserCreated" },
    align: "center",
  },
  {
    title: "创建部门",
    dataIndex: "UserDepartment",
    scopedSlots: { customRender: "UserDepartment" },
    align: "center",
  },
];
import { getMaterialSampleApi } from "@/services/web.js";
export default {
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
      searchForm: this.$form.createForm(this),
    };
  },
  created() {},
  methods: {
    closeModal() {
      this.isPreview = false;
    },

    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    close() {
      this.$emit("closeModal");
    },
    handleOk() {
      let result = this.dataSource.find((item) => item.EquimentId == this.selectedRowKeys[0]);
      this.$emit("selectDevice", result);
    },
    reset() {
      this.searchForm.resetFields();
      this.dataSource =[]
    },
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          let params = {
            itemcode: values.itemcode,
          };
          getMaterialSampleApi(params, "getitemcodecreatedinfo").then((res) => {
            if (res.data.success) {
              this.dataSource = res.data.data
            }
          });
          // do something
        }
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
