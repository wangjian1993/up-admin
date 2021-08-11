<!--
 * @Author: max
 * @Date: 2021-08-06 15:34:43
 * @LastEditTime: 2021-08-11 11:04:20
 * @LastEditors: max
 * @Description: 菜单管理
 * @FilePath: /up-admin/src/pages/admin/menu/list.vue
-->
<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <div class="search-box">
      <a-row>
        <a-col :span="6">
          <div>
            <a-button @click="add" type="primary" icon="form">添加</a-button>
            <a-button type="primary" :disabled="!hasSelected" :loading="loading" @click="allDel" icon="delete" style="margin-left: 8px">删除</a-button>
            <span style="margin-left: 8px">
              <template v-if="hasSelected">
                {{ `共选中 ${selectedRowKeys.length} 条` }}
              </template>
            </span>
          </div>
        </a-col>
        <a-col :span="18">
          <a-form layout="horizontal" :form="searchForm">
            <div>
              <a-col :md="6" :sm="24">
                <a-form-item label="菜单编码/名称" :labelCol="{ span: 9 }" :wrapperCol="{ span: 14, offset: 1 }">
                  <a-input placeholder="请输入" v-decorator="['key']" allowClear />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="应用" :labelCol="{ span: 6 }" :wrapperCol="{ span: 14, offset: 1 }">
                  <a-select v-decorator="['AppId']" placeholder="请选择应用" allowClear>
                    <a-select-option v-for="item in appData" :key="item.AppId" :value="item.AppId">{{ item.AppName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="应用类型" :labelCol="{ span: 6 }" :wrapperCol="{ span: 14, offset: 1 }">
                  <a-select placeholder="请选择应用类型" v-decorator="['AppTypeId']" allowClear>
                    <a-select-option v-for="item in appTypeData" :key="item.AppTypeId" :value="item.AppTypeId">{{ item.AppTypeName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </div>
            <span style="float: right; margin-top: 3px;">
              <a-button type="primary" @click="search">查询</a-button>
              <a-button style="margin-left: 8px" @click="reset">重置</a-button>
            </span>
          </a-form>
        </a-col>
      </a-row>
    </div>
    <div>
      <a-modal :title="isEdit ? '编辑菜单' : '添加菜单'" v-if="visible" :width="840" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel">
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="AppId" has-feedback label="应用" v-if="isSub && !isEdit"><a-input v-model="subData.AppName" :disabled="isSub"/></a-form-model-item
            ></a-col>
            <a-col :span="12"
              ><a-form-model-item ref="SuperiorId" label="上级菜单" v-if="isSub && !isEdit"><a-input v-model="subData.ModuleName" :disabled="isSub"/></a-form-model-item
            ></a-col>
          </a-row>
          <a-row>
            <a-col :span="12"
              ><a-form-model-item ref="AppId" has-feedback label="应用" prop="AppId" v-if="!isSub">
                <a-select v-model="form.AppId" placeholder="请选择应用">
                  <a-select-option v-for="item in appData" :key="item.AppId" :value="item.AppId">{{ item.AppName }}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item ref="ModuleName" has-feedback label="菜单名称" prop="ModuleName">
                <a-input
                  v-model="form.ModuleName"
                  placeholder="请输入菜单名称"
                  allowClear
                  @blur="
                    () => {
                      $refs.ModuleName.onFieldBlur();
                    }
                  "
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="ModuleCode" has-feedback label="菜单编码" prop="ModuleCode">
                <a-input
                  v-model="form.ModuleCode"
                  :disabled="isEdit"
                  allowClear
                  placeholder="请输入菜单编码"
                  @blur="
                    () => {
                      $refs.ModuleCode.onFieldBlur();
                    }
                  "
                /> </a-form-model-item
            ></a-col>
            <a-col :span="12">
              <a-form-model-item ref="ModuleLogo" label="图标">
                <a-input style="width: 150px" disabled v-model="form.ModuleLogo" />
                <a-button type="primary" @click="iconSelect()">选择</a-button>
              </a-form-model-item></a-col
            >
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="ModuleTypeCode" label="菜单类型" prop="ModuleTypeCode">
                <a-radio-group v-model="form.ModuleTypeCode" v-for="item in menuList" :key="item.ParamId">
                  <a-radio :value="item.ParamCode">{{ item.ParamName }}</a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item ref="ConfigTypeCode" label="配置类型" prop="ConfigTypeCode">
                <a-radio-group v-model="form.ConfigTypeCode" v-for="item in configTypeList" :key="item.ParamId">
                  <a-radio :value="item.ParamCode">{{ item.ParamName }}</a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item ref="AccessTypeCode" :labelCol="{ span: 3 }" label="访问方式" prop="AccessTypeCode">
                <a-radio-group v-model="form.AccessTypeCode" v-for="item in linkTypeList" :key="item.ParamId">
                  <a-radio :value="item.ParamCode">{{ item.ParamName }}</a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="component" label="组件路径"><a-input v-model="form.component" placeholder="请输入组件路径" :disabled="form.AccessTypeCode != 'module'" /></a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item ref="UserTypeName" label="菜单路径"><a-input v-model="form.ModuleUrl" placeholder="请输入菜单路径"/></a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="UserTypeName" label="菜单参数"><a-input v-model="form.ModuleParam" placeholder="请输入菜单参数"/></a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item ref="Enable" label="是否启用">
                <a-radio-group :value="form.Enable" default-value="Y" button-style="solid" @change="enableChange">
                  <a-radio-button value="N">否</a-radio-button>
                  <a-radio-button value="Y">是</a-radio-button>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="SortNo" has-feedback label="序号">
                <a-input-number
                  id="SortNo"
                  v-model="form.SortNo"
                  :min="1"
                  placeholder="请输入序号"
                  @blur="
                    () => {
                      $refs.SortNo.onFieldBlur();
                    }
                  "
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item ref="ModuleDesc" label="描述">
                <a-textarea v-model="form.ModuleDesc" placeholder="请输入菜单描述" :auto-size="{ minRows: 3, maxRows: 5 }" />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </a-modal>
    </div>
    <app-icon v-if="isIcon" @closeModal="closeModal" @iconClick="iconClick"></app-icon>
    <!-- 列表 -->
    <div class="tab">
      <a-table
        :columns="columns"
        :data-source="data"
        size="small"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        rowKey="ModuleId"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
        bordered
      >
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
        <template slot="ModuleLogo" slot-scope="text">
          <div><a-icon :type="text" :style="{ fontSize: '14px' }" /></div>
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
            <a style="margin-right: 8px" @click="submenu(record)">
              <a-icon type="plus-circle" />
              添加子菜单
            </a>
            <a style="margin-right: 8px" @click="detail(record)">
              <a-icon type="profile" />
              查看
            </a>
          </div>
        </template>
      </a-table>
    </div>
    <!-- 查看详情 -->
    <div>
      <a-drawer width="400" placement="right" :closable="true" :visible="isDrawer" @close="onClose">
        <a-descriptions title="菜单详情" :column="1">
          <a-descriptions-item label="菜单编码">{{ drawerItem.ModuleCode }}</a-descriptions-item>
          <a-descriptions-item label="菜单名称">{{ drawerItem.ModuleName }}</a-descriptions-item>
          <a-descriptions-item label="应用">{{ drawerItem.AppName }}</a-descriptions-item>
          <a-descriptions-item label="图标"><a-icon :type="drawerItem.ModuleLogo"/></a-descriptions-item>
          <a-descriptions-item label="菜单类型">{{ drawerItem.ModuleTypeName }}</a-descriptions-item>
          <a-descriptions-item label="访问方式">{{ drawerItem.AccessTypeName }}</a-descriptions-item>
          <a-descriptions-item label="配置类型">{{ drawerItem.ConfigTypeName }}</a-descriptions-item>
          <a-descriptions-item label="菜单路径">{{ drawerItem.ModuleUrl }}</a-descriptions-item>
          <a-descriptions-item label="菜单参数">{{ drawerItem.ModuleParam }}</a-descriptions-item>
          <a-descriptions-item label="描述">{{ drawerItem.ModuleDesc }}</a-descriptions-item>
          <a-descriptions-item label="是否启用">
            <div>
              <a-tag color="green" v-if="drawerItem.Enable == 'Y'">启用</a-tag>
              <a-tag color="red" v-else>禁用</a-tag>
            </div>
          </a-descriptions-item>
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
    title: "菜单名称",
    dataIndex: "ModuleName",
    scopedSlots: { customRender: "ModuleName" },
    align: "center",
  },
  {
    title: "菜单编码",
    dataIndex: "ModuleCode",
    scopedSlots: { customRender: "ModuleCode" },
    align: "center",
  },
  {
    title: "上级菜单",
    dataIndex: "SuperiorName",
    scopedSlots: { customRender: "SuperiorName" },
    align: "center",
  },
  {
    title: "页面路径",
    dataIndex: "ModuleUrl",
    scopedSlots: { customRender: "ModuleUrl" },
    align: "center",
  },
  {
    title: "图标",
    dataIndex: "ModuleLogo",
    scopedSlots: { customRender: "ModuleLogo" },
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];
import { getMenuList, menuAction, getAppInfoList, getAppTypeList, getParamData } from "@/services/admin.js";
import { renderStripe } from "@/utils/stripe.js";
import AppIcon from "@/components/app-icon/AppIcon.vue";
export default {
  components: { AppIcon },
  data() {
    return {
      data: [],
      columns,
      isEdit: false,
      isSub: false,
      editForm: [],
      title: "添加菜单",
      loading: true,
      isDrawer: false,
      selectedRowKeys: [], // Check here to configure the default column
      visible: false,
      drawerItem: [],
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      isIcon: false,
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10, //每页中显示10条数据
        showSizeChanger: true,
        showLessItems: true,
        showQuickJumper: true,
        pageSizeOptions: ["10", "20", "50", "100"], //每页中显示的数据
        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
      },
      searcValue: "",
      searchForm: this.$form.createForm(this),
      form: {
        AppId: "",
        ModuleCode: "",
        ModuleName: "",
        ModuleDesc: "",
        AccessTypeCode: "module",
        component: "",
        ModuleUrl: "",
        ConfigTypeCode: "",
        ModuleLogo: "",
        ModuleParam: "",
        ModuleTypeCode: "",
        SuperiorId: "0",
        SortNo: "1",
      },
      appData: [],
      subData: [],
      appTypeData: [],
      rules: {
        AppId: [
          {
            required: true,
            message: "请选择应用",
            trigger: "blur",
          },
        ],
        ModuleName: [
          {
            required: true,
            message: "请输入菜单名称",
            trigger: "blur",
          },
        ],
        ModuleCode: [
          {
            required: true,
            message: "请输入菜单编码",
            trigger: "blur",
          },
        ],
        ModuleTypeCode: [
          {
            required: true,
            message: "请选择菜单类型",
            trigger: "blur",
          },
        ],
        AccessTypeCode: [
          {
            required: true,
            message: "请选择访问方式",
            trigger: "blur",
          },
        ],
        ConfigTypeCode: [
          {
            required: true,
            message: "请选择配置类型",
            trigger: "blur",
          },
        ],
        menuList: [],
        linkTypeList: [],
        configTypeList: [],
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
    this.getMenuList();
    this.getAppInfoList();
    this.getParamData();
  },
  methods: {
    getParamData() {
      let parmas = {
        groupcode: "MODULE_TYPE",
      };
      let parmas2 = {
        groupcode: "LINK_TYPE",
      };
      let parmas3 = {
        groupcode: "CONFIG_TYPE",
      };
      getParamData(parmas).then((res) => {
        if (res.data.success) {
          this.menuList = res.data.data;
        }
      });
      getParamData(parmas2).then((res) => {
        if (res.data.success) {
          this.linkTypeList = res.data.data;
        }
      });
      getParamData(parmas3).then((res) => {
        if (res.data.success) {
          this.configTypeList = res.data.data;
        }
      });
    },
    iconSelect() {
      this.isIcon = true;
    },
    closeModal() {
      this.isIcon = false;
    },
    iconClick(item) {
      this.form.ModuleLogo = item;
      this.isIcon = false;
    },
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
      this.getMenuList();
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
            apptypeid: values.AppTypeId,
            appid: values.AppId,
            keyword: values.key,
          };
          getMenuList(parmas).then((res) => {
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
    getAppInfoList() {
      let parmas = {
        pageindex: 1,
        pagesize: 50,
      };
      getAppInfoList(parmas).then((res) => {
        if (res.data.success) {
          this.appData = res.data.data.list;
        }
      });

      getAppTypeList(parmas).then((res) => {
        if (res.data.success) {
          this.appTypeData = res.data.data.list;
        }
      });
    },
    //获取机构类型列表
    getMenuList() {
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
      };
      getMenuList(parmas).then((res) => {
        if (res.data.success) {
          this.data = res.data.data.list;
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination = pagination;
          this.loading = false;
        }
      });
    },
    //打开对话框
    add() {
      this.defaultForm();
      this.isEdit = false;
      this.title = "添加菜单";
      this.visible = true;
      this.isSub = false;
      this.form.SuperiorId = "0";
    },
    submenu(item) {
      this.defaultForm();
      this.isEdit = false;
      this.title = "添加菜单";
      this.visible = true;
      this.isSub = true;
      this.subData = item;
    },
    defaultForm() {
      this.form = {
        AppId: "",
        ModuleCode: "",
        ModuleName: "",
        ModuleDesc: "",
        AccessTypeCode: "module",
        component: "",
        ModuleUrl: "",
        ConfigTypeCode: "",
        ModuleLogo: "",
        ModuleParam: "",
        ModuleTypeCode: "",
        SuperiorId: "0",
        SortNo: "1",
      };
    },
    //关闭对话框
    handleCancel() {
      this.visible = false;
    },
    edit(item) {
      this.visible = true;
      this.isEdit = true;
      this.title = "编辑菜单";
      this.form = item;
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            if (this.form.AccessTypeCode == "module") {
              this.form.AccessTypeCode = this.form.component;
            }
            let editForm = {
              ModuleId: this.form.ModuleId,
              AppId: this.form.AppId,
              ModuleName: this.form.ModuleName,
              ModuleDesc: this.form.ModuleDesc,
              AccessTypeCode: this.form.AccessTypeCode,
              ModuleUrl: this.form.ModuleUrl,
              ConfigTypeCode: this.form.ConfigTypeCode,
              ModuleLogo: this.form.ModuleLogo,
              ModuleParam: this.form.ModuleParam,
              ModuleTypeCode: this.form.ModuleTypeCode,
              SuperiorId: this.form.SuperiorId,
              SortNo: this.form.SortNo,
            };
            menuAction(editForm, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.defaultForm();
                this.visible = false;
                this.getMenuList();
              }
            });
          } else {
            if (this.isSub) {
              this.form.SuperiorId = this.subData.ModuleId;
              this.form.AppId = this.subData.AppId;
            }
            if (this.form.AccessTypeCode == "module") {
              this.form.AccessTypeCode = this.form.component;
            }
            console.log(this.form);
            menuAction(this.form, "add").then((res) => {
              if (res.data.success) {
                this.$message.success("添加成功!");
                this.getMenuList();
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
            params.push(self.data[item].ModuleId);
          });
          menuAction(params, "delete").then((res) => {
            if (res.data.success) {
              self.selectedRowKeys = [];
              self.$message.success("删除成功!");
              self.getMenuList();
            }
          });
        },
        onCancel() {},
      });
    },
    //单个删除
    onDelete(item) {
      let parmas = [];
      parmas.push(item.ModuleId);
      menuAction(parmas, "delete").then((res) => {
        if (res.data.success) {
          this.$message.success("删除成功!");
          this.getMenuList();
        }
      });
    },
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.getMenuList();
    },
  },
};
</script>
<style lang="less">
.ant-form-item {
  margin-bottom: 5px;
}
.iconStyle {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
</style>
