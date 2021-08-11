<!--
 * @Author: max
 * @Date: 2021-07-08 09:23:52
 * @LastEditTime: 2021-08-11 17:29:43
 * @LastEditors: max
 * @Description: 权限管理
 * @FilePath: /up-admin/src/pages/admin/permissions/list.vue
-->
<template>
  <div>
    <a-row>
      <!-- 机构类型 -->
      <a-col style="padding: 0 5px" :span="5">
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <a-row>
            <a-col :xs="12" :sm="8"><span class="card-title">机构类型:</span></a-col>
            <a-col :xs="12" :sm="16">
              <a-select v-model="defaultEnterTypeId" style="width: 120px" @change="enterTypeSelect">
                <a-select-option :value="item.EnterTypeId" v-for="(item, index) in enterTypeData" :key="index">{{ item.EnterTypeName }}</a-select-option>
              </a-select>
            </a-col>
          </a-row>
          <a-row>
            <a-col :xs="24" :sm="24">
              <div style="padding: 10px 0;">
                <a-tree @select="enterTreeClick" v-if="enterTreeData.length" :tree-data="enterTreeData" :replaceFields="replaceFields" default-expand-all :default-selected-keys="enterValue"></a-tree>
                <a-empty v-if="enterTreeData.length == 0" />
              </div>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
      <!-- 组织维度 -->
      <a-col style="padding: 0 5px" :span="5">
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <a-row>
            <a-col :xs="12" :sm="8"><span class="card-title">组织维度:</span></a-col>
            <a-col :xs="12" :sm="16">
              <a-select v-model="defaultOrgDimensionId" style="width: 120px" @change="orgTypeSelect" :disabled="isNotEnter">
                <a-select-option :value="item.OrgDimensionId" v-for="(item, index) in OrganizationData" :key="index">{{ item.OrgDimensionName }}</a-select-option>
              </a-select>
            </a-col>
          </a-row>
          <div style="padding: 10px 0;">
            <a-tree @select="orgTreeClick" v-if="orgTreeData.length" :tree-data="orgTreeData" :replaceFields="replaceFields1" default-expand-all :default-selected-keys="orgValue"></a-tree>
            <a-empty v-if="orgTreeData.length == 0" />
          </div>
        </a-card>
      </a-col>
      <!-- 应用类型 -->
      <a-col style="padding: 0 5px" :span="5">
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <a-row>
            <a-col :xs="12" :sm="6"><span class="card-title">应用类型:</span></a-col>
            <a-col :xs="12" :sm="11">
              <a-select v-model="defaultAppTypeId" style="width: 130px" @change="appTypeSelect" :disabled="isNotEnter">
                <a-select-option :value="item.AppTypeId" v-for="(item, index) in appTypeData" :key="index">{{ item.AppTypeName }}</a-select-option>
              </a-select>
            </a-col>
            <a-col :xs="12" :sm="7"><a-button icon="save" type="primary" style="margin:0 0px;" @click="appTreeSave">保存</a-button></a-col>
          </a-row>
          <div style="padding: 10px 0;">
            <a-tree v-model="expandedKeys" @select="appTreeClick" v-if="appTreeData.length" :tree-data="appTreeData" :replaceFields="replaceFields2" default-expand-all checkable @check="appTreeChange" :default-selected-keys="appValue"></a-tree>
            <a-empty v-if="appTreeData.length == 0" />
          </div>
        </a-card>
      </a-col>
      <!-- 添加 -->
      <div>
        <a-modal :title="isEdit ? '编辑权限' : '添加权限'" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel">
          <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item ref="EnterTypeId" has-feedback label="机构类型" prop="EnterTypeId">
              <a-select v-model="form.EnterTypeId" placeholder="请选择机构类型" @change="enterTypeSelect">
                <a-select-option v-for="item in enterTypeData" :key="item.EnterTypeId">{{ item.EnterTypeName }}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item ref="EnterId" has-feedback label="机构选择" prop="EnterId">
              <a-tree-select v-model="form.EnterId" style="width: 100%" :tree-data="enterTreeData" placeholder="请选择机构" tree-default-expand-all :replaceFields="replaceFields"></a-tree-select>
            </a-form-model-item>
            <a-form-model-item ref="Compartor" has-feedback label="比较符" prop="Compartor">
              <a-select v-model="form.Compartor" placeholder="请选择比较符">
                <a-select-option v-for="item in parmaData" :key="item.ParamValue">{{ item.ParamName }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-form-model>
        </a-modal>
      </div>
      <!-- 列表 -->
      <a-col :span="9">
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <div>
            <a-button type="primary" icon="form" @click="goAdd">添加</a-button>
            <a-button type="primary" :disabled="!hasSelected" @click="allDel" icon="delete" style="margin-left: 8px">删除</a-button>
            <span style="margin-left: 8px">
              <template v-if="hasSelected">
                {{ `共选中 ${selectedRowKeys.length} 条` }}
              </template>
            </span>
          </div>
          <div>
            <a-table
              :columns="columns"
              :data-source="permissionList"
              size="small"
              bordered
              :row-selection="{
                selectedRowKeys: selectedRowKeys,
                onChange: onSelectChange,
              }"
            >
              <template slot="operation">
                <div>
                  <a style="margin-right: 8px">
                    <a-icon type="plus" />
                    新增
                  </a>
                  <a style="margin-right: 8px">
                    <a-icon type="edit" />
                    编辑
                  </a>
                </div>
              </template>
            </a-table>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
const columns = [
  {
    title: "筛选字段",
    dataIndex: "EnterTypeName",
    scopedSlots: { customRender: "EnterTypeName" },
    align: "center",
  },
  {
    title: "比较符",
    dataIndex: "Compartor",
    scopedSlots: { customRender: "Compartor" },
    align: "center",
  },
  {
    title: "字段值",
    dataIndex: "EnterName",
    scopedSlots: { customRender: "EnterName" },
    align: "center",
  },
];
import { getInstitutionList, getEnterTree, getOrganizationList, getOrgTree, getAppTypeList, getAppMdules, getPermissionList, setPermission, getParamData } from "@/services/admin.js";
export default {
  data() {
    return {
      columns,
      editingKey: "",
      autoExpandParent: true,
      selectedKeys: [],
      enterTypeData: [],
      OrganizationData: [],
      appTypeData: [],
      defaultEnterTypeId: null,
      defaultOrgDimensionId: null,
      defaultAppTypeId: null,
      enterTreeData: [],
      orgTreeData: [],
      appTreeData: [],
      isEdit: false,
      visible: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      selectedRowKeys: [],
      replaceFields: {
        title: "EnterName",
        key: "Id",
        value: "Id",
        children: "children",
      },
      replaceFields1: {
        title: "OrgName",
        key: "OrgId",
        value: "OrgId",
        children: "children",
      },
      replaceFields2: {
        title: "Name",
        key: "Id",
        value: "Id",
        children: "children",
      },
      form: {
        EnterTypeId: "",
        EnterId: "",
        Compartor: "=",
        OrgId: "",
      },
      rules: {
        EnterTypeId: [
          {
            required: true,
            message: "请选择机构类型",
            trigger: "change",
          },
        ],
        EnterId: [
          {
            required: true,
            message: "请选择机构",
            trigger: "change",
          },
        ],
        Compartor: [
          {
            required: true,
            message: "请选择比较符",
            trigger: "blur",
          },
        ],
      },
      enterValue: [],
      orgValue: [],
      appValue: [],
      enterid: 0,
      orgdimensionid: 0,
      appTypeId: 0,
      OrgId: 0,
      isNotEnter: false,
      permissionList: [],
      ModuleList: [],
      expandedKeys: [],
      treeJ: 0,
      parmaData: [],
    };
  },
  watch: {
    checkedKeys(val) {
      console.log("onCheck", val);
    },
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  created() {
    this.getData();
    this.getParamData();
  },
  methods: {
    //机构类型
    getData() {
      let parmas = {
        pageindex: 1,
        pagesize: 50,
      };
      getInstitutionList(parmas).then((res) => {
        if (res.data.success) {
          this.enterTypeData = res.data.data.list;
          this.defaultEnterTypeId = res.data.data.list[0].EnterTypeId;
          this.getEnterTree();
        }
      });
      getOrganizationList(parmas).then((res) => {
        if (res.data.success) {
          this.OrganizationData = res.data.data.list;
          this.defaultOrgDimensionId = res.data.data.list[0].OrgDimensionId;
          this.orgdimensionid = res.data.data.list[0].OrgDimensionId;
        }
      });
      getAppTypeList(parmas).then((res) => {
        if (res.data.success) {
          this.appTypeData = res.data.data.list;
          this.defaultAppTypeId = res.data.data.list[0].AppTypeId;
          this.appTypeId = res.data.data.list[0].AppTypeId;
        }
      });
    },
    //机构列表
    getEnterTree() {
      let parmas = {
        entertypeid: this.defaultEnterTypeId,
      };
      getEnterTree(parmas).then((res) => {
        if (res.data.success) {
          this.enterTreeData = res.data.data;
          // console.log('this.enterTreeData ', this.enterTreeData);
          //没有机构
          if (this.enterTreeData.length == 0) {
            this.orgTreeData = [];
            this.appTreeData = [];
            this.isNotEnter = true;
            return;
          }
          this.isNotEnter = false;
          this.enterValue.push(this.enterTreeData[0].Id);
          this.enterid = this.enterTreeData[0].Id;
          // console.log('this.enterid===', this.enterid);
          this.getOrgTree();
        }
      });
    },
    //获取组织维度
    getOrgTree() {
      let parmas = {
        enterid: this.enterid,
        orgdimensionid: this.orgdimensionid,
      };
      getOrgTree(parmas).then((res) => {
        if (res.data.success) {
          this.orgTreeData = res.data.data;
          if (this.orgTreeData.length == 0) {
            return;
          }
          this.orgValue.push(this.orgTreeData[0].OrgId);
          // console.log('this.orgValue', this.orgValue);
          this.OrgId = this.orgTreeData[0].OrgId;
          // console.log('this.OrgId===', this.OrgId);
          this.getAppMdules();
          this.getPermissionList();
        }
      });
    },
    //获取应用类型
    getAppMdules() {
      let parmas = {
        orgid: this.OrgId,
        apptypeid: this.appTypeId,
      };
      getAppMdules(parmas).then((res) => {
        if (res.data.success) {
          this.appTreeData = res.data.data;
          this.bianli(this.appTreeData);
          this.appValue.push(this.appTreeData[0].Id);
        }
      });
    },
    getParamData() {
      let parmas = {
        groupcode: "OPERATORS_CODE",
      };
      getParamData(parmas).then((res) => {
        if (res.data.success) {
          this.parmaData = res.data.data;
        }
      });
    },
    bianli(checkedData) {
      for (var i in checkedData) {
        //过滤，只处理满足此条件的，不需要过滤则去掉这层if
        if (checkedData[i].OrgId != null) {
          this.expandedKeys[this.treeJ++] = checkedData[i].Id;
        }
        if (checkedData[i].children) {
          this.bianli(checkedData[i].children);
        } else {
          continue;
        }
      }
      return;
    },
    //获取权限列表
    getPermissionList() {
      let parmas = {
        orgid: this.OrgId,
      };
      getPermissionList(parmas).then((res) => {
        if (res.data.success) {
          this.permissionList = res.data.data;
        }
      });
    },
    defaultForm() {
      this.form = {
        EnterTypeId: "",
        EnterId: "",
        Compartor: "=",
        OrgId: "",
      };
    },
    //机构选择
    enterTreeClick(e) {
      this.enterid = e[0];
      this.getOrgTree();
      this.orgTreeData = [];
      this.appTreeData = [];
      this.orgValue = [];
    },
    //组织选择
    orgTreeClick(e) {
      console.log("组织切换====");
      this.OrgId = e[0];
      this.getAppMdules();
      this.appTreeData = [];
      this.appValue = [];
      this.expandedKeys =[];
      this.getPermissionList();
    },
    //应用选择
    appTreeClick(e) {
      console.log(e);
    },
    //机构类型选择
    enterTypeSelect(e) {
      this.defaultEnterTypeId = e;
      this.getEnterTree();
    },
    //组织类型选择
    orgTypeSelect(e) {
      this.orgdimensionid = e;
      this.orgTreeData = [];
      this.appTreeData = [];
      this.orgValue = [];
      this.getOrgTree();
    },
    //应用类型选择
    appTypeSelect(e) {
      this.appTypeId = e;
      this.appTreeData = [];
      this.appValue = [];
      this.getAppMdules();
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onCheck(checkedKeys) {
      // console.log('onCheck', checkedKeys);
      this.checkedKeys = checkedKeys;
    },
    goAdd() {
      this.visible = true;
    },
    onSelect(selectedKeys, info) {
      console.log("onSelect", info);
      this.selectedKeys = selectedKeys;
    },
    handleOk() {
      let parmas = {
        EnterTypeId: this.form.EnterTypeId,
        EnterId: this.form.EnterId,
        Compartor: this.form.Compartor,
        OrgId: this.OrgId,
      };
      setPermission(parmas, "add").then((res) => {
        if (res.data.success) {
          this.$message.success("添加成功!");
          this.getPermissionList();
          this.visible = false;
          this.defaultForm();
        }
      });
    },
    handleCancel() {
      this.visible = false;
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    appTreeChange(key, e) {
      // console.log(key);
      let list = e.checkedNodes;
      let result = [];
      list.filter((item) => {
        result.push({
          ModuleId: item.key,
          ModuleCode: item.data.props.Code,
          Type: item.data.props.Type,
        });
      });
      console.log(result);
      this.ModuleList = result;
    },
    appTreeSave() {
      let parmas = {
        OrgId: this.OrgId,
        ModuleList: this.ModuleList,
      };
      setPermission(parmas, "setpermission").then((res) => {
        if (res.data.success) {
          this.$message.success("设置成功!");
          this.ModuleList = [];
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
          console.log(self.selectedRowKeys);
          self.selectedRowKeys.forEach((item) => {
            console.log(self.permissionList[item])
            params.push({
              EnterTypeId: self.permissionList[item].EnterTypeId,
              EnterId: self.permissionList[item].EnterId,
              Compartor: self.permissionList[item].Compartor,
              OrgId: self.permissionList[item].OrgId,
            });
          });
          setPermission(params, "delete").then((res) => {
            if (res.data.success) {
              self.selectedRowKeys = [];
              self.$message.success("删除成功!");
              self.getPermissionList();
            }
          });
        },
        onCancel() {},
      });
    },
  },
  components: {},
};
</script>

<style lang="less" scoped>
.left-list {
  padding: 10px 20px;
  text-align: center;
  p {
    font-size: 12px;
    color: @title-color;
    span {
      padding-left: 10px;
      &:hover {
        color: @primary-color;
        // background: @theme-color;
        cursor: pointer;
      }
    }
  }
}
.list-tab {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  p {
    height: 30px;
    line-height: 30px;
    color: @title-color;
    font-size: 12px;
    &:hover {
      color: @primary-color;
      cursor: pointer;
    }
  }
}
.card-title {
  display:inline-block;
  padding: 0 10px;
  height: 32px;
  display: flex;
  align-items: center;
}
</style>
