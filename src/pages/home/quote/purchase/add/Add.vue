<!--
 * @Author: max
 * @Date: 2021-08-17 10:58:13
 * @LastEditTime: 2021-10-30 16:36:12
 * @LastEditors: max
 * @Description: 新建采购报价
 * @FilePath: /up-admin/src/pages/home/quote/purchase/add/Add.vue
-->
<template>
  <div>
    <a-spin tip="loading..." :spinning="costLoading">
      <a-card class="card" :bordered="false">
        <a-back-top :visibilityHeight="300" />
        <!-- 搜索 -->
        <div class="save-btn">
          <span>
            <a-button v-if="!isAgainCost" :disabled="!hasPerm('search')" type="primary" @click="search" icon="search">查询</a-button>
            <a-button v-if="!isAgainCost" :disabled="!hasPerm('search')" style="margin-left: 10px" icon="reload" @click="reset">重置</a-button>
          </span>
          <span>
            <a-button :disabled="!hasPerm('save')" type="primary" icon="save" style="margin-left: 10px" @click="costSave">{{ saveBtnText }}</a-button>
            <a-button :disabled="!hasPerm('export')" style="margin-left: 10px" type="primary" icon="import" @click="handleExcel">导出</a-button>
          </span>
        </div>
        <div :class="advanced ? 'search' : null">
          <a-form layout="horizontal" :form="searchForm">
            <div :class="advanced ? null : 'fold'">
              <a-row>
                <a-col :lg="8" :md="12" :sm="24">
                  <a-form-item label="品号" :labelCol="{ span: 4 }" :wrapperCol="{ span: 14, offset: 1 }">
                    <a-input
                      placeholder="请输入产品BOM号"
                      :disabled="isSearch"
                      allowClear
                      v-decorator="[
                        'itemcode',
                        {
                          rules: [{ required: true, message: '请输入产品BOM号' }],
                        },
                      ]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :lg="8" :md="12" :sm="24">
                  <a-form-item label="需求公司" :labelCol="{ span: 4 }" :wrapperCol="{ span: 14, offset: 1 }">
                    <a-select
                      :disabled="isSearch"
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
                <a-col :lg="8" :md="12" :sm="24">
                  <a-form-item label="生产工厂" :labelCol="{ span: 4 }" :wrapperCol="{ span: 14, offset: 1 }">
                    <a-select
                      :disabled="isSearch"
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
              </a-row>
              <a-row>
                <a-col :lg="8" :md="12" :sm="24">
                  <a-form-item label="品名" :labelCol="{ span: 4 }" :wrapperCol="{ span: 14, offset: 1 }">
                    <a-input :disabled="isSearch" v-model="costInfo.ItemName" />
                  </a-form-item>
                </a-col>
                <a-col :lg="8" :md="12" :sm="24">
                  <a-form-item label="产品大类" :labelCol="{ span: 4 }" :wrapperCol="{ span: 14, offset: 1 }">
                    <a-input :disabled="isSearch" v-model="costInfo.ItemSort" />
                  </a-form-item>
                </a-col>
                <a-col :lg="8" :md="12" :sm="24">
                  <a-form-item label="产品规格" :labelCol="{ span: 4 }" :wrapperCol="{ span: 14, offset: 1 }">
                    <a-textarea :disabled="isSearch" v-model="costInfo.ItemSpecification" :rows="3" />
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
          </a-form>
        </div>
      </a-card>
      <!-- 填写报价单 -->
      <a-card class="card" title="填写报价单" :bordered="false" :bodyStyle="{ padding: '5px 24px' }" :headStyle="{ padding: '5px 24px', minHeight: '30px' }">
        <div class="input-box" v-if="costList.length">
          <p style="color:red;padding:10px 0;" v-if="costInfo.ItemOtherInfo && costInfo.ItemOtherInfo.QuotedTips != ''">{{ costInfo.ItemOtherInfo.QuotedTips }}</p>
          <a-row v-for="(item, index) in costList" :key="index + 'cost'" class="cost-list">
            <a-col :md="2" :lg="2" :xl="2">
              <p class="input-title">{{ item.CostSort }}</p>
            </a-col>
            <a-col :md="22" :lg="22" :xl="22">
              <a-row>
                <a-col :md="24" :lg="24" :xl="12" v-for="(items, indexs) in item.list" :key="indexs">
                  <div class="input-item">
                    <p class="input-lable">{{ items.CostName }}:</p>
                    <p class="input-number">
                      <a-input-number size="small" :disabled="items.IsReadonly == 'Y'" v-model="items.Amount" :min="0" @change="costNumber(items)" />
                    </p>
                    <p class="input-text">{{ items.Description }}</p>
                  </div>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
          <a-row class="cost-list">
            <a-col :md="2" :lg="2" :xl="2">
              <p class="input-title">总费用</p>
            </a-col>
            <a-col :md="22" :lg="22" :xl="22">
              <a-row>
                <a-col :md="24" :lg="24" :xl="12">
                  <div class="input-item">
                    <p class="input-lable input-text-color">物料成本:</p>
                    <p class="input-number">
                      <a-input-number size="small" disabled :min="0" v-model="cost.materialTotal" />
                    </p>
                    <p class="input-text" v-if="costInfo.ItemOtherInfo">{{ costInfo.ItemOtherInfo.PriceIncompleteMsg }}</p>
                  </div>
                </a-col>
                <a-col :md="24" :lg="24" :xl="12">
                  <div class="input-item">
                    <p class="input-lable input-text-color">最终成本:</p>
                    <p class="input-number">
                      <a-input-number disabled size="small" :min="0" v-model="cost.ultimatelyTotal" />
                    </p>
                    <p class="input-text"></p>
                  </div>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
          <a-row class="cost-list">
            <a-col :md="2" :lg="2" :xl="2">
              <p class="input-title"></p>
            </a-col>
            <a-col :md="22" :lg="22" :xl="22">
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
            </a-col>
          </a-row>
        </div>
        <a-empty v-else />
      </a-card>
      <!-- //物料 -->
      <a-card class="card" title="物料" :bordered="false" :bodyStyle="{ padding: '0px 24px' }" :headStyle="{ padding: '5px 24px', minHeight: '30px' }">
        <div class="table-search">
          <a-space class="operator">
            <a-button type="primary" :disabled="!hasSelected" :loading="loading" @click="toAosage" style="margin-left: 8px">用量统计</a-button>
            <span style="margin-left: 8px">
              <template v-if="hasSelected">
                {{ `共选中 ${selectedRowKeys.length} 条` }}
              </template>
            </span>
          </a-space>
          <a-form layout="inline" :form="keywordForm">
            <a-form-item label="(品号,品名, 产品规格,提示)关键字匹配">
              <a-input v-model="keyword" allowClear @change="listSearch" />
            </a-form-item>
          </a-form>
        </div>
        <a-table
          :pagination="pagination"
          size="small"
          :columns="columns"
          :data-source="searchList"
          :rowKey="(searchList) => searchList.CodeId"
          :row-class-name="rowClassName"
          :row-selection="{
            columnWidth: 40,
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
            onSelect: onSelect,
          }"
        >
          <div slot="Price" slot-scope="text, record, index">
            <a-input-number :disabled="record.Property === '自制件' || record.Property === '虚设件'" :id="record.key" v-model="record.Price" :min="0" @change="priceNumber(record, index)" />
          </div>
          <div slot="Property" slot-scope="text">
            <p v-if="text != '委外加工费'">{{ text }}</p>
            <p v-else style="color:#e01111">{{ text }}</p>
          </div>
          <div slot="Tips" slot-scope="text">
            <p style="color:#f51f1f">{{ text }}</p>
          </div>
          <div slot="e10" slot-scope="text, record">
            <p>{{ record.PriceErpSource == "" ? text : text + `(${record.PriceErpSource})` }}</p>
          </div>
          <div slot="Remark" slot-scope="text, record, i" class="raemark-input">
            <a-input size="small" style="width:150px;font-size: 10px;" allowClear @change="(e) => remarkInput(e, record, i)" :value="text" />
          </div>
          <!-- <template slot="dosage" slot-scope="text,record">
            <p @click="dosageClick(record)">{{ text}}</p>
          </template> -->
        </a-table>
      </a-card>
      <dosage v-if="isDosage" :searchDosage="searchDosage" @closeModal="closeModal" @empty="empty" @remove="removeDosage"></dosage>
    </a-spin>
  </div>
</template>

<script>
import { getDemandEnter, getCostConfig, addCost } from "@/services/web.js";
import Dosage from "./Dosage.vue";
import { exportjsontoexcelMore } from "../list/exportExcel";
const excelHead = [
  {
    title: "序号",
    dataIndex: "IndexNo",
    align: "center",
    width: "3%",
  },
  {
    title: "阶次",
    dataIndex: "LvNo",
    width: "40px",
    align: "center",
  },
  {
    title: "类型",
    dataIndex: "Property",
    scopedSlots: { customRender: "Property" },
    width: "5%",
    align: "center",
  },
  {
    title: "上阶BOM号",
    dataIndex: "LastCode",
    width: "9%",
    align: "center",
  },
  {
    title: "品号",
    dataIndex: "ChildCode",
    align: "center",
  },
  {
    title: "品名",
    dataIndex: "ChildName",
    align: "center",
  },
  {
    title: " 产品规格",
    dataIndex: "ChildSpecification",
    width: "18%",
    align: "center",
  },
  {
    title: "单位",
    dataIndex: "UnitName",
    width: "4%",
    align: "center",
  },
  {
    title: "E10单价",
    dataIndex: "PriceErp",
    scopedSlots: { customRender: "e10" },
    width: "5%",
    align: "center",
  },
  {
    title: "单价",
    dataIndex: "Price",
    scopedSlots: { customRender: "Price" },
    align: "center",
  },
  {
    title: "用量",
    dataIndex: "Yl",
    width: "5%",
    align: "center",
  },
  {
    title: "金额",
    dataIndex: "Amount",
    align: "center",
  },
  {
    title: "提示",
    dataIndex: "Tips",
    scopedSlots: { customRender: "Tips" },
    width: "5%",
    align: "center",
  },
  {
    title: "备注",
    dataIndex: "Remark",
    scopedSlots: { customRender: "Remark" },
    width: "8%",
  },
];
export default {
  components: { Dosage },
  data() {
    return {
      advanced: true,
      costList: [],
      tableData: [],
      columns: [
        {
          title: "序号",
          dataIndex: "IndexNo",
          align: "center",
          width: "3%",
        },
        {
          title: "阶次",
          dataIndex: "LvNo",
          width: "3%",
          align: "center",
        },
        {
          title: "类型",
          dataIndex: "Property",
          scopedSlots: { customRender: "Property" },
          width: "5%",
          align: "center",
        },
        {
          title: "上阶BOM号",
          dataIndex: "LastCode",
          align: "center",
        },
        {
          title: "品号",
          dataIndex: "ChildCode",
          align: "center",
        },
        {
          title: "品名",
          dataIndex: "ChildName",
          align: "center",
          width: "10%",
        },
        {
          title: " 产品规格",
          dataIndex: "ChildSpecification",
          align: "center",
          width: "20%",
        },
        {
          title: "单位",
          dataIndex: "UnitName",
          width: "5%",
          align: "center",
        },
        {
          title: "E10单价",
          dataIndex: "PriceErp",
          scopedSlots: { customRender: "e10" },
          width: "5%",
          align: "center",
        },
        {
          title: "单价",
          dataIndex: "Price",
          scopedSlots: { customRender: "Price" },
          align: "center",
          width: "5%",
        },
        {
          title: "用量",
          dataIndex: "Yl",
          width: "3%",
          scopedSlots: { customRender: "dosage" },
          align: "center",
          customCell: this.dosageClick,
        },
        {
          title: "金额",
          dataIndex: "Amount",
          align: "center",
        },
        {
          title: "提示",
          dataIndex: "Tips",
          scopedSlots: { customRender: "Tips" },
          width: "5%",
          align: "center",
        },
        {
          title: "备注",
          dataIndex: "Remark",
          scopedSlots: { customRender: "Remark" },
          width: "5%",
          align: "center",
        },
      ],
      excelHead,
      pagination: false,
      cost: {
        materialTotal: 0, //物料成本
        ultimatelyTotal: 0, //最终成本
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      searchForm: this.$form.createForm(this),
      keywordForm: this.$form.createForm(this),
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
      isSearch: false,
      isAgainCost: false,
      isDosage: false,
      keyword: "",
      searchDosage: [],
      isTableSearch: false,
      searchList: [],
      selectedRowKeys: [],
      saveBtnText: "保存",
      exportData: [],
      tableCurrRowId: "",
      costListGroup: [],
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
    if (this.$route.query.sign == "COPY") {
      this.saveBtnText = "保存复制报价";
    }
    if (this.$route.query.sign == "ANEW") {
      this.saveBtnText = "保存重新报价";
    }
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  methods: {
    //清空用量计算
    empty() {
      this.searchDosage = [];
      this.selectedRowKeys = [];
      this.isDosage = false;
    },
    //关闭弹窗
    closeModal() {
      this.isDosage = false;
    },
    //用量统计
    toAosage() {
      this.isDosage = true;
      this.searchDosage = this.tableData.filter((product) => {
        return this.selectedRowKeys.includes(product.CodeId);
      });
    },
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
          this.tableData.forEach((item) => {
            item.CodeId = item.ChildCode + "_" + item.LastCode;
          });
          this.searchList = this.tableData;
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
          this.isAgainCost = true;
          this.isSearch = true;
        }
        this.costLoading = false;
      });
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
          this.searchForm.setFieldsValue({
            enterpriseid: this.enterList[0].EnterId,
          });
        }
      });
      getDemandEnter(parmas1).then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
          this.searchForm.setFieldsValue({
            plantid: this.plantList[0].EnterId,
          });
        }
      });
    },
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    onSelect(record, selected) {
      if (selected) {
        this.tableCurrRowId = record.CodeId;
      }
    },
    //重置数据
    reset() {
      this.costList = [];
      this.costInfo = [];
      this.tableData = [];
      this.isSearch = false;
      this.isAgainCost = false;
      this.quoteRemark = "";
      this.keyword = "";
      this.searchList = [];
      this.selectedRowKeys = [];
      this.searchDosage = [];
      this.searchData = [];
      this.cost = {
        materialTotal: 0, //物料成本
        ultimatelyTotal: 0, //最终成本
      };
      // this.searchForm.resetFields();
      this.searchForm.resetFields();
      this.getDemandEnter();
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
              this.tableData.forEach((item) => {
                item.CodeId = item.ChildCode + "_" + item.LastCode;
              });
              this.searchList = this.tableData;
              this.searchList.forEach((item) => {
                let data = item.PriceEffectiveDate.split(" ");
                item.Remark = item.SupplierName + data[0];
              });
              console.log(this.searchList);
              this.costInfo = res.data.data.ItemInfo;
              this.costList = res.data.data.CostBaseList;
              this.countCost();
            }
            this.costLoading = false;
            this.isSearch = true;
          });
        } else {
          this.costLoading = false;
        }
      });
    },
    costNumber() {
      let total = 0;
      this.costList.map((item) => {
        let sum = 0;
        item.list.map((items) => {
          if (items.Amount) {
            total += items.Amount;
            sum += items.Amount;
          } else {
            items.Amount = 0;
          }
        });
        console.log("sum", sum);
        let totalSum = Number(sum);
        console.log("totalSum", totalSum);
        item.total = parseFloat(totalSum.toFixed(4));
      });
      this.costTotal = total;
      let expenses = Number(this.cost.materialTotal + this.costTotal);
      this.cost.ultimatelyTotal = parseFloat(expenses.toFixed(4));
    },
    //计算物料成本
    countCost() {
      var sum = 0;
      let total = 0;
      // this.priceNone = [];
      // console.log(this.tableData);
      // console.log(this.searchList);
      let list = this.tableData;
      // let list = Object.assign(this.tableData, this.searchList);
      list.forEach((item) => {
        sum += item.Price * item.Yl;
        //价格不全数量
      });
      // console.log(sum)
      //物聊费用
      this.cost.materialTotal = parseFloat(sum.toFixed(4));
      //只有添加才计算
      this.costList.forEach((item) => {
        //计算电源贴片费用
        if (this.costInfo.ItemOtherInfo && item.CostName === "电源贴片费") {
          if (item.Description == "") {
            item.Amount = 0;
            item.Description = `品名带有“贴片”关键字(0)行)，用量(0)*0`;
            return;
          }
          let str = item.Description.split("*");
          let price1 = this.costInfo.ItemOtherInfo.TpKeyWordRowsTotalUsing * str[1];
          item.Amount = parseFloat(price1.toFixed(4));
          item.Description = `品名带有“贴片”关键字(${this.costInfo.ItemOtherInfo.TpKeyWordRowsNum})行)，用量(${this.costInfo.ItemOtherInfo.TpKeyWordRowsTotalUsing})*${str[1]}`;
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
      //分组显示
      let dataTemp = this.arrayGroup(this.costList);
      this.costList = dataTemp;
      this.costList.map((item) => {
        let sum = 0;
        item.list.map((items) => {
          if (items.Amount) {
            sum += items.Amount;
          } else {
            // items.Amount = 0
          }
        });
        item.total = parseFloat(sum.toFixed(4));
      });
      this.costTotal = total;
      //最终费用
      let expenses = Number(this.cost.materialTotal + this.costTotal);
      this.cost.ultimatelyTotal = parseFloat(expenses.toFixed(4));
    },
    arrayGroup(arr) {
      var map = {},
        dest = [];
      for (var i = 0; i < arr.length; i++) {
        var ai = arr[i];
        if (!map[ai.CostSort]) {
          dest.push({
            CostSort: ai.CostSort,
            list: [ai],
          });
          map[ai.CostSort] = ai;
        } else {
          for (var j = 0; j < dest.length; j++) {
            var dj = dest[j];
            if (dj.CostSort == ai.CostSort) {
              dj.list.push(ai);
              break;
            }
          }
        }
      }
      return dest;
    },
    //修改单价
    priceNumber(item, index) {
      this.tableData.find((items) => {
        if (items.CodeId == item.CodeId) {
          let a = item.Price * item.Yl;
          items.Price = item.Price;
          items.Amount = parseFloat(a.toFixed(4));
          if (item.Price === null) {
            item.Price = 0;
          }
        }
      });
      if (item.Price != item.PriceErp) {
        this.searchList[index].Tips = "价格修改过";
      } else {
        if (item.Price == 0) {
          this.searchList[index].Tips = "价格不全";
        } else {
          this.searchList[index].Tips = "";
        }
      }
      let cost = [];
      this.costList.map((item) => {
        cost = cost.concat(item.list);
      });
      this.costList = cost;
      this.countCost();
    },
    //修改备注
    remarkInput(e, item) {
      const newData = [...this.searchList];
      item.Remark = e.target.value;
      this.searchList = newData;
    },
    //保存报价单
    costSave() {
      try {
        this.searchData = this.searchForm.getFieldsValue();
        if (this.costList.length == 0) {
          this.$message.warning("请先查询物料信息!");
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
        //添加备注信息
        this.tableData.forEach((item) => {
          if (!item.Remark) {
            item.Remark = "";
          }
        });
        // var obj = Object.assign(this.tableData, this.searchList);
        let cost = [];
        this.costList.map((item) => {
          cost = cost.concat(item.list);
        });
        let parmas = {
          CostBaseList: cost,
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
        addCost(parmas, "addnewquote").then((res) => {
          if (res.data.success) {
            this.$message.success("保存成功!");
            this.reset();
            this.$router.push({ path: "/purchase/list", query: { type: 2 } });
          }
          this.costLoading = false;
        });
      } catch (error) {
        this.$message.success(error);
      }
    },
    //列表搜索
    listSearch(e) {
      console.log(e);
      try {
        let keyword = e.target.value;
        this.searchList = this.tableData.filter((product) => {
          return Object.keys(product).some((key) => {
            return (
              String(product[key])
                .toLowerCase()
                .indexOf(keyword.toLowerCase()) > -1
            );
          });
        });
      } catch (error) {
        this.searchList = this.tableData;
      }
    },
    removeDosage(CodeId) {
      this.selectedRowKeys.map((item, i) => {
        if (item == CodeId) {
          this.selectedRowKeys.splice(i, 1);
        }
      });
    },
    dosageClick(record) {
      return {
        style: {
          cursor: "pointer",
        },
        on: {
          // 鼠标单击行
          click: () => {
            if (this.selectedRowKeys.indexOf(record.CodeId) > -1) {
              // console.log("deleting...");
              this.selectedRowKeys.splice(this.selectedRowKeys.indexOf(record.CodeId), 1);
            } else {
              this.selectedRowKeys.push(record.CodeId);
            }
            this.rowClassName(record);
          },
        },
      };
    },
    rowClassName(record) {
      //选择行后设置颜色
      //return 'white'
      return this.selectedRowKeys.includes(record.CodeId) ? "blue" : "white";
      // return this.selectedRowKeys.includes(record.ChildCode) ? "litigationInfoListredRow" : ""
    },
    calField(tree) {
      tree.forEach((node) => {
        if (node.children && node.children.length > 0) {
          // console.log(node.children)
          this.calField(node.children);
          node.Amount = node.children.reduce((sum, item) => ((sum += item.Amount), parseFloat(sum.toFixed(4))), 0);
        } else {
          let sum = node.Amount * 1;
          node.Amount = parseFloat(sum.toFixed(4));
          delete node.children;
        }
      });
      return tree;
    },
    initTree(parent_id) {
      // jsonArray 变量数据
      // 第一次以后：根据id去查询parent_id相同的（相同为子数据）
      // 第一次：查找所有parent_id为-1的数据组成第一级
      const child = this.tableData.filter((item) => item.LastCode == parent_id);
      // 第一次：循环parent_id为-1数组
      return child.map((item) => ({
        ...item,
        // 当前存在id（id与parent_id应该是必须有的）调用initTree() 查找所有parent_id为本id的数据
        // childs字段写入
        children: this.initTree(item.ChildCode),
      }));
    },
    //导出excel
    handleExcel() {
      if (this.tableData.length == 0) {
        this.$message.warning("请先查询报价信息!");
        return;
      }
      let list = this.tableData;
      this.exportData = list;
      let info = this.costInfo;
      let ConfigList = this.costList;
      // let ConfigList = this.arrayGroup(this.costList);
      let _data = [];
      let mergeTitle = [];
      for (let i = 0; i < 6; i++) {
        mergeTitle.push({
          s: { r: i, c: 1 },
          e: { r: i, c: 14 },
        });
      }
      let enterInfo = this.searchForm.getFieldsValue();
      let en = this.enterList.find((item) => item.EnterId === enterInfo.enterpriseid);
      let pl = this.plantList.find((item) => item.EnterId === enterInfo.plantid);
      _data.push(["需求公司", en.EnterName, null, null, null, null, null, null, null, null, null, null, null, null, null]);
      _data.push(["需求工厂", pl.EnterName || 0, null, null, null, null, null, null, null, null, null, null, null, null, null]);
      _data.push(["品号", info.ItemCode, null, null, null, null, null, null, null, null, null, null, null, null, null]);
      _data.push(["品名", info.ItemName, null, null, null, null, null, null, null, null, null, null, null, null, null]);
      _data.push(["大类", info.ItemSort, null, null, null, null, null, null, null, null, null, null, null, null, null]);
      _data.push([" 产品规格", info.ItemSpecification, null, null, null, null, null, null, null, null, null, null, null, null, null]);
      let cost = [];
      ConfigList.map((item) => {
        cost = cost.concat(item.list);
      });
      cost.map((item, index) => {
        let array = [item.CostSort, item.CostName, null, item.Amount || 0, null, null, null, null, null, null, null, null, null, null, null];
        _data.push(array);
        mergeTitle.push({
          s: { r: 6 + index, c: 1 },
          e: { r: 6 + index, c: 2 },
        });
        mergeTitle.push({
          s: { r: 6 + index, c: 3 },
          e: { r: 6 + index, c: 14 },
        });
      });
      ConfigList.map((item, index) => {
        let l = item.list.length - 1;
        if (index == 0) {
          mergeTitle.push({
            s: { r: 6, c: 0 },
            e: { r: 6 + l, c: 0 },
          });
        } else {
          mergeTitle.push({
            s: { r: 6 + ConfigList[index - 1].list.length, c: 0 },
            e: { r: 6 + l + ConfigList[index - 1].list.length, c: 0 },
          });
        }
      });
      _data.push(["物料成本", this.cost.materialTotal, null, null, null, null, null, null, null, null, null, null, null, null, null]);
      _data.push(["最终成本", this.cost.ultimatelyTotal, null, null, null, null, null, null, null, null, null, null, null, null, null]);
      mergeTitle.push({
        s: { r: 6 + cost.length, c: 1 },
        e: { r: 6 + cost.length, c: 14 },
      });
      mergeTitle.push({
        s: { r: 7 + cost.length, c: 1 },
        e: { r: 7 + cost.length, c: 14 },
      });
      const columns = [];
      this.excelHead.map((item) => {
        columns.push(item.title);
      });
      columns.splice(8, 0, "价格来源");
      _data.push(columns);
      let _data1 = [..._data];
      list.map((item) => {
        let array = [];
        Object.keys(item).forEach((key) => {
          array.push(item[key]);
        });
        _data.push(array);
      });
      let tree = this.initTree(info.ItemCode);
      let treeData = this.calField(tree);
      console.log(treeData);
      treeData.map((item) => {
        let array1 = [];
        if (item.LvNo == 2) {
          Object.keys(item).forEach((key) => {
            if (key !== "children") {
              array1.push(item[key]);
            }
          });
          _data1.push(array1);
        }
      });
      let excelArray = [];
      let contentList = [];
      let merges2 = []; // 设置表格内容单元格合并
      let aoa = [..._data, ...contentList]; // 导出的数据
      let aoa1 = [..._data1, ...contentList]; // 导出的数据
      let merges = [...mergeTitle, ...merges2]; // 合并单元格
      // 样式修改
      const sheetCols = [
        { wch: 10 }, // 序号
        { wch: 5 }, // 阶次
        { wch: 8 }, // 类型
        { wch: 10 }, // 上阶BOM号
        { wch: 10 }, // 品号
        { wch: 18 }, // 料名
        { wch: 20 }, //  产品规格
        { wch: 6 }, // 单位
        { wch: 8 }, // 价格来源
        { wch: 7 }, // E10单价
        { wch: 7 }, // 单价
        { wch: 7 }, // 用量
        { wch: 6 }, // 金额
        { wch: 10 }, // 提示
        { wch: 10 }, // 备注
      ];
      let formStyle = {};
      excelArray.push({
        Sheet: `展开显示`, // 下方tab切换名称
        data: aoa, // 表格数据
        merges, //  合并单元格
        autoWidth: false, // 自适应宽度
        formStyle: formStyle, // 特殊行或列样式
        sheetCols,
      });
      excelArray.push({
        Sheet: `收缩显示`, // 下方tab切换名称
        data: aoa1, // 表格数据
        merges, //  合并单元格
        autoWidth: false, // 自适应宽度
        formStyle: formStyle, // 特殊行或列样式
        sheetCols,
      });
      try {
        var temp = info.ItemName.replace(/['//<>%;.)(&+]/g, " ").replace(/(^\s)|(\s$)/g, "");
        exportjsontoexcelMore({
          dataList: excelArray,
          bookType: "xlsx", // 导出类型
          filename: `${info.ItemCode}_${temp}`, // 导出标题名
        });
        this.$message.success("导出数据成功!");
      } catch (error) {
        this.$message.error("导出数据失败");
      }
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.ant-table-tbody > tr.ant-table-row-selected td {
  background: none;
  color: inherit;
}
.input-item {
  display: flex;
  align-items: center;
  .input-lable {
    width: 120px;
    text-align: right;
    font-size: 15px;
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
  justify-content: space-between;
}
.table-search {
  display: flex;
  justify-content: space-between;
}
.input-text-color {
  color: #f51f1f;
  font-weight: 700;
}
/deep/ .ant-card {
  margin: 5px 0px;
}
.cost-list {
  display: flex;
  align-items: center;
  border: 1px #e6e2e2 solid;
  margin-bottom: 5px;
}
.input-title {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
}
/deep/ p {
  margin-bottom: 3px;
  padding: 0;
}
/deep/ .ant-card-head-title {
  padding: 5px 0;
}
/deep/.ant-table-tbody .white {
  background-color: #fff !important;
  height: 40px !important;
  border: none !important;
  padding: 0 !important;
}
/deep/.ant-table-tbody .blue {
  background: #cce8cf;
  // opacity: 1;
  // color:#cce8cf;
  height: 40px !important;
  border: none !important;
  padding: 0 !important;
}
/deep/.raemark-input input {
  font-size: 10px;
}
/deep/.ant-table {
  min-height: 77vh;
  max-height: 77vh;
  overflow: auto;
}
/deep/ .ant-input[disabled],
.ant-select-disabled,
.ant-input-number-disabled {
  color: rgba(0, 0, 0, 0.5);
}
</style>
