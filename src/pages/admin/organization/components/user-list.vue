<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <div class="search-box">
      <a-row>
        <a-col :md="24" :lg="12">
          <div>
            <a-button :disabled="!hasPerm('userAdd')" @click="add" type="primary" icon="form">添加</a-button>
            <a-button v-if="hasPerm('userDelete')" icon="delete" type="primary" :disabled="!hasSelected" :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
            <a-button v-else icon="delete" type="primary" disabled :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
            <span style="margin-left: 8px">
              <template v-if="hasSelected">
                {{ `共选中 ${selectedRowKeys.length} 条` }}
              </template>
            </span>
          </div>
        </a-col>
        <a-col :md="24" :lg="12">
          <div>
            <a-input-search placeholder="姓名账号搜索" allowClear style="width: 200px" @search="onSearch" />
          </div>
        </a-col>
      </a-row>
    </div>
    <div><all-user v-if="isModal" :orgId="id" :enterid="enterid" @succeed="getUser" @closeModal="closeModal"></all-user></div>
    <!-- 列表 -->
    <div class="tab">
      <a-table
        :columns="columns"
        :data-source="data"
        size="small"
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
        <template slot="action" slot-scope="text, record">
          <div>
            <a-popconfirm title="确定删除?" @confirm="() => onDelete(record)">
              <a style="margin-right: 8px" :disabled="!hasPerm('userDelete')">
                <a-icon type="close-circle" />
                移除
              </a>
            </a-popconfirm>
          </div>
        </template>
      </a-table>
    </div>
  </a-card>
</template>
<script>
const columns = [
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
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];
import { orginfoAction, getOrgUser } from "@/services/admin.js";
import { renderStripe } from "@/utils/stripe.js";
import AllUser from "./all-user.vue";
import paging from "@/config/paging.js";
export default {
  props: ["orgId", "enterid"],
  data() {
    return {
      data: [],
      columns,
      isEdit: false,
      editForm: [],
      title: "添加机构类型",
      loading: false,
      isDrawer: false,
      isModal: false,
      selectedRowKeys: [], // Check here to configure the default column
      visible: false,
      drawerItem: [],
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      pagination: paging.pagination,
      searcValue: "",
      searchForm: this.$form.createForm(this),
      id: "",
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
    this.id = this.orgId;
    this.data = [];
  },
  methods: {
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //搜索
    onSearch(value) {
      this.setPage();
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        orgid: this.id,
        username: value,
      };
      getOrgUser(parmas).then((res) => {
        if (res.data.success) {
          this.data = res.data.data.list;
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination = pagination;
        }
      });
    },
    //设置分页初始数据
    setPage() {
      this.pagination.current = 1;
      this.pagination.pageSize = 20;
    },
    //获取用户
    getUser() {
      this.getOrgUser(this.id);
    },
    //获取机构类型列表
    getOrgUser(id) {
      this.id = id;
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        orgid: id,
      };
      getOrgUser(parmas).then((res) => {
        if (res.data.success) {
          this.data = res.data.data.list;
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination = pagination;
        }
      });
    },
    //打开对话框
    add() {
      this.isModal = true;
    },
    //关闭添加弹窗
    closeModal() {
      this.isModal = false;
    },
    //关闭对话框
    handleCancel() {
      this.visible = false;
    },
    //多选删除
    allDel() {
      let self = this;
      self.$confirm({
        title: "确定要删除选中内容",
        onOk() {
          let parmas = {
            OrgId: self.id,
            OrgUserInfo: [],
          };
          self.selectedRowKeys.forEach((item) => {
            let obj = {
              UserId: item,
            };
            parmas.OrgUserInfo.push(obj);
          });
          orginfoAction(parmas, "removeuser").then((res) => {
            if (res.data.success) {
              self.selectedRowKeys = [];
              self.$message.success("移除成功!");
              self.getOrgUser(self.id);
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
      let parmas = {
        OrgId: this.id,
        OrgUserInfo: [
          {
            UserId: item.UserId,
          },
        ],
      };
      //分页切换
      orginfoAction(parmas, "removeuser").then((res) => {
        if (res.data.success) {
          this.$message.success("移除成功!");
          this.getOrgUser(this.id);
        }
      });
    },
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.getOrgUser(this.id);
    },
  },
  components: { AllUser },
};
</script>
<style lang="less">
.ant-form-item {
  margin-bottom: 5px;
}
</style>
