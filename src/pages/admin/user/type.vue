<!--
 * @Author: max
 * @Date: 2021-08-06 15:34:43
 * @LastEditTime: 2021-09-04 14:48:20
 * @LastEditors: max
 * @Description: 用户类型
 * @FilePath: /up-admin/src/pages/admin/user/type.vue
-->
<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <div class="search-box">
      <a-row type="flex" justify="space-between">
        <a-col :span="8">
          <div>
            <a-button :disabled="!hasPerm('add')" @click="add" type="primary" icon="form">添加</a-button>
            <a-button v-if="hasPerm('delete')" icon="delete" type="primary" :disabled="!hasSelected" :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
            <a-button v-else icon="delete" type="primary" disabled :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
            <span style="margin-left: 8px">
              <template v-if="hasSelected">
                {{ `共选中 ${selectedRowKeys.length} 条` }}
              </template>
            </span>
          </div>
        </a-col>
        <a-col :sm="24" :md="24" :xl="14">
          <a-row>
            <a-col>
              <a-form layout="horizontal" :form="searchForm" class="form-box">
                <div>
                  <a-form-item>
                    <a-input
                      placeholder="请输入用户类型编码/名称"
                      allowClear
                      v-decorator="[
                        'searcValue',
                        {
                          rules: [{ required: true, message: '请输入用户类型编码/名称!' }],
                        },
                      ]"
                    />
                  </a-form-item>
                </div>
                <div style="margin-top: 3px;margin-left:10px">
                  <a-button :disabled="!hasPerm('search')" type="primary" icon="search" style="margin:0 10px" @click="search">搜索</a-button>
                  <a-button :disabled="!hasPerm('search')" @click="reset" icon="reload">重置</a-button>
                </div>
              </a-form>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
    <div>
      <a-modal :title="isEdit ? '编辑用户类型' : '添加用户类型'" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel">
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item ref="UserTypeCode" has-feedback label="用户编号" prop="UserTypeCode">
            <a-input
              v-model="form.UserTypeCode"
              :disabled="isEdit"
              allowClear
              placeholder="请输入用户编号"
              @blur="
                () => {
                  $refs.UserTypeCode.onFieldBlur();
                }
              "
            />
          </a-form-model-item>
          <a-form-model-item ref="UserTypeName" has-feedback label="类型名称" prop="UserTypeName">
            <a-input
              v-model="form.UserTypeName"
              placeholder="请输入用户名称"
              allowClear
              @blur="
                () => {
                  $refs.UserTypeName.onFieldBlur();
                }
              "
            />
          </a-form-model-item>
          <a-form-model-item ref="UserTypeDesc" label="描述">
            <a-textarea v-model="form.UserTypeDesc" placeholder="请输入用户描述" :auto-size="{ minRows: 3, maxRows: 5 }" />
          </a-form-model-item>
          <a-form-model-item ref="Enable" label="是否启用">
            <a-radio-group :value="form.Enable" default-value="Y" button-style="solid" @change="enableChange">
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
        v-if="hasPerm('search')"
        :columns="columns"
        :data-source="data"
        size="small"
        :scroll="{ y: scrollY }"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        :rowKey="(data) => data.UserTypeId"
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
      <a-empty v-else description="暂无权限"/>
    </div>
    <!-- 查看详情 -->
    <div>
      <a-drawer width="400" placement="right" :closable="true" :visible="isDrawer" @close="onClose">
        <a-descriptions title="用户类型详情" :column="1">
          <a-descriptions-item label="用户编码">{{ drawerItem.UserTypeCode }}</a-descriptions-item>
          <a-descriptions-item label="用户名称">{{ drawerItem.UserTypeName }}</a-descriptions-item>
          <a-descriptions-item label="是否启用">
            <div>
              <a-tag color="green" v-if="drawerItem.Enable == 'Y'">启用</a-tag>
              <a-tag color="red" v-else>禁用</a-tag>
            </div>
          </a-descriptions-item>
          <a-descriptions-item label="描述">{{ drawerItem.UserTypeDesc }}</a-descriptions-item>
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
    title: "用户编码",
    dataIndex: "UserTypeCode",
    scopedSlots: { customRender: "UserTypeCode" },
    align: "center",
  },
  {
    title: "用户名称",
    dataIndex: "UserTypeName",
    scopedSlots: { customRender: "UserTypeName" },
    align: "center",
  },
  {
    title: "描述",
    dataIndex: "UserTypeDesc",
    scopedSlots: { customRender: "UserTypeDesc" },
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];
import { getUserTypeList, userTypeAction } from "@/services/admin.js";
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
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
        hideOnSinglePage:true,
        pageSizeOptions: ["10", "20", "50", "100"], //每页中显示的数据
        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
      },
      searcValue: "",
      searchForm: this.$form.createForm(this),
      form: {
        UserTypeCode: "",
        UserTypeName: "",
        UserTypeDesc: "",
        Enable: "Y",
      },
      rules: {
        UserTypeCode: [
          {
            required: true,
            message: "请输入用户编码",
            trigger: "blur",
          },
        ],
        UserTypeName: [
          {
            required: true,
            message: "请输入用户名称",
            trigger: "blur",
          },
        ],
      },
      scrollY: "",
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
    this.$nextTick(() => {
      this.scrollY = getTableScroll();
    });
    this.getUserTypeList();
  },
  methods: {
    enableChange(value) {
      this.form.Enable = value.target.value;
    },
    defualtChange(value) {
      this.form.IsDefualt = value.target.value;
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
      this.getUserTypeList();
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
          getUserTypeList(parmas).then((res) => {
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
    getUserTypeList() {
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
      };
      getUserTypeList(parmas).then((res) => {
        if (res.data.success) {
          this.data = res.data.data.list;
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination = pagination;
          this.loading = false;
        }else {
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
    defaultForm() {
      this.form = {
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
      this.form = item;
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            let editForm = {
              UserTypeId: this.form.UserTypeId,
              UserTypeName: this.form.UserTypeName,
              UserTypeDesc: this.form.UserTypeDesc,
              Enable: this.form.Enable,
            };
            userTypeAction(editForm, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.defaultForm();
                this.visible = false;
                this.getUserTypeList();
              }
            });
          } else {
            userTypeAction(this.form, "add").then((res) => {
              if (res.data.success) {
                this.$message.success("添加成功!");
                this.getUserTypeList();
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
          userTypeAction(self.selectedRowKeys, "delete").then((res) => {
            if (res.data.success) {
              self.selectedRowKeys = [];
              self.$message.success("删除成功!");
              self.getUserTypeList();
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
      parmas.push(item.UserTypeId);
      userTypeAction(parmas, "delete").then((res) => {
        if (res.data.success) {
          this.$message.success("删除成功!");
          this.getUserTypeList();
        }
      });
    },
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.getUserTypeList();
    },
  },
};
</script>
<style lang="less">
.ant-form-item {
  margin-bottom: 5px;
}
</style>
