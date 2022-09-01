<!--
 * @Author: max
 * @Date: 2022-03-30 11:47:10
 * @LastEditTime: 2022-03-30 13:34:55
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/hp/commissions/discountRate/index.vue
-->
<template>
  <div>
    <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
      <a-table :columns="columns" :data-source="dataSource" size="small" :scroll="{ y: scrollY}" :loading="loading" :pagination="pagination" @change="handleTableChange" :rowKey="(dataSource) => dataSource.Id" bordered>
        <template slot="index" slot-scope="text, record, index">
          <div>
            <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
          </div>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import { getDiscountRateList } from "@/services/hp.js";
import ExportExcel from "@/utils/ExportExcelJS";
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
import { splitData } from "@/utils/util.js";
import { PublicVar } from "@/mixins/publicVar.js";
import { columns } from "./list.data";
export default {
  mixins: [PublicVar],
  data() {
    return {
      advanced: true,
      dataSource: [],
      columns,
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
    this.getListAll();
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
      getDiscountRateList().then((res) => {
        if (res.data.success) {
          this.dataSource = res.data.data;
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
          // if (!values.mono && !values.ctrno) {
          //   return this.$message.warning("请输入订单号或合同号!");
          // }
          this.loading = true;
          if (values["range-time-picker"] && values["range-time-picker"].length == 2) {
            const rangeValue = values["range-time-picker"];
            var importdatestart = rangeValue[0].format("YYYY-MM-DD");
            var importdateend = rangeValue[1].format("YYYY-MM-DD");
          }
          console.log("Received values of form: ", values);
          let params = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            rolesign: this.rolesign,
            mono: values.mono || "",
            ctrno: values.ctrno || "",
            customercode: values.customercode || "",
            employeecode: values.employeecode || "",
            bkdatestart: importdatestart || "",
            bkdateend: importdateend || "",
          };
          getDiscountRateList(params).then((res) => {
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
      let params = {
        pageindex: 1,
        pagesize: 10000,
        rolesign: this.rolesign,
        mono: values.mono || "",
        ctrno: values.ctrno || "",
        importdatestart: importdatestart || "",
        importdateend: importdateend || "",
      };
      getDiscountRateList(params).then((res) => {
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
