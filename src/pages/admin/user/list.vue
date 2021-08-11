<!--
 * @Author: max
 * @Date: 2021-08-06 15:34:43
 * @LastEditTime: 2021-08-11 17:23:04
 * @LastEditors: max
 * @Description: 用户列表
 * @FilePath: /up-admin/src/pages/admin/user/list.vue
-->
<template>
  <!-- 搜索 -->
  <div>
    <a-row>
      <a-col style="padding: 0 5px" :span="6">
        <a-card class="card" :bordered="false" :bodyStyle="{ margin: '0 5px', padding: '5px' }">
          <p>组织选择</p>
          <a-tree @select="treeClick" v-if="treeList.length" :tree-data="treeList" default-expand-all auto-expand-parent :replaceFields="replaceFields" :default-selected-keys="enterValue"></a-tree>
           <a-empty v-if="treeList.length == 0" />
        </a-card>
      </a-col>
      <a-col style="padding: 0 0px" :span="18">
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <div>
            <a-row type="flex" justify="end">
              <a-col :span="14">
                <a-form layout="horizontal" :form="searchForm">
                  <div>
                    <a-col :span="8" style="margin-right:5px">
                      <a-form-item :wrapperCol="{ span: 24, offset: 1 }">
                        <a-select placeholder="请选择用户类型" v-decorator="['UserTypeId']">
                          <a-select-option v-for="(item, index) in usetTypeList" :key="index" :value="item.UserTypeId">{{ item.UserTypeName }}</a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-item :wrapperCol="{ span: 24, offset: 1 }">
                        <a-select placeholder="请选择用户状态" v-decorator="['enable']">
                          <a-select-option value="Y">启用</a-select-option>
                          <a-select-option value="N">禁用</a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :span="8">
                      <a-form-item :wrapperCol="{ span: 24, offset: 1 }"><a-input v-decorator="['key']" allowClear placeholder="请输入用户账号/名称"/></a-form-item>
                    </a-col>
                  </div>
                </a-form>
              </a-col>
              <a-col :span="4">
                <span style="float: left;margin-top: 3px;">
                  <a-button type="primary" icon="search" style="margin:0 10px" @click="search">搜索</a-button>
                  <a-button @click="reset" icon="reload">重置</a-button>
                </span>
              </a-col>
            </a-row>
          </div>
          <div class="search-box">
            <a-row>
              <a-col :span="8">
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
            </a-row>
          </div>
          <!-- 列表 -->
          <div class="tab">
            <a-table
              :columns="columns"
              :data-source="data"
              size="small"
              :loading="tableLoading"
              :pagination="pagination"
              @change="handleTableChange"
              :rowKey="(tableDatas) => data.EnterTypeId"
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
                    <a style="margin-right: 8px">
                      <a-icon type="delete" />
                      删除
                    </a>
                  </a-popconfirm>
                  <a style="margin-right: 8px" @click="edit(record)">
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
                      <a-menu-item key="0" @click="moreClick('enableuser', record)">{{ record.Enable == "Y" ? "禁用" : "启用" }}</a-menu-item>
                      <a-menu-item key="1" @click="moreClick('lockuser', record)">{{ record.IsLocked == "Y" ? "解锁" : "锁定" }}</a-menu-item>
                      <a-menu-item key="3" @click="moreClick('resetuserpwd', record)">重置密码</a-menu-item>
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
                <a-descriptions-item label="用户头像"><a-avatar :src="drawerItem.PhotoUrl"/></a-descriptions-item>
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
  },
  {
    title: "用户账号",
    dataIndex: "UserLoginId",
    scopedSlots: { customRender: "UserLoginId" },
    align: "center",
  },
  {
    title: "用户名称",
    dataIndex: "UserName",
    scopedSlots: { customRender: "UserName" },
    align: "center",
  },
  {
    title: "用户类型",
    dataIndex: "UserTypeName",
    scopedSlots: { customRender: "UserTypeName" },
    align: "center",
  },
  {
    title: "企业微信",
    dataIndex: "EnterWechatAccount",
    scopedSlots: { customRender: "EnterWechatAccount" },
    align: "center",
  },
  {
    title: "所属机构",
    dataIndex: "EnterName",
    scopedSlots: { customRender: "EnterName" },
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "Enable",
    scopedSlots: { customRender: "Enable" },
    align: "center",
  },
  {
    title: "锁定状态",
    dataIndex: "IsLocked",
    scopedSlots: { customRender: "IsLocked" },
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];
import { getUserList, userAction, getEnterTree, getUserTypeList } from "@/services/admin.js";
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
        pageSize: 10, //每页中显示10条数据
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
    this.getTreeList();
    this.getUsetType();
  },
  methods: {
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
    getTreeList() {
      getEnterTree().then((res) => {
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
          const params = [];
          self.selectedRowKeys.forEach((item) => {
            params.push(self.data[item].UserId);
          });
          userAction(params, "delete").then((res) => {
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
              title: "This is a success message",
              // JSX support
              content: (
                <div>
                  <p>密码重置成功!新密码为: " + res.data.data.NewPwd</p>
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
<style lang="less">
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
</style>
