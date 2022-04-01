<!--
 * @Author: max
 * @Date: 2022-03-29 17:42:46
 * @LastEditTime: 2022-03-29 17:59:44
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/hp/commissions/order/order.vue
-->
<template>
  <div>
    <a-spin tip="导出中..." :spinning="isExportLod">
      <a-form layout="horizontal" :form="searchForm">
        <div :class="advanced ? null : 'fold'">
          <a-row>
            <a-col :md="6" :sm="24" v-if="rolesign == 'ADMIN'">
              <a-form-item label="业务员" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-select style="width:200px" v-decorator="['employeecode']">
                  <a-select-option key="" value="">全部</a-select-option>
                  <a-select-option v-for="(item, index) in salesmanList" :key="index" :value="item.UserId">{{ item.DisplayName + " " + item.UserId }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="订单号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入订单号" v-decorator="['mono']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="合同号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入合同号" v-decorator="['ctrno']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="客户代码" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入合同号" v-decorator="['customercode']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24" v-if="rolesign == 'ADMIN'">
              <a-form-item label="录入时间" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-range-picker style="width: 300px" :default-value="dateFormat" v-decorator="['range-time-picker']" />
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <span style="float: right; margin-top: 3px;">
          <a-button type="primary" @click="search">查询</a-button>
          <a-button style="margin-left: 8px" @click="reset">重置</a-button>
        </span>
      </a-form>
      <div class="operator">
        <a-button :disabled="!hasPerm('export')" type="primary" @click="exportExcel" icon="export">导出</a-button>
      </div>
      <a-table :columns="columns" :data-source="dataSource" size="small" :scroll="{ y: scrollY }" :loading="loading" :pagination="pagination" @change="handleTableChange" :rowKey="(dataSource) => dataSource.Id" bordered>
        <template slot="index" slot-scope="text, record, index">
          <div>
            <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
          </div>
        </template>
        <template slot="action" slot-scope="text, record" v-if="rolesign == 'ADMIN'">
          <div>
            <a style="margin-right: 8px" :disabled="!hasPerm('edit')" @click="edit(record)">
              <a-icon type="edit" />
              编辑折扣率
            </a>
          </div>
        </template>
      </a-table>
    </a-spin>
    <editForm v-if="editForm" :editType="editType" :editFormData="editFormData" @success="editSuccess" @close="editClose" />
  </div>
</template>

<script>
import { getOrderList, getSalesmanList } from "@/services/hp.js";
import ExportExcel from "@/utils/ExportExcelJS";
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
import { splitData } from "@/utils/util.js";
import { PublicVar } from "@/mixins/publicVar.js";
import moment from "moment";
import editForm from "../components/editForm.vue";
export default {
  props: ["rolesign", "columns"],
  mixins: [PublicVar],
  components: { editForm },
  data() {
    return {
      advanced: true,
      dataSource: [],
      isDrawer: false,
      isExportLod: false,
      editData: [],
      isEdit: false,
      dateFormat: [],
      isImportExcel: false,
      editForm: false,
      editFormData: [],
      editType: "discount",
      salesmanList: [],
    };
  },
  updated() {
    renderStripe();
  },
  created() {
    this.$nextTick(() => {
      this.scrollY = getTableScroll(70);
    });
    this.getSalesmanList();
  },
  watch: {
    rolesign(res) {
      this.rolesign = res;
      if (this.rolesign == "ADMIN") {
        let day1 = moment().format("YYYY-MM-DD");
        let day2 = moment()
          .subtract(1, "years")
          .format("YYYY-MM-DD"); // 1年前
        this.dateFormat = [day2, day1];
        this.getListAll();
      } else {
        // this.reset();
        this.dataSource = [];
        console.log("====dataSource", this.dataSource);
      }
    },
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
    filterData() {
      return this.columns.filter((obj) => {
        if (obj.dataIndex !== "StatusName" && obj.dataIndex !== "MatchStatusName") {
          return obj.dataIndex;
        }
      });
    },
  },
  methods: {
    splitData,
    moment,
    getAdminList() {},
    getSalesmanList() {
      getSalesmanList().then((res) => {
        if (res.data.success) {
          this.salesmanList = res.data.data;
        }
      });
    },
    importExcel() {
      this.isImportExcel = true;
    },
    //重置搜索
    reset() {
      this.dataSource = [];
      this.searchForm.resetFields();
    },
    //编辑
    edit(item) {
      this.editForm = true;
      this.editFormData = item;
    },
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    editSuccess() {
      this.editForm = false;
      this.getListAll();
    },
    editClose() {
      this.editForm = false;
      this.isImportExcel = false;
    },
    //获取列表
    getListAll() {
      this.loading = true;
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        rolesign: this.rolesign,
        mono: "",
        ctrno: "",
        customercode: "",
        employeecode: "",
        importdatestart: this.dateFormat[0],
        importdateend: this.dateFormat[1],
      };
      getOrderList(parmas).then((res) => {
        if (res.data.success) {
          this.dataSource = res.data.data.list;
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
    //分页
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      if (this.isSearch == 2) {
        this.search();
        return;
      }
      this.getListAll();
    },
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          console.log(values);
          if (!values.mono && !values.ctrno) {
            return this.$message.warning("请输入订单号或合同号!");
          }
          this.loading = true;
          if (values["range-time-picker"] && values["range-time-picker"].length == 2) {
            const rangeValue = values["range-time-picker"];
            var importdatestart = rangeValue[0].format("YYYY-MM-DD");
            var importdateend = rangeValue[1].format("YYYY-MM-DD");
          }
          console.log("Received values of form: ", values);
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            rolesign: this.rolesign,
            mono: values.mono || "",
            ctrno: values.ctrno || "",
            ustomercode: values.ustomercode || "",
            employeecode: values.employeecode || "",
            importdatestart: importdatestart || "",
            importdateend: importdateend || "",
          };
          getOrderList(parmas).then((res) => {
            if (res.data.success) {
              this.dataSource = res.data.data.list;
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
      if (values["range-time-picker"] && values["range-time-picker"].length == 2) {
        const rangeValue = values["range-time-picker"];
        var importdatestart = rangeValue[0].format("YYYY-MM-DD");
        var importdateend = rangeValue[1].format("YYYY-MM-DD");
      }
      let parmas = {
        pageindex: 1,
        pagesize: 10000,
        rolesign: this.rolesign,
        mono: values.mono || "",
        ctrno: values.ctrno || "",
        importdatestart: importdatestart || "",
        importdateend: importdateend || "",
      };
      getOrderList(parmas).then((res) => {
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
            ExportExcel(header, dataSource, `提成折扣率_${timestamp}.xlsx`);
            this.$message.success("导出数据成功!");
          } catch (error) {
            // console.log(error);
            this.$message.error("导出数据失败");
          }
          this.isExportLod = false;
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
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
  min-height: 62vh;
}
</style>
