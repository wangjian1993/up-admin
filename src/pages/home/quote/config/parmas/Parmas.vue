<template>
  <div class="content">
    <div class="add-btn">
      <a-row type="flex" justify="start">
        <a-col :span="2"><a-button @click="goAdd()" type="primary" icon="form">添加</a-button></a-col>
      </a-row>
    </div>
    <a-table
      :columns="columns"
      :data-source="list"
      size="small"
      :scroll="{ y: true }"
      :loading="isLoading"
      :pagination="pagination"
      @change="handleTableChange"
      :rowKey="(tableDatas) => list.id"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
      bordered
    >
      <template slot="index" slot-scope="text, record, index">
        <div>
          <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
        </div>
      </template>
      <template slot="required" slot-scope="text, record">
        <div>
          <p>{{ record.is_required == 1 ? "是" : "" }}</p>
        </div>
      </template>
    </a-table>
    <div>
      <a-modal v-model="visible" title="添加参数" destroyOnClose ok-text="确认" cancel-text="取消" @cancel="cancel" @ok="setConfig">
        <a-form-model :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item ref="cost_name" prop="cost_name" label="费用名称"><a-input v-model="form.cost_name"/></a-form-model-item>
          <a-form-model-item ref="field_name" prop="field_name" label="字段名称"><a-input v-model="form.field_name"/></a-form-model-item>
          <a-form-model-item label="是否必填"><a-switch v-model="form.is_required"/></a-form-model-item>
        </a-form-model>
      </a-modal>
    </div>
  </div>
</template>

<script>
const columns = [
  {
    title: "序号",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "费用名称",
    dataIndex: "cost_name",
    align: "center",
  },
  {
    title: "字段名",
    dataIndex: "field_name",
    align: "center",
  },
  {
    title: "必选",
    dataIndex: "is_required",
    align: "center",
    scopedSlots: { customRender: "required" },
  },
  {
    title: "添加时间",
    dataIndex: "add_time",
    align: "center",
  },
];
import { getBomBaseConfig, setBomBaseConfig } from "@/services/bom.js";
export default {
  data() {
    return {
      list: [],
      columns,
      isLoading: true,
      visible: false,
      destroyOnClose: true,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      selectedRowKeys: [], // Check here to configure the default column
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
      form: {
        field_name: "",
        cost_name: "",
        is_required: false,
        act: "add_cost_options",
      },
      rules: {
        field_name: [{ required: true, message: "请输入字段名称", trigger: "blur" }],
        cost_name: [{ required: true, message: "请输入费用名称", trigger: "change" }],
      },
    };
  },
  created() {
    this.getBomBaseConfig();
  },
  methods: {
    getBomBaseConfig() {
      getBomBaseConfig("get_base").then((res) => {
        if (res.data.success) {
          this.list = res.data.data;
          console.log(this.list);
          const pagination = { ...this.pagination };
          pagination.total = this.list.length;
          this.pagination = pagination;
          this.isLoading = false;
        }
      });
    },
    setConfig() {
      if (this.form.field_name == "") {
        this.$message.warning("请填写费用名称");
        return;
      }
      if (this.form.cost_name == "") {
        this.$message.warning("请填写字段名称");
        return;
      }
      let param = this.form;
      param.is_required = this.form.is_required ? 1 : 0;
      setBomBaseConfig(param).then((res) => {
        if (res.data.success) {
          this.getBomBaseConfig();
          this.visible = false;
          this.$message.success("添加成功!");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    cancel() {
      this.form = {
        field_name: "",
        cost_name: "",
        is_required: false,
      };
    },
    goAdd() {
      this.visible = true;
    },
    //分页操作
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      // this.getAppTypeList();
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
  },
  components: {},
};
</script>

<style lang="less">
.content {
  background-color: @base-bg-color;
  padding: 0px;
}
.add-btn {
  padding: 10px;
}
</style>
