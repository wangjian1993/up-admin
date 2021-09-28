<!--
 * @Author: max
 * @Date: 2021-08-17 10:58:13
 * @LastEditTime: 2021-09-28 14:02:36
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
            <a-button :disabled="!hasPerm('save')" type="primary" icon="save" @click="costSave">{{ saveBtnText }}</a-button>
            <a-button :disabled="!hasPerm('export')" style="margin-left: 8px" type="primary" icon="import" @click="handleExcel">导出</a-button>
          </span>
        </div>
        <div :class="advanced ? 'search' : null">
          <a-form layout="horizontal" :form="searchForm">
            <div :class="advanced ? null : 'fold'">
              <a-row>
                <a-col :lg="6" :md="12" :sm="24">
                  <a-form-item label="产品品号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 14, offset: 1 }">
                    <a-input
                      placeholder="请输入产品品号"
                      :disabled="isSearch"
                      v-decorator="[
                        'itemcode',
                        {
                          rules: [{ required: true, message: '请输入产品品号' }],
                        },
                      ]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :lg="6" :md="12" :sm="24">
                  <a-form-item label="需求公司" :labelCol="{ span: 5 }" :wrapperCol="{ span: 14, offset: 1 }">
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
                <a-col :lg="6" :md="12" :sm="24">
                  <a-form-item label="生产工厂" :labelCol="{ span: 5 }" :wrapperCol="{ span: 14, offset: 1 }">
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
                <a-col :lg="6" :md="12" :sm="24" v-if="!isAgainCost">
                  <span style="float: left; margin-top: 5px;">
                    <a-button :disabled="!hasPerm('search')" type="primary" @click="search">查询</a-button>
                    <a-button :disabled="!hasPerm('search')" style="margin-left: 8px" @click="reset">重置</a-button>
                  </span>
                </a-col>
              </a-row>
              <a-row>
                <a-col :lg="6" :md="12" :sm="24">
                  <a-form-item label="产品品名" :labelCol="{ span: 5 }" :wrapperCol="{ span: 14, offset: 1 }">
                    <a-input :disabled="isSearch" v-model="costInfo.ItemName" />
                  </a-form-item>
                </a-col>
                <a-col :lg="6" :md="12" :sm="24">
                  <a-form-item label="产品大类" :labelCol="{ span: 5 }" :wrapperCol="{ span: 14, offset: 1 }">
                    <a-input :disabled="isSearch" v-model="costInfo.ItemSort" />
                  </a-form-item>
                </a-col>
                <a-col :lg="6" :md="12" :sm="24">
                  <a-form-item label="产品规格" :labelCol="{ span: 5 }" :wrapperCol="{ span: 14, offset: 1 }">
                    <a-textarea :disabled="isSearch" v-model="costInfo.ItemSpecification" :rows="2" />
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
            <a-card bordered :title="`${item.CostSort}(${item.total})`" v-for="(item, index) in costList" :key="index + 'cost'">
              <a-col :md="24" :lg="24" :xl="12" v-for="(items, indexs) in item.list" :key="indexs">
                <div class="input-item">
                  <p class="input-lable" :class="items.IsReadonly == 'N' ? 'input-lable-color2' : 'input-lable-color1'">{{ items.CostName }}:</p>
                  <p class="input-number">
                    <a-input-number :disabled="items.IsReadonly == 'Y'" v-model="items.Amount" :min="0" @change="costNumber(items)" />
                  </p>
                  <p class="input-text">{{ items.Description }}</p>
                </div>
              </a-col>
            </a-card>
          </a-row>
          <a-row>
            <a-card bordered title="总费用">
              <a-col :md="24" :lg="24" :xl="12">
                <div class="input-item">
                  <p class="input-lable input-text-color">物料成本:</p>
                  <p class="input-number">
                    <a-input-number disabled :min="0" v-model="cost.materialTotal" />
                  </p>
                  <p class="input-text">{{ costInfo.ItemOtherInfo.PriceIncompleteMsg }}</p>
                </div>
              </a-col>
              <a-col :md="24" :lg="24" :xl="12">
                <div class="input-item">
                  <p class="input-lable input-text-color">最终成本:</p>
                  <p class="input-number">
                    <a-input-number disabled :min="0" v-model="cost.ultimatelyTotal" />
                  </p>
                  <p class="input-text"></p>
                </div>
              </a-col>
            </a-card>
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
            <a-form-item label="(料号,料规格,提示)关键字匹配">
              <a-input v-model="keyword" allowClear @change="listSearch" />
            </a-form-item>
          </a-form>
        </div>
        <a-table
          :pagination="pagination"
          size="small"
          :columns="columns"
          :data-source="searchList"
          :rowKey="(searchList) => searchList.ChildCode"
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
          }"
        >
          <div slot="Price" slot-scope="text, record, index">
            <a-input-number :disabled="record.Property === '自制件' || record.Property === '虚设件'" :id="record.key" v-model="record.Price" :min="0" @change="priceNumber(record, index)" />
          </div>
          <div slot="Property" slot-scope="text">
            <p v-if="text != '委外加工费'">{{ text }}</p>
            <p v-else style="color:#e01111">{{ text }}</p>
          </div>
          <div slot="e10" slot-scope="text, record">
            <p>{{ record.PriceErpSource == "" ? text : text + `(${record.PriceErpSource})` }}</p>
          </div>
          <div slot="action" slot-scope="text, record, index">
            <a><a-input @change="remarkInput(record, index)" v-model="record.Remark"/></a>
          </div>
          <!-- <template slot="dosage" slot-scope="text,record">
            <p v-if="!record.dosage" @click="dosageClick(record)">{{ text}}</p>
            <p v-else style="color:#e01111" @click="dosageClick(record)">{{ text}}</p>
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
    width: "4%",
  },
  {
    title: "阶次",
    dataIndex: "LvNo",
    width: "5%",
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
    title: "上阶料号",
    dataIndex: "LastCode",
    width: "10%",
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
    title: "规格",
    dataIndex: "ChildSpecification",
    width: "20%",
    align: "center",
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
    scopedSlots: { customRender: "action" },
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
          width: "4%",
        },
        {
          title: "阶次",
          dataIndex: "LvNo",
          width: "5%",
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
          title: "上阶料号",
          dataIndex: "LastCode",
          width: "10%",
          align: "center",
        },
        {
          title: "料号",
          dataIndex: "ChildCode",
          align: "center",
        },
        {
          title: "料名",
          dataIndex: "ChildName",
          align: "center",
        },
        {
          title: "料规格",
          dataIndex: "ChildSpecification",
          align: "center",
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
        },
        {
          title: "用量",
          dataIndex: "Yl",
          width: "5%",
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
          scopedSlots: { customRender: "action" },
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
      this.searchDosage = this.searchList.filter((product) => {
        return this.selectedRowKeys.includes(product.ChildCode);
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
      this.cost = {
        materialTotal: 0, //物料成本
        ultimatelyTotal: 0, //最终成本
      };
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
              this.searchList = this.tableData;
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
          }
        });
        item.total = parseFloat(sum.toFixed(4));
      });
      this.costTotal = total;
      let expenses = this.cost.materialTotal + this.costTotal;
      this.cost.ultimatelyTotal = parseFloat(expenses.toFixed(4));
    },
    //计算物料成本
    countCost() {
      var sum = 0;
      let total = 0;
      // this.priceNone = [];
      let list = this.tableData;
      list.forEach((item) => {
        item.Remark = "";
        sum += item.Price * item.Yl;
        //价格不全数量
        // if (item.Price == 0) {
        //   this.priceNone.push(item);
        // }
      });
      //物聊费用
      this.cost.materialTotal = parseFloat(sum.toFixed(4));
      //只有添加才计算

      this.costList.forEach((item) => {
        //计算电源贴片费用
        if (this.costInfo.ItemOtherInfo && item.CostName === "电源贴片费") {
          if (item.Description == "") {
            item.Amount = 0;
            item.Description = `料名带有“贴片”关键字(0)行)，用量(0)*0`;
            return;
          }
          let str = item.Description.split("*");
          item.Amount = this.costInfo.ItemOtherInfo.TpKeyWordRowsTotalUsing * str[1];
          item.Description = `料名带有“贴片”关键字(${this.costInfo.ItemOtherInfo.TpKeyWordRowsNum})行)，用量(${this.costInfo.ItemOtherInfo.TpKeyWordRowsTotalUsing})*${str[1]}`;
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
      let dataTemp = this.arrayGroup(this.costList);
      this.costList = dataTemp;
      this.costList.map((item) => {
        let sum = 0;
        item.list.map((items) => {
          if (items.Amount) {
            sum += items.Amount;
          }
        });
        console.log(sum);
        item.total = parseFloat(sum.toFixed(4));
      });
      this.costTotal = total;
      //最终费用
      let expenses = this.cost.materialTotal + this.costTotal;
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
        if (items.ChildCode == item.ChildCode) {
          items.Amount = item.Price * item.Yl;
        }
      });
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
      this.searchData = this.searchForm.getFieldsValue();
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
      var obj = Object.assign(this.tableData, this.searchList);
      let cost = [];
      this.costList.map((item) => {
        cost = cost.concat(item.list);
      });
      console.log(cost);
      let parmas = {
        CostBaseList: cost,
        ItemChildList: obj,
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
        }
        this.costLoading = false;
      });
    },
    //列表搜索
    listSearch(e) {
      this.searchList = this.tableData.filter((product) => {
        return Object.keys(product).some((key) => {
          return (
            String(product[key])
              .toLowerCase()
              .indexOf(e.target.value) > -1
          );
        });
      });
    },
    removeDosage(index) {
      this.selectedRowKeys.splice(index, 1);
    },
    dosageClick(record) {
      return {
        style: {
          cursor: "pointer",
        },
        on: {
          // 鼠标单击行
          click: () => {
            this.selectedRowKeys.includes(record.ChildCode) ? (this.selectedRowKeys = this.selectedRowKeys.filter((n) => n !== record.ChildCode)) : this.selectedRowKeys.push(record.ChildCode);
          },
        },
      };
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
      _data.push(["规格", info.ItemSpecification, null, null, null, null, null, null, null, null, null, null, null, null, null]);
      let cost = [];
      ConfigList.map((item) => {
        cost = cost.concat(item.list);
      });
      console.log("ConfigList===", ConfigList);
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
          console.log({
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
      this.exportData.map((item) => {
        let array1 = [];
        if (item.LvNo != 2) {
          Object.keys(item).forEach((key) => {
            array1.push(item[key]);
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
        { wch: 10 }, // 上阶料号
        { wch: 10 }, // 料号
        { wch: 18 }, // 料名
        { wch: 20 }, // 规格
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
.table-search {
  display: flex;
  justify-content: space-between;
}
.input-text-color {
  color: #dd0707;
}
/deep/ .ant-card-bordered {
  border: 1px #d3d0d0 solid;
}
/deep/ .ant-card {
  margin: 5px 0px;
}
</style>
