<!--
 * @Author: max
 * @Date: 2021-09-23 13:59:52
 * @LastEditTime: 2021-10-12 17:16:51
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/scm/supplierReply/Exception.vue
-->
<template>
  <div>
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
            <a-form-item label="PMC" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-input placeholder="请输入PMC" allowClear style="width: 200px" v-decorator="['pmc']" />
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
            <a-form-item label="产品型号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-input style="width: 200px" allowClear placeholder="请输入产品型号" v-decorator="['mitemname']" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="BOM号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-input style="width: 200px" allowClear placeholder="请输入产品型号" v-decorator="['mitemcode']" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select v-decorator="['status']" placeholder="请选择状态" style="width: 200px">
                <a-select-option :value="item.ParamValue" v-for="(item, index) in stateList" :key="index">
                  {{ item.ParamName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <span style="margin-top: 3px;display: flex;justify-content: flex-end;margin-right: 10px;">
          <a-button type="primary" @click="search">查询</a-button>
          <a-button style="margin-left: 8px" @click="reset">重置</a-button>
          <a @click="toggleAdvanced" style="margin-left: 8px">
            {{ advanced ? "收起" : "展开" }}
            <a-icon :type="advanced ? 'up' : 'down'" />
          </a>
        </span>
      </div>
    </a-form>
    <!-- <div class="operator">
      <a-button :disabled="!hasPerm('export')" type="primary" @click="exportExcel" icon="export">导出</a-button>
    </div> -->
    <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
      <div>
        <a-row type="flex" justify="center">
          <a-col :span="5"
            ><div class="statistic" @click="getStatisticList('PART_REPLY_NO_DIFF,NO_CONFIRM_DIFF,ALL_REPLY')">
              <a-statistic title="已回复笔数:" :value="statistic.ReplyQty"
                ><template #suffix>
                  <span style="margin-left: 4px;font-size: 10px;">查看详情<a-icon type="double-right" /> </span></template
              ></a-statistic></div
          ></a-col>
          <a-col :span="5" class="statistic" @click="getStatisticList('REPLY_RELEASE_DIFF,CONFIRMED_DIFF')">
            <a-statistic title="有差异笔数:" :value-style="{ color: '#cf1322' }" :value="statistic.DiffQty"
              ><template #suffix>
                <span style="margin-left: 4px;font-size: 10px;">查看详情<a-icon type="double-right" /> </span></template></a-statistic
          ></a-col>
          <a-col :span="5" class="statistic" @click="getStatisticList('REPLY_RELEASE_DIFF', 'Y')">
            <a-statistic title="有差异属于我的笔数:" :value-style="{ color: '#cf1322' }" :value="statistic.MeDiffQty"
              ><template #suffix>
                <span style="margin-left: 4px;font-size: 10px;">查看详情<a-icon type="double-right" /> </span></template></a-statistic
          ></a-col>
          <a-col :span="5" class="statistic" @click="getStatisticList('NO_CONFIRM_DIFF', 'Y')">
            <a-statistic title="归属于我的未回复笔数:" :value-style="{ color: '#cf1322' }" :value="statistic.MeNoReplyQty"
              ><template #suffix>
                <span style="margin-left: 4px;font-size: 10px;">查看详情<a-icon type="double-right" /> </span></template></a-statistic
          ></a-col>
          <a-col :span="4" class="statistic" @click="getListAll">
            <a-statistic title="总笔数:" :value="statistic.AllQty"
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
      :scroll="{ y: scrollY, x: 2200 }"
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
      :rowKey="(dataSource) => dataSource.Id"
      bordered
    >
      <template slot="index" slot-scope="text, record, index">
        <div>
          <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
        </div>
      </template>
      <template slot="MatchStatus" slot-scope="text, record">
        <div>
          <a-tag color="green" v-if="text !== 'ERR_MATCH'">{{ record.MatchStatusName }}</a-tag>
          <a-tag color="red" v-else>{{ record.MatchStatusName }}</a-tag>
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
          <p v-for="(item, index) in text" :key="index">{{ item }}</p>
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
      <template slot="action" slot-scope="text, record" v-if="record.PurchaseId != undefined || record.PurchaseId != null">
        <div>
          <a style="margin-right: 8px" @click="consent(record)" :disabled="!hasPerm('consent')">
            <a-icon type="profile" />
            同意供应商交期
          </a>
        </div>
        <div>
          <a style="margin-right: 8px" @click="adjustDate(record)" :disabled="!hasPerm('adjust')">
            <a-icon type="profile" />
            调整供应商交期
          </a>
        </div>
      </template>
    </a-table>
    <adjust-date v-if="isAdjust" :adjustData="adjustData" @closeModal="closeModal"></adjust-date>
  </div>
</template>

<script>
import { getSupplierAction, setSupplierAction } from "@/services/web.js";
import ExportExcel from "@/utils/ExportExcel";
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
    dataIndex: "UserCreated",
    scopedSlots: { customRender: "UserCreated" },
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
    width: "60px",
  },
  {
    title: "计划状态",
    dataIndex: "MatchStatus",
    scopedSlots: { customRender: "MatchStatus" },
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
    fixed: "right",
    width: 140,
  },
];
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
import { getParamData } from "@/services/admin.js";
import AdjustDate from "./AdjustDate.vue";
import { splitData } from "@/utils/util.js";
export default {
  components: { AdjustDate },
  props: ["plantList"],
  data() {
    return {
      scrollY: "",
      loading: false,
      advanced: true,
      isAdjust: false,
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
      isSearch: false,
      statistic: [],
      stateList: [],
      adjustData: [],
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
  },
  methods: {
    splitData,
    closeModal() {
      this.isAdjust = false;
    },
    adjustDate(item) {
      this.isAdjust = true;
      this.adjustData = item;
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
    getListAll() {
      this.loading = true;
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
          this.isSearch = false;
        } else {
          this.loading = false;
        }
      });
    },
    getStatisticList(type, isme) {
      // console.log("111");
      this.loading = true;
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        matchstatus: type,
        isme: isme || "",
      };
      getSupplierAction(parmas, "reply/getall").then((res) => {
        if (res.data.success) {
          this.dataSource = res.data.data.list;
          this.setPurchaseOrderMatchList();
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
    setPurchaseOrderMatchList() {
      this.dataSource.forEach((item) => {
        if (item.PurchaseOrderMatchList.length > 0) {
          let PurchaseUserName = [];
          let SupplierName = [];
          let PurchaseOrderNo = [];
          let LineItem = [];
          let TransitQty = [];
          let SupplierReplyDate = [];
          let SupplierReplyQty = [];
          let PurchaseReplyResult = [];
          item.PurchaseOrderMatchList.map((items) => {
            PurchaseUserName.push(items.PurchaseUserName);
            SupplierName.push(items.SupplierName);
            PurchaseOrderNo.push(items.PurchaseOrderNo);
            LineItem.push(items.LineItem);
            TransitQty.push(items.TransitQty);
            SupplierReplyDate.push(items.SupplierReplyDate);
            SupplierReplyQty.push(items.SupplierReplyQty);
            PurchaseReplyResult.push(items.PurchaseReplyResult);
          });
          item.PurchaseUserName = PurchaseUserName;
          item.SupplierName = SupplierName;
          item.PurchaseOrderNo = PurchaseOrderNo;
          item.LineItem = LineItem;
          item.TransitQty = TransitQty;
          item.SupplierReplyDate = SupplierReplyDate;
          item.SupplierReplyQty = SupplierReplyQty;
          item.PurchaseReplyResult = PurchaseReplyResult;
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
    //收起展开
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    search() {
      this.loading = true;
      this.searchForm.validateFields((err, values) => {
        if (!err) {
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
              this.isSearch = true;
            }
          });
          // do something
        }
      });
    },
    exportExcel() {
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.total,
      };
      getSupplierAction(parmas, "reply/getall").then((res) => {
        if (res.data.success) {
          let list = res.data.data.list;
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
        }
      });
    },
    //同意供应商交期
    consent(item) {
      let parmas = {
        BatchId: item.BatchId,
        DetailId: item.Id,
        PurchaseId: item.PurchaseId,
      };
      setSupplierAction(parmas, "reply/agree").then((res) => {
        if (res.data.success) {
          this.$message.success("同意供应商交期成功!");
        }
      });
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
