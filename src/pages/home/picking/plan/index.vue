<!--
 * @Author: max
 * @Date: 2021-08-30 13:39:50
 * @LastEditTime: 2022-03-07 10:09:24
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/picking/plan/index.vue
-->
<template>
  <div>
    <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
      <a-form layout="horizontal" :form="searchForm">
        <div>
          <a-row>
            <a-col :md="6" :sm="24">
              <a-form-item label="生产工厂" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-select v-decorator="['plantname', { rules: [{ required: true, message: '请选择生产工厂' }] }]" style="width: 200px" placeholder="请选择生产工厂" @change="plantChange">
                  <a-select-option v-for="item in plantList" :key="item.EnterName" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="工作中心" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-select v-decorator="['workcentername']" style="width: 200px" placeholder="请选择工作中心厂">
                  <a-select-option v-for="item in workshopList" :key="item.WorkShopId" :value="item.WorkShopName">{{ item.WorkShopName }}</a-select-option>
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
        <a-date-picker format="YYYY-MM-DD" v-model="planDate" :disabled-date="disabledDate" />
        <a-button v-if="hasPerm('save')" icon="check-circle" type="primary" :disabled="!hasSelected" :loading="loading" @click="allSave" style="margin-left: 8px">发布</a-button>
        <a-button v-else icon="check-circle" type="primary" disabled :loading="loading" style="margin-left: 8px">发布</a-button>
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
        :scroll="{ y: scrollY }"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        :rowKey="(data) => data.DocNo"
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
        <template slot="Sort" slot-scope="text, record">
          <a-input-number :disabled="!record.isInput" :min="0" size="small" type="text" v-model="record.Sort" />
        </template>
      </a-table>
      <a-empty v-else description="暂无权限" />
    </a-card>
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
    title: "领料单",
    dataIndex: "DocNo",
    scopedSlots: { customRender: "DocNo" },
    align: "center",
  },
  {
    title: "领料单类型",
    dataIndex: "DocName",
    scopedSlots: { customRender: "DocName" },
    align: "center",
  },
  {
    title: "生产工厂",
    dataIndex: "PlantName",
    scopedSlots: { customRender: "PlantName" },
    align: "center",
  },
  {
    title: "工作中心",
    dataIndex: "WorkCenterName",
    scopedSlots: { customRender: "WorkCenterName" },
    align: "center",
  },
  {
    title: "开单日期",
    dataIndex: "DocDate",
    scopedSlots: { customRender: "DocDate" },
    align: "center",
    width: 120,
    customRender: (text) => {
      return splitData(text);
    },
  },
  {
    title: "领料部门",
    dataIndex: "AdminUnitName",
    scopedSlots: { customRender: "AdminUnitName" },
    align: "center",
    width: 120,
  },
  {
    title: "领料员",
    dataIndex: "EmployeeName",
    scopedSlots: { customRender: "EmployeeName" },
    align: "center",
    width: 150,
  },
  {
    title: "工单",
    dataIndex: "WorkNo",
    scopedSlots: { customRender: "WorkNo" },
    align: "center",
  },
  {
    title: "PMC计划日期",
    dataIndex: "PMCPlanDate",
    scopedSlots: { customRender: "PMCPlanDate" },
    align: "center",
    width: 150,
    customRender: (text) => {
      return splitData(text);
    },
  },
  {
    title: "计划领料日期",
    dataIndex: "PlanDate",
    scopedSlots: { customRender: "PlanDate" },
    align: "center",
    width: 150,
    customRender: (text) => {
      return splitData(text);
    },
  },
  {
    title: "次序",
    scopedSlots: { customRender: "Sort" },
    align: "center",
  },
];
import getTableScroll from "@/utils/setTableHeight";
import { renderStripe } from "@/utils/stripe.js";
import { getPlanList, setPlan } from "@/services/wms.js";
import { splitData } from "@/utils/util.js";
import { getDailyPlanAction, getWorkshopList } from "@/services/web.js";
import moment from "moment";
export default {
  data() {
    return {
      data: [],
      columns,
      loading: true,
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
      selectedRows: [],
      isExecl: false,
      selectedRowKeys: [],
      scrollY: "",
      searchForm: this.$form.createForm(this),
      workshopList: [],
      planDate: "",
      plantList: [],
    };
  },
  updated() {
    renderStripe();
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
    filterData() {
      return this.columns.filter((obj) => {
        if (obj.dataIndex !== "Status") {
          return obj.dataIndex;
        }
      });
    },
  },
  created() {
    this.$nextTick(() => {
      this.scrollY = getTableScroll(70);
    });
    this.getListAll();
    this.getPlant();
  },
  methods: {
    splitData,
    moment,
    disabledDate(current) {
      return current < moment().add(-1, "days");
    },
    disabledDateTime() {
      return {
        disabledHours: () => this.range(0, 24).splice(4, 20),
        disabledMinutes: () => this.range(30, 60),
        disabledSeconds: () => [55, 56],
      };
    },
    getPlant() {
      let parmas1 = {
        entertypecode: "PLANT",
      };
      getDailyPlanAction(parmas1, "getlistbytypecode").then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
          this.plantid = this.plantList[0].EnterId;
        }
      });
    },
    //获取车间
    getWorkshopList() {
      let parmas = {
        plantid: this.plantId,
      };
      getWorkshopList(parmas, "getlist").then((res) => {
        if (res.data.success) {
          this.workshopList = res.data.data;
        }
      });
    },
    plantChange(e) {
      if (e == "") return;
      this.plantId = e;
      this.searchForm.setFieldsValue({
        workcentername: "",
      });
      this.getWorkshopList();
    },
    errorInfo(record) {
      this.isError = true;
      this.errorData = record;
    },
    closeErrorModal() {
      this.isError = false;
    },
    showInfo(item) {
      this.isDrawer = true;
      this.drawerItem = item;
    },
    //pmc选择
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
      getPlanList(parmas).then((res) => {
        if (res.data.success) {
          this.data = res.data.data.list;
          this.data.forEach((item) => {
            item.isInput = false;
          });
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.totalCount;
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
      if (selectedRowKeys.length > 0) {
        this.data.map((items) => {
          items.isInput = this.setIsInput(items.DocNo);
        });
      } else {
        this.data.map((items) => {
          items.isInput = false;
        });
      }
    },
    setIsInput(id) {
      return this.selectedRowKeys.includes(id);
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
          console.log("Received values of form: ", values);
          this.pagination.total = 0;
          let plantname = "";
          this.plantList.map((item) => {
            if (item.EnterId == values.plantname) {
              plantname = item.EnterName;
            }
          });
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            plantname: plantname,
            workcentername: values.workcentername,
          };
          getPlanList(parmas, "getall").then((res) => {
            if (res.data.success) {
              this.data = res.data.data.list;
              this.data.forEach((item) => {
                item.isInput = false;
              });
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.totalCount;
              this.pagination = pagination;
              this.loading = false;
              this.isSearch = true;
            }
          });
          // do something
        }
      });
    },
    //发布
    allSave() {
      if (this.planDate == "") {
        this.$message.warning("请选择计划日期");
        return;
      }
      console.log(this.planDate);
      let planD = this.planDate.format("YYYY-MM-DD HH:mm:ss");
      let parmas = [];
      this.data.map((item) => {
        if (this.selectedRowKeys.includes(item.DocNo)) {
          parmas.push({
            docno: item.DocNo,
            docname: item.DocName,
            plantname: item.PlantName,
            workcentername: item.WorkCenterName,
            docdate: item.DocDate,
            adminunitname: item.AdminUnitName,
            employeename: item.EmployeeName,
            workno: item.WorkNo,
            qty: item.Qty,
            plandate: planD,
            sort: item.Sort || 0,
          });
        }
      });
      parmas.push({});
      setPlan(parmas).then((res) => {
        if (res.data.success) {
          this.$message.success("发布成功");
          this.planDate = 0;
          this.selectedRowKeys = [];
          this.getListAll();
        }
      });
    },
    //分页
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      if (this.isSearch) {
        this.search();
        return;
      }
      this.getListAll();
    },
  },
};
</script>

<style scoped lang="less">
/deep/.ant-table {
  min-height: 65vh;
}
.ant-form-item {
  margin-bottom: 5px;
}
</style>
