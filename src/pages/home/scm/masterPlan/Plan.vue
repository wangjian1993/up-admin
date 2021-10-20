<!--
 * @Author: max
 * @Date: 2021-09-23 13:59:33
 * @LastEditTime: 2021-10-20 16:28:54
 * @LastEditors: max
 * @Description: 物料需求总计划
 * @FilePath: /up-admin/src/pages/home/scm/masterPlan/Plan.vue
-->
<template>
  <div>
    <a-form layout="horizontal" :form="searchForm">
      <div>
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
            <a-form-item label="计划状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select v-decorator="['planstatus']" placeholder="请选择状态" style="width: 200px">
                 <a-select-option value="">全部</a-select-option>
                  <a-select-option :value="item.ParamValue" v-for="(item, index) in stateList" :key="index">
                    {{ item.ParamName }}
                  </a-select-option>
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
      <!-- <a-button icon="interaction" type="primary" :disabled="!hasPerm('matching')" @click="matching" style="margin-left: 8px">手动匹配</a-button> -->
      <a-button v-if="hasPerm('approve')" icon="check-circle" type="primary" :disabled="!hasSelected" :loading="loading" @click="allCheck" style="margin-left: 8px">审核发布</a-button>
      <a-button v-else icon="check-circle" type="primary" disabled :loading="loading" @click="allCheck" style="margin-left: 8px">审核发布</a-button>
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
       <template slot="StatusName" slot-scope="text">
        <div>
          <a-tag :color="text === '待审' || text === '匹配错误' || text === '部分推送' || text === '推送异常' || text == '有差异_未确认' ? 'red' : 'green'">{{ text }}</a-tag>
        </div>
      </template>
      <template slot="action" slot-scope="text, record">
        <div>
          <a style="margin-right: 8px" v-if="record.StatusName === '匹配错误' || record.StatusName === '推送异常'||record.StatusName === '部分推送'||record.StatusName === '部分匹配'" :disabled="!hasPerm('matching')" @click="matching(record)">
            <a-icon type="interaction" />
            手动匹配
          </a>
          <a style="margin-right: 8px" @click="detail(record)">
            <a-icon type="profile" />
            查看明细
          </a>
        </div>
      </template>
    </a-table>
    <a-empty v-else description="暂无权限" />
    <matching v-if="isMatching" :matchingData="matchingData" :plantList="plantList" @closeModal="closeModal" @succeed="getListAll"></matching>
     <user-list v-if="isUserList" @closeModal="closeUserModal" @okModal="okUserModal"></user-list>
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
    width: "5%",
  },
  {
    title: "导入时间",
    dataIndex: "DateTimeCreated",
    scopedSlots: { customRender: "DateTimeCreated" },
    align: "center",
  },
  {
    title: "导入数量",
    dataIndex: "Qty",
    scopedSlots: { customRender: "Qty" },
    align: "center",
  },
  {
    title: "计划状态",
    dataIndex: "StatusName",
    scopedSlots: { customRender: "StatusName" },
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
import { getScmAction, setScmAction } from "@/services/web.js";
import Matching from "./Matching";
import UserList from '@/components/app-user/UserList'
export default {
  components: { Matching,UserList},
  props: ["plantList",'stateList'],
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
      isMatching: false,
      matchingData:[],
      isUserList:false
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
      this.scrollY = getTableScroll();
    });
    this.getListAll();
  },
  methods: {
    //pmc选择
    userSearch(){
      this.isUserList =true
    },
    closeUserModal(){
      this.isUserList =false
    },
    okUserModal(item){
      this.isUserList =false;
      this.searchForm.setFieldsValue({
        pmc:item.Name
      });
    },
    matching(item) {
      this.isMatching = true;
      this.matchingData = item;
    },
    closeModal(){
        this.isMatching = false;
    },
    detail(item) {
      // this.$router.push({ path: "/purchase/add", query: { id:item.Id} });
      this.$emit("toDetail", item.BatchNo);
    },
    weekChange(date, dateString) {
      let str = dateString.split("-");
      this.week = str[1].replace("周", "");
    },
    //获取列表数据
    getListAll() {
      this.loading = true;
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
      };
      getScmAction(parmas, "requirement/getall").then((res) => {
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
            planstatus:values.planstatus
          };
          getScmAction(parmas, "requirement/getall").then((res) => {
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
          setScmAction(self.selectedRowKeys, "masterplan/delete").then((res) => {
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
          setScmAction(self.selectedRowKeys, "requirement/release").then((res) => {
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
      let parmas = [];
      parmas.push(item.Id);
      setScmAction(parmas, type).then((res) => {
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
// /deep/.ant-table {
//   min-height: 0vh;
// }
// /deep/.ant-table-body {
//   min-height: 60vh;
// }
</style>
