<!--
 * @Author: max
 * @Date: 2022-05-11 11:40:06
 * @LastEditTime: 2023-04-24 14:16:32
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/administrative/order/order/index.vue
-->
<template>
  <div>
    <a-spin tip="导出中..." :spinning="isExportLod">
      <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
        <a-form layout="horizontal" :form="searchForm">
          <div :class="advanced ? null : 'fold'">
            <a-row>
              <a-col :md="6" :sm="24">
                <a-form-item label="点单公司" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['companyid']" placeholder="请选择点单公司" @change="companyChange">
                    <a-select-option v-for="item in enterList" :key="item.Id" :value="item.Id">{{ item.CompanyName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="点单地点" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['addressid']" placeholder="请选择点单地点">
                    <a-select-option v-for="item in addressList" :key="item.Id" :value="item.Id">{{ item.Place }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="订单号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入订单号" v-decorator="['keyword']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="订单时间" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-range-picker style="width: 300px" v-decorator="['range-time-picker']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="订单状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['status']" placeholder="请选择订单状态" style="width: 200px">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="新订单">新订单</a-select-option>
                    <a-select-option value="已确认">已确认</a-select-option>
                    <a-select-option value="已配送">已配送</a-select-option>
                    <a-select-option value="已完成">已完成</a-select-option>
                    <a-select-option value="已取消">已取消</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <span style="float: right; margin-top: 3px;">
            <a-button type="primary" @click="searchBtn">查询</a-button>
            <a-button style="margin-left: 8px" @click="reset">重置</a-button>
          </span>
        </a-form>
        <div class="operator">
          <a-button type="primary" :disabled="!hasSelected" @click="exportExcel" icon="export">导出</a-button>
          <a-button type="primary" style="margin-left: 8px" @click="allOrder('confirm')" :disabled="!hasSelected" icon="check-circle">确认订单</a-button>
          <a-button type="primary" style="margin-left: 8px" @click="allOrder('dispatch')" :disabled="!hasSelected" icon="check-circle">确认配送</a-button>
          <a-button type="primary" style="margin-left: 8px" @click="allOrder('finish')" :disabled="!hasSelected" icon="check-circle">确认完成</a-button>
          <span style="margin-left: 8px">
            <template v-if="hasSelected">
              {{ `共选中 ${selectedRowKeys.length} 条` }}
            </template>
          </span>
        </div>
        <a-table
          :columns="columns"
          :data-source="dataSource"
          size="small"
          :scroll="{ y: scrollY }"
          :loading="loading"
          :pagination="pagination"
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
          }"
          @change="handleTableChange"
          :rowKey="(dataSource) => dataSource.Id"
          bordered
        >
          <template slot="index" slot-scope="text, record, index">
            <div>
              <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
            </div>
          </template>
          <template slot="Status" slot-scope="text">
            <div>
              <a-tag :color="setTagColor(text)">{{ text }}</a-tag>
            </div>
          </template>
          <template slot="action" slot-scope="text, record">
            <div>
              <a-popconfirm title="确认订单?" @confirm="() => onOrder(record.Id, record.Status)">
                <a style="margin-right: 8px" v-if="record.Status !== '已完成' && record.Status !== '已关闭'">
                  <a-icon type="check-circle" />
                  {{ orderState(record.Status) }}
                </a>
              </a-popconfirm>
              <a style="margin-right: 8px" @click="details(record)">
                <a-icon type="database" />
                订单明细
              </a>
              <a style="margin-right: 8px" @click="editOrder(record)" v-if="record.Status !== '已完成' && record.Status !== '已关闭'"  :disabled="!hasPerm('edit')">
                <a-icon type="edit" />
                修改订单
              </a>
              <a style="margin-right: 8px" v-if="record.Status !== '已完成' && record.Status !== '已关闭'" @click="cancel(record)">
                <a-icon type="close-circle" />
                关闭订单
              </a>
            </div>
          </template>
        </a-table>
      </a-card>
      <useForm v-if="isForm"  :editData="detailsData" @closeModal="closeModal" @success="searchBtn" />
      <edit-form v-if="isEdit" :editData="editData" @closeModal="closeModal" @success="searchBtn"></edit-form>
      <Cause v-if="isCause" :causeData="causeData" @closeModal="closeModal" @success="success" />
    </a-spin>
  </div>
</template>

<script>
import { getOrderList, setOrderList, getOrderAddress } from "@/services/ors.js";
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
import { splitData } from "@/utils/util.js";
import { PublicVar } from "@/mixins/publicVar.js";
import { columns, innerColumns } from "./data";
import useForm from "./form.vue";
import EditForm from "./edit.vue";
// import ExportExcel from "@/utils/ExportExcelJS";
import Cause from "./cause.vue";
export default {
  mixins: [PublicVar],
  components: { useForm, Cause, EditForm },
  data() {
    return {
      scrollY: "",
      advanced: true,
      columns,
      innerColumns,
      dataSource: [],
      deviceTypeList: [],
      isSearch: 0,
      isExportLod: false,
      editData: [],
      isEdit: false,
      isForm: false,
      selectedRowKeys: [],
      enterList: [],
      addressList: [],
      isCause: false,
      causeData: [],
      detailsData: [],
    };
  },
  updated() {
    renderStripe();
  },
  created() {
    this.$nextTick(() => {
      this.scrollY = getTableScroll(70);
    });
    this.searchBtn();
    this.getEnterList();
  },
  methods: {
    splitData,
    setTagColor(state) {
      let color = "";
      switch (state) {
        case "新订单":
          color = "#dceb0a";
          break;
        case "已确认":
          color = "#2db7f5";
          break;
        case "已配送":
          color = "#108ee9";
          break;
        case "已完成":
          color = "#87d068";
          break;
        case "已取消":
          color = "#f50";
          break;
        default:
          break;
      }
      return color;
    },
    orderState(state) {
      let stateStr = "";
      switch (state) {
        case "新订单":
          stateStr = "确认订单";
          break;
        case "已确认":
          stateStr = "确认配送";
          break;
        case "已配送":
          stateStr = "确认完成";
          break;
        default:
          break;
      }
      return stateStr;
    },
    cancel(record) {
      this.isCause = true;
      this.causeData = record;
    },
    success(form) {
      console.log(form);
      let params = {
        desc: form.desc,
        ids: [this.causeData.Id, null],
      };
      setOrderList(params, "close").then((res) => {
        if (res.data.success) {
          this.$message.success("取消成功");
          this.searchBtn();
        }
      });
    },
    getEnterList() {
      getOrderAddress("", "getcompany").then((res) => {
        if (res.data.success) {
          this.enterList = res.data.data;
        }
      });
    },
    companyChange(e) {
      let params = {
        pageindex: 1,
        pagesize: 100,
        companyid: e,
      };
      getOrderAddress(params, "get").then((res) => {
        if (res.data.success) {
          this.addressList = res.data.data.list;
        }
      });
    },
    //重置搜索
    reset() {
      this.isSearch = 0;
      this.searchForm.resetFields();
      this.searchBtn();
    },
    editOrder(record) {
      this.isEdit = true;
      this.editData = record;
    },
    details(record) {
      this.isForm = true;
      this.detailsData = record;
    },
    closeModal() {
      this.isForm = false;
      this.isImport = false;
      this.isCause = false;
      this.isEdit = false;
    },
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //分页
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      if (this.isSearch == 2) {
        this.search();
        return;
      }
    },
    searchBtn() {
      this.pagination.current = 1;
      this.search();
    },
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          if (values["range-time-picker"] != undefined) {
            var starttime = values["range-time-picker"][0].format("YYYY-MM-DD");
            var endtime = values["range-time-picker"][1].format("YYYY-MM-DD");
          }
          let params = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            enterpriseid: values.enterpriseid,
            keyword: values.keyword,
            companyid: values.companyid,
            addressid: values.addressid,
            status: values.status,
            starttime: starttime,
            endtime: endtime,
          };
          getOrderList(params, "get").then((res) => {
            if (res.data.success) {
              this.dataSource = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.totalCount;
              this.pagination = pagination;
              this.isSearch = 2;
            }
            this.loading = false;
          });
          // do something
        }
      });
    },
    //多选删除
    allOrder(type) {
      let self = this;
      self.$confirm({
        title: "确定要提交选中内容",
        onOk() {
          self.selectedRowKeys.push(null);
          setOrderList(self.selectedRowKeys, type).then((res) => {
            if (res.data.success) {
              self.selectedRowKeys = [];
              self.$message.success("确认成功!");
              self.searchBtn();
            } else {
              self.selectedRowKeys = [];
            }
          });
        },
        onCancel() {},
      });
    },
    //单个删除
    onOrder(id, type) {
      let params = [id, null];
      let url = type === "新订单" ? "confirm" : type === "已确认" ? "dispatch" : "finish";
      let content = type === "新订单" ? "确认订单成功" : type === "已确认" ? "确认配送成功" : "订单已成功";
      setOrderList(params, url).then((res) => {
        if (res.data.success) {
          this.$message.success(content);
          this.searchBtn();
        }
      });
    },
    exportExcel() {
      this.selectedRowKeys.push(null);
      setOrderList(this.selectedRowKeys, "export").then((res) => {
        if (res.data.success) {
          console.log("res.data.path", res.data.data.path);
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = "http://113.106.78.83:7003/" + res.data.data.path;
          link.setAttribute("download", name);
          document.body.appendChild(link);
          link.click();
          this.selectedRowKeys = [];
        }
      });
      // let values = this.searchForm.getFieldsValue();
      // if (values["range-time-picker"] != undefined) {
      //   var starttime = values["range-time-picker"][0].format("YYYY-MM-DD");
      //   var endtime = values["range-time-picker"][1].format("YYYY-MM-DD");
      // }
      // let params = {
      //   pageindex: this.pagination.current,
      //   pagesize: this.pagination.total,
      //   enterpriseid: values.enterpriseid,
      //   keyword: values.keyword,
      //   companyid: values.companyid,
      //   addressid: values.addressid,
      //   status: values.status,
      //   starttime: starttime,
      //   endtime: endtime,
      // };
      // getOrderList(params, "get").then((res) => {
      //   if (res.data.success) {
      //     let list = res.data.data.list;
      //     const dataSource = list.map((item) => {
      //       Object.keys(item).forEach((key) => {
      //         // 后端传null node写入会有问题
      //         if (item[key] === null) {
      //           item[key] = "";
      //         }
      //         if (Array.isArray(item[key])) {
      //           item[key] = item[key].join(",");
      //         }
      //       });
      //       return item;
      //     });
      //     const header = [];
      //     this.columns.map((item) => {
      //       if (item.dataIndex) {
      //         header.push({ key: item.dataIndex, title: item.title });
      //       }
      //     });
      //     var timestamp = Date.parse(new Date());
      //     try {
      //       ExportExcel(header, dataSource, `订单列表_${timestamp}.xlsx`);
      //       this.$message.success("导出数据成功!");
      //     } catch (error) {
      //       // console.log(error);
      //       this.$message.error("导出数据失败");
      //     }
      //     this.isExportLod = false;
      //   }
      // });
    },
  },
};
</script>

<style scoped lang="less">
/deep/.ant-table:nth-of-type(0) {
  min-height: 62vh;
}
.ant-form-item {
  margin-bottom: 5px;
}
</style>
