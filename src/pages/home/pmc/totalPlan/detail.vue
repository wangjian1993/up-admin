<!--
 * @Author: max
 * @Date: 2021-09-02 18:16:28
 * @LastEditTime: 2021-11-02 16:25:56
 * @LastEditors: max
 * @Description: 物料需求总计划明细
 * @FilePath: /up-admin/src/pages/home/pmc/totalPlan/Detail.vue
-->

<template>
  <div>
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
          <a-col :md="6" :sm="24">
            <a-form-item label="周" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-week-picker placeholder="选择周" @change="weekChange" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select v-decorator="['planstatus']" placeholder="请选择状态" style="width: 200px">
                <a-select-option value="">全部</a-select-option>
                <a-select-option :value="item.ParamCode" v-for="(item, index) in stateList" :key="index">
                  {{ item.ParamName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="品名" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-input style="width: 200px" allowClear placeholder="请输入品名" v-decorator="['mitemname']" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="6" :sm="24">
            <a-form-item label="品号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-input style="width: 200px" allowClear placeholder="请输入品号" v-decorator="['mitemcode']" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="计划批号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-input style="width: 200px" allowClear placeholder="请输入计划批号" v-decorator="['batchno']" />
            </a-form-item>
          </a-col>
        </a-row>
      </div>
      <span style="display:flex;justify-content:flex-end">
        <a-button type="primary" @click="search" :disabled="!hasPerm('search')">查询</a-button>
        <a-button style="margin-left: 8px" @click="reset" :disabled="!hasPerm('search')">重置</a-button>
      </span>
    </a-form>
    <!-- <div class="operator">
      <a-button v-if="hasPerm('create')" icon="check-circle" type="primary" :disabled="!hasSelected" :loading="loading" @click="allCheck" style="margin-left: 8px">生成总计划</a-button>
      <a-button v-else icon="check-circle" type="primary" disabled :loading="loading" @click="allCheck" style="margin-left: 8px">生成总计划</a-button>
      <a-button v-if="hasPerm('delete')" icon="delete" type="primary" :disabled="!hasSelected" :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
      <a-button v-else icon="delete" type="primary" disabled :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
      <span style="margin-left: 8px">
        <template v-if="hasSelected">
          {{ `共选中 ${selectedRowKeys.length} 条` }}
        </template>
      </span>
    </div> -->
    <a-table v-if="hasPerm('search')" :columns="columns" :data-source="data" size="small" :scroll="{ y: scrollY }" :loading="loading" :pagination="pagination" @change="handleTableChange" bordered>
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
          <a-tag :color="record.MatchStatusName === '未匹配' || record.MatchStatusName === '匹配错误' || text === 'CANNOT_MATCH' || record.MatchStatusName === '推送异常' ? 'red' : 'green'">{{ record.MatchStatusName }}</a-tag>
        </div>
      </template>
      <template slot="RequirementDate" slot-scope="text">
        <div>
          <p>{{ splitData(text) }}</p>
        </div>
      </template>
      <template slot="action" slot-scope="text, record">
        <div>
          <a style="margin-right: 8px" @click="detail(record)">
            <a-icon type="profile" />
            查看详情
          </a>
        </div>
      </template>
    </a-table>
    <a-empty v-else description="暂无权限" />
    <div>
      <a-drawer width="400" placement="right" :closable="true" :visible="isDrawer" @close="onClose">
        <a-descriptions title="详情" :column="1">
          <a-descriptions-item label="计划批号">{{ drawerItem.BatchNo }}</a-descriptions-item>
          <a-descriptions-item label="生产工厂">{{ drawerItem.PlantName }}</a-descriptions-item>
          <a-descriptions-item label="品号">{{ drawerItem.MitemCode }}</a-descriptions-item>
          <a-descriptions-item label="品名">{{ drawerItem.MitemName }}</a-descriptions-item>
          <a-descriptions-item label=" 产品规格">{{ drawerItem.Spec }}</a-descriptions-item>
          <a-descriptions-item label="需求日期">{{ drawerItem.RequirementDate }}</a-descriptions-item>
          <a-descriptions-item label="需求数量">{{ drawerItem.Qty }}</a-descriptions-item>
          <a-descriptions-item label="错误信息">{{ drawerItem.Msg }}</a-descriptions-item>
          <a-descriptions-item label="计划状态">
            <div>
              <a-tag :color="drawerItem.StatusName === '待审' || drawerItem.StatusName === '匹配错误' || drawerItem.StatusName === '部分推送' || drawerItem.StatusName === '推送异常' ? 'red' : 'green'">{{ drawerItem.StatusName }}</a-tag>
            </div>
          </a-descriptions-item>
          <a-descriptions-item label="物料状态">
            <div>
              <a-tag :color="drawerItem.MatchStatusName === '未匹配' || drawerItem.MatchStatusName === '匹配错误' || drawerItem.MatchStatus === 'CANNOT_MATCH' || drawerItem.MatchStatusName === '推送异常' ? 'red' : 'green'">{{ drawerItem.MatchStatusName }}</a-tag>
            </div>
          </a-descriptions-item>
        </a-descriptions>
      </a-drawer>
    </div>
  </div>
</template>

<script>
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
    title: "生产工厂",
    dataIndex: "PlantName",
    scopedSlots: { customRender: "PlantName" },
    align: "center",
    width: "5%",
  },
  {
    title: "周",
    dataIndex: "Week",
    scopedSlots: { customRender: "Week" },
    align: "center",
    width: "5%",
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
    scopedSlots: { customRender: "Spec" },
    align: "center",
    width: "20%",
  },
  {
    title: "需求日期",
    dataIndex: "RequirementDate",
    scopedSlots: { customRender: "RequirementDate" },
    align: "center",
  },
  {
    title: "需求数量",
    dataIndex: "Qty",
    scopedSlots: { customRender: "Qty" },
    align: "center",
    width: "5%",
  },
  {
    title: "计划状态",
    dataIndex: "Status",
    scopedSlots: { customRender: "Status" },
    align: "center",
  },
  {
    title: "物料状态",
    dataIndex: "MatchStatus",
    scopedSlots: { customRender: "MatchStatus" },
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];
import getTableScroll from "@/utils/setTableHeight";
import { renderStripe } from "@/utils/stripe.js";
import { getMitemrequirement, mitemrequirementAction } from "@/services/web.js";
import { splitData } from "@/utils/util.js";
export default {
  props: ["plantList", "batchid", "stateList"],
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
      drawerItem: [],
      isDrawer: false,
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
      this.scrollY = getTableScroll(110);
    });
    if (this.batchid == "") {
      this.getListAll();
    }
  },
  methods: {
    splitData,
    detail(item) {
      // this.$router.push({ path: "/purchase/add", query: { id:item.Id} });
      // this.$emit("toDetail", item.Id);
      this.drawerItem = item;
      this.isDrawer = true;
    },
    onClose() {
      this.isDrawer = false;
    },
    weekChange(date, dateString) {
      let str = dateString.split("-");
      this.week = str[1].replace("周", "");
    },
    //获取列表数据
    getListAll() {
      console.log("batchid", this.batchid);
      this.loading = true;
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        batchno: this.batchid || "",
      };
      if (this.batchid) {
        this.$nextTick(() => {
          this.searchForm.setFieldsValue({
            batchno: this.batchid,
          });
        });
      }
      getMitemrequirement(parmas, "masterplan/getdetails").then((res) => {
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
      this.loading = true;
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          this.data = [];
          this.pagination.total = 0;
          if (this.week != "") {
            var w = this.week;
          }
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            plantid: values.plantid,
            week: w,
            pmc: values.pmc,
            mitemcode: values.mitemcode,
            mitemname: values.mitemcode,
            planstatus: values.planstatus,
            batchno: values.batchno,
          };
          getMitemrequirement(parmas, "masterplan/getdetails").then((res) => {
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
        disabled: record.Status !== "APPROVED", // Column configuration not to be checked
      },
    }),
    //多选删除
    allDel() {
      let self = this;
      self.$confirm({
        title: "确定要删除选中内容",
        onOk() {
          mitemrequirementAction(self.selectedRowKeys, "masterplan/delete").then((res) => {
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
        title: "确定要生成选中内容",
        onOk() {
          mitemrequirementAction(self.selectedRowKeys, "masterplan/generate").then((res) => {
            if (res.data.success) {
              self.selectedRowKeys = [];
              self.$message.success("生成成功!");
              self.getListAll();
            }
          });
        },
        onCancel() {},
      });
    },
    //单个删除
    actionBnt(item, type) {
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
  },
};
</script>

<style scoped lang="less">
/deep/.ant-table {
  min-height: 60vh;
}
</style>
