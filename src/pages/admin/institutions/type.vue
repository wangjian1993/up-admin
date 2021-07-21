<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <div>
      <a-row type="flex" justify="start">
        <a-col :span="2"
          ><a-button @click="add" type="primary" icon="form"
            >添加</a-button
          ></a-col
        >
        <a-col
          ><div style="margin-bottom: 16px">
            <a-button
              type="primary"
              :disabled="!hasSelected"
              :loading="loading"
              @click="allDel"
            >
              删除
            </a-button>
            <span style="margin-left: 8px">
              <template v-if="hasSelected">
                {{ `共删除 ${selectedRowKeys.length} 条` }}
              </template>
            </span>
          </div></a-col
        >
      </a-row>
    </div>
    <div>
      <a-modal
        :title="title"
        :visible="visible"
        @ok="handleOk"
        @cancel="handleCancel"
      >
        <a-form-model
          ref="ruleForm"
          :model="typeForm"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item
            ref="EnterTypeCode"
            label="类型编号"
            prop="EnterTypeCode"
          >
            <a-input
              v-model="typeForm.EnterTypeCode"
              @blur="
                () => {
                  $refs.EnterTypeCode.onFieldBlur();
                }
              "
            />
          </a-form-model-item>
          <a-form-model-item
            ref="EnterTypeName"
            label="类型名称"
            prop="EnterTypeName"
          >
            <a-input
              v-model="typeForm.EnterTypeName"
              @blur="
                () => {
                  $refs.EnterTypeName.onFieldBlur();
                }
              "
            />
          </a-form-model-item>
          <a-form-model-item
            ref="EnterTypeDesc"
            label="描述"
            prop="EnterTypeDesc"
          >
            <a-input
              v-model="typeForm.EnterTypeDesc"
              @blur="
                () => {
                  $refs.EnterTypeDesc.onFieldBlur();
                }
              "
            />
          </a-form-model-item>
          <a-form-model-item ref="IndexUrl" label="首页URL" prop="IndexUrl">
            <a-input
              v-model="typeForm.IndexUrl"
              @blur="
                () => {
                  $refs.IndexUrl.onFieldBlur();
                }
              "
            />
          </a-form-model-item>
          <a-form-model-item ref="Enable" label="是否启动">
            <a-radio-group
              ::default-value="typeForm.Enable"
              button-style="solid"
            >
              <a-radio-button value="N">
                否
              </a-radio-button>
              <a-radio-button value="Y">
                是
              </a-radio-button>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item ref="Enable" label="是否默认">
            <a-radio-group
              :default-value="typeForm.IsDefualt"
              button-style="solid"
            >
              <a-radio-button value="N">
                否
              </a-radio-button>
              <a-radio-button value="Y">
                是
              </a-radio-button>
            </a-radio-group>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </div>
    <div class="tab">
      <a-table
        :columns="columns"
        :data-source="data"
        size="small"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
        bordered
      >
        <template slot="index" slot-scope="text, record, index">
          <div>
            <span>{{
              (pagination.current - 1) * pagination.pageSize + (index + 1)
            }}</span>
          </div>
        </template>
        <template slot="enable" slot-scope="record">
          <div>
            <a-tag color="green" v-if="record == 'Y'">是</a-tag>
            <a-tag color="red" v-else>否</a-tag>
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
              <a style="margin-right: 8px">
                <a-icon type="delete" />
                删除
              </a>
            </a-popconfirm>
            <a style="margin-right: 8px" @click="edit(record)">
              <a-icon type="edit" />
              编辑
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
    title: "类型编码",
    dataIndex: "EnterTypeCode",
    scopedSlots: { customRender: "name" },
    align: "center",
  },
  {
    title: "类型名称",
    dataIndex: "EnterTypeName",
    scopedSlots: { customRender: "age" },
    align: "center",
  },
  {
    title: "是否启动",
    dataIndex: "Enable",
    scopedSlots: { customRender: "enable" },
    align: "center",
  },
  {
    title: "默认",
    dataIndex: "IsDefualt",
    scopedSlots: { customRender: "defualt" },
    align: "center",
  },
  {
    title: "首页URL",
    dataIndex: "IndexUrl",
    scopedSlots: { customRender: "EnterUrl" },
    align: "center",
  },
  {
    title: "描述",
    dataIndex: "EnterTypeDesc",
    scopedSlots: { customRender: "address" },
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];
import {
  getInstitutionList,
  addEnterType,
  editEnterType,
  delEnterType,
} from "@/services/admin.js";
export default {
  data() {
    return {
      data: [],
      columns,
      isEdit: false,
      editForm: [],
      title: "添加机构类型",
      loading: false,
      selectedRowKeys: [], // Check here to configure the default column
      visible: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      typeForm: {
        EnterTypeCode: "",
        EnterTypeName: "",
        EnterTypeDesc: "",
        IndexUrl: "",
        Enable: "N",
        IsDefualt: "N",
      },
      rules: {
        EnterTypeCode: [
          {
            required: true,
            message: "请输入类型编码",
            trigger: "blur",
          },
        ],
        EnterTypeName: [
          {
            required: true,
            message: "请输入类型名称",
            trigger: "blur",
          },
        ],
        EnterTypeDesc: [
          {
            required: true,
            message: "请输入类型描述",
            trigger: "blur",
          },
        ],
        IndexUrl: [
          {
            required: true,
            message: "请输入首页地址",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  created() {
    this.getInstitutionList();
  },
  methods: {
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //获取机构类型列表
    getInstitutionList() {
      let parmas = {
        pageindex: 1,
        pagesize: 10,
      };
      getInstitutionList(parmas).then((res) => {
        if (res.data.success) {
          this.data = res.data.data.list;
          this.pagination.total = res.data.recordsTotal;
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
    defaultForm() {
      this.typeForm = {
        EnterTypeCode: "",
        EnterTypeName: "",
        EnterTypeDesc: "",
        IndexUrl: "",
        Enable: "N",
        IsDefualt: "N",
      };
    },
    //关闭对话框
    handleCancel() {
      this.visible = false;
    },
    edit(item) {
      this.visible = true;
      this.isEdit = true;
      this.title = "编辑机构类型";
      this.editForm = item;
      this.typeForm.EnterTypeCode = item.EnterTypeCode;
      this.typeForm.EnterTypeCode = item.EnterTypeCode;
      this.typeForm.EnterTypeName = item.EnterTypeName;
      this.typeForm.EnterTypeDesc = item.EnterTypeDesc;
      this.typeForm.IndexUrl = item.IndexUrl;
      this.typeForm.Enable = item.Enable;
      this.typeForm.IsDefualt = item.IsDefualt;
      console.log(this.typeForm);
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const parmas = this.typeForm;
          parmas.Enable = parmas.Enable ? "Y" : "N";
          parmas.IsDefualt = parmas.IsDefualt ? "Y" : "N";
          if (this.isEdit) {
            parmas.EnterTypeId = this.editForm.EnterTypeId;
            editEnterType(parmas).then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.defaultForm();
                this.visible = false;
                this.getInstitutionList();
              } else {
                this.$message.warning(res.data.message.content);
              }
            });
          } else {
            addEnterType(parmas).then((res) => {
              if (res.data.success) {
                this.$message.success("添加成功!");
                this.getInstitutionList();
                this.defaultForm();
                this.visible = false;
              } else {
                this.$message.warning(res.data.message.content);
              }
            });
          }
        }
      });
    },
    //多选删除
    allDel() {
      let self = this;
      self.$confirm({
        title: "确定要删除选中内容",
        onOk() {
          const params = [];
          self.selectedRowKeys.forEach((item) => {
            params.push(self.data[item].EnterTypeId);
          });
          delEnterType(params).then((res) => {
            if (res.data.success) {
              self.$message.success("删除成功!");
              self.selectedRowKeys = [];
              self.$message.success("删除成功!");
              self.getInstitutionList();
            } else {
              self.$message.warning(res.data.message.content);
            }
          });
        },
        onCancel() {},
      });
    },
    //单个删除
    onDelete(item) {
      let parmas = [];
      parmas.push(item.EnterTypeId);
      delEnterType(parmas).then((res) => {
        if (res.data.success) {
          this.$message.success("删除成功!");
          this.getInstitutionList();
        } else {
          this.$message.warning(res.data.message.content);
        }
      });
    },
  },
};
</script>
<style lang="less">
.ant-form-item {
  margin-bottom: 5px;
}
</style>
