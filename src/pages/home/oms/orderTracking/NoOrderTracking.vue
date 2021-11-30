<!--
 * @Author: max
 * @Date: 2021-11-25 15:10:14
 * @LastEditTime: 2021-11-30 16:25:51
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/oms/orderTracking/NoOrderTracking.vue
-->
<template>
  <div>
    <a-form layout="horizontal" :form="searchForm">
      <div>
        <a-row>
          <a-col :md="6" :sm="24">
            <a-form-item label="销售公司" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select v-decorator="['company', { rules: [{ required: true, message: '请选择销售公司' }] }]" style="width: 200px" placeholder="请选择销售公司" @change="companyChange">
                <a-select-option v-for="item in companyList" :key="item.EnterId" :value="item.EnterCode">{{ item.EnterName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="生产工厂" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select v-decorator="['plantid']" style="width: 200px" placeholder="请选择生产工厂">
                <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="销售部" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select v-decorator="['department']" style="width: 200px" placeholder="请选择销售部" @change="departmentChange">
                <a-select-option v-for="item in departmentList" :key="item.DepartmentName" :value="item.DepartmentCode">{{ item.DepartmentName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="销售员" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select v-decorator="['salesuser']" style="width: 200px" placeholder="请选择销售部">
                <a-select-option v-for="item in salesmanList" :key="item.UserCode" :value="item.UserCode">{{ item.UserName }}</a-select-option>
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
      <a-button v-if="hasPerm('export')" :disabled="!isExport" type="primary" @click="exportExcel" icon="export">导出</a-button>
      <a-button v-else type="primary" disabled @click="exportExcel" icon="export">导出</a-button>
    </div>
    <a-table v-if="hasPerm('search')" :columns="columns" :data-source="data" size="small" :scroll="{ y: scrollY, x: 3000 }" :loading="loading" :pagination="pagination" @change="handleTableChange" :rowKey="(data) => data.Id" bordered>
      <template slot="index" slot-scope="text, record, index">
        <div>
          <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
        </div>
      </template>
      <template slot="PlanShipDate" slot-scope="text, record">
        <a-date-picker v-model="record.PlanShipDate" />
      </template>
      <template slot="condition" slot-scope="text, record">
        <div>
          <a style="margin-right: 8px" @click="detail(record)">
            <a-icon type="profile" />
            查看明细
          </a>
        </div>
      </template>
      <template slot="TotalProductionQty" slot-scope="text, record">
        <a style="margin-right: 8px" @click="totalQty(record)">
          {{ text }}
        </a>
      </template>
      <template slot="action" slot-scope="text, record">
        <div>
          <a style="margin-right: 8px" :disabled="!hasPerm('save')" @click="save(record)">
            <a-icon type="profile" />
            保存
          </a>
        </div>
      </template>
    </a-table>
    <a-empty v-else description="暂无权限" />
    <div>
      <a-modal title="下载进度" :width="400" centered :closable="false" :visible="processVisible" :footer="null">
        <div class="baseinfo">
          <a-progress :percent="percent" class="baseProgess" />
        </div>
        <div class="baseinfoFoot">
          <span class="baseinfoing"> {{ progressUp }}</span>
        </div>
      </a-modal>
    </div>
    <user-list v-if="isUserList" @closeModal="closeUserModal" @okModal="okUserModal"></user-list>
    <OrderDetail v-if="isDetail" :detailData="detailData" @closeModal="closeModal" />
    <TotalQty v-if="isTotalQty" :totalQtyData="totalQtyData" :company="companycode" @closeModal="closeModal" />
  </div>
</template>

<script>
import getTableScroll from "@/utils/setTableHeight";
import { renderStripe } from "@/utils/stripe.js";
import { getOrderApi, setOrderApi } from "@/services/web.js";
import UserList from "@/components/app-user/UserList";
import { columns, excelHead } from "./order.data";
import { PublicVar } from "@/mixins/publicVar.js";
import OrderDetail from "./OrderDetail.vue";
import TotalQty from "./TotalQty.vue";
import { exportjsontoexcelMore } from "@/utils/exportExcel";
export default {
  components: { UserList, OrderDetail, TotalQty },
  props: ["companyList", "plantList"],
  mixins: [PublicVar],
  data() {
    return {
      data: [],
      columns,
      isUserList: false,
      companycode: "",
      departmentList: [],
      salesmanList: [],
      deptname: "",
      isDetail: false,
      detailData: [],
      isTotalQty: false,
      TotalQtyData: [],
      TotalQtyCompany: "",
      isExport: false,
      isExportLod: false,
      processVisible: false,
      percent: 100,
      progressUp: "下载中,请稍候.......",
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
      this.scrollY = getTableScroll(70);
    });
    // this.getListAll();
  },
  methods: {
    companyChange(e) {
      this.departmentList = [];
      this.salesmanList = [];
      this.companycode = e;
      this.getDepartment();
      this.searchForm.setFieldsValue({
        department: "",
        salesuser: "",
      });
    },
    departmentChange(e) {
      this.salesmanList = [];
      this.deptname = e;
      this.getSalesman();
      this.searchForm.setFieldsValue({
        salesuser: "",
      });
    },
    //pmc选择
    getDepartment() {
      let parmas = {
        companycode: this.companycode,
      };
      getOrderApi(parmas, "getdepartments").then((res) => {
        if (res.data.success) {
          this.departmentList = res.data.data;
        }
      });
    },
    getSalesman() {
      let parmas = {
        companycode: this.companycode,
        deptname: this.deptname,
      };
      getOrderApi(parmas, "getdeptusers").then((res) => {
        if (res.data.success) {
          this.salesmanList = res.data.data;
        }
      });
    },
    totalQty(item) {
      this.isTotalQty = true;
      this.totalQtyData = item;
    },
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
    detail(item) {
      this.isDetail = true;
      this.detailData = item;
    },
    weekChange(date, dateString) {
      let str = dateString.split("-");
      this.week = str[1].replace("周", "");
    },
    closeModal() {
      this.isDetail = false;
      this.isTotalQty = false;
    },
    save(item) {
      let parmas = {
        SalesOrderNo: item.SalesOrderNo,
        LineItem: item.LineItem,
        MitemCode: item.MitemCode,
        UpdatePlanShipDate: item.PlanShipDate,
      };
      setOrderApi(parmas, "update").then((res) => {
        if (res.data.success) {
          this.$message.success("保存成功!");
          this.search();
        }
      });
    },
    getPaginationList() {
      this.loading = true;
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
      };
      getOrderApi(parmas, "getcacheall").then((res) => {
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
    //关闭弹窗
    onClose() {
      this.isDrawer = false;
    },
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //重置搜索
    reset() {
      // this.getListAll();
      this.week = "";
      this.pagination.current = 1;
      this.pagination.total = 0;
      this.isExport = false;
      this.data = [];
      this.searchForm.resetFields();
    },
    //关键词搜索
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            company: values.company,
            plant: values.plant,
            department: values.department,
            salesuser: values.salesuser,
          };
          getOrderApi(parmas, "getall").then((res) => {
            if (res.data.success) {
              this.data = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.recordsTotal;
              this.pagination = pagination;
              this.loading = false;
              this.isSearch = true;
              this.isExport = true;
            }
          });
          // do something
        }
      });
    },
    //分压
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.getPaginationList();
    },
    getExcelList() {
      // let inputData = this.searchForm.getFieldsValue();
      return new Promise((resolve, reject) => {
        let parmas = {
          pageindex: this.pagination.current,
          pagesize: 500,
        };
        getOrderApi(parmas, "getcacheall").then((res) => {
          if (res.data.success) {
            let list = res.data.data.list;
            resolve(list);
          } else {
            reject();
          }
        });
      });
    },
    async waitData() {
      let n = await this.getExcelList();
      return n;
    },
    exportFn(list) {
      // let inputData = this.searchForm.getFieldsValue();
      let _data = [];
      let excelArray = [];
      let mergeTitle = [];
      let head = [];
      excelHead.map((item) => {
        head.push(item.title);
      });
      _data.push(head);
      list.map((item) => {
        let array = [];
        excelHead.map((items) => {
          array.push(item[items.dataIndex] || "");
        });
        _data.push(array);
      });
      console.log(_data);
      const sheetCols = [
        { wch: 8 }, // 序号
        { wch: 8 }, // 阶次
        { wch: 8 }, // 类型
        { wch: 20 }, // 上阶BOM号
        { wch: 20 }, // 品号
        { wch: 8 }, // 料名
        { wch: 20 }, //  产品规格
        { wch: 20 }, // 单位
        { wch: 20 }, // 价格来源
        { wch: 8 }, // E10单价
        { wch: 8 }, // 单价
        { wch: 8 }, // 用量
        { wch: 8 }, // 金额
        { wch: 8 }, // 提示
        { wch: 8 }, // 备注
        { wch: 8 }, // 备注
      ];
      let contentList = [];
      let merges2 = []; // 设置表格内容单元格合并
      let aoa = [..._data, ...contentList]; // 导出的数据
      let merges = [...mergeTitle, ...merges2]; // 合并单元格
      let formStyle = {};
      excelArray.push({
        Sheet: `未生产订单`, // 下方tab切换名称
        data: aoa, // 表格数据
        merges, //  合并单元格
        autoWidth: false, // 自适应宽度
        formStyle: formStyle, // 特殊行或列样式
        sheetCols,
      });
      try {
        exportjsontoexcelMore({
          dataList: excelArray,
          bookType: "xlsx", // 导出类型
          filename: "未生产订单", // 导出标题名
        });
        this.$message.success("导出数据成功!");
        this.percent = 100;
        this.progressUp = "下载已完成";
        this.processVisible = false;
        this.pagination.current = 1;
      } catch (error) {
        this.$message.error("导出数据失败");
      }
      this.isExportLod = false;
    },
    exportExcel() {
      setInterval(() => {
        this.percent++;
        if (this.percent == 90) {
          this.percent = 90;
          this.progressUp = "下载中,请稍候.......";
        }
      }, 500);
      this.isExportLod = true;
      this.processVisible = true;
      this.percent = 0;
      let total = this.pagination.total;
      if (total <= 500) {
        this.getExcelList().then((res) => {
          console.log(res);
          this.exportFn(res);
        });
      } else {
        let ssidTimes = Math.ceil(total / 500);
        let arr = [];
        for (let i = 0; i < ssidTimes; ++i) {
          arr.push(this.waitData());
          this.pagination.current += 1;
        }
        Promise.all(arr)
          .then((res) => {
            let list = res.flat();
            this.exportFn(list);
            // loading.close();
          })
          .catch((err) => {
            //  loading.close();
            console.log("error", err);
          });
      }
    },
  },
};
</script>

<style scoped lang="less">
/deep/.ant-table-body {
  min-height: 0vh;
}
</style>
