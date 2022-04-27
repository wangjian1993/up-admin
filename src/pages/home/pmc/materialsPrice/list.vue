<!--
 * @Author: max
 * @Date: 2022-04-27 08:46:44
 * @LastEditTime: 2022-04-27 10:00:02
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/pmc/materialsPrice/list.vue
-->
<template>
  <div>
    <a-spin tip="导出中..." :spinning="isExportLod">
      <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
        <a-form layout="horizontal" :form="searchForm">
          <div :class="advanced ? null : 'fold'">
            <a-row>
              <a-col :md="6" :sm="24">
                <a-form-item label="供应商编码" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入供应商编码" v-decorator="['suppliercode']" />
                </a-form-item>
              </a-col>
               <a-col :md="6" :sm="24">
                <a-form-item label="供应商简称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入供应商简称" v-decorator="['SupplierName']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="0-面积" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input-number
                    :min="0"
                    style="width: 200px"
                    allowClear
                    placeholder="请输入面积"
                    v-decorator="[
                      'square',
                      {
                        initialValue: 50,
                        rules: [{ required: true, message: '请输入面积!' }],
                      },
                    ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="基准价格(大于)" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input-number
                    :min="0"
                    style="width: 200px"
                    allowClear
                    placeholder="请输入基准价格1"
                    v-decorator="[
                      'jzprice1',
                      {
                        rules: [{ required: true, message: '请输入基准价格1!' }],
                      },
                    ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="基准价格(小于)" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input-number
                    :min="0"
                    style="width: 200px"
                    allowClear
                    placeholder="请输入基准价格2"
                    v-decorator="[
                      'jzprice2',
                      {
                        rules: [{ required: true, message: '请输入基准价格2!' }],
                      },
                    ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="铜厚" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入铜厚" v-decorator="['thstr']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="耐压" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入耐压" v-decorator="['nystr']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="板厚" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入板厚" v-decorator="['bhstr']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="生产工艺" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入生产工艺" v-decorator="['scgystr']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="品号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入品号" v-decorator="['ItemCode']" />
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <span style="display:flex;justify-content: flex-end">
            <a-button type="primary" @click="search">查询</a-button>
            <a-button style="margin-left: 8px" @click="reset">重置</a-button>
            <a-button v-if="hasPerm('update')" icon="reload" type="primary" :disabled="dataSource.length == 0" @click="update" style="margin-left: 8px">提交</a-button>
          </span>
        </a-form>
        <a-table :columns="columns" :data-source="dataSource" size="small" :scroll="{ y: scrollY }" :loading="loading" :rowClassName="rowClassName" :pagination="pagination" @change="handleTableChange" :rowKey="(dataSource, index) => dataSource.ItemCode + '_' + index" bordered>
          <template slot="index" slot-scope="text, record, index">
            <div>
              <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
            </div>
          </template>
          <template slot="TaxIncluded" slot-scope="text">
            <div>
              <a-tag :color="text === 'True' ? 'green' : 'red'">{{ text === "True" ? "是" : "否" }}</a-tag>
            </div>
          </template>
          <template slot="ComponentPrice" slot-scope="text">
            <div>
              <a-tag :color="text === 'True' ? 'green' : 'red'">{{ text === "True" ? "是" : "否" }}</a-tag>
            </div>
          </template>
          <template slot="EffectiveDate" slot-scope="text, record">
            <div>
              <p>{{ timeSplit(record.EffectiveDate) }}</p>
              <p v-if="record.EffectiveDateAfter != ''">{{ record.EffectiveDateAfter }}(修改后)</p>
            </div>
          </template>
          <template slot="Price" slot-scope="text, record">
            <div>
              <p>{{ record.Price }}</p>
              <p v-if="record.PriceAfter != ''">{{ record.PriceAfter }}(修改后)</p>
            </div>
          </template>
          <template slot="PriceD" slot-scope="text, record">
            <div>
              <p>{{ record.PriceD }}</p>
              <p v-if="record.PriceDAfter != ''">{{ record.PriceDAfter }}(修改后)</p>
            </div>
          </template>
        </a-table>
      </a-card>
    </a-spin>
  </div>
</template>

<script>
import { getMaterialsPrice } from "@/services/web.js";
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
import { splitData } from "@/utils/util.js";
import { PublicVar } from "@/mixins/publicVar.js";
import { columns } from "./data";
export default {
  mixins: [PublicVar],
  data() {
    return {
      scrollY: "",
      advanced: true,
      columns,
      dataSource: [],
      isDrawer: false,
      plantList: [],
      plantid: "",
      drawerItem: [],
      isSearch: 0,
      statistic: [],
      isUserList: false,
      isExportLod: false,
      statisticType: "",
      stateList: [],
      workshopList: [],
      lineList: [],
      workshopId: "",
      editData: [],
      isEdit: false,
      isPrint: false,
      printData: [],
    };
  },
  updated() {
    renderStripe();
  },
  created() {
    this.$nextTick(() => {
      this.scrollY = getTableScroll(70);
    });
  },
  methods: {
    splitData,
    //重置搜索
    timeSplit(time) {
      let str = time.split(" ");
      return str[0];
    },
    reset() {
      this.isSearch = 0;
      this.searchForm.resetFields();
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
      this.getListAll();
    },
    update() {
      let values = this.searchForm.getFieldsValue();
      let parmas = {
        PageIndex: this.pagination.current,
        PageSize: this.pagination.pageSize,
        Sign: "SUBMIT",
        SupplierCode: values.suppliercode.toString(),
        Square: values.square,
        JzPrice1: values.jzprice1,
        JzPrice2: values.jzprice2,
        SupplierName: values.SupplierName || "",
        ItemCode: values.ItemCode || "",
        ThStr: values.thstr != undefined ? values.thstr.toString() : "",
        NyStr: values.nystr != undefined ? values.nystr.toString() : "",
        BhStr: values.bhstr != undefined ? values.bhstr.toString() : "",
        ScgyStr: values.scgystr != undefined ? values.scgystr.toString() : "",
      };
      getMaterialsPrice(parmas,'bindfun').then((res) => {
        if (res.data.success) {
          this.dataSource = res.data.data.list;
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.totalCount;
          this.pagination = pagination;
          this.$message.success("提交成功!");
        }
        this.loading = false;
      });
    },
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          if (values.suppliercode == undefined && values.SupplierName == undefined) {
            this.$message.warning("请输入供应商编码或供应商简称!");
            return;
          }
          this.loading = true;
          let parmas = {
            PageIndex: this.pagination.current,
            PageSize: this.pagination.pageSize,
            Sign: "GET",
            SupplierCode: values.suppliercode.toString(),
            Square: values.square,
            JzPrice1: values.jzprice1,
            JzPrice2: values.jzprice2,
            SupplierName: values.SupplierName || "",
            ItemCode: values.ItemCode || "",
            ThStr: values.thstr != undefined ? values.thstr.toString() : "",
            NyStr: values.nystr != undefined ? values.nystr.toString() : "",
            BhStr: values.bhstr != undefined ? values.bhstr.toString() : "",
            ScgyStr: values.scgystr != undefined ? values.scgystr.toString() : "",
          };
          getMaterialsPrice(parmas,'bindfun').then((res) => {
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
    rowClassName(record) {
      return record.ApproveStatus != "可以更新" ? "Rowactive" : "";
    },
  },
};
</script>

<style scoped lang="less">
/deep/.ant-table {
  min-height: 62vh;
}
.ant-form-item {
  margin-bottom: 5px;
}
/deep/.Rowactive > td {
  // background-color: #ed0e0e !important;
  color: #f60e0e !important;
}
</style>
