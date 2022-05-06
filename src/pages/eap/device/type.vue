<!--
 * @Author: max
 * @Date: 2022-05-05 11:01:45
 * @LastEditTime: 2022-05-05 11:27:25
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/eap/device/type.vue
-->
<template>
  <!-- 搜索 -->
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <div class="search-box">
      <a-row type="flex" justify="space-between">
        <a-col :span="8">
          <div>
            <a-button :disabled="!hasPerm('add')" @click="add" type="primary" icon="form">添加</a-button>
          </div>
        </a-col>
      </a-row>
    </div>
    <!-- 添加编辑弹窗框 -->
    <div>
      <a-modal :title="isEdit ? '编辑应用类型' : '添加设备类型'" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel">
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item ref="EquimentTypeName" has-feedback label="设备类型名称" prop="EquimentTypeName">
            <a-input v-model="form.EquimentTypeName" allowClear placeholder="请输入设备类型名称" />
          </a-form-model-item>
          <a-form-model-item ref="EquimentTypeCode" has-feedback label="设备类型编码" prop="EquimentTypeCode">
            <a-input v-model="form.EquimentTypeCode" allowClear placeholder="请输入设备类型编码" :disabled="isEdit" />
          </a-form-model-item>
          <a-form-model-item ref="EquimentTypeDesc" label="设备类型描述">
            <a-textarea v-model="form.EquimentTypeDesc" placeholder="请输入设备类型描述" :auto-size="{ minRows: 3, maxRows: 5 }" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </div>
    <!-- 列表 -->
    <div class="tab">
      <a-table
        :columns="columns"
        :data-source="data"
        size="small"
        :scroll="{ y: true }"
        :loading="loading"
        :pagination="false"
        @change="handleTableChange"
        :rowKey="(tableDatas) => data.ID"
        bordered
      >
        <template slot="index" slot-scope="text, record, index">
          <div>
            <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
          </div>
        </template>
        <template slot="enable" slot-scope="record">
          <div>
            <a-tag color="green" v-if="record == 'Y'">启用</a-tag>
            <a-tag color="red" v-else>禁用</a-tag>
          </div>
        </template>
        <template slot="defualt" slot-scope="record">
          <div>
            <a-tag color="green" v-if="record == 'Y'">是</a-tag>
            <a-tag color="red" v-else>否</a-tag>
          </div>
        </template>
        <template slot="action" slot-scope="text, record">
          <div>
            <a-popconfirm title="确定删除?" @confirm="() => onDelete(record)">
              <a style="margin-right: 8px" :disabled="!hasPerm('delete')">
                <a-icon type="delete" />
                删除
              </a>
            </a-popconfirm>
            <a style="margin-right: 8px" @click="edit(record)" :disabled="!hasPerm('edit')">
              <a-icon type="edit" />
              编辑
            </a>
            <a style="margin-right: 8px" @click="detail(record)">
              <a-icon type="profile" />
              查看
            </a>
          </div>
        </template>
      </a-table>
    </div>
  </a-card>
</template>
<script>
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
  },
  {
    title: "设备类型名称",
    dataIndex: "EQUIPMENT_TYPE_NAME",
    scopedSlots: { customRender: "EQUIPMENT_TYPE_NAME" },
    align: "center",
  },
  {
    title: "设备类型编码",
    dataIndex: "EQUIPMENT_TYPE_CODE",
    scopedSlots: { customRender: "EQUIPMENT_TYPE_CODE" },
    align: "center",
  },
  {
    title: "设备类型描述",
    dataIndex: "EQUIPMENT_TYPE_DESC",
    scopedSlots: { customRender: "EQUIPMENT_TYPE_DESC" },
    align: "center",
  },
];
import { getDeviceTypeAction, setDeviceTypeAction } from "@/services/eap.js";
import { renderStripe } from "@/utils/stripe.js";
export default {
  data() {
    return {
      data: [],
      columns,
      isEdit: false,
      editForm: [],
      title: "添加机构类型",
      loading: true,
      isDrawer: false,
      selectedRowKeys: [], // Check here to configure the default column
      visible: false,
      drawerItem: [],
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
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
      searcValue: "",
      searchForm: this.$form.createForm(this),
      form: {
        EquimentTypeCode: "",
        EquimentTypeName: "",
        EquimentTypeDesc: "",
      },
      rules: {
        EquimentTypeCode: [
          {
            required: true,
            message: "请输入设备类型编码",
            trigger: "blur",
          },
        ],
        EquimentTypeName: [
          {
            required: true,
            message: "请输入设备类型名称",
            trigger: "blur",
          },
        ],
      },
    };
  },
  updated() {
    renderStripe();
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  created() {
    this.getDeviceTypeAction();
  },
  methods: {
    //状态切换
    enableChange(value) {
      this.form.Enable = value.target.value;
    },
    //查看详情
    detail(item) {
      this.isDrawer = true;
      this.drawerItem = item;
    },
    //关闭弹窗
    onClose() {
      this.isDrawer = false;
    },
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //重置搜索
    reset() {
      this.getDeviceTypeAction();
      this.searchForm.resetFields();
    },
    //关键词搜索
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          console.log("Received values of form: ", values);
          this.data = [];
          this.pagination.total = 0;
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
          };
          getDeviceTypeAction(parmas).then((res) => {
            if (res.data.success) {
              this.data = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.recordsTotal;
              this.pagination = pagination;
              this.loading = false;
            }
          });
          // do something
        }
      });
    },
    //获取机构类型列表
    getDeviceTypeAction() {
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
      };
      getDeviceTypeAction(parmas, "getlist").then((res) => {
        if (res.data.success) {
          this.data = res.data.data;
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination = pagination;
          this.loading = false;
        } else {
          this.loading = false;
        }
      });
    },
    //打开对话框
    add() {
      this.defaultForm();
      this.isEdit = false;
      this.title = "添加机构类型";
      this.visible = true;
    },
    //初始化表单
    defaultForm() {
      this.form = {
        EquimentTypeCode: "",
        EquimentTypeName: "",
        EquimentTypeDesc: "",
      };
    },
    //关闭对话框
    handleCancel() {
      this.visible = false;
    },
    //编辑
    edit(item) {
      this.visible = true;
      this.isEdit = true;
      this.title = "编辑机构类型";
      this.form = item;
    },
    //弹框确认按钮
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          //编辑
          if (this.isEdit) {
            let editForm = {
              AppTypeId: this.form.AppTypeId,
              AppTypeName: this.form.AppTypeName,
              AppTypeDesc: this.form.AppTypeDesc,
              Enable: this.form.Enable,
            };
            setDeviceTypeAction(editForm, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.defaultForm();
                this.visible = false;
                this.getDeviceTypeAction();
              }
            });
          } else {
            //添加
            setDeviceTypeAction(this.form, "add").then((res) => {
              if (res.data.success) {
                this.$message.success("添加成功!");
                this.getDeviceTypeAction();
                this.defaultForm();
                this.visible = false;
              }
            });
          }
        }
      });
    },
    //分页操作
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.getDeviceTypeAction();
    },
  },
};
</script>
<style lang="less" scoped>
.ant-form-item {
  margin-bottom: 5px;
}
/deep/ .ant-table {
  min-height: 77vh;
  max-height: 77vh;
  overflow: auto;
}
</style>
