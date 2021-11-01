<!--
 * @Author: max
 * @Date: 2021-09-02 18:16:28
 * @LastEditTime: 2021-11-01 14:49:43
 * @LastEditors: max
 * @Description: 物料需求总计划
 * @FilePath: /up-admin/src/pages/home/pmc/totalPlan/Total.vue
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
            <a-form-item label="PMC" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-input placeholder="请输入PMC" disabled allowClear style="width: 150px" v-decorator="['pmc']" />
              <a-button @click="userSearch" style="margin-left: 8px" shape="circle" icon="search" />
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
      <a-button v-if="hasPerm('create')" icon="check-circle" type="primary" :disabled="!hasSelected" :loading="loading" @click="allCheck" style="margin-left: 8px">审核发布</a-button>
      <a-button v-else icon="check-circle" type="primary" disabled :loading="loading" @click="allCheck" style="margin-left: 8px">审核发布</a-button>
      <!-- <a-button v-if="hasPerm('delete')" icon="delete" type="primary" :disabled="!hasSelected" :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
      <a-button v-else icon="delete" type="primary" disabled :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button> -->
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
      <template slot="Status" slot-scope="text,record">
        <div>
          <a-tag :color="record.StatusName === '待审' || record.StatusName === '匹配错误' || record.StatusName === '部分推送' || record.StatusName === '推送异常' || record.StatusName === '有差异_未确认'? 'red' : 'green'">{{ record.StatusName }}</a-tag>
        </div>
      </template>
      <template slot="action" slot-scope="text, record">
        <div>
          <a style="margin-right: 8px" @click="detail(record.BatchNo,'3')">
            <a-icon type="profile" />
            查看明细
          </a>
          <a style="margin-right: 8px" @click="detail(record.BatchNo,'4')">
            <a-icon type="profile" />
            查看合并明细
          </a>
        </div>
      </template>
    </a-table>
    <a-empty v-else description="暂无权限" />
    <user-list v-if="isUserList" @closeModal="closeUserModal" @okModal="okUserModal"></user-list>
    <!-- 查看详情 -->
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
    width: "5%",
  },
  {
    title: "计划状态",
    dataIndex: "Status",
    scopedSlots: { customRender: "Status" },
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
import { getMitemrequirement,setScmAction } from "@/services/web.js";
import UserList from '@/components/app-user/UserList'
export default {
  components: {UserList},
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
      isSearch:false,
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
    detail(id,tab) {
      this.$emit("toDetail",id,tab);
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
      getMitemrequirement(parmas, "masterplan/getgrenatelist").then((res) => {
        if (res.data.success) {
          this.data = res.data.data.list;
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination = pagination;
          this.loading = false;
          this.isSearch =false
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
      this.week =""
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
          if(this.week != ""){
            var w =this.week
          }
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            plantid: values.plantid,
            week: w,
            pmc: values.pmc,
            planstatus:values.planstatus
          };
          getMitemrequirement(parmas, "masterplan/getgrenatelist").then((res) => {
            if (res.data.success) {
              this.data = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.recordsTotal;
              this.pagination = pagination;
              this.loading = false;
              this.isSearch =true
            }
          });
          // do something
        }
      });
    },
    //多选审批
    allCheck() {
      let self = this;
      self.$confirm({
        title: "确定要审核发布选中内容",
        onOk() {
          setScmAction(self.selectedRowKeys, "requirement/release").then((res) => {
            if (res.data.success) {
              self.selectedRowKeys = [];
              self.$message.success(res.data.data);
              self.getListAll();
            }
          });
        },
        onCancel() {},
      });
    },
    //分页
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      if(this.isSearch){
        this.search();
        return;
      }
      this.getListAll();
    },
  },
};
</script>

<style scoped lang="less">
</style>
