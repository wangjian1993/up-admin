<!--
 * @Author: max
 * @Date: 2021-09-23 13:59:52
 * @LastEditTime: 2022-02-25 10:18:02
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/shipment/agc/infoPublic/index.vue
-->
<template>
  <div>
    <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
      <a-spin tip="导出中..." :spinning="isExportLod">
        <a-form layout="horizontal" :form="searchForm">
          <div :class="advanced ? null : 'fold'">
            <a-row>
              <a-col :md="6" :sm="24">
                <a-form-item label="申请时间" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-range-picker style="width: 300px" v-decorator="['range-time-picker1']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="审核状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['statuscheck']" placeholder="请选择订单状态" style="width: 200px">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="1">已审核</a-select-option>
                    <a-select-option value="2">未审核</a-select-option>
                    <a-select-option value="3">不需要审核</a-select-option>
                  </a-select>
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
          <a-button v-if="hasPerm('export')" :disabled="selectedRowKeys.length == 0" icon="export" type="primary" :loading="loading" @click="exportExcel('', 'all')" style="margin-left: 8px">导出</a-button>
          <a-button v-else icon="delete" disabled="" type="primary" :loading="loading" style="margin-left: 8px">导出</a-button>
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
          :scroll="{ y: scrollY, x: 2400 }"
          :loading="loading"
          :pagination="pagination"
          @change="handleTableChange"
          :rowKey="(dataSource, index) => dataSource.Id + '_' + index"
          bordered
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
          }"
        >
          <template slot="index" slot-scope="text, record, index">
            <div>
              <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
            </div>
          </template>
          <template slot="StatusCheck" slot-scope="text">
            <div>
              <a-tag :color="text !== '1' ? 'red' : 'green'">{{ text === "2" ? "未处理" : text === "1" ? "已处理" : "不需要处理" }}</a-tag>
            </div>
          </template>
          <template slot="IsShipment" slot-scope="text">
            <div>
              <a-tag :color="text === 'N' ? 'red' : 'green'">{{ text === "N" ? "未出货" : "已出货" }}</a-tag>
            </div>
          </template>
          <template slot="action" slot-scope="text, record">
            <div>
              <a style="margin-right: 8px" @click="exportExcel(record)" :disabled="!hasPerm('export')">
                <a-icon type="export" />
                导出
              </a>
            </div>
          </template>
        </a-table>
      </a-spin>
    </a-card>
  </div>
</template>
<script>
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
import { getOrderInfoAgc } from "@/services/shipment.js";
import { splitData } from "@/utils/util.js";
import { ShipmentExport } from "@/mixins/shipmentAgc";
import { columns } from "../data/columns";
export default {
  mixins: [ShipmentExport],
  data() {
    return {
      scrollY: "",
      loading: false,
      advanced: true,
      columns,
      dataSource: [],
      isDrawer: false,
      selectedRowKeys: [],
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
      isExportLod: false,
      plantList: [],
      isEdit: false,
      editData: [],
    };
  },
  updated() {
    renderStripe();
  },
  created() {
    this.$nextTick(() => {
      this.scrollY = getTableScroll();
    });
    this.getListAll();
  },
  activated() {
    this.getListAll();
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  methods: {
    splitData,
    //关闭弹出框
    closeModal() {
      this.isEdit = false;
    },
    //重置搜索
    reset() {
      this.getListAll();
      this.searchForm.resetFields();
    },
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //获取列表
    getListAll() {
      this.loading = true;
      let params = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        createdatestart: "",
        createdateend: "",
        statuscheck: "",
      };
      getOrderInfoAgc(params, "getplantfinance").then((res) => {
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
    //分组
    handlerDatas(arr) {
      let obj = {};
      arr.forEach((item) => {
        let { Id } = item;
        if (!obj[Id]) {
          obj[Id] = {
            ...item,
            group: [],
          };
        }
        obj[Id].group.push(item);
      });
      let data = Object.values(obj); // 最终输出
      console.log(data);
      return data;
    },
    //编辑
    edit(record) {
      this.isEdit = true;
      this.editData = record;
    },
    //分页
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      console.log(this.isSearch);
      if (this.isSearch == 2) {
        this.search();
        return;
      }
      this.getListAll();
    },
    //收起展开
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          if (values["range-time-picker1"] && values["range-time-picker1"].length == 2) {
            const rangeValue1 = values["range-time-picker1"];
            var createdatestart = rangeValue1[0].format("YYYY-MM-DD");
            var createdateend = rangeValue1[1].format("YYYY-MM-DD");
          }
          let params = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            createdatestart: createdatestart || "",
            createdateend: createdateend || "",
            statuscheck: values.statuscheck || "",
          };
          getOrderInfoAgc(params, "getplantfinance").then((res) => {
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
  },
};
</script>

<style scoped lang="less">
/deep/.ant-table {
  min-height: 0vh;
}
/deep/.ant-table-body {
  min-height: 0vh;
}
.statistic {
  display: flex;
  justify-content: center;
  cursor: pointer;
}
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
.ant-form-item {
  margin-bottom: 5px;
}
</style>
