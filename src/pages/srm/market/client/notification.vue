<!--
 * @Author: max
 * @Date: 2022-05-05 11:01:59
 * @LastEditTime: 2022-08-16 09:36:57
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/srm/market/client/notification.vue
-->
<template>
  <div>
    <a-spin tip="导出中..." :spinning="isExportLod">
      <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
        <a-form layout="horizontal" :form="searchForm">
          <a-row>
            <a-col :span="8">
              <a-radio-group style="margin-top: 5px;" default-value="全部" v-model="listType" button-style="solid" @change="searchBtn">
                <a-radio-button v-for="(item, index) in tagItem" :value="item" :key="index">
                  {{ item }}
                </a-radio-button>
              </a-radio-group></a-col
            >
            <a-col :md="6" :sm="24">
              <a-form-item label="" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 300px" placeholder="请输入搜索内容" v-decorator="['keyword']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-button type="primary" style="margin-top: 5px;" @click="searchBtn">查询</a-button>
              <a-button style="margin-left: 8px;margin-top: 5px;" @click="toggleAdvanced">高级搜索</a-button>
            </a-col>
          </a-row>
          <div :class="advanced ? null : 'fold'" v-if="advanced">
            <a-row>
              <a-col :md="6" :sm="24">
                <a-form-item label="标题" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" placeholder="请输入标题" v-decorator="['title']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="到期时间" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-range-picker style="width: 300px" v-decorator="['range-time-picker1']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['status']" placeholder="请选择订单状态" style="width: 200px">
                    <a-select-option :value="item" v-for="(item, index) in tagItem" :key="index">{{ item }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <span style="float: right; margin-top: 3px;">
              <a-button type="primary" @click="searchBtn">查询</a-button>
              <a-button style="margin-left: 8px" @click="reset">重置</a-button>
            </span>
          </div>
        </a-form>
        <div class="operator">
          <a-button style="margin-left: 8px" :disabled="!hasPerm('export') && dataSource.length == 0" type="primary" @click="exportExcel" icon="export">导出</a-button>
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
          :rowKey="(dataSource) => dataSource.PlcId"
          bordered
        >
          <template slot="index" slot-scope="text, record, index">
            <div>
              <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
            </div>
          </template>
          <template slot="StatusName" slot-scope="record">
            <div>
              <a-tag color="green" v-if="record == '正常'">{{ record }}</a-tag>
              <a-tag color="red" v-else>{{ record }}</a-tag>
            </div>
          </template>
          <template slot="action" slot-scope="text, record">
            <div>
              <a style="margin-right: 8px" @click="detail(record)">
                <a-icon type="container" />
                查看
              </a>
              <a style="margin-right: 8px" @click="edit(record)" :disabled="!hasPerm('warn')">
                <a-icon type="bell" />
                提醒
              </a>
              <a style="margin-right: 8px" @click="edit(record)" :disabled="!hasPerm('print')">
                <a-icon type="printer" />
                打印
              </a>
            </div>
          </template>
        </a-table>
      </a-card>
    </a-spin>
  </div>
</template>

<script>
import { getSupplierAction } from "@/services/srm.js";
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
import { splitData } from "@/utils/util.js";
import { PublicVar } from "@/mixins/publicVar.js";
import { columns } from "./data/authentication";
import ExportExcel from "@/utils/ExportExcelJS";
export default {
  mixins: [PublicVar],
  data() {
    return {
      scrollY: "",
      advanced: false,
      columns,
      dataSource: [],
      isSearch: 0,
      isExportLod: false,
      selectedRowKeys: [],
      isImport: false,
      listType: "全部",
      isDetail: false,
      docno: "",
      tagItem: ["全部", "临近到期", "已到期", "待确认", "待回复", "已完成"],
    };
  },
  updated() {
    renderStripe();
  },
  created() {
    this.$nextTick(() => {
      this.scrollY = getTableScroll(70);
    });
    this.search();
  },
  methods: {
    splitData,
    //重置搜索
    reset() {
      this.isSearch = 0;
      this.searchForm.resetFields();
      this.listType = "全部";
      this.search();
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
      if (this.advanced) {
        console.log("打开====");
        this.scrollY = getTableScroll(120);
      } else {
        console.log("关闭====");
        this.scrollY = getTableScroll(0);
      }
      console.log("scrollY===", this.scrollY);
    },
    closeModal() {
      this.isDetail = false;
    },
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //分页
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.search();
    },
    detail(record) {
      this.isDetail = true;
      this.docno = record.OrderNo;
    },
    searchBtn() {
      this.pagination.current = 1;
      this.search();
    },
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          if (values["range-time-picker1"] && values["range-time-picker1"].length == 2) {
            const rangeValue = values["range-time-picker1"];
            var starttime = rangeValue[0].format("YYYY-MM-DD");
            var endtime = rangeValue[1].format("YYYY-MM-DD");
          }
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            keyword: values.keyword,
            tag: this.listType,
            title: values.title,
            starttime: starttime,
            endtime: endtime,
            status: values.status,
          };
          getSupplierAction(parmas, "get").then((res) => {
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
    exportExcel() {
      this.isExportLod = true;
      let values = this.searchForm.getFieldsValue();
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.total,
        typeid: values.typeid,
        brand: values.brand,
        status: values.status,
        plccode: values.plccode,
        plcname: values.plcname,
      };
      getSupplierAction(parmas, "get").then((res) => {
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
          columns.map((item) => {
            if (item.dataIndex) {
              header.push({ key: item.dataIndex, title: item.title });
            }
          });
          var timestamp = Date.parse(new Date());
          try {
            ExportExcel(header, dataSource, `PLC列表_${timestamp}.xlsx`);
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

<style lang="less">
/deep/.ant-table {
  min-height: 62vh;
}
.ant-form-item {
  margin-bottom: 5px;
}
</style>
