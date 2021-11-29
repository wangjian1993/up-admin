<!--
 * @Author: max
 * @Date: 2021-11-25 15:10:14
 * @LastEditTime: 2021-11-27 18:05:37
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
              <a-select v-decorator="['company', { rules: [{ required: true, message: '请选择销售公司' }] }]" style="width: 200px" placeholder="请选择销售公司" @change="companyChange">
                <a-select-option v-for="item in companyList" :key="item.EnterId" :value="item.EnterCode">{{ item.EnterName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="生产工厂" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select v-decorator="['plantid']" style="width: 200px" placeholder="请选择生产工厂">
                <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="销售部" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select v-decorator="['department']" style="width: 200px" placeholder="请选择销售部" @change="departmentChange">
                <a-select-option v-for="item in departmentList" :key="item.DepartmentName" :value="item.DepartmentCode">{{ item.DepartmentName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="销售员" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select v-decorator="['salesuser']" style="width: 200px" placeholder="请选择销售部">
                <a-select-option v-for="item in salesmanList" :key="item.UserCode" :value="item.UserCode">{{ item.UserName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </div>
      <span style="display: flex;justify-content: flex-end;">
        <a-button type="primary" @click="search" :disabled="!hasPerm('search')">查询</a-button>
        <a-button style="margin-left: 8px" @click="reset" :disabled="!hasPerm('search')">重置</a-button>
      </span>
    </a-form>
    <!-- <div class="operator">
      <a-button v-if="hasPerm('save')" icon="check-circle" type="primary" :disabled="!hasSelected" :loading="loading" @click="allCheck" style="margin-left: 8px">保存</a-button>
      <a-button v-else icon="check-circle" type="primary" disabled :loading="loading" @click="allCheck" style="margin-left: 8px">保存</a-button>
      <span style="margin-left: 8px">
        <template v-if="hasSelected">
          {{ `共选中 ${selectedRowKeys.length} 条` }}
        </template>
      </span>
    </div> -->
    <a-table v-if="hasPerm('search')" :columns="columns" :data-source="data" size="small" :scroll="{ y: scrollY, x: 3000 }" :loading="loading" :pagination="pagination" @change="handleTableChange" :rowKey="(data) => data.Id" bordered>
      <template slot="index" slot-scope="text, record, index">
        <div>
          <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
        </div>
      </template>
      <template slot="PlanShipDate" slot-scope="text, record">
        <a-date-picker v-model="record.PlanShipDate" />
      </template>
      <template slot="condition" slot-scope="text, record">
        <div>
          <a style="margin-right: 8px" @click="detail(record)">
            <a-icon type="profile" />
            查看明细
          </a>
        </div>
      </template>
      <template slot="action" slot-scope="text, record">
        <div>
          <a style="margin-right: 8px" :disabled="!hasPerm('save')" @click="save(record)">
            <a-icon type="profile" />
            保存
          </a>
        </div>
      </template>
    </a-table>
    <a-empty v-else description="暂无权限" />
    <user-list v-if="isUserList" @closeModal="closeUserModal" @okModal="okUserModal"></user-list>
    <OrderDetail v-if="isDetail" :detailData="detailData" @closeModal="closeModal" />
  </div>
</template>

<script>
import getTableScroll from "@/utils/setTableHeight";
import { renderStripe } from "@/utils/stripe.js";
import { getOrderApi, setOrderApi } from "@/services/web.js";
import UserList from "@/components/app-user/UserList";
import { columns } from "./order.data";
import { PublicVar } from "@/mixins/publicVar.js";
import OrderDetail from "./OrderDetail.vue";
export default {
  components: { UserList, OrderDetail },
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
      isDetail: false,
      detailData: [],
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
    // this.getListAll();
  },
  methods: {
    companyChange(e) {
      this.departmentList = [];
      this.salesmanList = [];
      this.companycode = e;
      this.getDepartment();
      this.searchForm.setFieldsValue({
        department: "",
        salesuser: "",
      });
    },
    departmentChange(e) {
      this.salesmanList = [];
      this.deptname = e;
      this.getSalesman();
      this.searchForm.setFieldsValue({
        salesuser: "",
      });
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
      this.isDetail = true;
      this.detailData = item;
    },
    weekChange(date, dateString) {
      let str = dateString.split("-");
      this.week = str[1].replace("周", "");
    },
    closeModal() {
      this.isDetail = false;
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
    save(item) {
      let parmas = {
        SalesOrderNo: item.SalesOrderNo,
        LineItem: item.LineItem,
        MitemCode: item.MitemCode,
        UpdatePlanShipDate: item.PlanShipDate,
      };
      setOrderApi(parmas, "update").then((res) => {
        if (res.data.success) {
          this.$message.success("保存成功!");
          this.search();
        }
      });
    },
    getPaginationList() {
      this.loading = true;
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
      };
      getOrderApi(parmas, "getcacheall").then((res) => {
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
      // this.getListAll();
      this.week = "";
      this.pagination.current = 1;
      this.pagination.total = 0;
      this.data = [];
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
    //分压
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.getPaginationList();
    },
  },
};
</script>

<style scoped lang="less">
/deep/.ant-table-body {
  min-height: 0vh;
}
</style>
