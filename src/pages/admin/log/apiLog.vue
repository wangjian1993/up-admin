<!--
 * @Author: max
 * @Date: 2021-08-17 08:26:18
 * @LastEditTime: 2022-02-24 16:43:37
 * @LastEditors: max
 * @Description: API日志
 * @FilePath: /up-admin/src/pages/admin/log/apiLog.vue
-->
<template>
  <!-- 搜索 -->
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <div class="search-box">
      <a-row type="flex" justify="space-between">
        <a-col :sm="24" :md="24" :xl="24">
          <a-form :form="searchForm" class="form-box">
            <div>
              <a-form-item>
                <a-range-picker style="width: 400px" v-decorator="['range-time-picker']" show-time format="YYYY-MM-DD HH:mm:ss" />
              </a-form-item>
            </div>
            <div style="margin-left:10px">
              <a-form-item>
                <a-input placeholder="API访问耗时(毫秒)" allowClear style="width: 200px" v-decorator="['elapsetime']" />
              </a-form-item>
            </div>
            <div style="margin-left:10px">
              <a-form-item>
                <a-input placeholder="API路径" allowClear style="width: 200px" v-decorator="['apiurl']" />
              </a-form-item>
            </div>
            <div style="margin-left:10px">
              <a-form-item>
                <a-checkbox v-decorator="['orderdesc']">
                  按耗时降序排列
                </a-checkbox>
              </a-form-item>
            </div>
            <div style="margin-top: 3px;margin-left:10px">
              <a-button :disabled="!hasPerm('search')" type="primary" icon="search" style="margin:0 10px" @click="search">搜索</a-button>
              <a-button :disabled="!hasPerm('search')" @click="reset" icon="reload">重置</a-button>
            </div>
          </a-form>
        </a-col>
      </a-row>
    </div>
    <!-- 列表 -->
    <div class="tab">
      <a-table v-if="hasPerm('search')" :columns="columns" :data-source="data" size="small" :scroll="{ y: scrollY, x: 2200 }" :loading="loading" :pagination="pagination" @change="handleTableChange" bordered>
        <template slot="index" slot-scope="text, record, index">
          <div>
            <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
          </div>
        </template>
        <a slot="ReturnResult" slot-scope="text" @click="result(text)">查看结果</a>
        <template slot="action" slot-scope="text, record">
          <div>
            <a style="margin-right: 8px" @click="detail(record)" :disabled="!hasPerm('details')">
              <a-icon type="edit" />
              详情
            </a>
            <a style="margin-right: 8px" :disabled="!hasPerm('trace')" @click="trace(record)">
              <a-icon type="profile" />
              跟踪
            </a>
          </div>
        </template>
      </a-table>
      <a-empty v-else description="暂无权限" />
    </div>
    <!-- 查看结果 -->
    <div>
      <a-modal title="查看结果" :visible="resultModal" closable :footer="null" @cancel="handleCancel">
        <p>{{ resultStr }}</p>
      </a-modal>
    </div>
    <!-- 跟踪 -->
    <div>
      <Trace v-if="traceModal" :traceId="traceId" @close="handleCancel"></Trace>
    </div>
    <!-- 查看详情 -->
    <div>
      <a-drawer width="600" placement="right" :closable="true" :visible="isDrawer" @close="onClose">
        <a-descriptions title="api详情" :column="1">
          <a-descriptions-item label="API地址">{{ drawerItem.APIUrl }}</a-descriptions-item>
          <a-descriptions-item label="访问方式">{{ drawerItem.AccessMothod }}</a-descriptions-item>
          <a-descriptions-item label="参数">{{ drawerItem.QueryString }}</a-descriptions-item>
          <a-descriptions-item label="客户端IP">{{ drawerItem.InComimgIp }}</a-descriptions-item>
          <a-descriptions-item label="端口号">{{ drawerItem.InComingPort }}</a-descriptions-item>
          <a-descriptions-item label="服务器IP">{{ drawerItem.ServerIp }}</a-descriptions-item>
          <a-descriptions-item label="端口号">{{ drawerItem.ServerPort }}</a-descriptions-item>
          <a-descriptions-item label="耗时(毫秒)">{{ drawerItem.ElapseTime }}</a-descriptions-item>
          <a-descriptions-item label="执行方式">{{ drawerItem.InvokeMothod }}</a-descriptions-item>
          <a-descriptions-item label="执行编码">{{ drawerItem.TracePath }}</a-descriptions-item>
          <a-descriptions-item label="API返回数据">{{ drawerItem.ReturnResult }}</a-descriptions-item>
          <a-descriptions-item label="创建时间">{{ drawerItem.DateTimeCreated }}</a-descriptions-item>
          <a-descriptions-item label="操作用户">{{ drawerItem.UserLoginId }}</a-descriptions-item>
        </a-descriptions>
      </a-drawer>
    </div>
  </a-card>
</template>
<script>
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 80,
  },
  {
    title: "创建时间",
    dataIndex: "DateTimeCreated",
    scopedSlots: { customRender: "DateTimeCreated" },
    align: "center",
    width: 150,
  },
  {
    title: "操作用户",
    dataIndex: "UserLoginId",
    scopedSlots: { customRender: "UserLoginId" },
    align: "center",
    width: 80,
  },
  {
    title: "客户端IP",
    dataIndex: "InComimgIp",
    scopedSlots: { customRender: "InComimgIp" },
    align: "center",
    width: 100,
  },
  {
    title: "端口号",
    dataIndex: "InComingPort",
    scopedSlots: { customRender: "InComingPort" },
    align: "center",
    width: 80,
  },
  {
    title: "服务器IP",
    dataIndex: "ServerIp",
    scopedSlots: { customRender: "ServerIp" },
    align: "center",
    width: 120,
  },
  {
    title: "端口号",
    dataIndex: "ServerPort",
    scopedSlots: { customRender: "ServerPort" },
    align: "center",
    width: 80,
  },
  {
    title: "耗时(毫秒)",
    dataIndex: "ElapseTime",
    scopedSlots: { customRender: "ElapseTime" },
    align: "center",
    width: 100,
  },
  {
    title: "访问方式",
    dataIndex: "AccessMothod",
    scopedSlots: { customRender: "AccessMothod" },
    align: "center",
    width: 80,
  },
  {
    title: "状态码",
    dataIndex: "StatusCode",
    scopedSlots: { customRender: "StatusCode" },
    align: "center",
    width: 60,
  },
  {
    title: "API地址",
    dataIndex: "APIUrl",
    scopedSlots: { customRender: "APIUrl" },
    align: "center",
    width: 200,
  },
  {
    title: "执行方式",
    dataIndex: "InvokeMothod",
    scopedSlots: { customRender: "InvokeMothod" },
    align: "center",
    width: 200,
  },
  {
    title: "执行编码",
    dataIndex: "TracePath",
    scopedSlots: { customRender: "TracePath" },
    align: "center",
    width: 100,
  },
  {
    title: "API返回结果",
    dataIndex: "ReturnResult",
    scopedSlots: { customRender: "ReturnResult" },
    align: "center",
    width: 120,
    fixed: "right",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
    fixed: "right",
    width: 130,
  },
];
import { getLogAction } from "@/services/admin.js";
import { renderStripe } from "@/utils/stripe.js";
import Trace from "./trace.vue";
import getTableScroll from "@/utils/setTableHeight";
export default {
  components: { Trace },
  data() {
    return {
      data: [],
      columns,
      isEdit: false,
      resultModal: false,
      traceModal: false,
      traceId: "",
      resultStr: "",
      editForm: [],
      title: "添加机构类型",
      loading: true,
      isDrawer: false,
      visible: false,
      drawerItem: [],
      pagination: {
        current: 1,
        total: 0,
        pageSize: 100, //每页中显示10条数据
        showSizeChanger: true,
        showLessItems: true,
        showQuickJumper: true,
        pageSizeOptions: ["50", "100", "150", "200"], //每页中显示的数据
        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
      },
      searchForm: this.$form.createForm(this),
      scrollY: "",
      isSearch: false,
    };
  },
  updated() {
    renderStripe();
  },
  created() {
    this.$nextTick(() => {
      this.scrollY = getTableScroll();
    });
    this.getLogList();
  },
  methods: {
    result(text) {
      this.resultStr = text;
      this.resultModal = true;
    },
    trace(item) {
      this.traceModal = true;
      this.traceId = item.TraceId;
      console.log(this.traceId);
    },
    //查看详情
    detail(item) {
      this.isDrawer = true;
      this.drawerItem = item;
    },
    onClose() {
      this.isDrawer = false;
    },
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //重置搜索
    reset() {
      this.data = [];
      this.pagination.total = 0;
      this.pagination.current = 1;
      this.getLogList();
      this.searchForm.resetFields();
    },
    //日期转换
    formatDateTime(inputTime) {
      var date = new Date(inputTime);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var h = date.getHours();
      h = h < 10 ? "0" + h : h;
      var minute = date.getMinutes();
      var second = date.getSeconds();
      minute = minute < 10 ? "0" + minute : minute;
      second = second < 10 ? "0" + second : second;
      return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
    },
    //关键词搜索
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          // if (values.elapsetime == undefined && values.apiurl == undefined && values.orderdesc == undefined && values["range-time-picker"] == undefined) {
          //   this.$message.warning("请输入要查询内容!");
          //   this.loading = false;
          //   return;
          // }
          if (values["range-time-picker"] != undefined) {
            var begindt = this.formatDateTime(values["range-time-picker"][0]);
            var enddt = this.formatDateTime(values["range-time-picker"][1]);
          }
          this.data = [];
          this.pagination.total = 0;
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            begindt: begindt,
            enddt: enddt,
            elapsetime: values.elapsetime,
            apiurl: values.apiurl,
            orderdesc: values.orderdesc ? "Y" : "N",
          };
          getLogAction(parmas, "getall").then((res) => {
            if (res.data.success) {
              this.data = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.recordsTotal;
              this.pagination = pagination;
              this.loading = false;
              this.isSearch = true;
            }
          });
        }
      });
    },
    //获取机构类型列表
    getLogList() {
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
      };
      getLogAction(parmas, "getall").then((res) => {
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
    //关闭对话框
    handleCancel() {
      this.visible = false;
      this.resultModal = false;
      this.traceModal = false;
    },
    //分页操作
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      if (this.isSearch) {
        this.search();
        return;
      }
      this.getLogList();
    },
  },
};
</script>
<style lang="less">
.ant-form-item {
  margin-bottom: 5px;
}
</style>
