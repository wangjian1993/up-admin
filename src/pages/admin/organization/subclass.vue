<template>
  <div>
    <a-row>
      <a-col style="padding: 0 5px" :span="5">
        <a-card class="card" :bordered="false" :bodyStyle="{ margin: '0 0px', padding: '5px', maxHeight: '88vh', minHeight: '88vh', overflow: 'auto' }">
          <p>机构选择</p>
          <a-tree @select="treeClick" v-if="treeList.length" :tree-data="treeList" :replaceFields="replaceFields" default-expand-all :default-selected-keys="enterValue"></a-tree>
          <a-empty v-if="treeList.length == 0" />
        </a-card>
        <!-- <a-card class="card" :bordered="false" :bodyStyle="{ margin: '5px', padding: '5px',maxHeight:'30vh',minHeight:'20vh',overflow:'auto'}">
          <p>组织维度选择</p>
          <a-tree @select="leverClick" v-if="orgList.length" :default-selected-keys="leverValue" :tree-data="orgList" :replaceFields="replaceFields1">{{ orgList }}</a-tree>
          <a-empty v-if="orgList.length == 0" />
        </a-card> -->
      </a-col>
      <a-col :span="13" style="padding: 0 0px">
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px', margin: '0 5px' }">
          <div>
            <a-button :disabled="!hasPerm('add')" @click="addSubclass" type="primary" icon="form">添加</a-button>
            <a-button v-if="hasPerm('delete')" icon="delete" type="primary" :disabled="!hasSelected" :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
            <a-button v-else icon="delete" type="primary" disabled :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
            <span style="margin-left: 8px">
              <template v-if="hasSelected">
                {{ `共选中 ${selectedRowKeys.length} 条` }}
              </template>
            </span>
            <div style="float:right;margin-right:20px">
              <a-select v-model="leverValue" defaultActiveFirstOption style="width: 150px" @change="handleChange">
                <a-select-option :value="item.OrgDimensionId" v-for="item in orgList" :key="item.OrgDimensionId">
                  {{ item.OrgDimensionName}}
                </a-select-option>
              </a-select>
            </div>
          </div>
          <div>
            <a-table
              v-if="hasPerm('search')"
              :columns="columns"
              :data-source="tabData"
              :pagination="pagination"
              size="small"
              :scroll="{ y: true }"
              rowKey="OrgId"
              :row-selection="{
                selectedRowKeys: selectedRowKeys,
                onChange: onSelectChange,
              }"
            >
              <template slot="action" slot-scope="text, record">
                <div>
                  <a-popconfirm title="确定删除?" @confirm="() => onDelete(record)">
                    <a style="margin-right: 8px" :disabled="!hasPerm('delete')">
                      <a-icon type="delete" />
                      删除
                    </a>
                  </a-popconfirm>
                  <!-- <a style="margin-right: 8px" @click="edit(record)" :disabled="!hasPerm('edit')">
                    <a-icon type="edit" />
                    编辑
                  </a>
                  <a style="margin-right: 8px" @click="addSubclass(record, 'sub')" :disabled="!hasPerm('addsub')">
                    <a-icon type="profile" />
                    新增子组
                  </a> -->
                  <a style="margin-right: 8px" @click="relationship(record)">
                    <span v-if="orgId == record.OrgId" style="color:red"><a-icon type="team" />用户关系</span>
                    <span v-else><a-icon type="team" />用户关系</span>
                  </a>
                  <a-dropdown :trigger="['click']">
                    <a class="ant-dropdown-link">
                      更多
                      <a-icon type="down" />
                    </a>
                    <a-menu slot="overlay">
                      <a-menu-item key="0" :disabled="!hasPerm('edit')" @click="edit(record)">编辑</a-menu-item>
                      <a-menu-item key="1" :disabled="!hasPerm('addsub')" @click="addSubclass(record, 'sub')">新增子组</a-menu-item>
                    </a-menu>
                  </a-dropdown>
                </div>
              </template>
            </a-table>
            <a-empty v-else description="暂无权限" />
          </div>
          <div>
            <a-modal :title="title" :visible="visible" @ok="handleOk" @cancel="handleCancel">
              <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-form-model-item ref="OrgName" has-feedback label="组织名称" prop="OrgName">
                  <a-input
                    v-model="form.OrgName"
                    allowClear
                    placeholder="请输入组织名称"
                    @blur="
                      () => {
                        $refs.OrgName.onFieldBlur();
                      }
                    "
                  />
                </a-form-model-item>
                <a-form-model-item ref="OrgCode" has-feedback label="组织编码" prop="OrgCode">
                  <a-input
                    v-model="form.OrgCode"
                    allowClear
                    placeholder="请输入组织编码"
                    :disabled="isEdit"
                    @blur="
                      () => {
                        $refs.OrgCode.onFieldBlur();
                      }
                    "
                  />
                </a-form-model-item>
                <a-form-model-item ref="SuperiorId" label="上级组织" v-if="subType"><a-input v-model="subItem.OrgName" disabled/></a-form-model-item>
                <a-form-model-item ref="OrgDesc" label="描述">
                  <a-textarea v-model="form.OrgDesc" placeholder="请输入用户组描述" :auto-size="{ minRows: 3, maxRows: 5 }" />
                </a-form-model-item>
                <a-form-model-item ref="OrgLevelId" label="所属等级指" prop="OrgLevelId">
                  <a-select placeholder="选择组织等级" v-model="form.OrgLevelId" allowClear v-decorator="['OrgLevelId']">
                    <a-select-option v-for="(item, index) in LevelList" :key="index" :value="item.OrgLevelId">{{ item.OrgLevelName }}</a-select-option>
                  </a-select>
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
        </a-card>
      </a-col>
      <a-col style="padding: 0 5px" :span="6"><user-list ref="getUser" v-if="isRelationship" :orgId="orgId" :enterid="enterid"></user-list></a-col>
    </a-row>
  </div>
</template>

<script>
import { getEnterTree, getOrganizationList, getOrginfo, orginfoAction, getOrgLevelList } from "@/services/admin.js";
import UserList from "./components/user-list.vue";
const columns = [
  {
    title: "组织名称",
    dataIndex: "OrgName",
    scopedSlots: { customRender: "OrgName" },
    width: "20%",
  },
  {
    title: "组织编码",
    dataIndex: "OrgCode",
    width: "15%",
  },
  {
    title: "所属机构",
    dataIndex: "EnterName",
    scopedSlots: { customRender: "EnterName" },
    align: "center",
    width: "20%",
    ellipsis: true,
  },
  {
    title: "等级",
    dataIndex: "OrgLevelName",
    scopedSlots: { customRender: "OrgLevelName" },
    align: "center",
    width: "15%",
    ellipsis: true,
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
    width: "30%",
  },
];
export default {
  data() {
    return {
      tabData: [],
      treeList: [],
      LevelList: [],
      columns,
      orgList: [],
      replaceFields: {
        title: "EnterName",
        key: "Id",
        value: "Id",
        children: "children",
      },
      fieldNames: {
        label: "OrgDimensionName",
        value: "OrgDimensionId",
        children: "children",
      },
      replaceFields1: {
        title: "OrgDimensionName",
        key: "OrgDimensionId",
        value: "OrgDimensionId",
      },
      title: "添加组织",
      loading: false,
      selectedRowKeys: [],
      expandRowByClick: false,
      visible: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      dimsensionId: null,
      enterid: null,
      defaultEnterid: null,
      enterValue: [],
      leverValue:"",
      subType: false,
      isEdit: false,
      subItem: [],
      isRelationship: false,
      orgId: null,
      orgIdFlag: false,
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
      form: {
        OrgCode: "",
        OrgName: "",
        OrgDesc: "",
        SuperiorId: "",
        Enable: "Y",
        OrgLevelId: "",
        OrgDimensionId: "",
        EnterId: "",
      },
      rules: {
        OrgCode: [
          {
            required: true,
            message: "请输入用户组编码",
            trigger: "blur",
          },
        ],
        OrgName: [
          {
            required: true,
            message: "请输入用户组名称",
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
  async created() {
    await this.getTreeList();
  },
  methods: {
    handleChange(e){
      console.log(e);
      this.dimsensionId = e;
      this.getOrginfo();
      this.getList(e);
      this.isRelationship = false;
    },
    relationship(item) {
      this.isRelationship = true;
      console.log(item);
      this.orgId = item.OrgId;
      this.$refs.getUser.getOrgUser(item.OrgId);
      this.$refs.getUser.setPage();
    },
    orgChange(value) {
      this.LevelList = [];
      this.getList(value);
    },
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    getTreeList() {
      getEnterTree().then((res) => {
        if (res.data.success) {
          this.treeList = res.data.data;
          this.enterValue.push(this.treeList[0].Id);
          this.enterid = this.treeList[0].Id;
          this.getOrganizationList();
        }
      });
    },
    //获取机构类型列表
    getOrganizationList() {
      let parmas = {
        pageindex: 1,
        pagesize: 100,
      };
      getOrganizationList(parmas).then((res) => {
        if (res.data.success) {
          this.orgList = res.data.data.list;
          this.leverValue =this.orgList[0].OrgDimensionId;
          this.dimsensionId = this.orgList[0].OrgDimensionId;
          this.getList(this.dimsensionId);
          this.getOrginfo();
        }
      });
    },
    getList(id) {
      let parmas = {
        pageindex: 1,
        pagesize: 100,
        dimsensionId: id,
      };
      getOrgLevelList(parmas).then((res) => {
        if (res.data.success) {
          this.LevelList = res.data.data.list;
        }
      });
    },
    //获取组织列表
    getOrginfo() {
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        dimsensionId: this.dimsensionId,
        enterid: this.enterid,
      };
      getOrginfo(parmas).then((res) => {
        if (res.data.success) {
          this.tabData = res.data.data.list;
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination = pagination;
          this.orgId = this.tabData[0].OrgId;
          // this.orgIdFlag = true;
        }
      });
    },
    loadData(selectedOptions) {
      console.log(selectedOptions);
    },
    enableChange(value) {
      this.form.Enable = value.target.value;
    },
    //关闭对话框
    handleCancel() {
      this.visible = false;
    },
    leverClick(value) {
      this.dimsensionId = value[0];
      this.getOrginfo();
      this.getList(value[0]);
      this.isRelationship = false;
    },
    treeClick(value) {
      this.enterid = value[0];
      this.getOrginfo();
      this.isRelationship = false;
    },
    defaultForm() {
      this.form = {
        OrgCode: "",
        OrgName: "",
        OrgDesc: "",
        SuperiorId: "",
        Enable: "Y",
        OrgLevelId: "",
        OrgDimensionId: "",
        EnterId: "",
      };
    },
    edit(item) {
      this.visible = true;
      this.isEdit = true;
      this.title = "编辑组织";
      this.form = item;
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            let editForm = {
              OrgId: this.form.OrgId,
              OrgName: this.form.OrgName,
              OrgDesc: this.form.OrgName,
              Enable: this.form.Enable,
              OrgLevelId: this.form.OrgLevelId,
            };
            orginfoAction(editForm, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.defaultForm();
                this.visible = false;
                this.getOrginfo();
              }
            });
          } else {
            let parma = {
              OrgCode: this.form.OrgCode,
              OrgName: this.form.OrgName,
              OrgDesc: this.form.OrgDesc,
              SuperiorId: this.subItem.OrgId || "",
              Enable: this.form.Enable,
              OrgLevelId: this.form.OrgLevelId,
              OrgDimensionId: this.dimsensionId,
              EnterId: this.enterid,
            };
            orginfoAction(parma, "add").then((res) => {
              if (res.data.success) {
                this.$message.success("添加成功!");
                this.getOrginfo();
                this.defaultForm();
                this.visible = false;
              }
            });
          }
        }
      });
    },
    addSubclass(item, type) {
      this.defaultForm();
      this.subItem = [];
      this.isEdit = false;
      this.subType = false;
      this.visible = !this.visible;
      if (type == "sub") {
        this.subItem = item;
        this.subType = true;
        console.log(this.subItem);
      }
    },
    //单个删除
    onDelete(item) {
      let parmas = [];
      parmas.push(item.OrgId);
      orginfoAction(parmas, "delete").then((res) => {
        if (res.data.success) {
          this.$message.success("删除成功!");
          this.getOrginfo();
        }
      });
    },
    //分页
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.getOrginfo();
    },
    allDel() {
      let self = this;
      self.$confirm({
        title: "确定要删除选中内容",
        onOk() {
          // const params = [];
          // console.log("self.selectedRowKeys",self.selectedRowKeys)
          // self.selectedRowKeys.forEach(item => {
          // 	console.log("self.tabData[item]",self.tabData[item])
          // 	params.push(self.tabData[item].OrgId);
          // });
          orginfoAction(self.selectedRowKeys, "delete").then((res) => {
            if (res.data.success) {
              self.selectedRowKeys = [];
              self.$message.success("删除成功!");
              self.getOrginfo();
            }
          });
        },
        onCancel() {},
      });
    },
  },
  components: { UserList },
};
</script>

<style lang="less">
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
    font-size: 14px;
  }
}
</style>
