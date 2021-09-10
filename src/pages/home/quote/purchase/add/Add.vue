<!--
 * @Author: max
 * @Date: 2021-08-17 10:58:13
 * @LastEditTime: 2021-09-09 13:46:18
 * @LastEditors: max
 * @Description: 新建采购报价
 * @FilePath: /up-admin/src/pages/home/quote/purchase/add/Add.vue
-->
<template>
  <div>
    <a-spin tip="loading..." :spinning="costLoading">
      <a-card class="card" :bordered="false">
        <a-back-top />
        <!-- 搜索 -->
        <div class="save-btn">
          <span>
            <a-button type="primary" icon="save" @click="costSave">保存</a-button>
            <a-button style="margin-left: 8px" type="primary" icon="import" @click="handleExcel">导出</a-button>
          </span>
        </div>
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
                    <a-button style="margin-left: 8px" @click="reset">重置</a-button>
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
                  <a-input-number :disabled="item.IsReadonly == 'Y'" v-model="item.Amount" :min="0" @change="costNumber(item)" />
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
                  <a-input-number disabled :min="0" v-model="cost.materialTotal" />
                </p>
                <p class="input-text" v-if="priceNone.length > 0">价格不全 *{{ priceNone.length }}</p>
              </div>
            </a-col>
            <a-col :md="24" :lg="24" :xl="12">
              <div class="input-item">
                <p class="input-lable">最终成本:</p>
                <p class="input-number">
                  <a-input-number disabled :min="0" v-model="cost.ultimatelyTotal" />
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
                  <a-input type="textarea" v-model="quoteRemark" style="width:300px" />
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
            <a><a-input @change="remarkInput(record, index)" v-model="record.Remark"/></a>
          </div>
        </standard-table>
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
    scopedSlots: { customRender: "Tips" },
    width: "5%",
  },
  {
    title: "备注",
    dataIndex: "Remark",
    scopedSlots: { customRender: "action" },
  },
];
import { getDemandEnter, getCostConfig, addCost } from "@/services/web.js";
import ExportExcel from "@/utils/importExcel";
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
      cost: {
        materialTotal: 0, //物料成本
        ultimatelyTotal: 0, //最终成本
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
      priceNone: [], // 价格不全
      costTotal: 0,
      top: 10,
      searchData: [],
      quoteRemark: "",
      isEdit: false,
    };
  },
  created() {
    this.getDemandEnter();
    if (this.$route.query.id) {
      this.editCost();
      this.isEdit = true;
    } else {
      this.isEdit = false;
    }
  },
  methods: {
    //复制发布
    editCost() {
      this.costLoading = true;
      let parmas = {
        id: this.$route.query.id,
        sign: this.$route.query.sign,
      };
      getCostConfig(parmas, "getbomdetail2").then((res) => {
        if (res.data.success) {
          this.tableData = res.data.data.ItemInfo.ItemChildList;
          this.costInfo = res.data.data.ItemInfo;
          this.costList = res.data.data.CostBaseList;
          this.cost.materialTotal = this.costInfo.MaterialCost;
          this.cost.ultimatelyTotal = this.costInfo.FinalCost;
          let parmas = {
            itemcode: this.costInfo.ItemCode,
            enterpriseid: this.costInfo.EnterpriseId,
            plantid: this.costInfo.PlantId,
          };
          this.searchForm.setFieldsValue(parmas);
          this.searchData = parmas;
          this.countCost();
        }
        this.costLoading = false;
      });
    },
    handleExcel() {
      const dataSource = this.tableData.map((item) => {
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
      const columns = this.columns.map((item) => ({ key: item.dataIndex, title: item.title }));
      // dataSource.unshift(product);
      console.log(dataSource);
       console.log(columns);
      ExportExcel(columns, dataSource, `${this.costInfo.ItemName}_采购报价导出.xlsx`);
    },
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
    //重置数据
    reset() {
      this.costList = [];
      this.costInfo = [];
      this.tableData = [];
      this.searchForm.resetFields();
    },
    //关键词搜索
    search() {
      this.costLoading = true;
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.searchData = values;
          getCostConfig(values, "getbomdetail").then((res) => {
            if (res.data.success) {
              this.tableData = res.data.data.ItemInfo.ItemChildList;
              this.costInfo = res.data.data.ItemInfo;
              this.costList = res.data.data.CostBaseList;
              this.countCost();
            }
            this.costLoading = false;
          });
        } else {
          this.costLoading = false;
        }
      });
    },
    costNumber() {
      let total = 0;
      this.costList.map((item) => {
        if (item.Amount) {
          total += item.Amount;
        }
      });
      console.log(total);
      this.costTotal = total;
      let expenses = this.cost.materialTotal + this.costTotal;
      this.cost.ultimatelyTotal = parseFloat(expenses.toFixed(4));
    },
    //计算物料成本
    countCost() {
      var sum = 0;
      let total = 0;
      this.priceNone = [];
      let list = this.tableData;
      list.forEach((item) => {
        item.Remark = "";
        sum += item.Price * item.Yl;
        //价格不全数量
        if (item.Price == 0) {
          this.priceNone.push(item);
        }
      });
      //物聊费用
      this.cost.materialTotal = parseFloat(sum.toFixed(4));
      //只有添加才计算

      this.costList.forEach((item) => {
        //计算电源贴片费用
        if (this.costInfo.ItemOtherInfo && item.CostName === "电源贴片费") {
          item.Amount = this.costInfo.ItemOtherInfo.TpKeyWordRowsTotalUsing * this.cost.materialTotal;
        }
        //计算损耗费用
        if (item.CostName === "损耗") {
          let percent = item.Description.split("*");
          var str = percent[1].replace("%", "");
          str = str / 100;
          let num = str * this.cost.materialTotal;
          item.Amount = parseFloat(num.toFixed(4));
        }
        //计算总费用
        if (item.Amount) {
          total += item.Amount;
        }
      });
      this.costTotal = total;
      //最终费用
      let expenses = this.cost.materialTotal + this.costTotal;
      this.cost.ultimatelyTotal = parseFloat(expenses.toFixed(4));
    },
    //修改单价
    priceNumber(item, index) {
      this.tableData[index].Amount = item.Price * item.Yl;
      if (item.Price != item.PriceErp) {
        this.tableData[index].Tips = "价格修改过";
      } else {
        if (item.Price == 0) {
          this.tableData[index].Tips = "价格不全";
        } else {
          this.tableData[index].Tips = "";
        }
      }
      this.countCost();
    },
    //修改备注
    remarkInput(e, index) {
      console.log(e);
      console.log(index);
    },
    //保存报价单
    costSave() {
      this.searchData =this.searchForm.getFieldsValue()
      if (this.costList.length == 0) {
        this.$message.warning("请先查询物联信息!");
        return;
      }
      if (this.searchData.enterpriseid == undefined) {
        this.$message.warning("请先选择需求公司!");
        return;
      }
      if (this.searchData.plantid == undefined) {
        this.$message.warning("请先选择生产工厂!");
        return;
      }
      this.costLoading = true;
      let parmas = {
        CostBaseList: this.costList,
        ItemChildList: this.tableData,
        EnterpriseId: this.searchData.enterpriseid,
        PlantId: this.searchData.plantid,
        ItemCode: this.costInfo.ItemCode,
        ItemName: this.costInfo.ItemName,
        ItemSpecification: this.costInfo.ItemSpecification,
        ItemSort: this.costInfo.ItemSort,
        MaterialCost: this.cost.materialTotal,
        MaterialCostDescription: "价格不全*" + this.priceNone.length,
        FinalCost: this.cost.ultimatelyTotal,
        Remark: this.quoteRemark,
      };
      console.log(parmas);
      addCost(parmas, "addnewquote").then((res) => {
        if (res.data.success) {
          this.$message.success("保存成功!");
        }
        this.costLoading = false;
      });
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
.save-btn {
  display: flex;
  justify-content: flex-end;
}
</style>
