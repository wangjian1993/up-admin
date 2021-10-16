<!--
 * @Author: max
 * @Date: 2021-10-07 10:40:23
 * @LastEditTime: 2021-10-16 09:08:49
 * @LastEditors: max
 * @Description: 采购质检
 * @FilePath: /up-admin/src/pages/home/scm/quality/Quality.vue
-->
<template>
  <div>
    <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
      <a-form layout="horizontal" :form="searchForm">
        <div :class="advanced ? null : 'fold'">
          <a-row>
            <a-col :md="6" :sm="24">
              <a-form-item label="生产工厂" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-select v-decorator="['plantid']" style="width: 200px" placeholder="请选择生产工厂">
                  <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="到货批号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入计划批号" v-decorator="['orderno']" />
              </a-form-item>
            </a-col>
             <a-col :md="6" :sm="24">
              <a-form-item label="BOM号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入BOM号" v-decorator="['mitemcode']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="产品型号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入产品型号" v-decorator="['mitemname']" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-if="advanced">
            <!-- <a-col :md="6" :sm="24">
              <a-form-item label="产品型号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" placeholder="请输入产品型号" v-decorator="['mitemname']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="BOM号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" placeholder="请输入BOM号" v-decorator="['mitemcode']" />
              </a-form-item>
            </a-col> -->
            <!-- <a-col :md="6" :sm="24">
              <a-form-item label="状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-select v-decorator="['status']" placeholder="请选择状态" style="width: 200px">
                  <a-select-option :value="item.ParamValue" v-for="(item, index) in stateList" :key="index">
                    {{ item.ParamName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col> -->
          </a-row>
        </div>
        <span style="float: right; margin-top: 3px;">
          <a-button type="primary" @click="search">查询</a-button>
          <a-button style="margin-left: 8px" @click="reset">重置</a-button>
          <!-- <a @click="toggleAdvanced" style="margin-left: 8px">
            {{ advanced ? "收起" : "展开" }}
            <a-icon :type="advanced ? 'up' : 'down'" />
          </a> -->
        </span>
      </a-form>
      <div class="operator">
        <a-space class="operator">
          <a-button v-if="hasPerm('approve')" icon="check-circle" type="primary" :disabled="!hasSelected" :loading="loading" @click="checkAll" style="margin-left: 8px">审批</a-button>
          <a-button v-else icon="check-circle" type="primary" disabled :loading="loading" @click="checkAll" style="margin-left: 8px">审批</a-button>
          <span style="margin-left: 8px">
            <template v-if="hasSelected">
              {{ `共选中 ${selectedRowKeys.length} 条` }}
            </template>
          </span>
        </a-space>
      </div>
      <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
        <div>
          <a-row type="flex" justify="center">
            <a-col :span="6"
              ><div class="statistic" @click="getStatisticList('Y','')">
                <a-statistic title="今日来料总数:" :value="statistic.TodayInComingQty"
                  ><template #suffix>
                    <span style="margin-left: 4px;font-size: 10px;">查看详情<a-icon type="double-right" /> </span></template
                ></a-statistic></div
            ></a-col>
            <a-col :span="6" class="statistic" @click="getStatisticList('Y','N')">
              <a-statistic title="今日未处理批数:" :value-style="{ color: '#cf1322' }" :value="statistic.TodayNoApprovedQty"
                ><template #suffix>
                  <span style="margin-left: 4px;font-size: 10px;">查看详情<a-icon type="double-right" /> </span></template></a-statistic
            ></a-col>
            <a-col :span="6" class="statistic" @click="getStatisticList('Y', 'Y')">
              <a-statistic title="今日已处理批数:" :value-style="{ color: '#cf1322' }" :value="statistic.TodayApprovedQty"
                ><template #suffix>
                  <span style="margin-left: 4px;font-size: 10px;">查看详情<a-icon type="double-right" /> </span></template></a-statistic
            ></a-col>
            <a-col :span="6" class="statistic" @click="getStatisticList('', 'N')">
              <a-statistic title="总未处理批数:" :value-style="{ color: '#cf1322' }" :value="statistic.TotalNoApprovedQty"
                ><template #suffix>
                  <span style="margin-left: 4px;font-size: 10px;">查看详情<a-icon type="double-right" /> </span></template></a-statistic
            ></a-col>
          </a-row>
        </div>
      </a-card>
      <a-table
        :columns="columns"
        :data-source="dataSource"
        size="small"
        :scroll="{ y: scrollY, x: 2000 }"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        :row-selection="{
          columnWidth:40,
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
        
        <template slot="OrderDate" slot-scope="text">
          <span>{{splitData(text) }}</span>
        </template>
        <template slot="QtStatusName" slot-scope="text">
          <div>
            <a-tag color="green" v-if="text !== '待检'">{{ text }}</a-tag>
            <a-tag color="red" v-else>{{ text }}</a-tag>
          </div>
        </template>
        <template slot="action" slot-scope="text, record">
          <div>
            <a style="margin-right: 8px" @click="check(record)" v-if="record.QtStatusName === '待检'" :disabled="!hasPerm('approve')">
              <a-icon type="profile" />
              审批
            </a>
          </div>
        </template>
      </a-table>
    </a-card>
    <approve v-if="isApprove" @closeModal="closeModal" @succeed="succeed" :approveData="approveData"></approve>
    <batch-approve v-if="isAllApprove" @closeModal="closeModal" @succeed="succeed" :batchData="batchData"></batch-approve>
  </div>
</template>

<script>
import { getQualityAction } from "@/services/web.js";
import Approve from './Approve.vue'
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: "50px",
  },
  {
    title: "生产工厂",
    dataIndex: "PlantName",
    scopedSlots: { customRender: "PlantName" },
    align: "center",
    width: "120px",
  },
  {
    title: "到货单号",
    dataIndex: "OrderNo",
    scopedSlots: { customRender: "OrderNo" },
    align: "center",
    width: "150px",
  },
  {
    title: "订单日期",
    dataIndex: "OrderDate",
    scopedSlots: { customRender: "OrderDate" },
    align: "center",
    width: "100px",
  },
  {
    title: "供应商",
    dataIndex: "SupplierName",
    scopedSlots: { customRender: "SupplierName" },
    align: "center",
  },
  {
    title: "BOM号",
    dataIndex: "MitemCode",
    scopedSlots: { customRender: "MitemCode" },
    align: "center",
  },
  {
    title: "产品型号",
    dataIndex: "MitemName",
    scopedSlots: { customRender: "MitemName" },
    align: "center",
  },
  {
    title: " 产品规格",
    dataIndex: "MitemSpec",
    align: "center",
    width: "350px",
  },
  {
    title: "到货数量",
    dataIndex: "Qty",
    scopedSlots: { customRender: "Qty" },
    align: "center",
    width: "80px",
  },
  {
    title: "检验数量",
    dataIndex: "QTQty",
    scopedSlots: { customRender: "QTQty" },
    align: "center",
    width: "80px",
  },
  {
    title: "合格数量",
    dataIndex: "QualifiedQty",
    scopedSlots: { customRender: "QualifiedQty" },
    align: "center",
    width: "80px",
  },
  {
    title: "退货数量",
    dataIndex: "ReturnQty",
    scopedSlots: { customRender: "ReturnQty" },
    align: "center",
    width: "80px",
  },
  {
    title: "报废数量",
    dataIndex: "ScrapQty",
    scopedSlots: { customRender: "ScrapQty" },
    align: "center",
    width: "80px",
  },
  {
    title: "质检人员",
    dataIndex: "UserQt",
    scopedSlots: { customRender: "UserQt" },
    align: "center",
    width: "80px",
  },
  {
    title: "质检日期",
    dataIndex: "DatetimeQt",
    scopedSlots: { customRender: "DatetimeQt" },
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "QtStatusName",
    scopedSlots: { customRender: "QtStatusName" },
    align: "center",
    width: "70px",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
    fixed: "right",
    width: 100,
  },
];
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
import { getParamData } from "@/services/admin.js";
import BatchApprove from './BatchApprove.vue'
import { splitData} from "@/utils/util.js";
export default {
  components: {Approve,BatchApprove},
  data() {
    return {
      scrollY: "",
      loading: false,
      advanced: true,
      columns: columns,
      dataSource: [],
      isApprove: false,
      isAllApprove:false,
      selectedRowKeys: [],
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
      searchForm: this.$form.createForm(this),
      plantid: "",
      week: "",
      drawerItem: [],
      isSearch: false,
      statistic: [],
      stateList: [],
      plantList: [],
      approveData:[],
      batchData:[]
    };
  },
  updated() {
    renderStripe();
  },
  created() {
    this.$nextTick(() => {
      this.scrollY = getTableScroll();
    });
    this.getListAll();
    this.getStatistic();
    this.getPlant();
    // this.getParamData();
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  methods: {
    splitData,
    check(item) {
      this.isApprove =true;
      this.approveData =item
    },
    closeModal(){
      this.isApprove =false;
      this.isAllApprove = false;
      this.batchData = []
    },
    checkAll(){
      this.isAllApprove =true;
      this.selectedRowKeys.forEach((item) => {
          this.batchData.push(this.dataSource[item])
      })
      console.log(this.batchData);
    },
    succeed(){
      this.isApprove =false;
      this.getListAll();
      this.getStatistic();
    },
    getPlant() {
      let parmas1 = {
        entertypecode: "PLANT",
      };
      getQualityAction(parmas1, "getenterlist").then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
        }
      });
    },
    getParamData() {
      let parmas = {
        groupcode: "MATCH_STATUS",
      };
      getParamData(parmas).then((res) => {
        if (res.data.success) {
          this.stateList = res.data.data;
        }
      });
    },
    //关闭弹出框
    onClose() {
      this.isDrawer = false;
    },
    //查看详情
    details(item) {
      this.isDrawer = true;
      this.drawerItem = item;
    },
    //重置搜索
    reset() {
      this.getListAll();
      this.week = "";
      this.searchForm.resetFields();
    },
    weekChange(date, dateString) {
      let str = dateString.split("-");
      this.week = str[1].replace("周", "");
    },
    getStatistic() {
      getQualityAction("", "gettotal").then((res) => {
        if (res.data.success) {
          this.statistic = res.data.data;
        }
      });
    },
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //获取列表
    getListAll() {
      this.loading = true;
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        istoday: "",
        isapproaved: "",
      };
      getQualityAction(parmas, "getall").then((res) => {
        if (res.data.success) {
          this.dataSource = res.data.data.list;
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
    getStatisticList(istoday, isapproaved) {
      this.loading = true;
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        istoday:istoday,
        isapproaved:isapproaved,
      };
      getQualityAction(parmas, "getall").then((res) => {
        if (res.data.success) {
          this.dataSource = res.data.data.list;
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
    getCheckboxProps: (record) => ({
      props: {
        disabled: record.QtStatusName === '待检', // Column configuration not to be checked
      },
    }),
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
    //收起展开
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    search() {
      this.loading = true;
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.dataSourcedata = [];
          this.pagination.total = 0;
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            plantid: values.plantid,
            orderno: values.orderno,
            mitemcode: values.mitemcode,
            mitemname: values.mitemname,
            istoday: "",
            isapproaved: "",
          };
          getQualityAction(parmas, "getall").then((res) => {
            if (res.data.success) {
              this.dataSource = res.data.data.list;
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
  },
};
</script>

<style scoped lang="less">
/deep/.ant-table {
  min-height: 40vh;
}
/deep/.ant-table-body {
  min-height: 0vh;
}
.statistic {
  display: flex;
  justify-content: center;
  cursor: pointer;
}
/deep/.ant-form-item {
  margin-bottom: 5px;
}
/deep/.ant-statistic {
  display: flex;
  align-items: center;
  justify-content:center;
  cursor: pointer;
}
/deep/.ant-statistic-title{
  margin-bottom:0;
  font-size: 18px;
  // font-weight: 700;
  color:#000;
}
</style>
