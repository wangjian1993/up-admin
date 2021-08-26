<!--
 * @Author: max
 * @Date: 2021-08-17 08:26:18
 * @LastEditTime: 2021-08-25 17:20:17
 * @LastEditors: max
 * @Description: API日志
 * @FilePath: /up-admin/src/pages/admin/log/sqlLog.vue
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
                <a-input placeholder="SQL执行耗时(毫秒)" allowClear style="width: 200px" v-decorator="['elapsetime']" />
              </a-form-item>
            </div>
            <div style="margin-left:10px">
              <a-form-item>
                <a-form-item>
                  <a-select v-decorator="['execumehtod']" style="width: 100px" placeholder="请选择语句类型">
                    <a-select-option :value="item.ParamValue" v-for="(item, index) in sqlMehtod" :key="index">
                      {{ item.ParamName }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-form-item>
            </div>
            <div style="margin-left:10px">
              <a-form-item>
                <a-form-item>
                  <a-select v-decorator="['type']" placeholder="请选择执行状态" style="width: 100px">
                    <a-select-option :value="item.ParamValue" v-for="(item, index) in sqlState" :key="index">
                      {{ item.ParamName }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
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
      <a-table v-if="hasPerm('search')" :columns="columns" :data-source="data" size="small" :scroll="{ y: scrollY }" :loading="loading" :pagination="pagination" @change="handleTableChange" bordered>
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
          </div>
        </template>
      </a-table>
      <a-empty v-else description="暂无权限" />
    </div>
    <!-- 查看详情 -->
    <div>
      <a-drawer width="600" placement="right" :closable="true" :visible="isDrawer" @close="onClose">
        <a-descriptions title="SQL执行详情" :column="1">
          <a-descriptions-item label="执行语句">{{ drawerItem.ExecuSqlString }}</a-descriptions-item>
          <a-descriptions-item label="语句参数">{{ drawerItem.SqlParams }}</a-descriptions-item>
          <a-descriptions-item label="执行状态">{{ drawerItem.Type }}</a-descriptions-item>
          <a-descriptions-item label="执行方法">{{ drawerItem.MethodName }}</a-descriptions-item>
          <a-descriptions-item label="链接数据源">{{ drawerItem.DataSource }}</a-descriptions-item>
          <a-descriptions-item label="执行耗时(秒)">{{ drawerItem.ExecuTimeSecond }}</a-descriptions-item>
          <a-descriptions-item label="执行时间">{{ drawerItem.DateTimeCreated }}</a-descriptions-item>
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
    width: "5%",
  },
  {
    title: "执行时间",
    dataIndex: "DateTimeCreated",
    scopedSlots: { customRender: "DateTimeCreated" },
    align: "center",
    width: "13%",
    ellipsis: true,
  },
  {
    title: "执行语句",
    dataIndex: "ExecuSqlString",
    scopedSlots: { customRender: "ExecuSqlString" },
    align: "center",
    width: "20%",
    ellipsis: true,
  },
  {
    title: "语句参数",
    dataIndex: "SqlParams",
    scopedSlots: { customRender: "SqlParams" },
    align: "center",
    width: "20%",
    ellipsis: true,
  },
  {
    title: "执行状态",
    dataIndex: "Type",
    scopedSlots: { customRender: "Type" },
    align: "center",
    width: "5%",
  },
  {
    title: "执行方法",
    dataIndex: "MethodName",
    scopedSlots: { customRender: "MethodName" },
    align: "center",
    width: "10%",
    ellipsis: true,
  },
  {
    title: "链接数据源",
    dataIndex: "DataSource",
    scopedSlots: { customRender: "DataSource" },
    align: "center",
    width: "7%",
  },
  {
    title: "执行耗时(秒)",
    dataIndex: "ExecuTimeSecond",
    scopedSlots: { customRender: "ExecuTimeSecond" },
    align: "center",
    width: "7%",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];
import { getLogAction, getParamData } from "@/services/admin.js";
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
export default {
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
        pageSize: 20, //每页中显示10条数据
        showSizeChanger: true,
        showLessItems: true,
        showQuickJumper: true,
        pageSizeOptions: ["10", "20", "50", "100"], //每页中显示的数据
        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
      },
      searchForm: this.$form.createForm(this),
      sqlState: [],
      sqlMehtod: [],
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
    this.getParamData();
    this.getLogList();
  },
  methods: {
    getParamData() {
      let parmas = {
        groupcode: "SQL_STATE",
      };
      let parmas2 = {
        groupcode: "SQL_EXECU_MEHTOD",
      };
      getParamData(parmas).then((res) => {
        if (res.data.success) {
          this.sqlState = res.data.data;
        }
      });
      getParamData(parmas2).then((res) => {
        if (res.data.success) {
          this.sqlMehtod = res.data.data;
        }
      });
    },
    result(text) {
      this.resultStr = text;
      this.resultModal = true;
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
      this.pagination.current =1
      this.getLogList();
      this.searchForm.resetFields();
    },
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
      this.loading = true;
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          console.log(values.elapsetime);
          if (values.elapsetime == undefined && values.execumehtod == undefined && values.orderdesc == undefined && values["range-time-picker"] == undefined && values.type == undefined) {
            this.$message.warning("请输入要查询内容!");
            this.loading = false;
            return;
          }
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
            execumehtod: values.execumehtod,
            type: values.type,
            orderdesc: values.orderdesc ? "Y" : "N",
          };
          getLogAction(parmas, "getsqlloglist").then((res) => {
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
      getLogAction(parmas, "getsqlloglist").then((res) => {
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
