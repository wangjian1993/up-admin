<!--
 * @Author: max
 * @Date: 2021-09-23 14:01:20
 * @LastEditTime: 2021-10-12 17:48:37
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/scm/masterPlan/Exception.vue
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
              <a-input style="width: 200px" allowClear placeholder="请输入BOM号" v-decorator="['mitemcode']" />
            </a-form-item>
          </a-col>
        </a-row>
      </div>
      <span style="float: right; margin-top: 3px;">
        <a-button type="primary" @click="search">查询</a-button>
        <a-button style="margin-left: 8px" @click="reset">重置</a-button>
        <a @click="toggleAdvanced" style="margin-left: 8px">
          {{ advanced ? "收起" : "展开" }}
          <a-icon :type="advanced ? 'up' : 'down'" />
        </a>
      </span>
    </a-form>
    <div class="operator">
      <a-button :disabled="!hasPerm('export')" type="primary" @click="exportExcel" icon="export">导出</a-button>
    </div>
    <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
      <div>
        <a-row type="flex" justify="center">
          <a-col :span="6"
            ><div class="statistic" @click="getStatisticList('1000')">
              <a-statistic title="已匹配笔数:" :value="statistic.MatchedQty"
                ><template #suffix>
                  <span style="margin-left: 4px;font-size: 10px;">查看详情<a-icon type="double-right" /> </span></template
              ></a-statistic></div
          ></a-col>
          <a-col :span="6" class="statistic" @click="getStatisticList('0100')">
            <a-statistic title="未匹配笔数:" :value-style="{ color: '#cf1322' }" :value="statistic.NoMatchQty"
              ><template #suffix>
                <span style="margin-left: 4px;font-size: 10px;">查看详情<a-icon type="double-right" /> </span></template></a-statistic
          ></a-col>
          <a-col :span="6" class="statistic" @click="getStatisticList('0010')">
            <a-statistic title="未匹配属于我的笔数:" :value-style="{ color: '#cf1322' }" :value="statistic.MeQty"
              ><template #suffix>
                <span style="margin-left: 4px;font-size: 10px;">查看详情<a-icon type="double-right" /> </span></template></a-statistic
          ></a-col>
          <a-col :span="6" class="statistic" @click="getListAll">
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
      :scroll="{ y: scrollY, x: 2000 }"
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
          <a-tag :color="text === 'PUSHED_ERR' || text === 'ERR_MATCH'? 'red' : 'green'">{{ record.MatchStatusName }}</a-tag>
        </div>
      </template>
      <template slot="PurchaseUserName" slot-scope="text">
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
      <template slot="action" slot-scope="text, record">
        <div>
          <a style="margin-right: 8px" @click="matching(record)" v-if="record.MatchStatusName === '未匹配' || record.MatchStatusName == '匹配异常' || record.MatchStatusName == '推送异常'|| record.MatchStatusName == '匹配错误'">
            <a-icon type="profile" />
            手动匹配
          </a>
        </div>
      </template>
    </a-table>
    <matching v-if="isMatching" :matchingData="matchingData" :plantList="plantList" @closeModal="closeModal" @succeed="getListAll"></matching>
  </div>
</template>

<script>
import { getScmAction } from "@/services/web.js";
import ExportExcel from "@/utils/ExportExcel";
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: "50px"
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
    width: "50px"
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
    width: "350px"
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
    width: "100px"
  },
  {
    title: "负责采购",
    dataIndex: "PurchaseUserName",
    scopedSlots: { customRender: "PurchaseUserName" },
    align: "center",
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
    width: "150px"
  },
  {
    title: "行项目",
    dataIndex: "LineItem",
    scopedSlots: { customRender: "LineItem" },
    align: "center",
    width: "70px"
  },
  {
    title: "采购订单数量",
    dataIndex: "TransitQty",
    scopedSlots: { customRender: "TransitQty" },
    align: "center",
  },
  {
    title: "物料状态",
    dataIndex: "MatchStatus",
    scopedSlots: { customRender: "MatchStatus" },
    align: "center",
    fixed: "right",
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
import Matching from "./Matching";
export default {
  components: { Matching },
  data() {
    return {
      scrollY: "",
      loading: false,
      advanced: true,
      columns: columns,
      dataSource: [],
      isDrawer: false,
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
      plantList: [],
      plantid: "",
      week: "",
      drawerItem: [],
      isSearch: false,
      statistic: [],
      isMatching: false,
      matchingData: [],
    };
  },
  updated() {
    renderStripe();
  },
  created() {
    this.$nextTick(() => {
      this.scrollY = getTableScroll(160);
    });
    this.getListAll();
    this.getPlant();
    this.getStatistic();
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  methods: {
    //关闭弹出框
    matching(item) {
      this.isMatching = true;
      this.matchingData = item;
      this.matchingData.Id =item.BatchId
    },
    closeModal() {
      this.isMatching = false;
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
    getPlant() {
      let parmas1 = {
        entertypecode: "PLANT",
      };
      getScmAction(parmas1, "requirement/getlistbytypecode").then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
          this.plantid = this.plantList[0].EnterId;
        }
      });
    },
    getStatistic() {
      getScmAction("", "requirement/detail/gettotal").then((res) => {
        if (res.data.success) {
          this.statistic = res.data.data;
        }
      });
    },
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    getCheckboxProps: (record) => ({
      props: {
        disabled: record.MatchStatusName === '未匹配' && record.MatchStatusName === '匹配异常' && record.MatchStatusName === '推送异常', // Column configuration not to be checked
      },
    }),
    //获取列表
    getListAll() {
      this.loading = true;
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        batchid: "",
      };
      getScmAction(parmas, "requirement/detail/getall").then((res) => {
        if (res.data.success) {
          this.dataSource = res.data.data.list;
          this.dataSource.forEach((item) => {
            if (item.PurchaseOrderMatchList.length > 0) {
              let PurchaseUserName = [];
              let SupplierName = [];
              let PurchaseOrderNo = [];
              let LineItem = [];
              let TransitQty = [];
              item.PurchaseOrderMatchList.map((items) => {
                PurchaseUserName.push(items.PurchaseUserName);
                SupplierName.push(items.SupplierName);
                PurchaseOrderNo.push(items.PurchaseOrderNo);
                LineItem.push(items.LineItem);
                TransitQty.push(items.TransitQty);
              });
              item.PurchaseUserName = PurchaseUserName;
              item.SupplierName = SupplierName;
              item.PurchaseOrderNo = PurchaseOrderNo;
              item.LineItem = LineItem;
              item.TransitQty = TransitQty;
            }
          });
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
    getStatisticList(type) {
      console.log("111");
      this.loading = true;
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        fastcondition: type,
      };
      getScmAction(parmas, "requirement/detail/getall").then((res) => {
        if (res.data.success) {
          this.dataSource = res.data.data.list;
          this.dataSource.forEach((item) => {
            if (item.PurchaseOrderMatchList.length > 0) {
              let PurchaseUserName = [];
              let SupplierName = [];
              let PurchaseOrderNo = [];
              let LineItem = [];
              let TransitQty = [];
              item.PurchaseOrderMatchList.map((items) => {
                PurchaseUserName.push(items.PurchaseUserName);
                SupplierName.push(items.SupplierName);
                PurchaseOrderNo.push(items.PurchaseOrderNo);
                LineItem.push(items.LineItem);
                TransitQty.push(items.TransitQty);
              });
              item.PurchaseUserName = PurchaseUserName;
              item.SupplierName = SupplierName;
              item.PurchaseOrderNo = PurchaseOrderNo;
              item.LineItem = LineItem;
              item.TransitQty = TransitQty;
            }
          });
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
          console.log("Received values of form: ", values);
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
            mitemcode: values.mitemcode,
            mitemname: values.mitemname,
          };
          getScmAction(parmas, "requirement/detail/getall").then((res) => {
            if (res.data.success) {
              this.dataSource = res.data.data.list;
              this.dataSource.forEach((item) => {
            if (item.PurchaseOrderMatchList.length > 0) {
              let PurchaseUserName = [];
              let SupplierName = [];
              let PurchaseOrderNo = [];
              let LineItem = [];
              let TransitQty = [];
              item.PurchaseOrderMatchList.map((items) => {
                PurchaseUserName.push(items.PurchaseUserName);
                SupplierName.push(items.SupplierName);
                PurchaseOrderNo.push(items.PurchaseOrderNo);
                LineItem.push(items.LineItem);
                TransitQty.push(items.TransitQty);
              });
              item.PurchaseUserName = PurchaseUserName;
              item.SupplierName = SupplierName;
              item.PurchaseOrderNo = PurchaseOrderNo;
              item.LineItem = LineItem;
              item.TransitQty = TransitQty;
            }
          });
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
      getScmAction(parmas, "requirement/detail/getall").then((res) => {
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
