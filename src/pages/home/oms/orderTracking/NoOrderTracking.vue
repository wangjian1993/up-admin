<!--
 * @Author: max
 * @Date: 2021-11-25 15:10:14
 * @LastEditTime: 2021-11-25 16:00:26
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/oms/orderTracking/NoOrderTracking.vue
-->
<template>
  <div>
    <a-form layout="horizontal" :form="searchForm">
      <div>
        <a-row>
          <a-col :md="6" :sm="24">
            <a-form-item label="销售公司" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select v-decorator="['company']" style="width: 200px" placeholder="请选择销售公司" @change="companyChange">
                <a-select-option value="">全部</a-select-option>
                <a-select-option v-for="item in companyList" :key="item.EnterId" :value="item.EnterCode">{{ item.EnterName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="生产工厂" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select v-decorator="['plantid']" style="width: 200px" placeholder="请选择生产工厂">
                <a-select-option value="">全部</a-select-option>
                <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="销售部" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select v-decorator="['department']" style="width: 200px" placeholder="请选择销售部" @change="departmentChange">
                <a-select-option value="">全部</a-select-option>
                <a-select-option v-for="item in departmentList" :key="item.DepartmentName" :value="item.DepartmentCode">{{ item.DepartmentName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="销售员" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select v-decorator="['plantid']" style="width: 200px" placeholder="请选择销售部">
                <a-select-option value="">全部</a-select-option>
                <a-select-option v-for="item in salesmanList" :key="item.UserCode" :value="item.UserCode">{{ item.UserName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </div>
      <span style="float: right; margin-top: 3px;">
        <a-button type="primary" @click="search" :disabled="!hasPerm('search')">查询</a-button>
        <a-button style="margin-left: 8px" @click="reset" :disabled="!hasPerm('search')">重置</a-button>
      </span>
    </a-form>
    <div class="operator">
      <a-button v-if="hasPerm('save')" icon="check-circle" type="primary" :disabled="!hasSelected" :loading="loading" @click="allCheck" style="margin-left: 8px">保存</a-button>
      <a-button v-else icon="check-circle" type="primary" disabled :loading="loading" @click="allCheck" style="margin-left: 8px">保存</a-button>
      <a-button v-if="hasPerm('delete')" icon="delete" type="primary" :disabled="!hasSelected" :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
      <a-button v-else icon="delete" type="primary" disabled :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
      <span style="margin-left: 8px">
        <template v-if="hasSelected">
          {{ `共选中 ${selectedRowKeys.length} 条` }}
        </template>
      </span>
    </div>
    <a-table
      v-if="hasPerm('search')"
      :columns="columns"
      :data-source="data"
      size="small"
      :scroll="{ y: scrollY,x:3000}"
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
      :rowKey="(data) => data.Id"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
        getCheckboxProps: getCheckboxProps,
      }"
      bordered
    >
      <template slot="index" slot-scope="text, record, index">
        <div>
          <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
        </div>
      </template>
      <template slot="Status" slot-scope="text, record">
        <div>
          <a-tag :color="text === 'APPROVAL' || text === 'PUSHED_ERR' ? 'red' : 'green'">{{ record.StatusName }}</a-tag>
        </div>
      </template>
      <template slot="action" slot-scope="text, record">
        <div>
          <a-popconfirm v-if="record.Status === 'APPROVAL'" title="确定删除?" @confirm="() => actionBnt(record, 'delete')">
            <a style="margin-right: 8px" :disabled="!hasPerm('delete')">
              <a-icon type="delete" />
              删除
            </a>
          </a-popconfirm>
          <a :disabled="!hasPerm('approve')" v-if="record.Status === 'APPROVAL'" style="margin-right: 8px" @click="actionBnt(record, 'approved')">
            <a-icon type="check-circle" />
            审批
          </a>
          <a style="margin-right: 8px" @click="detail(record)">
            <a-icon type="profile" />
            查看
          </a>
        </div>
      </template>
    </a-table>
    <a-empty v-else description="暂无权限" />
    <user-list v-if="isUserList" @closeModal="closeUserModal" @okModal="okUserModal"></user-list>
  </div>
</template>

<script>
import getTableScroll from "@/utils/setTableHeight";
import { renderStripe } from "@/utils/stripe.js";
import { mitemrequirementAction, getOrderApi } from "@/services/web.js";
import UserList from "@/components/app-user/UserList";
import { columns } from "./order.data";
import { PublicVar } from "@/mixins/publicVar.js";
export default {
  components: { UserList },
  props: ["companyList", "plantList"],
  mixins: [PublicVar],
  data() {
    return {
      data: [],
      columns,
      isUserList: false,
      companycode: "",
      departmentList: [],
      salesmanList: [],
      deptname: "",
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
      this.scrollY = getTableScroll(70);
    });
    this.getListAll();
  },
  methods: {
    companyChange(e) {
      this.departmentList = [];
      this.salesmanList = [];
      this.companycode = e;
      this.getDepartment();
    },
    departmentChange(e) {
      this.salesmanList = [];
      this.deptname = e;
      this.getSalesman();
    },
    //pmc选择
    getDepartment() {
      let parmas = {
        companycode: this.companycode,
      };
      getOrderApi(parmas, "getdepartments").then((res) => {
        if (res.data.success) {
          this.departmentList = res.data.data;
        }
      });
    },
    getSalesman() {
      let parmas = {
        companycode: this.companycode,
        deptname: this.deptname,
      };
      getOrderApi(parmas, "getdeptusers").then((res) => {
        if (res.data.success) {
          this.salesmanList = res.data.data;
        }
      });
    },
    userSearch() {
      this.isUserList = true;
    },
    closeUserModal() {
      this.isUserList = false;
    },
    okUserModal(item) {
      this.isUserList = false;
      this.searchForm.setFieldsValue({
        pmc: item.Name,
      });
    },
    detail(item) {
      // this.$router.push({ path: "/purchase/add", query: { id:item.Id} });
      this.$emit("toDetail", item.BatchNo);
    },
    weekChange(date, dateString) {
      let str = dateString.split("-");
      this.week = str[1].replace("周", "");
    },
    closeModal() {
      this.isExecl = false;
      this.getListAll();
    },
    //获取列表数据
    getListAll() {
      this.loading = true;
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
      };
      getOrderApi(parmas, "getall").then((res) => {
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
      this.getListAll();
      this.week = "";
      this.searchForm.resetFields();
    },
    //关键词搜索
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            company: values.company,
            plant: values.plant,
            department: values.department,
            salesuser: values.salesuser,
          };
          getOrderApi(parmas, "getall").then((res) => {
            if (res.data.success) {
              this.data = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.recordsTotal;
              this.pagination = pagination;
              this.loading = false;
              this.isSearch = true;
            }
          });
          // do something
        }
      });
    },
    getCheckboxProps: (record) => ({
      props: {
        disabled: record.Status !== "APPROVAL", // Column configuration not to be checked
      },
    }),
    //多选删除
    allDel() {
      let self = this;
      self.$confirm({
        title: "确定要删除选中内容",
        onOk() {
          mitemrequirementAction(self.selectedRowKeys, "delete").then((res) => {
            if (res.data.success) {
              self.selectedRowKeys = [];
              self.$message.success("删除成功!");
              self.getListAll();
            }
          });
        },
        onCancel() {},
      });
    },
    //多选审批
    allCheck() {
      let self = this;
      self.$confirm({
        title: "确定要审批选中内容",
        onOk() {
          mitemrequirementAction(self.selectedRowKeys, "approved").then((res) => {
            if (res.data.success) {
              self.selectedRowKeys = [];
              self.$message.success("审批成功!");
              self.getListAll();
            }
          });
        },
        onCancel() {},
      });
    },
    //单个删除
    actionBnt(item, type) {
      console.log(item);
      let parmas = [];
      parmas.push(item.Id);
      mitemrequirementAction(parmas, type).then((res) => {
        if (res.data.success) {
          if (type == "approved") {
            this.$message.success("审批成功!");
          } else {
            this.$message.success("删除成功!");
          }
          this.getListAll();
        }
      });
    },
    importExcel() {
      this.isExecl = true;
    },
    //分压
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      if (this.isSearch) {
        this.search();
        return;
      }
      this.getListAll();
    },
    //下载模板
    downloadExcel() {
      // window.location.open = "./Upload/excel/20211008/物料需求计划导入模板.xlsx";
      window.open("./Upload/excel/20211008/物料需求计划导入模板.xlsx", "_blank");
      // let a = document.createElement("a");
      // a.href = "./Upload/excel/20211008/物料需求计划导入模板.xlsx";
      // a.click();
    },
  },
};
</script>

<style scoped lang="less">
/deep/.ant-table-body {
  min-height: 0vh;
}
</style>
