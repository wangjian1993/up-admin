<!--
 * @Author: max
 * @Date: 2021-07-08 09:23:52
 * @LastEditTime: 2021-08-20 09:50:40
 * @LastEditors: max
 * @Description: 权限管理
 * @FilePath: /up-admin/src/pages/admin/permissions/list.vue
-->
<template>
  <div>
    <a-row>
      <!-- 机构类型 -->
      <a-col style="padding: 0 5px;" :xs="24" :sm="12" :md="5">
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <a-row>
            <a-col :xs="12" :sm="12"><span class="card-title">机构类型/组织维度:</span></a-col>
            <a-col :xs="12" :sm="12">
              <a-tree-select v-model="defaultEnterTypeId" allowClear style="width: 100%" :tree-data="enterTypeData" :replaceFields="replaceFields1" tree-default-expand-all @change="enterTypeSelect"> </a-tree-select>
            </a-col>
          </a-row>
          <a-row>
            <a-col :xs="24" :sm="24">
              <div style="padding: 10px 0;max-height:84vh;min-height:84vh;overflow:auto">
                <a-tree :default-selected-keys="enterValue" @select="enterTreeClick" v-if="enterTreeData.length" :tree-data="enterTreeData" :replaceFields="replaceFields" default-expand-all></a-tree>
                <a-empty v-if="enterTreeData.length == 0" />
              </div>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
      <!-- 组织维度 -->
      <a-col style="padding: 0 5px;" :xs="24" :sm="12" :md="5">
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <a-row>
            <a-col :xs="12" :sm="12"><span class="card-title">用户类型:</span></a-col>
            <a-col :xs="12" :sm="12">
              <a-select v-model="defaultUserTypeId" style="width: 120px" @change="userTypeSelect" :disabled="isNotEnter">
                <a-select-option :value="item.UserTypeId" v-for="(item, index) in userTypeData" :key="index">{{ item.UserTypeName }}</a-select-option>
              </a-select>
            </a-col>
          </a-row>
          <a-spin tip="加载中..." :spinning="userLoading">
            <div style="padding: 10px 0;max-height:84vh;min-height:84vh;overflow:auto">
              <a-tree @select="userTreeClick" v-if="userTreeData.length" :tree-data="userTreeData" :replaceFields="{ title: 'UserName', key: 'UserId', value: 'UserId', children: 'children' }" default-expand-all></a-tree>
              <a-empty v-if="userTreeData.length == 0" />
            </div>
          </a-spin>
        </a-card>
      </a-col>
      <!-- 应用类型 -->
      <a-col style="padding: 0 5px;" :xs="24" :sm="12" :md="5">
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <a-row>
            <a-col :xs="12" :sm="6"><span class="card-title">应用类型:</span></a-col>
            <a-col :xs="12" :sm="11">
              <a-select v-model="defaultAppTypeId" style="width: 130px" @change="appTypeSelect" :disabled="isNotEnter">
                <a-select-option :value="item.AppTypeId" v-for="(item, index) in appTypeData" :key="index">{{ item.AppTypeName }}</a-select-option>
              </a-select>
            </a-col>
            <a-col :xs="12" :sm="7"><a-button v-if="hasPerm('save')" icon="save" type="primary" style="margin:0 0px;" @click="appTreeSave">保存</a-button></a-col>
          </a-row>
          <div style="padding: 10px 0;max-height:84vh;min-height:84vh;overflow:auto">
            <a-tree v-model="expandedKeys" @select="appTreeClick" v-if="appTreeData.length" :tree-data="appTreeData" :replaceFields="replaceFields2" default-expand-all checkable @check="appTreeChange"></a-tree>
            <a-empty v-if="appTreeData.length == 0" />
          </div>
        </a-card>
      </a-col>
      <!-- 添加 -->
      <div>
        <a-modal :title="isEdit ? '编辑权限' : '添加权限'" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel">
          <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item ref="EnterTypeId" has-feedback label="机构类型" prop="EnterTypeId">
              <a-select v-model="form.EnterTypeId" placeholder="请选择机构类型" @change="addEnterTypeSelect">
                <a-select-option v-for="item in enterTypeList" :key="item.EnterTypeId">{{ item.EnterTypeName }}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item ref="EnterId" has-feedback label="机构选择" prop="EnterId">
              <a-tree-select v-model="form.EnterId" style="width: 100%" :tree-data="enterList" placeholder="请选择机构" tree-default-expand-all :replaceFields="{ title: 'EnterName', key: 'EnterId', value: 'EnterId', children: 'children' }"></a-tree-select>
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
      <a-col :xs="24" :sm="24" :md="9">
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <div>
            <a-button :disabled="!hasPerm('add')" @click="goAdd" type="primary" icon="form">添加</a-button>
            <a-button v-if="hasPerm('delete')" icon="delete" type="primary" :disabled="!hasSelected" :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
            <a-button v-else icon="delete" type="primary" disabled :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
            <span style="margin-left: 8px">
              <template v-if="hasSelected">
                {{ `共选中 ${selectedRowKeys.length} 条` }}
              </template>
            </span>
          </div>
          <div v-if="hasPerm('search')">
            <a-table
              :columns="columns"
              :data-source="permissionList"
              size="small"
              :scroll="{ y: true }"
              bordered
              :row-selection="{
                selectedRowKeys: selectedRowKeys,
                onChange: onSelectChange,
              }"
            >
              <template slot="operation">
                <div>
                  <a style="margin-right: 8px" :disabled="!hasPerm('add')">
                    <a-icon type="plus" />
                    新增
                  </a>
                  <a style="margin-right: 8px" :disabled="!hasPerm('edit')">
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
    width: "30%",
  },
  {
    title: "比较符",
    dataIndex: "Compartor",
    scopedSlots: { customRender: "Compartor" },
    align: "center",
    width: "20%",
  },
  {
    title: "字段值",
    dataIndex: "EnterName",
    scopedSlots: { customRender: "EnterName" },
    align: "center",
    width: "50%",
  },
];
import { getInstitutionList, getAppTypeList, getAppMdules, getPermissionList, setPermission, getParamData, getEnterOrgList, getEnterOrgTree, getUserTypeList, getPermissionUser, getEnterList } from "@/services/admin.js";
export default {
  data() {
    return {
      columns,
      editingKey: "",
      autoExpandParent: true,
      selectedKeys: [],
      enterTypeData: [],
      userTypeData: [],
      appTypeData: [],
      defaultEnterTypeId: null,
      defaultEnterType: null,
      defaultUserTypeId: null,
      defaultAppTypeId: null,
      enterTreeData: [],
      userTreeData: [],
      appTreeData: [],
      isEdit: false,
      visible: false,
      loading: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      selectedRowKeys: [],
      replaceFields: {
        title: "Name",
        key: "Id",
        value: "Id",
        children: "children",
      },
      replaceFields1: {
        title: "TypeName",
        key: "TypeId",
        value: "TypeId",
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
      userValue: [],
      appValue: [],
      enterid: "",
      userTypeId: "",
      appTypeId: "",
      userId: "",
      orgId: "",
      isNotEnter: false,
      permissionList: [],
      ModuleList: [],
      expandedKeys: [],
      treeJ: 0,
      treeA: 0,
      treeArray: [],
      parmaData: [],
      userLoading: true,
      moduleid: "",
      enterTypeList: [],
      enterList: [],
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
      getEnterOrgList().then((res) => {
        if (res.data.success) {
          this.enterTypeData = res.data.data;
          this.defaultEnterTypeId = res.data.data[0].TypeId;
          this.defaultEnterType = res.data.data[0].Type;
          this.getEnterTree();
        }
      });
      let parmas = {
        pageindex: 1,
        pagesize: 50,
      };
      getInstitutionList(parmas).then((res) => {
        if (res.data.success) {
          this.enterTypeList = res.data.data.list;
          this.getEnterList(this.enterTypeList[0].EnterTypeCode);
        }
      });
      getUserTypeList(parmas).then((res) => {
        if (res.data.success) {
          this.userTypeData = res.data.data.list;
          this.defaultUserTypeId = res.data.data.list[0].UserTypeId;
          this.userTypeId = res.data.data.list[0].UserTypeId;
        }
      });
      getAppTypeList(parmas).then((res) => {
        if (res.data.success) {
          this.appTypeData = res.data.data.list;
          this.defaultAppTypeId = res.data.data.list[0].AppTypeId;
          this.appTypeId = res.data.data.list[0].AppTypeId;
          console.log("this.appTypeIdt", this.appTypeId);
          this.getAppMdules();
        }
      });
    },
    getEnterList(id) {
      let parmas = {
        pageindex: 1,
        pagesize: 50,
        entertype: id,
      };
      getEnterList(parmas).then((res) => {
        if (res.data.success) {
          this.enterList = res.data.data.list;
        }
      });
    },
    //机构列表
    getEnterTree() {
      this.enterTreeData = [];
      let parmas = {
        type: this.defaultEnterType,
        typeid: this.defaultEnterTypeId,
      };
      getEnterOrgTree(parmas).then((res) => {
        if (res.data.success) {
          this.enterTreeData = res.data.data;
          //没有机构
          if (this.enterTreeData.length == 0) {
            this.userTreeData = [];
            this.appTreeData = [];
            this.isNotEnter = true;
            return;
          }
          this.isNotEnter = false;
          console.log(this.enterTreeData[0].Id);
          this.enterValue.push(this.enterTreeData[0].Id);
          console.log("this.enterValue====", this.enterValue);
          if (this.enterTreeData[0].Type == "ORG") {
            console.log("组织机构=====");
            this.enterid = "";
            this.orgId = this.enterTreeData[0].Id;
          } else {
            console.log("机构机构=====");
            this.orgId = "";
            this.enterid = this.enterTreeData[0].Id;
          }
          this.getPermissionUser();
          this.getAppMdules();
        }
      });
    },
    //获取用户列表
    getPermissionUser() {
      this.userLoading = true;
      let parmas = {
        enterpriseid: this.enterid,
        orgid: this.orgId,
        usertypeid: this.userTypeId,
      };
      getPermissionUser(parmas).then((res) => {
        if (res.data.success) {
          this.userTreeData = res.data.data;
          this.userLoading = false;
        }
      });
    },
    //获取应用类型
    getAppMdules() {
      this.expandedKeys = [];
      this.treeArray = [];
      this.treeJ = 0;
      let parmas = {
        enterid: this.userId != "" ? "" : this.enterid,
        orgid: this.userId != "" ? "" : this.orgId,
        userid: this.userId,
        apptypeid: this.appTypeId,
      };
      getAppMdules(parmas).then((res) => {
        if (res.data.success) {
          if (res.data.data.length > 0) {
            this.appTreeData = res.data.data;
            this.findDep(res.data.data);
            this.bianli(this.appTreeData);
            this.appValue.push(this.appTreeData[0].Id);
          }
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
    findDep(datas) {
      for (var i in datas) {
        this.treeArray.push(datas[i]);
        if (datas[i].children) {
          this.findDep(datas[i].children);
        }
      }
    },
    bianli(checkedData) {
      for (var i in checkedData) {
        //过滤，只处理满足此条件的，不需要过滤则去掉这层if
        if (checkedData[i].IsCheck) {
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
        moduleid: this.moduleid,
        userid: this.userId,
        orgid: this.userId != "" ? "" : this.orgId,
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
    enterTreeClick(selectedKeys, e) {
      if (e.node.dataRef.Type == "ORG") {
        console.log("组织机构=====");
        this.enterid = "";
        this.orgId = selectedKeys[0];
      } else {
        console.log("机构机构=====");
        this.orgId = "";
        this.enterid = selectedKeys[0];
      }
      this.getPermissionUser();
      this.getAppMdules();
      this.userId = "";
      this.userTreeData = [];
      this.appTreeData = [];
      this.userValue = [];
    },
    //组织选择
    userTreeClick(e) {
      console.log("用户切换====");
      this.userId = e[0];
      this.getAppMdules();
      this.appTreeData = [];
      this.appValue = [];
      this.treeJ = 0;
      this.expandedKeys = [];
      this.getPermissionList();
    },
    //菜单选择===
    appTreeClick(e) {
      console.log(e);
      this.moduleid = e[0];
      this.getPermissionList();
    },
    //机构类型选择
    enterTypeSelect(value) {
      let data = this.recursive(this.enterTypeData, value);
      this.defaultEnterTypeId = data.TypeId;
      this.defaultEnterType = data.Type;
      this.enterValue = [];
      this.appTreeData = [];
      this.treeJ = 0;
      this.expandedKeys = [];
      this.getEnterTree();
    },
    addEnterTypeSelect(e) {
      this.enterList = [];
      let data = this.enterTypeList.find((item) => item.EnterTypeId == e);
      this.getEnterList(data.EnterTypeCode);
    },
    recursive(obj, id) {
      const queue = [...obj];
      while (queue.length) {
        const o = queue.shift();
        if (o.TypeId == id) return o;
        queue.push(...(o.children || []));
      }
    },
    //用户类型选择
    userTypeSelect(e) {
      this.userTypeId = e;
      this.TreeData = [];
      this.userId = "";
      this.userValue = [];
      this.getPermissionUser();
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
      this.checkedKeys = checkedKeys;
    },
    goAdd() {
      if (this.moduleid == "") {
        this.$message.warning("请先选择菜单!");
        return;
      }
      this.visible = true;
    },
    onSelect(selectedKeys) {
      this.selectedKeys = selectedKeys;
    },
    handleOk() {
      let parmas = {
        EnterTypeId: this.form.EnterTypeId,
        EnterId: this.form.EnterId,
        OrgId: this.userId != "" ? "" : this.orgId,
        UserId: this.userId,
        Compartor: this.form.Compartor,
        ModuleId: this.moduleid,
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
    appTreeChange(key) {
      let list = key;
      if (list.length == 0) {
        this.treeArray.forEach((items) => {
          items.IsSelect = false;
        });
        return;
      }
      this.treeArray.map((item) => {
        if (list.includes(item.Id)) {
          item.IsSelect = true;
        } else {
          item.IsSelect = false;
        }
      });
    },
    appTreeSave() {
      let resArray = [];
      this.treeArray.filter((items) => {
        if (items.IsSelect) {
          resArray.push({
            ModuleId: items.Id,
            ModuleCode: items.Code,
            Type: items.Type,
          });
        }
      });
      let parmas = {
        ModuleList: resArray,
        UserId: this.userId,
        EnterId: this.userId != "" ? "" : this.enterid,
        OrgId: this.userId != "" ? "" : this.orgId,
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
            console.log(self.permissionList[item]);
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
  display: inline-block;
  padding: 0 10px;
  height: 32px;
  display: flex;
  align-items: center;
}
</style>
