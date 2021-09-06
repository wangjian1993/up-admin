<!--
 * @Author: max
 * @Date: 2021-08-17 10:58:13
 * @LastEditTime: 2021-09-06 18:05:24
 * @LastEditors: max
 * @Description: 新建采购报价
 * @FilePath: /up-admin/src/pages/home/quote/purchase/add/Add.vue
-->
<template>
  <div>
    <a-spin tip="查询中..." :spinning="costLoading">
      <a-card class="card" :bordered="false">
        <!-- 搜索 -->
        <div :class="advanced ? 'search' : null">
          <a-form layout="horizontal" :form="searchForm">
            <div :class="advanced ? null : 'fold'">
              <a-row>
                <a-col :md="6" :sm="24">
                  <a-form-item label="产品品号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 14, offset: 1 }">
                    <a-input
                      placeholder="请输入产品品号"
                      v-decorator="[
                        'itemcode',
                        {
                          rules: [{ required: true, message: '请输入产品品号' }],
                        },
                      ]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :md="6" :sm="24">
                  <a-form-item label="需求公司" :labelCol="{ span: 5 }" :wrapperCol="{ span: 14, offset: 1 }">
                    <a-select
                      placeholder="请选择需求公司"
                      v-decorator="[
                        'enterpriseid',
                        {
                          rules: [{ required: true, message: '请选择需求公司' }],
                        },
                      ]"
                    >
                      <a-select-option v-for="item in enterList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="6" :sm="24">
                  <a-form-item label="生产工厂" :labelCol="{ span: 5 }" :wrapperCol="{ span: 14, offset: 1 }">
                    <a-select
                      placeholder="请选择生产工厂"
                      v-decorator="[
                        'plantid',
                        {
                          rules: [{ required: true, message: '请选择生产工厂' }],
                        },
                      ]"
                    >
                      <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="6" :sm="24">
                  <span style="float: left; margin-top: 5px;">
                    <a-button type="primary" @click="search">查询</a-button>
                    <a-button style="margin-left: 8px">重置</a-button>
                  </span>
                </a-col>
              </a-row>
              <a-row>
                <a-col :md="12" :sm="24">
                  <a-form-item label="产品大类" :labelCol="{ span: 2 }" :wrapperCol="{ span: 14, offset: 1 }">
                    <a-input v-model="costInfo.ItemSort" />
                  </a-form-item>
                </a-col>
                <a-col :md="12" :sm="24">
                  <a-form-item label="产品品名" :labelCol="{ span: 2 }" :wrapperCol="{ span: 14, offset: 1 }">
                    <a-input v-model="costInfo.ItemName" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :md="12" :sm="24">
                  <a-form-item label="产品规格" :labelCol="{ span: 2 }" :wrapperCol="{ span: 14, offset: 1 }">
                    <a-textarea v-model="costInfo.ItemSpecification" :rows="2" />
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
          </a-form>
        </div>
      </a-card>
      <!-- 填写报价单 -->
      <a-card class="card" title="填写报价单" :bordered="false" :bodyStyle="{ padding: '0px 24px' }" :headStyle="{ padding: '5px 24px', minHeight: '30px' }">
        <div class="input-box" v-if="costList.length">
          <a-row>
            <a-col :md="24" :lg="24" :xl="12" v-for="(item, index) in costList" :key="index">
              <div class="input-item">
                <p class="input-lable" :class="item.IsReadonly == 'N' ? 'input-lable-color2' : 'input-lable-color1'">{{ item.CostName }}:</p>
                <p class="input-number">
                  <a-input-number :disabled="item.IsReadonly == 'Y'" v-model="item.value" :min="0" @change="costNumber(item)" />
                </p>
                <p class="input-text">{{ item.Description }}</p>
              </div>
            </a-col>
          </a-row>
          <a-row>
            <a-col :md="24" :lg="24" :xl="12">
              <div class="input-item">
                <p class="input-lable">物料成本:</p>
                <p class="input-number">
                  <a-input-number disabled :min="0" v-model="cost.materialTotal"/>
                </p>
                <p class="input-text"></p>
              </div>
            </a-col>
            <a-col :md="24" :lg="24" :xl="12">
              <div class="input-item">
                <p class="input-lable">最终成本:</p>
                <p class="input-number">
                  <a-input-number disabled :min="0" v-model="cost.ultimatelyTotal"/>
                </p>
                <p class="input-text"></p>
              </div>
            </a-col>
          </a-row>
          <a-row>
            <a-col :md="24" :lg="24" :xl="24">
              <div class="input-item">
                <p class="input-lable">备注:</p>
                <p class="input-number">
                  <a-input type="textarea" style="width:300px" />
                </p>
                <p class="input-text"></p>
              </div>
            </a-col>
          </a-row>
        </div>
        <a-empty v-else />
      </a-card>
      <!-- //物料 -->
      <a-card class="card" title="物料" :bordered="false" :bodyStyle="{ padding: '0px 24px' }" :headStyle="{ padding: '5px 24px', minHeight: '30px' }">
        <standard-table :pagination="pagination" :columns="columns" :dataSource="tableData">
          <div slot="Price" slot-scope="{ record, index }">
            <a-input-number :id="record.key" v-model="record.Price" :min="0" @change="priceNumber(record, index)" />
          </div>
          <div slot="Property" slot-scope="{ text }">
            <p v-if="text != '委外加工费'">{{ text }}</p>
            <p v-else style="color:#e01111">{{ text }}</p>
          </div>
          <div slot="action" slot-scope="{ record, index }">
            <a><a-input @change="remarkInput(record, index)" :value="record.remark"/></a>
          </div>
        </standard-table>
      </a-card>
      <a-card class="card" title="系统数据" :bordered="false" :bodyStyle="{ padding: '0px 24px' }" :headStyle="{ padding: '5px 24px' }">
        <div class="input-box">
          <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-row>
              <a-col :sm="24" :md="24" :lg="12" :xl="8">
                <a-form-item label="发布人">
                  <a-input v-decorator="['note']" />
                </a-form-item>
              </a-col>
              <a-col :sm="24" :md="24" :lg="12" :xl="8">
                <a-form-item label="填写日期">
                  <a-input v-decorator="['note']" />
                </a-form-item>
              </a-col>
              <a-col :sm="24" :md="24" :lg="12" :xl="8">
                <a-form-item label="发布人公司">
                  <a-input v-decorator="['note']" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :sm="24" :md="24" :lg="12" :xl="8">
                <a-form-item label="来源">
                  <a-input v-decorator="['note']" />
                </a-form-item>
              </a-col>
              <a-col :sm="24" :md="24" :lg="12" :xl="8">
                <a-form-item label="来源单号">
                  <a-input v-decorator="['note']" />
                </a-form-item>
              </a-col>
              <a-col :sm="24" :md="24" :lg="12" :xl="8">
                <a-form-item label="来源申请人/公司">
                  <a-input v-decorator="['note']" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </a-card>
    </a-spin>
  </div>
</template>

<script>
import StandardTable from "@/components/table/StandardTable";
const columns = [
  {
    title: "序号",
    dataIndex: "IndexNo",
    align: "center",
    width: "4%",
  },
  {
    title: "阶次",
    dataIndex: "LvNo",
    width: "5%",
  },
  {
    title: "类型",
    dataIndex: "Property",
    scopedSlots: { customRender: "Property" },
    width: "5%",
  },
  {
    title: "上阶料号",
    dataIndex: "LastCode",
    width: "10%",
  },
  {
    title: "料号",
    dataIndex: "ChildCode",
  },
  {
    title: "料名",
    dataIndex: "ChildName",
  },
  {
    title: "料规格",
    dataIndex: "ChildSpecification",
  },
  {
    title: "单位",
    dataIndex: "UnitName",
    width: "5%",
  },
  {
    title: "E10单价",
    dataIndex: "PriceErp",
    scopedSlots: { customRender: "e10" },
    width: "5%",
  },
  {
    title: "单价",
    dataIndex: "Price",
    scopedSlots: { customRender: "Price" },
  },
  {
    title: "用量",
    dataIndex: "Yl",
    width: "5%",
  },
  {
    title: "金额",
    dataIndex: "Amount",
  },
  {
    title: "提示",
    dataIndex: "Tips",
    width: "5%",
  },
  {
    title: "备注",
    scopedSlots: { customRender: "action" },
  },
];
import { getDemandEnter, getCostConfig } from "@/services/web.js";
export default {
  components: { StandardTable },
  data() {
    return {
      advanced: true,
      bomDetail: [],
      costList: [],
      tableData: [],
      columns,
      pagination: false,
      cost:{
         materialTotal: 0,   //物料成本
         ultimatelyTotal: 0,   //最终成本
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      // form: {
      //   name: "",
      //   region: undefined,
      //   date1: undefined,
      //   delivery: false,
      //   type: [],
      //   resource: "",
      //   desc: "",
      // },
      searchForm: this.$form.createForm(this),
      plantList: [],
      enterList: [],
      loading: false,
      costInfo: [],
      costLoading: false,
    };
  },
  created() {
    // this.searchClick();
    // this.getCompanyBomCost();
    this.getDemandEnter();
  },
  methods: {
    //获取需求公司
    getDemandEnter() {
      let parmas = {
        entertypecode: "COMPANY",
      };
      let parmas1 = {
        entertypecode: "PLANT",
      };
      getDemandEnter(parmas).then((res) => {
        if (res.data.success) {
          this.enterList = res.data.data;
        }
      });
      getDemandEnter(parmas1).then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
        }
      });
    },
    //关键词搜索
    search() {
      this.costLoading = true;
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          getCostConfig(values, "getnewestcostbaseinfo").then((res) => {
            if (res.data.success) {
              this.costList = res.data.data;
            }
          });
          getCostConfig(values, "getbomdetail").then((res) => {
            if (res.data.success) {
              this.tableData = res.data.data.ItemChildList;
              this.costInfo = res.data.data;
              //物料成本
              var sum = 0;
              this.tableData.forEach((item) => {
                sum += item.Price * item.Yl;
              });
              this.cost.materialTotal = parseFloat(sum.toFixed(4));
              this.cost.ultimatelyTotal = this.cost.materialTotal
            }
            this.costLoading = false;
          });
        }
      });
    },
    //产品大类输入
    sortInput(e) {
      this.bomDetail.one_sort = e.target.value;
    },
    //产品型号输入
    typeInput(e) {
      this.bomDetail.two_sort = e.target.value;
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    searchClick() {},
    costNumber() {
      // let total = 0;
      // this.costList.cost_options.map((item) => {
      //   if (item.field_name != "total_cost" && item.value) {
      //     total += item.value;
      //   }
      // });
    },
    priceNumber(item, index) {
      this.detailData.child_data[index].row_amount = item.price * item.yl;
      var sum = 0,
        finallyTotal = 0;
      let list = this.detailData.child_data;
      list.forEach((item) => {
        sum += item.price * item.yl;
      });
      let total = parseFloat(sum.toFixed(4));
      this.$emit("setMaterialTotal", total);
      this.costList.cost_options.map((item) => {
        if (item.field_name != "total_cost" && item.value) {
          finallyTotal += item.value;
        }
      });
      console.log(finallyTotal);
    },
  },
};
</script>

<style lang="less" scoped>
.input-item {
  display: flex;
  align-items: center;
  .input-lable {
    width: 100px;
    text-align: right;
  }
  .input-number {
    padding-left: 5px;
  }
  .input-text {
    padding-left: 5px;
  }
}
.input-lable-color2 {
  color: rgb(17, 224, 17);
}
.input-lable-color1 {
  color: #000;
}
.ant-card-body {
  padding: 0;
}
.ant-card-head-title {
  padding: 0;
}
.ant-form-item {
  margin-bottom: 0;
}
/deep/ .card {
  margin: 10px 0;
}
.input-box {
  margin-bottom: 20px;
}
</style>
