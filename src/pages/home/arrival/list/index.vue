<!--
 * @Author: max
 * @Date: 2022-05-11 11:40:06
 * @LastEditTime: 2022-07-23 14:38:52
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/arrival/list/index.vue
-->
<template>
  <div>
    <a-spin tip="导出中..." :spinning="isExportLod">
      <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
        <a-form layout="horizontal" :form="searchForm">
          <div :class="advanced ? null : 'fold'">
            <a-row>
              <a-col :md="6" :sm="24">
                <a-form-item label="到货单号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入到货单号" v-decorator="['docno']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="送货单号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入送货单号" v-decorator="['orderno']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="单据日期" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-range-picker style="width: 300px" v-decorator="['range-time-picker1']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="到货日期" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-range-picker style="width: 300px" v-decorator="['range-time-picker2']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="工厂名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['plantname']" placeholder="请选择工厂名称">
                    <a-select-option v-for="item in plantList" :key="item" :value="item">{{ item }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="打印状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['printstatus']" placeholder="请选择打印状态" style="width: 200px">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="已打印">已打印</a-select-option>
                    <a-select-option value="未打印">未打印</a-select-option>
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
          <a-radio-group style="margin-top: 5px;" default-value="全部" v-model="listType" button-style="solid" @change="typeChange">
            <a-radio-button value="全部">
              全部
            </a-radio-button>
            <a-radio-button value="未审核">
              未审核
            </a-radio-button>
            <a-radio-button value="已审核">
              已审核
            </a-radio-button>
            <a-radio-button value="作废">
              作废
            </a-radio-button>
            <a-radio-button value="今天">
              今天
            </a-radio-button>
            <a-radio-button value="本周">
              本周
            </a-radio-button>
            <a-radio-button value="本月">
              本月
            </a-radio-button>
          </a-radio-group>
          <a-button v-if="hasPerm('print')" icon="print" type="primary" :disabled="!hasSelected" :loading="loading" @click="printBatch" style="margin-left: 8px">打印</a-button>
          <a-button v-else icon="print" type="primary" disabled :loading="loading" @click="allDel" style="margin-left: 8px">打印</a-button>
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
          @change="handleTableChange"
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
          }"
          :rowKey="(dataSource, index) => dataSource.DocNo + '_' + index"
          bordered
        >
          <template slot="index" slot-scope="text, record, index">
            <div>
              <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
            </div>
          </template>
          <template slot="Enable" slot-scope="record">
            <div>
              <a-tag color="green" v-if="record == 'Y'">启用</a-tag>
              <a-tag color="red" v-else>禁用</a-tag>
            </div>
          </template>
          <template slot="action" slot-scope="text, record">
            <div>
              <a style="margin-right: 8px" @click="print(record)" :disabled="!hasPerm('print')">
                <a-icon type="print" />
                打印
              </a>
            </div>
          </template>
        </a-table>
        <print v-if="isPrint" :printData="printData" @closeModal="closeModal" />
      </a-card>
    </a-spin>
  </div>
</template>

<script>
import { getArrivalList } from "@/services/web.js";
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
import { splitData } from "@/utils/util.js";
import { PublicVar } from "@/mixins/publicVar.js";
import { columns } from "./data";
import print from "./print.vue";
export default {
  mixins: [PublicVar],
  components: { print },
  data() {
    return {
      scrollY: "",
      advanced: true,
      columns,
      dataSource: [],
      deviceTypeList: [],
      isSearch: 0,
      isExportLod: false,
      printData: [],
      isPrint: false,
      selectedRowKeys: [],
      enterList: [],
      enterId: "",
      listType: "全部",
      plantList: [],
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
    this.getPlantList();
  },
  methods: {
    splitData,
    //重置搜索
    reset() {
      this.isSearch = 0;
      this.searchForm.resetFields();
      this.listType = "全部";
      this.getListAll();
    },
    typeChange() {
      this.search();
    },
    closeModal() {
      this.isPrint = false;
    },
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    getPlantList() {
      getArrivalList("", "getplant").then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
        }
      });
    },
    //获取列表
    getListAll() {
      this.loading = true;
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        listType: "全部",
      };
      getArrivalList(parmas, "get").then((res) => {
        if (res.data.success) {
          this.dataSource = res.data.data.list;
          console.log("dataSource===", this.dataSource);
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.totalCount;
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
    print(record) {
      this.printData = [];
      this.isPrint = true;
      this.printData.push(record);
      console.log("record===", record);
    },
    printBatch() {
      this.printData = [];
      this.isPrint = true;
      this.dataSource.forEach((item, index) => {
        if (this.selectedRowKeys.includes(item.DocNo + "_" + index)) {
          this.printData.push(item);
        }
      });
    },
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          if (values["range-time-picker1"] != undefined) {
            var startcreatedate = values["range-time-picker1"][0].format("YYYY-MM-DD");
            var endcreatedate = values["range-time-picker1"][1].format("YYYY-MM-DD");
          }
          if (values["range-time-picker2"] != undefined) {
            var startreceivedate = values["range-time-picker2"][0].format("YYYY-MM-DD");
            var endreceivedate = values["range-time-picker2"][1].format("YYYY-MM-DD");
          }
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            type: this.listType,
            orderno: values.orderno,
            docno: values.docno,
            plantname: values.plantname,
            printstatus: values.printstatus,
            startcreatedate: startcreatedate,
            endcreatedate: endcreatedate,
            startreceivedate: startreceivedate,
            endreceivedate: endreceivedate,
          };
          getArrivalList(parmas, "get").then((res) => {
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
