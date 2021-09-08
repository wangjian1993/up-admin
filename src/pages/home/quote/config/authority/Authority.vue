<!--
 * @Author: max
 * @Date: 2021-08-06 15:34:43
 * @LastEditTime: 2021-09-08 16:27:45
 * @LastEditors: max
 * @Description: 权限
 * @FilePath: /up-admin/src/pages/home/quote/config/authority/Authority.vue
-->
<template>
  <!-- 搜索 -->
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
                      placeholder="请输入应用类型编码/名称"
                      allowClear
                      style="width: 300px"
                      v-decorator="[
                        'searcValue',
                        {
                          rules: [{ required: true, message: '请输入应用类型编码/名称!' }],
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
    <!-- 添加编辑弹窗框 -->
    <div>
      <a-modal :title="isEdit ? '编辑权限' : '添加权限'" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel">
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item ref="EnterId" has-feedback label="需求公司" prop="EnterId">
            <a-select
              v-model="form.EnterId"
              style="width: 250px"
              placeholder="请选择需求公司"
              @change="enterChange"
              @blur="
                () => {
                  $refs.EnterId.onFieldBlur();
                }
              "
            >
              <a-select-option v-for="item in enterList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item ref="PermissionTypeCode" has-feedback label="权限类型" prop="PermissionTypeCode">
            <a-select
              v-model="form.PermissionTypeCode"
              style="width: 250px"
              placeholder="请选择权限类型"
              @change="typeChange"
              @blur="
                () => {
                  $refs.PermissionTypeCode.onFieldBlur();
                }
              "
            >
              <a-select-option :value="item.ParamCode" v-for="(item, index) in permissionType" :key="index">
                {{ item.ParamName }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item ref="AppTypeCode" has-feedback label="权限名称" prop="AppTypeCode">
            <template v-for="(tag, index) in nametags">
              <a-tag :key="tag.Id" :closable="true" @close="() => handleClose(index, 1)">
                {{ tag.Name }}
              </a-tag>
            </template>
            <a-tag style="background: #fff; borderStyle: dashed;" @click="addPermissionName"> <a-icon type="plus" />添加</a-tag>
          </a-form-model-item>
          <a-form-model-item ref="AppTypeCode" has-feedback label="产品大类" prop="AppTypeCode">
            <template v-for="(tag, index) in categorytags">
              <a-tag :key="tag.MitemCategoryId" :closable="true" @close="() => handleClose(index, 2)">
                {{ tag.MitemCategoryName }}
              </a-tag>
            </template>
            <a-tag style="background: #fff; borderStyle: dashed;" @click="addPermissionClassify"> <a-icon type="plus" />添加</a-tag>
          </a-form-model-item>
          <a-form-model-item ref="" label="操作权限">
            <a-checkbox-group v-model="actionValue" :options="actionList" :default-value="actionValue" @change="actionChange" />
          </a-form-model-item>
          <a-form-model-item ref="Remarks" label="描述">
            <a-textarea v-model="form.Remarks" placeholder="请输入权限描述" :auto-size="{ minRows: 3, maxRows: 5 }" />
          </a-form-model-item>
          <a-form-model-item ref="Enable" label="是否启用">
            <a-radio-group :value="form.Enable" button-style="solid" @change="enableChange">
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
        :scroll="{ y: true }"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        :rowKey="(data) => data.QuotePermissionId"
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
      <a-empty v-else description="暂无权限" />
    </div>
    <!-- 查看详情 -->
    <div>
      <a-drawer width="400" placement="right" :closable="true" :visible="isDrawer" @close="onClose">
        <a-descriptions title="权限详情" :column="1">
          <a-descriptions-item label="需求公司">{{ drawerItem.EnterName }}</a-descriptions-item>
          <a-descriptions-item label="权限类型">{{ drawerItem.PerMissionTypeName }}</a-descriptions-item>
          <a-descriptions-item label="权限名称">{{ drawerItem.PermissionNames }}</a-descriptions-item>
          <a-descriptions-item label="产品大类">{{ drawerItem.MitemCategoryNames }}</a-descriptions-item>
          <a-descriptions-item label="权限">{{ drawerItem.OperationNames }}</a-descriptions-item>
          <a-descriptions-item label="是否启用">
            <div>
              <a-tag color="green" v-if="drawerItem.Enable == 'Y'">启用</a-tag>
              <a-tag color="red" v-else>禁用</a-tag>
            </div>
          </a-descriptions-item>
          <a-descriptions-item label="描述">{{ drawerItem.Remarks }}</a-descriptions-item>
          <a-descriptions-item label="添加人">{{ drawerItem.UserCreated }}</a-descriptions-item>
          <a-descriptions-item label="添加时间">{{ drawerItem.DateTimeCreated }}</a-descriptions-item>
        </a-descriptions>
      </a-drawer>
    </div>
    <!-- 添加权限名字 -->
    <autho-type v-if="isAuthoName" @closeModal="closeModal" @okModal="okModal" :enterArray="enterArray" :typeArray="typeArray"></autho-type>
    <!-- 大类弹窗 -->
    <category v-if="isCategory" @closeModal="closeModal" @okModal="okModal" :enterArray="enterArray"></category>
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
    title: "需求公司",
    dataIndex: "EnterName",
    scopedSlots: { customRender: "EnterName" },
    align: "center",
  },
  {
    title: "权限类型",
    dataIndex: "PerMissionTypeName",
    scopedSlots: { customRender: "PerMissionTypeName" },
    align: "center",
  },
  {
    title: "权限名称",
    dataIndex: "PermissionNames",
    scopedSlots: { customRender: "PermissionNames" },
    align: "center",
  },
  {
    title: "产品大类",
    dataIndex: "MitemCategoryNames",
    scopedSlots: { customRender: "MitemCategoryNames" },
    align: "center",
  },
  {
    title: "权限",
    dataIndex: "OperationNames",
    scopedSlots: { customRender: "OperationNames" },
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "Enable",
    scopedSlots: { customRender: "enable" },
    align: "center",
  },
  {
    title: "备注",
    dataIndex: "Remarks",
    scopedSlots: { customRender: "Remarks" },
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];
import { getQuotePermission, quotePermissionAction, getDemandEnter } from "@/services/web.js";
import { getParamData } from "@/services/admin.js";
import { renderStripe } from "@/utils/stripe.js";
import AuthoType from "./AuthoType.vue";
import Category from "./Category.vue";
export default {
  components: { AuthoType, Category },
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
        EnterId: "",
        PermissionTypeCode: "",
        PermissionOrgOrUserList: [],
        PermissionMitemCategoryList: [],
        OperationCodes: "",
        Remarks: "",
        Enable: "Y",
      },
      rules: {
        EnterId: [
          {
            required: true,
            message: "请输入需求公司",
            trigger: "blur",
          },
        ],
        PermissionTypeCode: [
          {
            required: true,
            message: "请输入权限类型",
            trigger: "blur",
          },
        ],
      },
      enterList: [],
      enterpriseid: "",
      permissionType: [],
      isAuthoName: false, //名称弹窗
      isCategory: false,
      enterArray: [], //选中需求公司
      typeArray: [], //权限类型选择
      nametags: [],
      categorytags: [],
      actionList: [],
      actionStr: [],
      actionValue: [],
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
    this.getAuthoData();
    this.getDemandEnter();
  },
  methods: {
    getDemandEnter() {
      let parmas = {
        entertypecode: "COMPANY",
      };
      let parmas2 = {
        groupcode: "QUOTE_PERMISSION_TYPE",
      };
      let parmas3 = {
        groupcode: "FEB_QUOTE_PERMISSION",
      };
      getParamData(parmas2).then((res) => {
        if (res.data.success) {
          this.permissionType = res.data.data;
        }
      });
      getParamData(parmas3).then((res) => {
        if (res.data.success) {
          res.data.data.forEach((items) => {
            this.actionList.push({
              label: items.ParamName,
              value: items.ParamCode,
            });
          });
        }
      });
      getDemandEnter(parmas).then((res) => {
        if (res.data.success) {
          this.enterList = res.data.data;
          this.enterpriseid = this.enterList[0].EnterId;
        }
      });
    },
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
      this.getAuthoData();
      this.searchForm.resetFields();
    },
    //关键词搜索
    search() {
      this.loading = true;
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
          getQuotePermission(parmas, "getall").then((res) => {
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
    getAuthoData() {
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
      };
      getQuotePermission(parmas, "getall").then((res) => {
        if (res.data.success) {
          this.data = res.data.data.list;
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
      this.visible = true;
    },
    //初始化表单
    defaultForm() {
      this.form = {
        EnterId: "",
        PermissionTypeCode: "",
        PermissionOrgOrUserList: [],
        PermissionMitemCategoryList: [],
        OperationCodes: "",
        Remarks: "",
        Enable: "Y",
      };
    },
    //关闭对话框
    handleCancel() {
      this.visible = false;
      this.nametags = [];
      this.categorytags = [];
    },
    //编辑
    edit(item) {
      this.visible = true;
      this.isEdit = true;
      this.nametags = [];
      this.categorytags = [];
      let parmas = { id: item.QuotePermissionId };
      getQuotePermission(parmas, "getsingle").then((res) => {
        if (res.data.success) {
          this.form = res.data.data;
          //获取名称,大类编辑id
          let MitemCategoryIds = this.form.MitemCategoryIds.split(",");
          let PermissionIds = this.form.PermissionIds.split(",");
          let MitemCategoryNames = this.form.MitemCategoryNames.split(",");
          let PermissionNames = this.form.PermissionNames.split(",");
          for (let i = 0; i < MitemCategoryIds.length; i++) {
            this.categorytags.push({
              MitemCategoryName: MitemCategoryNames[i],
              MitemCategoryId: MitemCategoryIds[i],
            });
          }
          for (let i = 0; i < PermissionIds.length; i++) {
            this.nametags.push({
              Name: PermissionNames[i],
              Id: PermissionIds[i],
            });
          }
          //操作权限
          this.actionValue = this.form.OperationCodes.split(",");
          //需求公司
          this.enterArray = {
            EnterId: this.form.EnterId,
            EnterName: this.form.EnterName,
          };
          //权限类型
          this.typeArray = {
            ParamName: this.form.PerMissionTypeName,
            ParamCode: this.form.PermissionTypeCode,
          };
        }
      });
    },
    //弹框确认按钮
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          //编辑
          if (this.nametags.length == 0) {
            this.$message.warning("请先添加权限名称!");
            return;
          }
          if (this.categorytags.length == 0) {
            this.$message.warning("请先添加产品大类!");
            return;
          }
          if (this.form.OperationCodes == "") {
            this.$message.warning("请先选择操作权限!");
            return;
          }
          if (this.isEdit) {
            let editForm = {
              QuotePermissionId: this.form.QuotePermissionId,
              EnterId: this.form.EnterId,
              PermissionTypeCode: this.form.PermissionTypeCode,
              OperationCodes: this.form.OperationCodes,
              Remarks: this.form.Remarks,
              Enable: this.form.Enable,
              PermissionOrgOrUserList: [],
              PermissionMitemCategoryList: [],
            };
            this.nametags.forEach((item) => {
              editForm.PermissionOrgOrUserList.push({
                Id: item.Id,
              });
            });
            this.categorytags.forEach((item) => {
              editForm.PermissionMitemCategoryList.push({
                MitemCategoryId: item.MitemCategoryId,
              });
            });
            quotePermissionAction(editForm, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.defaultForm();
                this.visible = false;
                this.getAuthoData();
              }
            });
          } else {
            //添加
            this.nametags.forEach((item) => {
              this.form.PermissionOrgOrUserList.push({
                Id: item.Id,
              });
            });
            this.categorytags.forEach((item) => {
              this.form.PermissionMitemCategoryList.push({
                MitemCategoryId: item.MitemCategoryId,
              });
            });
            quotePermissionAction(this.form, "add").then((res) => {
              if (res.data.success) {
                this.$message.success("添加成功!");
                this.getAuthoData();
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
          quotePermissionAction(self.selectedRowKeys, "delete").then((res) => {
            if (res.data.success) {
              self.selectedRowKeys = [];
              self.$message.success("删除成功!");
              self.getAuthoData();
            }
          });
        },
        onCancel() {},
      });
    },
    //单个删除
    onDelete(item) {
      let parmas = [];
      parmas.push(item.QuotePermissionId);
      quotePermissionAction(parmas, "delete").then((res) => {
        if (res.data.success) {
          this.$message.success("删除成功!");
          this.getAuthoData();
        }
      });
    },
    //分页操作
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.getAuthoData();
    },
    //权限名称弹窗
    addPermissionName() {
      if (this.enterArray.length == 0) {
        this.$message.warning("请先选择需求公司!");
        return;
      }
      if (this.typeArray.length == 0) {
        this.$message.warning("请先选择权限类型!");
        return;
      }
      this.isAuthoName = true;
    },
    closeModal() {
      this.isAuthoName = false;
      this.isCategory = false;
    },
    //需求公司选择
    enterChange(e) {
      this.nametags = [];
      this.categorytags = [];
      this.enterArray = this.enterList.find((item) => item.EnterId == e);
    },
    typeChange(e) {
      // this.categorytags = [];
      this.nametags = [];
      this.typeArray = this.permissionType.find((item) => item.ParamCode == e);
    },
    okModal(array, type) {
      this.isAuthoName = false;
      this.isCategory = false;
      if (type == 1) {
        this.nametags = this.nametags.concat(array);
        let map = new Map();
        for (let i of this.nametags) {
          if (!map.has(i.Id)) {
            map.set(i.Id, i);
          }
        }
        this.nametags = [...map.values()];
      } else if (type == 2) {
        this.categorytags = this.categorytags.concat(array);
        let map = new Map();
        for (let i of this.categorytags) {
          if (!map.has(i.MitemCategoryId)) {
            map.set(i.MitemCategoryId, i);
          }
        }
        this.categorytags = [...map.values()];
      }
    },
    handleClose(index, type) {
      if (type == 1) {
        this.nametags.splice(index, 1);
        return;
      }
      this.categorytags.splice(index, 1);
    },
    //大类选择
    addPermissionClassify() {
      if (this.enterArray.length == 0) {
        this.$message.warning("请先选择需求公司!");
        return;
      }
      this.isCategory = true;
    },
    //操作权限
    actionChange(e) {
      this.form.OperationCodes = e.join(",");
    },
  },
};
</script>
<style lang="less">
.ant-form-item {
  margin-bottom: 5px;
}
</style>
