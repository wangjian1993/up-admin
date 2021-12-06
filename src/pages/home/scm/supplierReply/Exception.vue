<!--
 * @Author: max
 * @Date: 2021-09-23 13:59:52
 * @LastEditTime: 2021-12-06 16:38:24
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/scm/supplierReply/Exception.vue
-->
<template>
  <div>
    <a-spin tip="导出中..." :spinning="isExportLod">
      <a-form layout="horizontal" :form="searchForm">
        <div :class="advanced ? null : 'fold'">
          <a-row>
            <a-col :md="6" :sm="24">
              <a-form-item label="生产工厂" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-select v-decorator="['plantid']" style="width: 200px" placeholder="请选择生产工厂">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="PMC" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input placeholder="请输入PMC" disabled allowClear style="width: 150px" v-decorator="['pmc']" />
                <a-button @click="userSearch" style="margin-left: 8px" shape="circle" icon="search" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="周" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-week-picker placeholder="选择周" @change="weekChange" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="计划批号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入计划批号" v-decorator="['batchid']" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-if="advanced">
            <a-col :md="6" :sm="24">
              <a-form-item label="品名" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入产品型号" v-decorator="['mitemname']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="品号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入产品型号" v-decorator="['mitemcode']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="计划状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-select v-decorator="['status']" placeholder="请选择计划状态" style="width: 200px">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option :value="item.ParamValue" v-for="(item, index) in stateList" :key="index">
                    {{ item.ParamName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <span style="float: right; margin-top: 3px;">
            <a-button type="primary" @click="search">查询</a-button>
            <a-button style="margin-left: 8px" @click="reset">重置</a-button>
            <a @click="toggleAdvanced" style="margin-left: 8px">
              {{ advanced ? "收起" : "展开" }}
              <a-icon :type="advanced ? 'up' : 'down'" />
            </a>
          </span>
        </div>
      </a-form>
      <div class="operator">
        <a-button :disabled="!hasPerm('export')" type="primary" @click="exportExcel" icon="export">导出</a-button>
      </div>
      <a-card class="card" :bordered="false" style="margin-top: 10px;" :bodyStyle="{ padding: '5px' }">
        <div>
          <a-row type="flex" justify="center">
            <a-col :xxl="5" :xl="8" :lg="12"
              ><div class="statistic" @click="getStatisticList('10000')">
                <a-statistic title="已回复笔数:" :value="statistic.ReplyQty"
                  ><template #suffix>
                    <span style="margin-left: 4px;font-size: 10px;">查看详情<a-icon type="double-right" /> </span></template
                ></a-statistic></div
            ></a-col>
            <a-col :xxl="5" :xl="8" :lg="12" class="statistic" @click="getStatisticList('01000')">
              <a-statistic title="有差异笔数:" :value-style="{ color: '#cf1322' }" :value="statistic.DiffQty"
                ><template #suffix>
                  <span style="margin-left: 4px;font-size: 10px;">查看详情<a-icon type="double-right" /> </span></template></a-statistic
            ></a-col>
            <a-col :xxl="5" :xl="8" :lg="12" class="statistic" @click="getStatisticList('00100')">
              <a-statistic title="有差异属于我的笔数:" :value-style="{ color: '#cf1322' }" :value="statistic.MeDiffQty"
                ><template #suffix>
                  <span style="margin-left: 4px;font-size: 10px;">查看详情<a-icon type="double-right" /> </span></template></a-statistic
            ></a-col>
            <a-col :xxl="5" :xl="8" :lg="12" class="statistic" @click="getStatisticList('00010')">
              <a-statistic title="归属于我的未回复笔数:" :value-style="{ color: '#cf1322' }" :value="statistic.MeNoReplyQty"
                ><template #suffix>
                  <span style="margin-left: 4px;font-size: 10px;">查看详情<a-icon type="double-right" /> </span></template></a-statistic
            ></a-col>
            <a-col :xxl="4" :xl="8" :lg="12" class="statistic" @click="getListAll('statistic')">
              <a-statistic title="总笔数:" :value="statistic.AllQty"
                ><template #suffix>
                  <span style="margin-left: 4px;font-size: 10px;">查看详情<a-icon type="double-right" /> </span></template></a-statistic
            ></a-col>
          </a-row>
        </div>
      </a-card>
      <a-table :columns="columns" :data-source="dataSource" size="small" :scroll="{ y: scrollY, x: 2600 }" :loading="loading" :pagination="pagination" @change="handleTableChange" :rowKey="(dataSource) => dataSource.Id" bordered>
        <template slot="index" slot-scope="text, record, index">
          <div>
            <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
          </div>
        </template>
        <template slot="Status" slot-scope="text, record">
          <div>
            <a-tag :color="record.StatusName === '待审' || record.StatusName === '匹配错误' || record.StatusName === '部分推送' || record.StatusName === '推送异常' ? 'red' : 'green'">{{ record.StatusName }}</a-tag>
          </div>
        </template>
        <template slot="MatchStatus" slot-scope="text, record">
          <div>
            <a-tag :color="text === 'PUSHED_ERR' || text === 'ERR_MATCH' ? 'red' : 'green'">{{ record.MatchStatusName }}</a-tag>
          </div>
        </template>
        <template slot="RequirementDate" slot-scope="text">
          <p>{{ splitData(text) }}</p>
        </template>
        <template slot="PurchaseUserName" slot-scope="text">
          <div>
            <p v-for="(item, index) in text" :key="index">{{ item }}</p>
          </div>
        </template>
        <template slot="SupplierReplyDate" slot-scope="text">
          <div>
            <p v-for="(item, index) in text" :key="index">{{ splitData(item) }}</p>
          </div>
        </template>
        <template slot="SupplierReplyQty" slot-scope="text">
          <div>
            <p v-for="(item, index) in text" :key="index">{{ item }}</p>
          </div>
        </template>
        <template slot="PurchaseReplyResult" slot-scope="text">
          <div>
            <p v-for="(item, index) in text" :key="index">{{ item }}</p>
          </div>
        </template>
        <template slot="SupplierName" slot-scope="text">
          <div>
            <p v-for="(item, index) in text" :key="index">{{ item }}</p>
          </div>
        </template>
        <template slot="PurchaseOrderNo" slot-scope="text">
          <div>
            <p v-for="(item, index) in text" :key="index">{{ item }}</p>
          </div>
        </template>
        <template slot="LineItem" slot-scope="text">
          <div>
            <p v-for="(item, index) in text" :key="index">{{ item }}</p>
          </div>
        </template>
        <template slot="TransitQty" slot-scope="text">
          <div>
            <p v-for="(item, index) in text" :key="index">{{ item }}</p>
          </div>
        </template>
        <template slot="MatchedQty" slot-scope="text">
          <div>
            <p v-for="(item, index) in text" :key="index">{{ item }}</p>
          </div>
        </template>
        <template slot="SalesNos" slot-scope="text">
          <div>
            <p v-for="(item, index) in text" :key="index">{{ item }}</p>
          </div>
        </template>
        <template slot="action" slot-scope="text, record">
          <div v-if="record.SumSupplierReplyQty > 0">
            <a style="margin-right: 8px" @click="consent(record)" :disabled="!hasPerm('consent')">
              <a-icon type="check-square" />
              交期确认处理
            </a>
          </div>
          <!-- <div v-if="record.PurchaseId != undefined || record.PurchaseId != null">
          <a style="margin-right: 8px" @click="adjustDate(record)" :disabled="!hasPerm('adjust')">
            <a-icon type="profile" />
            调整供应商交期
          </a>
        </div> -->
          <div>
            <a style="margin-right: 8px" @click="details(record)">
              <a-icon type="profile" />
              详情
            </a>
          </div>
        </template>
      </a-table>
      <!-- <adjust-date v-if="isAdjust" :adjustData="adjustData" @closeModal="closeModal"></adjust-date> -->
      <!-- 查看详情 -->
      <div>
        <a-drawer width="400" placement="right" :closable="true" :visible="isDrawer" @close="onClose">
          <a-descriptions title="详情" :column="1">
            <a-descriptions-item v-for="(item, index) in filterData" :key="index" :label="item.title">{{ drawerItem[item.dataIndex] }}</a-descriptions-item>
            <a-descriptions-item label="计划状态">
              <div>
                <a-tag :color="drawerItem.StatusName === '待审' || drawerItem.StatusName === '匹配错误' || drawerItem.StatusName === '部分推送' || drawerItem.StatusName === '推送异常' ? 'red' : 'green'">{{ drawerItem.StatusName }}</a-tag>
              </div>
            </a-descriptions-item>
            <a-descriptions-item label="物料状态">
              <div>
                <a-tag :color="drawerItem.MatchStatusName === '未匹配' || drawerItem.MatchStatusName === '匹配错误' || drawerItem.Status === 'CANNOT_MATCH' ? 'red' : 'green'">{{ drawerItem.MatchStatusName }}</a-tag>
              </div>
            </a-descriptions-item>
            <a-descriptions-item label="错误信息">
              <div>
                {{ drawerItem.Msg }}
              </div>
            </a-descriptions-item>
          </a-descriptions>
        </a-drawer>
      </div>
      <user-list v-if="isUserList" @closeModal="closeUserModal" @okModal="okUserModal"></user-list>
      <delivery-process v-if="isDispose" :disposeData="disposeData" @closeModal="closeModal" @succeed="getListAll"></delivery-process>
    </a-spin>
  </div>
</template>

<script>
import { getSupplierAction } from "@/services/web.js";
import ExportExcel from "@/utils/ExportExcelJS";
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: "50px",
  },
  {
    title: "计划批号",
    dataIndex: "BatchNo",
    scopedSlots: { customRender: "BatchNo" },
    align: "center",
  },
  {
    title: "PMC",
    dataIndex: "UserName",
    scopedSlots: { customRender: "UserName" },
    align: "center",
  },
  {
    title: "生产工厂",
    dataIndex: "PlantName",
    scopedSlots: { customRender: "PlantName" },
    align: "center",
  },
  {
    title: "周",
    dataIndex: "Week",
    scopedSlots: { customRender: "Week" },
    align: "center",
    width: "50px",
  },
  {
    title: "品号",
    dataIndex: "MitemCode",
    scopedSlots: { customRender: "MitemCode" },
    align: "center",
  },
  {
    title: "品名",
    dataIndex: "MitemName",
    scopedSlots: { customRender: "MitemName" },
    align: "center",
  },
  {
    title: " 产品规格",
    dataIndex: "Spec",
    align: "center",
    width: "350px",
  },
  {
    title: "需求日期",
    dataIndex: "RequirementDate",
    scopedSlots: { customRender: "RequirementDate" },
    align: "center",
  },
  {
    title: "需求数量",
    dataIndex: "RequirementQty",
    scopedSlots: { customRender: "RequirementQty" },
    align: "center",
    width: "70px",
  },
  {
    title: "供应商回复日期",
    dataIndex: "SupplierReplyDate",
    scopedSlots: { customRender: "SupplierReplyDate" },
    align: "center",
  },
  {
    title: "回复数量",
    dataIndex: "SupplierReplyQty",
    scopedSlots: { customRender: "SupplierReplyQty" },
    align: "center",
    width: "70px",
  },
  {
    title: "采购沟通结果",
    dataIndex: "PurchaseReplyResult",
    scopedSlots: { customRender: "PurchaseReplyResult" },
    align: "center",
    width: "5%",
  },
  {
    title: "采购调整交期",
    dataIndex: "PurchaseChangeDate",
    scopedSlots: { customRender: "PurchaseChangeDate" },
    align: "center",
    width: "5%",
  },
  {
    title: "负责采购",
    dataIndex: "PurchaseUserName",
    scopedSlots: { customRender: "PurchaseUserName" },
    align: "center",
    width: "70px",
  },
  {
    title: "供应商",
    dataIndex: "SupplierName",
    scopedSlots: { customRender: "SupplierName" },
    align: "center",
  },
  {
    title: "采购订单号",
    dataIndex: "PurchaseOrderNo",
    scopedSlots: { customRender: "PurchaseOrderNo" },
    align: "center",
    width: "150px",
  },
  {
    title: "行项目",
    dataIndex: "LineItem",
    scopedSlots: { customRender: "LineItem" },
    align: "center",
    width: "60px",
  },
  {
    title: "采购订单数量",
    dataIndex: "TransitQty",
    scopedSlots: { customRender: "TransitQty" },
    align: "center",
    width: "120px",
  },
  {
    title: "已匹配数量",
    dataIndex: "MatchedQty",
    scopedSlots: { customRender: "MatchedQty" },
    align: "center",
    width: "100px",
  },
  {
    title: "关联销售订单",
    dataIndex: "SalesNos",
    scopedSlots: { customRender: "SalesNos" },
    align: "center",
    width: "120px",
  },
  {
    title: "计划状态",
    dataIndex: "Status",
    scopedSlots: { customRender: "Status" },
    align: "center",
    fixed: "right",
    width: 100,
  },
  {
    title: "物料状态",
    dataIndex: "MatchStatus",
    scopedSlots: { customRender: "MatchStatus" },
    align: "center",
    fixed: "right",
    width: 120,
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
    fixed: "right",
    width: 120,
  },
];
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
import { getParamData } from "@/services/admin.js";
// import AdjustDate from "./AdjustDate.vue";
import { splitData } from "@/utils/util.js";
import UserList from "@/components/app-user/UserList";
import DeliveryProcess from "./DeliveryProcess.vue";
export default {
  components: { UserList, DeliveryProcess },
  props: ["plantList"],
  data() {
    return {
      scrollY: "",
      loading: false,
      advanced: true,
      isAdjust: false,
      isDrawer: false,
      columns: columns,
      dataSource: [],
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
      isSearch: 0,
      statistic: [],
      stateList: [],
      adjustData: [],
      isUserList: false,
      isDispose: false,
      disposeData: [],
      isExportLod: false,
      statisticType: "",
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
    this.getParamData();
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
    filterData() {
      return this.columns.filter((obj) => {
        if (obj.dataIndex !== "Status" && obj.dataIndex !== "MatchStatus") {
          return obj.dataIndex;
        }
      });
    },
  },
  methods: {
    splitData,
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
    //关闭弹出框
    onClose() {
      this.isDrawer = false;
    },
    //查看详情
    details(item) {
      this.isDrawer = true;
      this.drawerItem = item;
      for (const key in this.drawerItem) {
        return this.drawerItem[key].length > 0;
      }
    },
    closeModal() {
      this.isAdjust = false;
      this.isDispose = false;
    },
    adjustDate(item) {
      this.isAdjust = true;
      this.adjustData = item;
    },
    getParamData() {
      let parmas = {
        groupcode: "MITEM_REQUIREMENT_STATUS",
      };
      getParamData(parmas).then((res) => {
        if (res.data.success) {
          this.stateList = res.data.data;
        }
      });
    },
    //重置搜索
    reset() {
      this.getListAll();
      this.getStatistic();
      this.week = "";
      this.searchForm.resetFields();
    },
    weekChange(date, dateString) {
      let str = dateString.split("-");
      this.week = str[1].replace("周", "");
    },
    getStatistic() {
      getSupplierAction("", "reply/gettotal").then((res) => {
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
    getListAll(type) {
      this.loading = true;
      if (type == "statistic") {
        this.pagination.current = 1;
      }
      this.statisticType = "";
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
      };
      getSupplierAction(parmas, "reply/getall").then((res) => {
        if (res.data.success) {
          this.dataSource = res.data.data.list;
          this.setPurchaseOrderMatchList();
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination = pagination;
          this.loading = false;
          this.isSearch = 0;
        } else {
          this.loading = false;
        }
      });
    },
    getStatisticList(type) {
      // console.log("111");
      this.loading = true;
      if (this.statisticType !== type) {
        this.pagination.current = 1;
      }
      this.statisticType = type;
      let values = this.searchForm.getFieldsValue();
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        plantid: values.plantid,
        batchid: values.batchid,
        week: this.week || "",
        pmc: values.pmc,
        status: values.status,
        mitemcode: values.mitemcode,
        mitemname: values.mitemname,
        fastcondition: type,
      };
      getSupplierAction(parmas, "reply/getall").then((res) => {
        if (res.data.success) {
          this.dataSource = res.data.data.list;
          this.setPurchaseOrderMatchList();
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination = pagination;
          this.loading = false;
          this.isSearch = 1;
        } else {
          this.loading = false;
        }
      });
    },
    setPurchaseOrderMatchList() {
      this.dataSource.forEach((item) => {
        if (item.PurchaseOrderMatchList !== null && item.PurchaseOrderMatchList.length > 0) {
          let PurchaseUserName = [];
          let SupplierName = [];
          let PurchaseOrderNo = [];
          let LineItem = [];
          let TransitQty = [];
          let SupplierReplyDate = [];
          let SupplierReplyQty = [];
          let PurchaseReplyResult = [];
          let PurchaseChangeDate = [];
          let SumSupplierReplyQty = 0;
          let MatchedQty = [];
          let SalesNos = [];
          item.PurchaseOrderMatchList.map((items) => {
            PurchaseUserName.push(items.PurchaseUserName);
            SupplierName.push(items.SupplierName);
            PurchaseOrderNo.push(items.PurchaseOrderNo);
            LineItem.push(items.LineItem);
            TransitQty.push(items.TransitQty);
            SupplierReplyDate.push(items.SupplierReplyDate);
            SupplierReplyQty.push(items.SupplierReplyQty);
            PurchaseReplyResult.push(items.PurchaseReplyResult);
            PurchaseChangeDate.push(items.PurchaseChangeDate);
            SumSupplierReplyQty += items.SupplierReplyQty;
            MatchedQty.push(items.RequirementQty);
            SalesNos.push(items.SalesNos);
          });
          item.PurchaseUserName = PurchaseUserName;
          item.SupplierName = SupplierName;
          item.PurchaseOrderNo = PurchaseOrderNo;
          item.LineItem = LineItem;
          item.TransitQty = TransitQty;
          item.SupplierReplyDate = SupplierReplyDate;
          item.SupplierReplyQty = SupplierReplyQty;
          item.SumSupplierReplyQty = SumSupplierReplyQty;
          item.PurchaseReplyResult = PurchaseReplyResult;
          item.PurchaseChangeDate = PurchaseChangeDate;
          item.MatchedQty = MatchedQty;
          item.SalesNos = SalesNos;
        }
      });
    },
    //分页
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      if (this.isSearch == 2) {
        this.search();
        return;
      }
      if (this.isSearch == 1) {
        this.getStatisticList(this.statisticType);
        return;
      }
      this.getListAll();
    },
    //收起展开
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          // console.log("Received values of form: ", values);
          this.dataSourcedata = [];
          this.pagination.total = 0;
          if (this.week != "") {
            var w = this.week;
          }
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            plantid: values.plantid,
            batchid: values.batchid,
            week: w,
            pmc: values.pmc,
            status: values.status,
            mitemcode: values.mitemcode,
            mitemname: values.mitemname,
          };
          getSupplierAction(parmas, "reply/getall").then((res) => {
            if (res.data.success) {
              this.dataSource = res.data.data.list;
              this.setPurchaseOrderMatchList();
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.recordsTotal;
              this.pagination = pagination;
              this.loading = false;
              this.isSearch = 2;
            }
          });
          // do something
        }
      });
    },
    exportExcel() {
      this.isExportLod = true;
      let values = this.searchForm.getFieldsValue();
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.total,
         plantid: values.plantid,
        batchid: values.batchid,
        week: this.week || "",
        pmc: values.pmc,
        status: values.status,
        mitemcode: values.mitemcode,
        mitemname: values.mitemname,
        fastcondition: this.statisticType,
      };
      getSupplierAction(parmas, "reply/getall").then((res) => {
        if (res.data.success) {
          let list = res.data.data.list;
          list.forEach((item) => {
            if (item.PurchaseOrderMatchList !== null && item.PurchaseOrderMatchList.length > 0) {
              let PurchaseUserName = [];
              let SupplierName = [];
              let PurchaseOrderNo = [];
              let LineItem = [];
              let TransitQty = [];
              let SupplierReplyDate = [];
              let SupplierReplyQty = [];
              let PurchaseReplyResult = [];
              let PurchaseChangeDate = [];
              let MatchedQty = [];
              let SalesNos = [];
              item.PurchaseOrderMatchList.map((items) => {
                PurchaseUserName.push(items.PurchaseUserName);
                SupplierName.push(items.SupplierName);
                PurchaseOrderNo.push(items.PurchaseOrderNo);
                LineItem.push(items.LineItem);
                TransitQty.push(items.TransitQty);
                SupplierReplyDate.push(items.SupplierReplyDate);
                SupplierReplyQty.push(items.SupplierReplyQty);
                PurchaseReplyResult.push(items.PurchaseReplyResult);
                PurchaseChangeDate.push(item.PurchaseChangeDate);
                MatchedQty.push(items.RequirementQty);
                SalesNos.push(items.SalesNos);
              });
              item.PurchaseUserName = PurchaseUserName;
              item.SupplierName = SupplierName;
              item.PurchaseOrderNo = PurchaseOrderNo;
              item.LineItem = LineItem;
              item.TransitQty = TransitQty;
              item.SupplierReplyDate = SupplierReplyDate;
              item.SupplierReplyQty = SupplierReplyQty;
              item.PurchaseReplyResult = PurchaseReplyResult;
              item.PurchaseChangeDate = PurchaseChangeDate;
              item.MatchedQty = MatchedQty;
              item.SalesNos = SalesNos;
            }
            item.Status = item.StatusName;
            item.MatchStatus = item.MatchStatusName;
            item.RequirementDate = splitData(item.RequirementDate);
          });
          const dataSource = list.map((item) => {
            Object.keys(item).forEach((key) => {
              // 后端传null node写入会有问题
              if (item[key] === null) {
                item[key] = "";
              }
              if (Array.isArray(item[key])) {
                item[key] = item[key].join(",");
              }
            });
            return item;
          });
          const header = [];
          this.columns.map((item) => {
            if (item.dataIndex) {
              header.push({ key: item.dataIndex, title: item.title });
            }
          });
          var timestamp = Date.parse(new Date());
          try {
            ExportExcel(header, dataSource, `物料需求明细_${timestamp}.xlsx`);
            this.$message.success("导出数据成功!");
          } catch (error) {
            // console.log(error);
            this.$message.error("导出数据失败");
          }
          this.isExportLod = false;
        }
      });
    },
    //同意供应商交期
    consent(item) {
      this.isDispose = true;
      this.disposeData = item;
      // let parmas = {
      //   BatchId: item.BatchId,
      //   DetailId: item.Id,
      //   PurchaseId: item.PurchaseId,
      // };
      // setSupplierAction(parmas, "reply/agree").then((res) => {
      //   if (res.data.success) {
      //     this.$message.success("同意供应商交期成功!");
      //   }
      // });
    },
  },
};
</script>

<style scoped lang="less">
/deep/.ant-table {
  min-height: 0vh;
}
/deep/.ant-table-body {
  min-height: 0vh;
}
.statistic {
  display: flex;
  justify-content: center;
  cursor: pointer;
}
/deep/.ant-statistic {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
/deep/.ant-statistic-title {
  margin-bottom: 0;
  font-size: 18px;
  // font-weight: 700;
  color: #000;
}
/deep/.ant-table {
  min-height: 55vh;
}
</style>
