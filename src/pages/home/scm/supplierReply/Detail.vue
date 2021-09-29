<!--
 * @Author: max
 * @Date: 2021-09-23 13:59:52
 * @LastEditTime: 2021-09-29 15:20:09
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/scm/supplierReply/Detail.vue
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
              <a-input style="width: 200px" placeholder="请输入计划批号" v-decorator="['batchid']" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row v-if="advanced">
          <a-col :md="6" :sm="24">
            <a-form-item label="品名" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-input style="width: 200px" placeholder="请输入品名" v-decorator="['mitemname']" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="品号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-input style="width: 200px" placeholder="请输入品号" v-decorator="['mitemcode']" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select v-decorator="['status']" placeholder="请选择状态" style="width: 200px" >
                <a-select-option :value="item.ParamValue" v-for="(item, index) in stateList" :key="index">
                  {{ item.ParamName }}
                </a-select-option>
              </a-select>
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
    <a-card class="card" :bordered="false" :bodyStyle="{ padding: '16px' }">
      <div>
        <a-row type="flex" justify="center">
          <a-col :span="5"
            ><div class="statistic" @click="getStatisticList('PART_REPLY_NO_DIFF,NO_CONFIRM_DIFF,ALL_REPLY')">
              <a-statistic title="已回复笔数" :value="statistic.ReplyQty"
                ><template #suffix>
                  <span style="margin-left: 4px;font-size: 14px;">查看详情<a-icon type="double-right" /> </span></template
              ></a-statistic></div
          ></a-col>
          <a-col :span="5" class="statistic" @click="getStatisticList('REPLY_RELEASE_DIFF,CONFIRMED_DIFF')">
            <a-statistic title="有差异笔数" :value-style="{ color: '#cf1322' }" :value="statistic.DiffQty"
              ><template #suffix>
                <span style="margin-left: 4px;font-size: 14px;">查看详情<a-icon type="double-right" /> </span></template></a-statistic
          ></a-col>
          <a-col :span="5" class="statistic" @click="getStatisticList('REPLY_RELEASE_DIFF', 'Y')">
            <a-statistic title="有差异属于我的笔数" :value-style="{ color: '#cf1322' }" :value="statistic.MeDiffQty"
              ><template #suffix>
                <span style="margin-left: 4px;font-size: 14px;">查看详情<a-icon type="double-right" /> </span></template></a-statistic
          ></a-col>
          <a-col :span="5" class="statistic" @click="getStatisticList('NO_CONFIRM_DIFF', 'Y')">
            <a-statistic title="归属于我的未回复笔数" :value-style="{ color: '#cf1322' }" :value="statistic.MeNoReplyQty"
              ><template #suffix>
                <span style="margin-left: 4px;font-size: 14px;">查看详情<a-icon type="double-right" /> </span></template></a-statistic
          ></a-col>
          <a-col :span="4" class="statistic" @click="getListAll">
            <a-statistic title="总笔数" :value="statistic.AllQty"
              ><template #suffix>
                <span style="margin-left: 4px;font-size: 14px;">查看详情<a-icon type="double-right" /> </span></template></a-statistic
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
      <template slot="MatchStatus" slot-scope="text, record">
        <div>
          <a-tag color="green" v-if="text !== 'ERR_MATCH'">{{ record.MatchStatusName }}</a-tag>
          <a-tag color="red" v-else>{{ record.MatchStatusName }}</a-tag>
        </div>
      </template>
      <template slot="action" slot-scope="text, record">
        <div>
          <a style="margin-right: 8px" @click="details(record)">
            <a-icon type="profile" />
            详情
          </a>
        </div>
      </template>
    </a-table>
    <!-- 查看详情 -->
    <div>
      <a-drawer width="400" placement="right" :closable="true" :visible="isDrawer" @close="onClose">
        <a-descriptions title="详情" :column="1">
          <a-descriptions-item label="计划批号">{{ drawerItem.BatchNo }}</a-descriptions-item>
          <a-descriptions-item label="生产工厂">{{ drawerItem.PlantName }}</a-descriptions-item>
          <a-descriptions-item label="品号">{{ drawerItem.MitemCode }}</a-descriptions-item>
          <a-descriptions-item label="品名">{{ drawerItem.MitemName }}</a-descriptions-item>
          <a-descriptions-item label="规格">{{ drawerItem.Spec }}</a-descriptions-item>
          <a-descriptions-item label="需求日期">{{ drawerItem.RequirementDate }}</a-descriptions-item>
          <a-descriptions-item label="需求数量">{{ drawerItem.Qty }}</a-descriptions-item>
          <a-descriptions-item label="状态">
            <div>
              <a-tag color="green" v-if="drawerItem.Status == 'APPROVED'">已审核</a-tag>
              <a-tag color="red" v-else>未审核</a-tag>
            </div>
          </a-descriptions-item>
        </a-descriptions>
      </a-drawer>
    </div>
  </div>
</template>

<script>
import { getSupplierAction } from "@/services/web.js";
import ExportExcel from "@/utils/ExportExcel";
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: "3%",
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
    title: "规格",
    dataIndex: "Spec",
    align: "center",
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
    width: "5%",
  },
  {
    title: "供应商回复日期",
    dataIndex: "SupplierReplyDate",
    scopedSlots: { customRender: "SupplierReplyDate" },
    align: "center",
    width: "5%",
  },
  {
    title: "回复数量",
    dataIndex: "SupplierReplyQty",
    scopedSlots: { customRender: "SupplierReplyQty" },
    align: "center",
    width: "5%",
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
  },
  {
    title: "行项目",
    dataIndex: "LineItem",
    scopedSlots: { customRender: "LineItem" },
    align: "center",
  },
  {
    title: "采购订单数量",
    dataIndex: "TransitQty",
    scopedSlots: { customRender: "TransitQty" },
    align: "center",
  },
  {
    title: "计划状态",
    dataIndex: "MatchStatus",
    scopedSlots: { customRender: "MatchStatus" },
    align: "center",
  },
];
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
import { getParamData } from "@/services/admin.js";
export default {
  props: ["plantList"],
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
      plantid: "",
      week: "",
      drawerItem: [],
      isSearch: false,
      statistic: [],
      stateList: [],
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
          this.dataSource.forEach((item) => {
            if (item.PurchaseOrderMatchList.length > 0) {
              item = Object.assign(item, item.PurchaseOrderMatchList[0]);
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
          this.dataSource.forEach((item) => {
            if (item.PurchaseOrderMatchList.length > 0) {
              item = Object.assign(item, item.PurchaseOrderMatchList[0]);
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
      const dataSource = this.dataSource.map((item) => {
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
      const header = this.columns.map((item) => ({ key: item.dataIndex, title: item.title }));
      var timestamp = Date.parse(new Date());
      try {
        ExportExcel(header, dataSource, `物料需求明细_${timestamp}.xlsx`);
        this.$message.success("导出数据成功!");
      } catch (error) {
        // console.log(error);
        this.$message.error("导出数据失败");
      }
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
</style>
