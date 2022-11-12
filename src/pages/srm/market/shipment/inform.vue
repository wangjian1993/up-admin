<!--
 * @Author: max
 * @Date: 2022-05-05 11:01:59
 * @LastEditTime: 2022-11-11 09:16:06
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/srm/market/shipment/inform.vue
-->
<template>
  <div>
    <a-spin tip="导出中..." :spinning="isExportLod">
      <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
        <a-form layout="horizontal" :form="searchForm">
          <a-row>
            <a-col :span="6">
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
                <a-form-item label="客户" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" placeholder="请输入客户" v-decorator="['client']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="客户单号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" placeholder="请输入客户单号" v-decorator="['purchaseorderno']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="送货单号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" placeholder="请输入送货单号" v-decorator="['orderno']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="送货日期" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-range-picker style="width: 300px" v-decorator="['range-time-picker1']" />
                </a-form-item>
              </a-col>
               <a-col :md="6" :sm="24">
                <a-form-item label="预计到厂" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-range-picker style="width: 300px" v-decorator="['range-time-picker2']" />
                </a-form-item>
              </a-col>
               <a-col :md="6" :sm="24">
                <a-form-item label="到货日期" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-range-picker style="width: 300px" v-decorator="['range-time-picker3']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="采购类型" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['purchasetype']" placeholder="请选择采购类型" style="width: 200px">
                    <a-select-option v-for="item in paramsItem.PROCUREMENT_TYPE" :key="item.ParamCode" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="送货状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['deliverystatus']" placeholder="请选择送货状态" style="width: 200px">
                    <a-select-option v-for="item in paramsItem.DELIVERY_STATE" :key="item.ParamCode" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="物流状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['shippingstatus']" placeholder="请选择物流状态" style="width: 200px">
                    <a-select-option v-for="item in paramsItem.SHIPPING_STATE" :key="item.ParamCode" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
           <a-col :md="6" :sm="24">
                <a-form-item label="收货仓库" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" placeholder="请输入收货仓库" v-decorator="['receiptwarehouse']" />
                </a-form-item>
              </a-col>
            <a-col :md="6" :sm="24">
                <a-form-item label="送货类型" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['deliverytype']" placeholder="请选择送货类型" style="width: 200px">
                    <a-select-option v-for="item in paramsItem.DELIVER_TYPE" :key="item.ParamCode" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
               <a-col :md="6" :sm="24">
                <a-form-item label="送货方式" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['deliverymethod']" placeholder="请选择送货方式" style="width: 200px">
                    <a-select-option v-for="item in paramsItem.DELIVER_MODE" :key="item.ParamCode" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
               <a-col :md="6" :sm="24">
                <a-form-item label="采购员" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" placeholder="请输入采购员" v-decorator="['purchaseuser']" />
                </a-form-item>
              </a-col>
               <a-col :md="6" :sm="24">
                <a-form-item label="采购说明" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" placeholder="请输入采购说明" v-decorator="['purchasedescription']" />
                </a-form-item>
              </a-col>
               <a-col :md="6" :sm="24">
                <a-form-item label="送货地址" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" placeholder="请输入送货地址" v-decorator="['deliveryaddress']" />
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
          <a-button style="margin-left: 8px" :disabled="!hasPerm('add')" type="primary" @click="addDelivery" icon="plus">新建送货单</a-button>
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
          :rowKey="(dataSource) => dataSource.Id"
          bordered
        >
          <template slot="index" slot-scope="text, record, index">
            <div>
              <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
            </div>
          </template>
          <template slot="ReceiptWarehouseTitle">
            <p>收货仓库</p>
            <p>预计到厂</p>
          </template>
          <template slot="ReceiptWarehouse" slot-scope="text, record">
            <p>{{ record.ReceiptWarehouse }}</p>
            <p>{{ record.PlanDatetime }}</p>
          </template>
          <template slot="DeliveryTypeTitle">
            <p>送货类型</p>
            <p>送货方式</p>
          </template>
          <template slot="DeliveryType" slot-scope="text, record">
            <p>{{ record.DeliveryMethod }}</p>
            <p>{{ record.DeliveryType }}</p>
          </template>
          <template slot="action" slot-scope="text, record">
            <div>
              <a style="margin-right: 8px" @click="detail(record)">
                <a-icon type="container" />
                查看
              </a>
              <a style="margin-right: 8px" @click="edit(record)" :disabled="!hasPerm('edit')">
                <a-icon type="edit" />
                编辑
              </a>
              <a-popconfirm title="确定删除?" @confirm="() => onDelete(record)">
                <a style="margin-right: 8px" :disabled="!hasPerm('delete')">
                  <a-icon type="delete" />
                  删除
                </a>
              </a-popconfirm>
            </div>
          </template>
        </a-table>
      </a-card>
      <consigneeDetail v-if="isDetail" :orderId="orderId" @closeModal="closeModal" />
      <DeliveryForm v-if="isAddDelivery" :isEdit="isEdit" :orderId="orderId" :paramsItem="paramsItem"  @closeModal="closeModal" @success="searchBtn"/>
    </a-spin>
  </div>
</template>

<script>
import { getClientDelivery ,setClientDelivery } from "@/services/srm.js";
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
import { splitData } from "@/utils/util.js";
import { PublicVar } from "@/mixins/publicVar.js";
import { columns } from "./data/inform";
import ExportExcel from "@/utils/ExportExcelJS";
import consigneeDetail from "./components/consigneeDetail.vue";
import { getParamData } from "@/services/admin.js";
import DeliveryForm from './components/deliveryForm.vue';
export default {
  components: { consigneeDetail ,DeliveryForm },
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
      isAddDelivery:false,
      docno: "",
      tagItem: ["全部", "签收中", "待签收", "已发货", "已到货"],
      paramsList: ["DELIVER_TYPE","DELIVER_MODE","SHIPPING_STATE","DELIVERY_STATE","PROCUREMENT_TYPE"],
      paramsItem:[],
      orderId:"",
      isEdit:false,
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
    this.getParamData();
  },
  methods: {
    splitData,
    getParamData() {
      this.paramsList.forEach((item) => {
        let params = {
          groupcode: item,
        };
        getParamData(params).then((res) => {
          if (res.data.success) {
            this.paramsItem[item] = res.data.data;
          }
          console.log(this.paramsItem.PLC_PARAMS_TYPE);
        });
      });
    },
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
        this.scrollY = getTableScroll(280);
      } else {
        console.log("关闭====");
        this.scrollY = getTableScroll(-110);
      }
      console.log("scrollY===", this.scrollY);
    },
    closeModal() {
      this.isDetail = false;
      this.isAddDelivery = false
    },
    addDelivery(){
      this.isAddDelivery = true;
      this.isEdit  = false;
      this.orderId = "";
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
      this.orderId = record.Id;
    },
    edit(record){
      this.isEdit  = true;
      this.orderId = record.Id;
      this.isAddDelivery = true;
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
            var startdeliverydatetime = rangeValue[0].format("YYYY-MM-DD");
            var enddeliverydatetime = rangeValue[1].format("YYYY-MM-DD");
          }
          if (values["range-time-picker2"] && values["range-time-picker2"].length == 2) {
            const rangeValue = values["range-time-picker2"];
            var startplandatetime = rangeValue[0].format("YYYY-MM-DD");
            var endplandatetime = rangeValue[1].format("YYYY-MM-DD");
          }
          if (values["range-time-picker3"] && values["range-time-picker3"].length == 2) {
            const rangeValue = values["range-time-picker3"];
            var startreceiptdatetime = rangeValue[0].format("YYYY-MM-DD");
            var endreceiptdatetime = rangeValue[1].format("YYYY-MM-DD");
          }
          let params = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            keyword: values.keyword,
            tag: this.listType,
            client:values.client,
            purchaseorderno: values.purchaseorderno,
            orderno: values.orderno,
            product: values.product,
            purchaseuser: values.purchaseuser,
            deliverystatus: values.deliverystatus,
            shippingstatus: values.shippingstatus,
            receiptwarehouse: values.receiptwarehouse,
            deliverytype: values.deliverytype,
            deliverymethod: values.deliverymethod,
            purchasedescription: values.purchasedescription,
            deliveryaddress: values.deliveryaddress,
            startdeliverydatetime: startdeliverydatetime,
            enddeliverydatetime: enddeliverydatetime,
            startplandatetime: startplandatetime,
            endplandatetime: endplandatetime,
            startreceiptdatetime: startreceiptdatetime,
            endreceiptdatetime: endreceiptdatetime,
            purchasetype: values.purchasetype,
          };
          getClientDelivery(params, "get").then((res) => {
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
    onDelete(item) {
      let params = [];
      params.push(item.Id);
      setClientDelivery(params, "delete").then((res) => {
        if (res.data.success) {
          this.$message.success("删除成功!");
          this.searchBtn();
        }
      });
    },
    exportExcel() {
      this.isExportLod = true;
      let values = this.searchForm.getFieldsValue();
      let params = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.total,
        typeid: values.typeid,
        brand: values.brand,
        status: values.status,
        plccode: values.plccode,
        plcname: values.plcname,
      };
      getClientDelivery(params, "get").then((res) => {
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
