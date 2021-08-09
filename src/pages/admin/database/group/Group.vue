<!--
 * @Author: max
 * @Date: 2021-08-06 16:12:00
 * @LastEditTime: 2021-08-09 13:46:53
 * @LastEditors: max
 * @Description: 快码组管理
 * @FilePath: /up-admin/src/pages/admin/database/group/Group.vue
-->
<template>
  <!-- 搜索 -->
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
              type="primary"
              icon="delete"
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
          <a-form
            layout="horizontal"
            :form="searchForm"
          >
            <div>
              <a-col
                :md="18"
                :sm="24"
              >
                <a-form-item
                  label="快码组编码/名称"
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
                          { required: true, message: '快码组编码/名称!' },
                        ],
                      },
                    ]"
                  />
                </a-form-item>
              </a-col>
            </div>
            <span style="float: left; margin-top: 5px;">
              <a-button
                @click="reset"
                icon="reload"
              >重置</a-button>
            </span>
          </a-form>
        </a-col>
      </a-row>
    </div>
    <!-- 添加.编辑弹窗 -->
    <div>
      <a-modal
        :title="isEdit ? '编辑快码组' : '添加快码组'"
        v-if="visible"
        :visible="visible"
        @ok="handleOk"
        :destroyOnClose="true"
        @cancel="handleCancel"
      >
        <a-form-model
          ref="ruleForm"
          :model="form"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item
            ref="ParamGroupName"
            has-feedback
            label="快码组名称"
            prop="ParamGroupName"
          >
            <a-input
              v-model="form.ParamGroupName"
              allowClear
              placeholder="请输入快码组名称"
              @blur="
								() => {
									$refs.ParamGroupName.onFieldBlur();
								}
							"
            />
          </a-form-model-item>
          <a-form-model-item
            ref="ParamGroupCode"
            has-feedback
            label="快码组编码"
            prop="ParamGroupCode"
          >
            <a-input
              v-model="form.ParamGroupCode"
              allowClear
              placeholder="请输入快码组编码"
              :disabled="isEdit"
              @blur="
								() => {
									$refs.ParamGroupCode.onFieldBlur();
								}
							"
            />
          </a-form-model-item>
          <a-form-model-item
            ref="ParamGroupDesc"
            label="快码组描述"
          >
            <a-textarea
              v-model="form.ParamGroupDesc"
              placeholder="请输入快码组描述"
              :auto-size="{ minRows: 3, maxRows: 5 }"
            />
          </a-form-model-item>
          <a-form-model-item
            ref="Enable"
            label="是否启用"
          >
            <a-radio-group
              :value="form.Enable"
              button-style="solid"
              @change="enableChange"
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
        :loading="loading"
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
          title="快码组详情"
          :column="1"
        >
          <a-descriptions-item label="快码组编码">{{ drawerItem.ParamGroupCode }}</a-descriptions-item>
          <a-descriptions-item label="快码组名称">{{ drawerItem.ParamGroupName }}</a-descriptions-item>
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
          <a-descriptions-item label="描述">{{ drawerItem.ParamGroupDesc }}</a-descriptions-item>
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
    title: "快码组名称",
    dataIndex: "ParamGroupName",
    scopedSlots: { customRender: "ParamGroupName" },
    align: "center",
  },
  {
    title: "快码组编码",
    dataIndex: "ParamGroupCode",
    scopedSlots: { customRender: "ParamGroupCode" },
    align: "center",
  },
  {
    title: "快码组描述",
    dataIndex: "ParamGroupDesc",
    scopedSlots: { customRender: "ParamGroupDesc" },
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "Enable",
    scopedSlots: { customRender: "enable" },
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];
import { getParamGroupList, paramGroupAction } from "@/services/admin.js";
import { renderStripe } from "@/utils/stripe.js";
export default {
  data() {
    return {
      data: [],
      columns,
      isEdit: false,
      editForm: [],
      title: "添加快码组",
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
      form: {
        ParamGroupCode: "",
        ParamGroupName: "",
        ParamGroupDesc: "",
        Enable: "Y",
      },
      rules: {
        ParamGroupCode: [
          {
            required: true,
            message: "请输入快码组编码",
            trigger: "blur",
          },
        ],
        ParamGroupName: [
          {
            required: true,
            message: "请输入快码组名称",
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
    this.getParamGroupList();
  },
  methods: {
    enableChange(value) {
      this.form.Enable = value.target.value;
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
      this.getParamGroupList();
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
            keyword: values.searcValue,
          };
          getParamGroupList(parmas).then((res) => {
            if (res.data.success) {
              this.data = res.data.data;
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
    getParamGroupList() {
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
      };
      getParamGroupList(parmas).then((res) => {
        if (res.data.success) {
          this.data = res.data.data;
          const pagination = { ...this.pagination };
          if (res.data.data.recordsTotal) {
            pagination.total = res.data.data.recordsTotal;
          }
          this.pagination = pagination;
          this.loading = false;
        }
      });
    },
    //打开对话框
    add() {
      this.defaultForm();
      this.isEdit = false;
      this.title = "添加快码组组";
      this.visible = true;
    },
    defaultForm() {
      this.form = {
        ParamGroupCode: "",
        ParamGroupName: "",
        ParamGroupDesc: "",
        Enable: "Y",
      };
    },
    //关闭对话框
    handleCancel() {
      this.visible = false;
    },
    edit(item) {
      this.visible = true;
      this.isEdit = true;
      this.title = "编辑快码组";
      this.form = item;
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            let editForm = {
              ParamGroupId: this.form.ParamGroupId,
              ParamGroupName: this.form.ParamGroupName,
              ParamGroupDesc: this.form.ParamGroupDesc,
              Enable: this.form.Enable,
            };
            paramGroupAction(editForm, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.defaultForm();
                this.visible = false;
                this.getParamGroupList();
              }
            });
          } else {
            paramGroupAction(this.form, "add").then((res) => {
              if (res.data.success) {
                this.$message.success("添加成功!");
                this.getParamGroupList();
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
            params.push(self.data[item].ParamGroupId);
          });
          paramGroupAction(params, "delete").then((res) => {
            if (res.data.success) {
              self.selectedRowKeys = [];
              self.$message.success("删除成功!");
              self.getParamGroupList();
            }
          });
        },
        onCancel() {},
      });
    },
    //单个删除
    onDelete(item) {
      let parmas = [];
      parmas.push(item.ParamGroupId);
      paramGroupAction(parmas, "delete").then((res) => {
        if (res.data.success) {
          this.$message.success("删除成功!");
          this.getParamGroupList();
        }
      });
    },
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.getParamGroupList();
    },
  },
};
</script>
<style lang="less">
.ant-form-item {
  // margin-bottom: 5px;
}
</style>
