<!--
 * @Author: max
 * @Date: 2021-08-06 15:34:43
 * @LastEditTime: 2021-12-08 09:27:02
 * @LastEditors: max
 * @Description: 菜单管理
 * @FilePath: /up-admin/src/pages/admin/menu/list.vue
-->
<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <div class="search-box">
      <a-row type="flex" justify="space-between">
        <a-col :span="6">
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
        <a-col :sm="24" :md="24" :xl="18">
          <a-form layout="horizontal" :form="searchForm" class="form-box">
            <a-row type="flex" justify="end">
              <a-col
                ><a-form-item style="margin-right:10px">
                  <a-input placeholder="请输入菜单编码/名称" v-decorator="['key']" allowClear />
                </a-form-item>
              </a-col>
              <a-col>
                <a-form-item style="margin-right:10px;width:150px">
                  <a-select v-decorator="['AppId']" placeholder="请选择应用" allowClear>
                    <a-select-option v-for="item in appData" :key="item.AppId" :value="item.AppId">{{ item.AppName }}</a-select-option>
                  </a-select>
                </a-form-item></a-col
              >
              <a-col>
                <a-form-item style="width:150px"
                  ><a-select placeholder="请选择应用类型" v-decorator="['AppTypeId']" allowClear>
                    <a-select-option v-for="item in appTypeData" :key="item.AppTypeId" :value="item.AppTypeId">{{ item.AppTypeName }}</a-select-option>
                  </a-select></a-form-item
                >
              </a-col>
              <a-col>
                <div style="margin-top: 3px">
                  <a-button :disabled="!hasPerm('search')" type="primary" icon="search" style="margin:0 10px" @click="search">搜索</a-button>
                  <a-button :disabled="!hasPerm('search')" @click="reset" icon="reload">重置</a-button>
                </div></a-col
              >
            </a-row>
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
                <a-input style="width: 150px" v-model="form.ModuleLogo" />
                <a-button type="primary" @click="iconSelect()">选择</a-button>
              </a-form-model-item></a-col
            >
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="ModuleTypeCode" label="菜单类型" prop="ModuleTypeCode">
                <a-radio-group v-model="form.ModuleTypeCode" v-for="item in menuList" :key="item.ParamId" @change="menuType">
                  <a-radio :value="item.ParamCode">{{ item.ParamName }}</a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
            <!-- <a-col :span="12">
              <a-form-model-item ref="ConfigTypeCode" label="配置类型" prop="ConfigTypeCode">
                <a-radio-group v-model="form.ConfigTypeCode" v-for="item in configTypeList" :key="item.ParamId">
                  <a-radio :value="item.ParamCode">{{ item.ParamName }}</a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col> -->
          </a-row>
          <a-row v-if="form.ModuleTypeCode == 'button'">
            <a-col :span="24">
              <a-form-model-item ref="buttonType" label="按钮类型" :labelCol="{ span: 3 }">
                <a-radio-group v-model="form.buttonType" v-for="item in buttonTypeList" :key="item.ParamId" @change="buttonType">
                  <a-radio :value="item.ParamValue">{{ item.ParamName }}</a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item ref="AccessTypeCode" :labelCol="{ span: 3 }" label="访问方式" prop="AccessTypeCode">
                <a-radio-group v-model="form.AccessTypeCode" v-for="item in linkTypeList" :key="item.ParamId" :disabled="form.ModuleTypeCode == 'button'" @change="accessType">
                  <a-radio :value="item.ParamCode">{{ item.ParamName }}</a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item v-if="form.ModuleTypeCode != 'button'" ref="component" label="组件路径"><a-input v-model="form.component" placeholder="请输入组件路径" :disabled="form.AccessTypeCode != 'module' || form.ModuleTypeCode == 'catalogue'"/></a-form-model-item>
              <a-form-model-item v-else ref="component" label="权限标识"><a-input v-model="form.component" placeholder="请输入组件路径"/></a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item ref="UserTypeName" label="菜单路径"><a-input :disabled="form.ModuleTypeCode == 'button'" v-model="form.ModuleUrl" placeholder="请输入菜单路径"/></a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <!-- <a-col :span="12">
              <a-form-model-item ref="UserTypeName" label="菜单参数"><a-input :disabled="form.ModuleTypeCode == 'button'" v-model="form.ModuleParam" placeholder="请输入菜单参数"/></a-form-model-item>
            </a-col> -->
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
        v-if="hasPerm('search')"
        :columns="columns"
        :data-source="data"
        size="small"
        :scroll="{ y: scrollY }"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        rowKey="ModuleId"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
        bordered
        className="{style.tableStyle}"
      >
        <template slot="enable" slot-scope="text">
          <div>
            <a-tag color="green" v-if="text == 'Y'">启用</a-tag>
            <a-tag color="red" v-else>禁用</a-tag>
          </div>
        </template>
        <template slot="ModuleLogo" slot-scope="text">
          <div>
            <a-icon :type="text" />
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
            <a style="margin-right: 8px" @click="submenu(record)" :disabled="!hasPerm('addSub')">
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
      <a-empty v-else description="暂无权限" />
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
    align: "left",
    width: "15%",
  },
  {
    title: "菜单编码",
    dataIndex: "ModuleCode",
    scopedSlots: { customRender: "ModuleCode" },
    align: "center",
    width: "15%",
  },
  {
    title: "上级菜单",
    dataIndex: "SuperiorName",
    scopedSlots: { customRender: "SuperiorName" },
    align: "center",
    width: "10%",
  },
  {
    title: "页面路径",
    dataIndex: "ModuleUrl",
    scopedSlots: { customRender: "ModuleUrl" },
    align: "center",
    width: "20%",
  },
  {
    title: "图标",
    dataIndex: "ModuleLogo",
    scopedSlots: { customRender: "ModuleLogo" },
    align: "center",
    width: "5%",
  },
  {
    title: "排序",
    dataIndex: "SortNo",
    scopedSlots: { customRender: "SortNo" },
    align: "center",
    width: "5%",
  },
  {
    title: "应用名称",
    dataIndex: "AppName",
    scopedSlots: { customRender: "AppName" },
    align: "center",
    width: "5%",
  },
  {
    title: "应用类型",
    dataIndex: "AppTypeName",
    scopedSlots: { customRender: "AppTypeName" },
    align: "center",
    width: "5%",
  },
  {
    title: "状态",
    dataIndex: "Enable",
    scopedSlots: { customRender: "enable" },
    align: "center",
    width: "5%",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
    width: "20%",
  },
];
import { getMenuList, menuAction, getAppInfoList, getAppTypeList, getParamData, getMenuInfo } from "@/services/admin.js";
import { renderStripe } from "@/utils/stripe.js";
import AppIcon from "@/components/app-icon/AppIcon.vue";
import getTableScroll from "@/utils/setTableHeight";
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
        AppId: "",
        ModuleCode: "",
        ModuleName: "",
        ModuleDesc: "",
        AccessTypeCode: "module",
        component: "",
        ModuleUrl: "",
        ConfigTypeCode: "VueComponent",
        ModuleLogo: "",
        ModuleParam: "",
        ModuleTypeCode: "",
        SuperiorId: "0",
        SortNo: "1",
      },
      appData: [],
      subData: [],
      appTypeData: [],
      scrollY: "",
      menuList: [],
      linkTypeList: [],
      configTypeList: [],
      buttonTypeList: [],
      isSearch: false,
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
    this.$nextTick(() => {
      this.scrollY = getTableScroll();
    });
    this.getMenuList();
    this.getAppInfoList();
    this.getParamData();
  },
  methods: {
    menuType(e) {
      if (e.target.value == "catalogue") {
        this.form.component = "BlankView";
      } else if (e.target.value == "button") {
        this.form.AccessTypeCode = "null";
        this.form.component = "";
      } else {
        this.form.component = "";
      }
    },
    accessType(e) {
      if(e.target.value == "external_links"){
        console.log("1111")
        this.form.component = "OpenView";
      }else if(e.target.value == "interior_link"){
        this.form.component = "IframeView";
      }else if(e.target.value == "null"){
        this.form.component = "null";
      }
       console.log("111",  this.form);
    },
    //按钮类型
    buttonType(e) {
      if (e.target.value == "else") {
        this.form.component = "";
        return;
      }
      this.form.AccessTypeCode = e.target.value;
      this.form.component = e.target.value;
      let code = e.target.value;
      this.buttonTypeList.find((item) => {
        if (item.ParamValue == code) {
          this.form.ModuleName = item.ParamName;
          this.form.ModuleCode = this.subData.ModuleCode + "_" + item.ParamCode;
        }
      });
    },
    getParamData() {
      getParamData({
        groupcode: "BUTTON_TYPE",
      }).then((res) => {
        if (res.data.success) {
          this.buttonTypeList = res.data.data;
        }
      });
      getParamData({
        groupcode: "MODULE_TYPE",
      }).then((res) => {
        if (res.data.success) {
          this.menuList = res.data.data;
        }
      });
      getParamData({
        groupcode: "LINK_TYPE",
      }).then((res) => {
        if (res.data.success) {
          this.linkTypeList = res.data.data;
        }
      });
      getParamData({
        groupcode: "CONFIG_TYPE",
      }).then((res) => {
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
      if (item == "无") {
        this.form.ModuleLogo = "";
      }
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
      this.pagination.current = 1;
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
              this.isSearch = true;
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
          this.isSearch = false;
        } else {
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
        ConfigTypeCode: "VueComponent",
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
      this.form = [];
    },
    edit(item) {
      console.log(item);
      let parmas = {
        id: item.ModuleId,
      };
      getMenuInfo(parmas).then((res) => {
        if (res.data.success) {
          this.visible = true;
          this.isEdit = true;
          this.title = "编辑菜单";
          this.form = res.data.data;
          if (this.form.AccessTypeCode == "BlankView") {
            this.form.component = "BlankView";
            this.form.AccessTypeCode = "module";
            console.log("111");
          } else {
            if (this.form.AccessTypeCode != "external_links" || this.form.AccessTypeCode != "nternal_link" || this.form.AccessTypeCode != "null") {
              console.log("222", this.form.AccessTypeCode);
              this.form.component = this.form.AccessTypeCode;
              this.form.buttonType = this.form.AccessTypeCode;
              this.form.AccessTypeCode = "module";
            }
          }
        }
      });
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            this.form.AccessTypeCode = this.form.component;
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
              Enable: this.form.Enable,
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
            this.form.AccessTypeCode = this.form.component;
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
          // const params = [];
          // self.selectedRowKeys.forEach((item) => {
          //   params.push(self.data[item].ModuleId);
          // });
          menuAction(self.selectedRowKeys, "delete").then((res) => {
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
      if (this.isSearch) {
        this.search();
        return;
      }
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
