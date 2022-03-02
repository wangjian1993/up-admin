<!--
 * @Author: max
 * @Date: 2021-08-30 13:39:50
 * @LastEditTime: 2022-03-02 18:06:29
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
                <a-select v-decorator="['plantid']" style="width: 200px" placeholder="请选择生产工厂">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
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
        :scroll="{ y: scrollY }"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        :rowKey="(data) => data.Id"
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
        <template slot="Status" slot-scope="text, record">
          <div>
            <a-tag :color="text === 'PROCESSING' || text === 'PENDING' || text === 'IMPORT_EXCEPTION' || text === 'CALCULATION_EXCEPTION' ? 'red' : 'green'">{{ record.StatusName }}</a-tag>
          </div>
        </template>
        <template slot="action" slot-scope="text, record">
          <div>
            <a-popconfirm title="确定删除?" v-if="record.Status === 'IMPORT_EXCEPTION' || record.Status === 'CALCULATION_EXCEPTION'" @confirm="() => actionBnt(record, 'delete')">
              <a style="margin-right: 8px" :disabled="!hasPerm('delete')">
                <a-icon type="delete" />
                删除
              </a>
            </a-popconfirm>
            <a style="margin-right: 8px" @click="showInfo(record)">
              <a-icon type="profile" />
              详情
            </a>
            <a style="margin-right: 8px" @click="errorInfo(record)" v-if="record.Status === 'CALCULATION_EXCEPTION' || record.Status === 'IMPORT_EXCEPTION'">
              <a-icon type="profile" />
              异常信息
            </a>
            <a style="margin-right: 8px" @click="detail(record)" v-if="record.Status === 'CALCULATION_COMPLETED'">
              <a-icon type="profile" />
              计算结果
            </a>
          </div>
        </template>
      </a-table>
      <a-empty v-else description="暂无权限" />
      <div>
        <a-drawer width="400" placement="right" :closable="true" :visible="isDrawer" @close="onClose">
          <a-descriptions title="详情" :column="1">
            <a-descriptions-item v-for="(item, index) in filterData" :key="index" :label="item.title">{{ drawerItem[item.dataIndex] }}</a-descriptions-item>
            <a-descriptions-item label="状态">
              <div>
                <a-tag :color="drawerItem.Status === 'PROCESSING' || drawerItem.MatchStatusName === 'PENDING' || drawerItem.Status === 'IMPORT_EXCEPTION' || drawerItem.MatchStatusName === 'CALCULATION_EXCEPTION' ? 'red' : 'green'">{{ drawerItem.StatusName }}</a-tag>
              </div>
            </a-descriptions-item>
          </a-descriptions>
        </a-drawer>
      </div>
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
    dataIndex: "BatchNo",
    scopedSlots: { customRender: "BatchNo" },
    align: "center",
  },
  {
    title: "领料单类型",
    dataIndex: "PMCName",
    scopedSlots: { customRender: "PMCName" },
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
    dataIndex: "ImportDate",
    scopedSlots: { customRender: "ImportDate" },
    align: "center",
  },
  {
    title: "开单日期",
    dataIndex: "WaitProductionQty",
    scopedSlots: { customRender: "WaitProductionQty" },
    align: "center",
    width: 120,
  },
  {
    title: "领料部门",
    dataIndex: "WaitScheduleQty",
    scopedSlots: { customRender: "WaitScheduleQty" },
    align: "center",
    width: 120,
  },
  {
    title: "领料员",
    dataIndex: "SalesScheduleQty",
    scopedSlots: { customRender: "SalesScheduleQty" },
    align: "center",
    width: 150,
  },
  {
    title: "工单",
    dataIndex: "Status",
    scopedSlots: { customRender: "Status" },
    align: "center",
  },
  {
    title: "PMC计划日期",
    dataIndex: "SalesScheduleQty",
    scopedSlots: { customRender: "SalesScheduleQty" },
    align: "center",
    width: 150,
  },
  {
    title: "计划领料日期",
    dataIndex: "SalesScheduleQty",
    scopedSlots: { customRender: "SalesScheduleQty" },
    align: "center",
    width: 150,
  },
  {
    title: "次序",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];
import getTableScroll from "@/utils/setTableHeight";
import { renderStripe } from "@/utils/stripe.js";
import { getMitemPlanAction, setMitemPlanAction } from "@/services/web.js";
export default {
  props: ["plantList", "stateList"],
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
      week: "",
      isSearch: false,
      isUserList: false,
      isError: false,
      errorData: [],
      isDrawer: false,
      drawerItem: [],
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
  },
  methods: {
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
      getMitemPlanAction(parmas, "getall").then((res) => {
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
          console.log("Received values of form: ", values);
          this.pagination.total = 0;
          if (this.week != "") {
            var w = this.week;
          }
          if (values["range-time-picker"]) {
            const rangeValue = values["range-time-picker"];
            var begindate = rangeValue[0].format("YYYY-MM-DD HH:mm:ss");
            var enddate = rangeValue[1].format("YYYY-MM-DD HH:mm:ss");
          }
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            plantid: values.plantid,
            batchno: values.batchno,
            week: w,
            status: values.status,
            pmc: values.pmc,
            begindate: begindate,
            enddate: enddate,
          };
          getMitemPlanAction(parmas, "getall").then((res) => {
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
    //多选删除
    allDel() {
      let self = this;
      self.$confirm({
        title: "确定要删除选中内容",
        onOk() {
          setMitemPlanAction(self.selectedRowKeys, "delete").then((res) => {
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
    //单个删除
    actionBnt(item) {
      let parmas = [];
      parmas.push(item.Id);
      setMitemPlanAction(parmas, "delete").then((res) => {
        if (res.data.success) {
          this.$message.success("删除成功!");
          this.getListAll();
        } else {
          this.$message.error(res.data.message.content);
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
    // getCheckboxProps: (record) => ({
    //   props: {
    //     disabled: record.Status !== "IMPORT_EXCEPTION" && record.Status !== "CALCULATION_EXCEPTION", // Column configuration not to be checked
    //   },
    // }),
    //下载模板
    downloadExcel() {
      window.open("./Upload/rar/20211019/待产计划与待排产计划导入模板.rar", "_blank");
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
