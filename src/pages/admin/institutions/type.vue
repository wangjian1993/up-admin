<template>
  <a-card
    class="card"
    :bordered="false"
    :bodyStyle="{ padding: '5px' }"
  >
    <div class="search-box">
      <a-row>
        <a-col :span="12">
          <div>
            <a-button
              @click="add"
              type="primary"
              icon="form"
            >添加</a-button>
            <a-button
              icon="delete"
              type="primary"
              :disabled="!hasSelected"
              :loading="loading"
              @click="allDel"
              style="margin-left: 8px"
            >删除</a-button>
            <span style="margin-left: 8px">
              <template v-if="hasSelected">
                {{ `共选中 ${selectedRowKeys.length} 条` }}
              </template>
            </span>
          </div>
        </a-col>
        <a-col :span="12">
           <a-form layout="horizontal" :form="searchForm">
            <div>
              <a-col :md="18" :sm="24">
                <a-form-item
                  label="机构类型编码/名称"
                  :labelCol="{ span: 8 }"
                  :wrapperCol="{ span: 14, offset: 1 }"
                >
                  <a-input-search
                    placeholder="请输入"
                    allowClear
                    enter-button="搜索"
                    @search="search"
                    v-decorator="[
                      'searcValue',
                      {
                        rules: [
                          { required: true, message: '机构类型编码/名称!' },
                        ],
                      },
                    ]"
                  />
                </a-form-item>
              </a-col>
            </div>
            <span style="float: left; margin-top: 5px;">
              <a-button @click="reset" icon="reload">重置</a-button>
            </span>
          </a-form>
        </a-col>
      </a-row>
    </div>
    <div>
      <a-modal
        :title="title"
        :visible="visible"
        v-if="visible"
        @ok="handleOk"
        destoryOnClose
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
            has-feedback
            label="类型编号"
            prop="EnterTypeCode"
          >
            <a-input
              v-model="typeForm.EnterTypeCode"
              :disabled="isEdit"
              placeholder="请输入类型编号"
              @blur="
								() => {
									$refs.EnterTypeCode.onFieldBlur();
								}
							"
            />
          </a-form-model-item>
          <a-form-model-item
            ref="EnterTypeName"
            has-feedback
            label="类型名称"
            prop="EnterTypeName"
          >
            <a-input
              v-model="typeForm.EnterTypeName"
              placeholder="请输入类型名称"
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
            has-feedback
          >
            <a-textarea
              v-model="typeForm.EnterTypeDesc"
              placeholder="请输入类型描述"
              :auto-size="{ minRows: 3, maxRows: 5 }"
            />
          </a-form-model-item>
          <a-form-model-item
            ref="IndexUrl"
            label="首页URL"
            prop="IndexUrl"
            has-feedback
          >
            <a-input
              v-model="typeForm.IndexUrl"
              placeholder="请输入首页URL"
              @blur="
								() => {
									$refs.IndexUrl.onFieldBlur();
								}
							"
            />
          </a-form-model-item>
          <a-form-model-item
            ref="Enable"
            label="是否启用"
          >
            <a-radio-group
              :value="typeForm.Enable"
              default-value="Y"
              button-style="solid"
              @change="enableChange"
            >
              <a-radio-button value="N">否</a-radio-button>
              <a-radio-button value="Y">是</a-radio-button>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item
            ref="IsDefualt"
            label="是否默认"
          >
            <a-radio-group
              :value="typeForm.IsDefualt"
              default-value="Y"
              button-style="solid"
              @change="defualtChange"
            >
              <a-radio-button value="N">否</a-radio-button>
              <a-radio-button value="Y">是</a-radio-button>
            </a-radio-group>
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
        :pagination="pagination"
        @change="handleTableChange"
        :rowKey="tableDatas => data.EnterTypeId"
        :row-selection="{
					selectedRowKeys: selectedRowKeys,
					onChange: onSelectChange
				}"
        bordered
      >
        <template
          slot="index"
          slot-scope="text, record, index"
        >
          <div>
            <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
          </div>
        </template>
        <template
          slot="enable"
          slot-scope="record"
        >
          <div>
            <a-tag
              color="green"
              v-if="record == 'Y'"
            >启用</a-tag>
            <a-tag
              color="red"
              v-else
            >禁用</a-tag>
          </div>
        </template>
        <template
          slot="defualt"
          slot-scope="record"
        >
          <div>
            <a-tag
              color="green"
              v-if="record == 'Y'"
            >是</a-tag>
            <a-tag
              color="red"
              v-else
            >否</a-tag>
          </div>
        </template>
        <template
          slot="action"
          slot-scope="text, record"
        >
          <div>
            <a-popconfirm
              title="确定删除?"
              @confirm="() => onDelete(record)"
            >
              <a style="margin-right: 8px">
                <a-icon type="delete" />
                删除
              </a>
            </a-popconfirm>
            <a
              style="margin-right: 8px"
              @click="edit(record)"
            >
              <a-icon type="edit" />
              编辑
            </a>
            <a
              style="margin-right: 8px"
              @click="detail(record)"
            >
              <a-icon type="profile" />
              查看
            </a>
          </div>
        </template>
      </a-table>
    </div>
    <!-- 查看详情 -->
    <div>
      <a-drawer
        width="400"
        placement="right"
        :closable="true"
        :visible="isDrawer"
        @close="onClose"
      >
        <a-descriptions
          title="机构类型详情"
          :column="1"
        >
          <!-- <a-descriptions-item label="类型id">{{ drawerItem.EnterTypeId }}</a-descriptions-item> -->
          <a-descriptions-item label="类型编码">{{ drawerItem.EnterTypeCode }}</a-descriptions-item>
          <a-descriptions-item label="类型名称">{{ drawerItem.EnterTypeName }}</a-descriptions-item>
          <a-descriptions-item label="是否启用">
            <div>
              <a-tag
                color="green"
                v-if="drawerItem.Enable == 'Y'"
              >启用</a-tag>
              <a-tag
                color="red"
                v-else
              >禁用</a-tag>
            </div>
          </a-descriptions-item>
          <a-descriptions-item label="默认">
            <div>
              <a-tag
                color="green"
                v-if="drawerItem.IsDefualt == 'Y'"
              >是</a-tag>
              <a-tag
                color="red"
                v-else
              >否</a-tag>
            </div>
          </a-descriptions-item>
          <a-descriptions-item label="首页URL">{{ drawerItem.IndexUrl }}</a-descriptions-item>
          <a-descriptions-item label="描述">{{ drawerItem.EnterTypeDesc }}</a-descriptions-item>
          <a-descriptions-item label="添加人">{{ drawerItem.UserCreated }}</a-descriptions-item>
          <a-descriptions-item label="添加时间">{{ drawerItem.DateTimeCreated }}</a-descriptions-item>
        </a-descriptions>
      </a-drawer>
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
import { renderStripe } from "@/utils/stripe.js";
export default {
  data() {
    return {
      data: [],
      columns,
      isEdit: false,
      editForm: [],
      title: "添加机构类型",
      loading: false,
      isDrawer: false,
      selectedRowKeys: [], // Check here to configure the default column
      visible: false,
      drawerItem: [],
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10, //每页中显示10条数据
        showSizeChanger: true,
        showLessItems: true,
        showQuickJumper: true,
        pageSizeOptions: ["10", "20", "50", "100"], //每页中显示的数据
        showTotal: (total, range) =>
          `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
      },
      searcValue: "",
      searchForm: this.$form.createForm(this),
      typeForm: {
        EnterTypeCode: "",
        EnterTypeName: "",
        EnterTypeDesc: "",
        IndexUrl: "",
        Enable: "Y",
        IsDefualt: "Y",
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
  updated() {
    renderStripe();
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
    enableChange(value) {
      this.typeForm.Enable = value.target.value;
    },
    defualtChange(value) {
      this.typeForm.IsDefualt = value.target.value;
    },
    //查看详情
    detail(item) {
      this.isDrawer = true;
      this.drawerItem = item;
    },
    onClose() {
      this.isDrawer = false;
    },
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //重置搜索
    reset() {
      this.getInstitutionList();
      this.searchForm.resetFields();
    },
    //关键词搜索
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          this.data = [];
          this.pagination.total = 0;
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            keyword: values.searcValue,
          };
          getInstitutionList(parmas).then((res) => {
            if (res.data.success) {
              this.data = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.recordsTotal;
              this.pagination = pagination;
            }
          });
          // do something
        }
      });
    },
    //获取机构类型列表
    getInstitutionList() {
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
      };
      getInstitutionList(parmas).then((res) => {
        if (res.data.success) {
          this.data = res.data.data.list;
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination = pagination;
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
        Enable: "Y",
        IsDefualt: "Y",
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
      this.typeForm = item;
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            let editForm = {
              EnterTypeId: this.typeForm.EnterTypeId,
              EnterTypeCode: this.typeForm.EnterTypeCode,
              EnterTypeName: this.typeForm.EnterTypeName,
              EnterTypeDesc: this.typeForm.EnterTypeDesc,
              IndexUrl: this.typeForm.IndexUrl,
              Enable: this.typeForm.Enable,
              IsDefualt: this.typeForm.IsDefualt,
            };
            editEnterType(editForm).then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.defaultForm();
                this.visible = false;
                this.getInstitutionList();
              }
            });
          } else {
            addEnterType(this.typeForm).then((res) => {
              if (res.data.success) {
                this.$message.success("添加成功!");
                this.getInstitutionList();
                this.defaultForm();
                this.visible = false;
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
        }
      });
    },
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.getInstitutionList();
    },
  },
};
</script>
<style lang="less">
.ant-form-item {
  margin-bottom: 5px;
}
</style>
