<!--
 * @Author: max
 * @Date: 2021-08-06 15:34:43
 * @LastEditTime: 2021-10-11 17:26:12
 * @LastEditors: max
 * @Description: 用户列表
 * @FilePath: /up-admin/src/pages/admin/user/list.vue
-->
<template>
  <!-- 搜索 -->
  <div>
    <a-row type="flex">
      <a-col style="padding: 0 5px;" :md="24" :lg="5">
        <a-card class="card" :bordered="false" :bodyStyle="{ margin: '0 0px', padding: '5px', maxHeight: '88vh', minHeight: '88vh', overflow: 'auto' }">
          <a-row>
            <a-col :md="24" :lg="12"><span class="card-title">机构类型选择:</span></a-col>
            <a-col :md="24" :lg="12">
              <a-select v-model="enterTypeVale" defaultActiveFirstOption style="width: 150px" @change="enterTypeChange">
                <a-select-option :value="item.EnterTypeId" v-for="item in enterTypeList" :key="item.EnterTypeId">
                  {{ item.EnterTypeName }}
                </a-select-option>
              </a-select>
            </a-col>
          </a-row>
          <div style="margin-top: 20px">
            <a-tree @select="treeClick" v-if="treeList.length" :tree-data="treeList" default-expand-all auto-expand-parent :replaceFields="replaceFields" :default-selected-keys="enterValue"></a-tree>
            <a-empty v-if="treeList.length == 0" />
          </div>
        </a-card>
      </a-col>
      <a-col style="padding: 0 0px" :md="24" :lg="19">
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <div class="search-box">
            <a-row type="flex" justify="space-between">
              <a-col :md="24" :lg="5">
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
              <a-col :md="24" :lg="19">
                <a-form layout="horizontal" :form="searchForm" class="form-box">
                  <a-row type="flex" justify="end">
                    <a-col
                      ><a-form-item style="margin-right:10px">
                        <a-select placeholder="请选择用户类型" style="width:150px" v-decorator="['UserTypeId']">
                          <a-select-option v-for="(item, index) in usetTypeList" :key="index" :value="item.UserTypeId">{{ item.UserTypeName }}</a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col>
                      <a-form-item style="margin-right:10px">
                        <a-select placeholder="请选择用户状态" style="width:150px" v-decorator="['enable']">
                          <a-select-option value="Y">启用</a-select-option>
                          <a-select-option value="N">禁用</a-select-option>
                        </a-select>
                      </a-form-item></a-col
                    >
                    <a-col>
                      <a-form-item><a-input v-decorator="['key']" style="width:200px" allowClear placeholder="请输入用户账号/名称"/></a-form-item>
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
          <!-- 列表 -->
          <div class="tab" v-if="hasPerm('search')">
            <a-table
              :columns="columns"
              :data-source="data"
              size="small"
              :scroll="{ y: true }"
              :loading="tableLoading"
              :pagination="pagination"
              @change="handleTableChange"
              :rowKey="(data) => data.UserId"
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
              <template slot="Enable" slot-scope="record">
                <div>
                  <a-tag color="green" v-if="record == 'Y'">启用</a-tag>
                  <a-tag color="red" v-else>禁用</a-tag>
                </div>
              </template>
              <template slot="IsLocked" slot-scope="record">
                <div>
                  <a-tag color="red" v-if="record == 'Y'">已锁定</a-tag>
                  <a-tag color="green" v-else>正常</a-tag>
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
                  <a-dropdown :trigger="['click']">
                    <a class="ant-dropdown-link">
                      更多
                      <a-icon type="down" />
                    </a>
                    <a-menu slot="overlay">
                      <a-menu-item key="0" :disabled="!hasPerm('editEnable')" @click="moreClick('enableuser', record)">{{ record.Enable == "Y" ? "禁用" : "启用" }}</a-menu-item>
                      <a-menu-item key="1" :disabled="!hasPerm('editLock')" @click="moreClick('lockuser', record)">{{ record.IsLocked == "Y" ? "解锁" : "锁定" }}</a-menu-item>
                      <!-- <a-menu-item key="3" :disabled="!hasPerm('reset')" @click="moreClick('resetuserpwd', record)">重置密码</a-menu-item> -->
                    </a-menu>
                  </a-dropdown>
                </div>
              </template>
            </a-table>
          </div>
          <!-- 查看详情 -->
          <div>
            <a-drawer width="400" placement="right" :closable="true" :visible="isDrawer" @close="onClose">
              <a-descriptions title="用户详情" :column="1">
                <a-descriptions-item label="用户头像"><a-avatar :src="`./${drawerItem.PhotoUrl}`"/></a-descriptions-item>
                <a-descriptions-item label="用户账号">{{ drawerItem.UserLoginId }}</a-descriptions-item>
                <a-descriptions-item label="用户名称">{{ drawerItem.UserName }}</a-descriptions-item>
                <a-descriptions-item label="企业微信">{{ drawerItem.EnterWechatAccount }}</a-descriptions-item>
                <a-descriptions-item label="用户类型">{{ drawerItem.UserTypeName }}</a-descriptions-item>
                <a-descriptions-item label="出生日期">{{ drawerItem.Birthday }}</a-descriptions-item>
                <a-descriptions-item label="入职日期">{{ drawerItem.EntryDate }}</a-descriptions-item>
                <a-descriptions-item label="性别">{{ drawerItem.Gender == "M" ? "男" : "女" }}</a-descriptions-item>
                <a-descriptions-item label="邮箱">{{ drawerItem.Email }}</a-descriptions-item>
                <a-descriptions-item label="手机">{{ drawerItem.MobilePhone }}</a-descriptions-item>
                <a-descriptions-item label="地址">{{ drawerItem.Address }}</a-descriptions-item>
                <a-descriptions-item label="是否启用">
                  <div>
                    <a-tag color="green" v-if="drawerItem.Enable == 'Y'">启用</a-tag>
                    <a-tag color="red" v-else>禁用</a-tag>
                  </div>
                </a-descriptions-item>
                <a-descriptions-item label="锁定转态">
                  <div>
                    <a-tag color="green" v-if="drawerItem.IsLocked == 'Y'">是</a-tag>
                    <a-tag color="red" v-else>否</a-tag>
                  </div>
                </a-descriptions-item>
              </a-descriptions>
            </a-drawer>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <add-user v-if="addModal" :editItem="editItem" :modalType="modalType" @cloneModal="cloneModal" @succeed="succeed" :enterValue="enterValue"></add-user>
  </div>
</template>
<script>
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: "5%",
  },
  {
    title: "用户账号",
    dataIndex: "UserLoginId",
    scopedSlots: { customRender: "UserLoginId" },
    align: "center",
    width: "15%",
  },
  {
    title: "用户名称",
    dataIndex: "UserName",
    scopedSlots: { customRender: "UserName" },
    align: "center",
    width: "10%",
  },
  {
    title: "用户类型",
    dataIndex: "UserTypeName",
    scopedSlots: { customRender: "UserTypeName" },
    align: "center",
    width: "10%",
  },
  {
    title: "企业微信",
    dataIndex: "EnterWechatAccount",
    scopedSlots: { customRender: "EnterWechatAccount" },
    align: "center",
    width: "10%",
  },
  {
    title: "所属机构",
    dataIndex: "EnterName",
    scopedSlots: { customRender: "EnterName" },
    align: "center",
    width: "20%",
  },
  {
    title: "状态",
    dataIndex: "Enable",
    scopedSlots: { customRender: "Enable" },
    align: "center",
    width: "5%",
  },
  {
    title: "锁定状态",
    dataIndex: "IsLocked",
    scopedSlots: { customRender: "IsLocked" },
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
import { getUserList, userAction, getEnterTree, getUserTypeList, getInstitutionList } from "@/services/admin.js";
import { renderStripe } from "@/utils/stripe.js";
import addUser from "./components/add-user.vue";
export default {
  data() {
    return {
      data: [],
      advanced: true,
      columns,
      isEdit: false,
      editForm: [],
      title: "添加用户",
      loading: false,
      isDrawer: false,
      selectedRowKeys: [], // Check here to configure the default column
      visible: false,
      addModal: false,
      tableLoading: true,
      drawerItem: [],
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      replaceFields: {
        title: "EnterName",
        key: "Id",
        value: "Id",
        children: "children",
      },
      enterValue: [],
      treeList: [],
      enterId: "",
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
      usetTypeList: [],
      editItem: [],
      modalType: "",
      enterTypeList: [],
      enterTypeVale: "",
      entertypeid: "",
      isSearch: false,
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
    this.getUsetType();
  },
  methods: {
    getInstitutionList() {
      let parmas = {
        pageindex: 1,
        pagesize: 100,
      };
      getInstitutionList(parmas).then((res) => {
        if (res.data.success) {
          this.enterTypeList = res.data.data.list;
          this.enterTypeVale = this.enterTypeList[0].EnterTypeId;
          this.entertypeid = this.enterTypeList[0].EnterTypeId;
          this.getTreeList();
        }
      });
    },
    //获取用户类型
    getUsetType() {
      let parmas = {
        pageindex: 1,
        pagesize: 50,
      };
      getUserTypeList(parmas).then((res) => {
        if (res.data.success) {
          this.usetTypeList = res.data.data.list;
        }
      });
    },
    toggleAdvanced() {
      console.log("1111");
      this.advanced = !this.advanced;
    },
    enterTypeChange(e) {
      this.data = [];
      this.entertypeid = e;
      this.tabData = [];
      this.enterValue =[];
      this.enterId ='';
      this.treeList =[];
      this.getTreeList();
    },
    getTreeList() {
      let parmas = {
        entertypeid: this.entertypeid,
      };
      getEnterTree(parmas).then((res) => {
        if (res.data.success) {
          this.treeList = res.data.data;
          if (this.treeList.length == 0) {
            this.tableLoading = false;
            return;
          }
          this.enterValue.push(this.treeList[0].Id);
          this.enterId = this.treeList[0].Id;
          this.getUserList();
        }
      });
    },
    treeClick(value) {
      this.tableLoading = true;
      this.enterId = value[0];
      this.pagination.current = 1;
      this.getUserList();
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
      this.getUserList();
      this.searchForm.resetFields();
    },
    //关键词搜索
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          console.log(values);
          this.data = [];
          this.pagination.total = 0;
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            keyword: values.key,
            enterid: this.enterId,
            enable: values.enable,
            UserTypeId: values.UserTypeId,
          };
          getUserList(parmas).then((res) => {
            if (res.data.success) {
              this.data = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.recordsTotal;
              this.pagination = pagination;
              this.isSearch = true;
            }
          });
        }
      });
    },
    //获取机构类型列表
    getUserList() {
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        enterid: this.enterId,
      };
      getUserList(parmas).then((res) => {
        if (res.data.success) {
          this.tableLoading = false;
          this.data = res.data.data.list;
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination = pagination;
          this.isSearch = false;
        } else {
          console.log("1111");
          this.tableLoading = false;
        }
      });
    },
    //提交成功
    succeed() {
      this.addModal = false;
      this.getUserList();
    },
    //打开对话框
    add() {
      this.addModal = true;
      this.modalType = "add";
    },
    cloneModal() {
      this.addModal = false;
    },
    //关闭对话框
    handleCancel() {
      this.visible = false;
    },
    edit(item) {
      this.addModal = true;
      this.editItem = item;
      this.modalType = "edit";
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
            userAction(editForm, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.defaultForm();
                this.visible = false;
                this.getUserList();
              }
            });
          } else {
            userAction(this.form, "add").then((res) => {
              if (res.data.success) {
                this.$message.success("添加成功!");
                this.getUserList();
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
          userAction(self.selectedRowKeys, "delete").then((res) => {
            if (res.data.success) {
              self.selectedRowKeys = [];
              self.$message.success("删除成功!");
              self.getUserList();
            }
          });
        },
        onCancel() {},
      });
    },
    //单个删除
    onDelete(item) {
      let parmas = [];
      parmas.push(item.UserId);
      userAction(parmas, "delete").then((res) => {
        if (res.data.success) {
          this.$message.success("删除成功!");
          this.getUserList();
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
      this.getUserList();
    },
    //更多操作
    moreClick(e, item) {
      var params = {};
      if (e == "enableuser") {
        params = {
          UserId: item.UserId,
          Enable: item.Enable == "Y" ? "N" : "Y",
        };
      }
      if (e == "lockuser") {
        params = {
          UserId: item.UserId,
          IsLocked: item.IsLocked == "Y" ? "N" : "Y",
        };
      }
      if (e == "resetuserpwd") {
        params = [item.UserId];
      }
      userAction(params, e).then((res) => {
        if (res.data.success) {
          this.getUserList();
          if (e == "resetuserpwd") {
            // this.$message.success("密码重置成功!新密码为: " + res.data.data.NewPwd, 10);
            this.$success({
              title: "密码重置成功",
              // JSX support
              content: (
                <div>
                  <p>密码重置成功!新密码为:{res.data.data.NewPwd}</p>
                </div>
              ),
            });
            // this.$confirm({
            //   title: "重置密码",
            //   closable: "true",
            //   content: "密码重置成功!新密码为: " + res.data.data.NewPwd,
            //   onOk() {},
            //   onCancel() {},
            // });
          } else {
            this.$message.success("操作成功!");
          }
        }
      });
    },
  },
  components: { addUser },
};
</script>
<style lang="less" scoped>
.ant-form-item {
  margin-bottom: 5px;
}
.search {
  margin-bottom: 54px;
}
.fold {
  width: calc(100% - 216px);
  display: inline-block;
}
.operator {
  margin-bottom: 18px;
}
@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
/deep/ .ant-table{
  min-height:77vh;
  max-height:77vh;
  overflow: auto;
}
/deep/.card {
  max-height: 90vh;
  min-height: 90vh;
  overflow: auto;
}
</style>
