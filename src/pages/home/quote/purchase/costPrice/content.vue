<!--
 * @Author: max
 * @Date: 2022-02-23 14:54:15
 * @LastEditTime: 2022-03-01 10:29:45
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/quote/purchase/costPrice/content.vue
-->
<template>
  <div>
    <a-spin tip="loading..." :spinning="costLoading">
      <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
        <a-back-top :visibilityHeight="300" />
        <!-- 搜索 -->
        <div class="save-btn">
          <span>
            <a-button :disabled="!hasPerm('search')" type="primary" @click="search" icon="search">查询</a-button>
            <a-button :disabled="!hasPerm('search')" style="margin-left: 10px" icon="reload" @click="reset">重置</a-button>
            <a-button v-if="hasPerm('export')" :disabled="!isSearch" type="primary" style="margin-left: 10px" icon="export" @click="handleExcel">导出</a-button>
            <a-button v-else disabled type="primary" style="margin-left: 10px" icon="export" @click="handleExcel">导出</a-button>
          </span>
        </div>
        <div :class="advanced ? 'search' : null">
          <a-form layout="horizontal" :form="searchForm">
            <div :class="advanced ? null : 'fold'">
              <a-row>
                <a-col :lg="8" :md="12" :sm="24">
                  <a-form-item v-if="pageType == 1" label="品号" :labelCol="{ span: 4 }" :wrapperCol="{ span: 14, offset: 1 }">
                    <a-input
                      placeholder="请输入产品品号号"
                      :disabled="isSearch"
                      allowClear
                      v-decorator="[
                        'itemcode',
                        {
                          rules: [{ required: true, message: '请输入产品品号' }],
                        },
                      ]"
                    />
                  </a-form-item>
                  <a-form-item v-else label="半成品品号" :labelCol="{ span: 4 }" :wrapperCol="{ span: 14, offset: 1 }">
                    <a-input
                      placeholder="请输入半成品品号"
                      :disabled="isSearch"
                      allowClear
                      v-decorator="[
                        'itemcode',
                        {
                          rules: [{ required: true, message: '请输入半成品品号' }],
                        },
                      ]"
                    />
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
                <a-col :lg="8" :md="12" :sm="24" v-if="pageType == 1">
                  <a-form-item label="查询类型" :labelCol="{ span: 4 }" :wrapperCol="{ span: 14, offset: 1 }">
                    <a-select
                      default-value="ALL"
                      v-decorator="[
                        'querytype',
                        {
                          rules: [{ required: true, message: '请选择查询类型' }],
                        },
                      ]"
                    >
                      <a-select-option value="ALL">
                        全部展阶
                      </a-select-option>
                      <a-select-option value="TAIL">
                        仅显示尾阶(原外挂系统取数逻辑)
                      </a-select-option>
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
      <!-- //物料 -->
      <a-card class="card" title="物料" :bordered="false" :bodyStyle="{ padding: '5px' }" :headStyle="{ padding: '5px 24px', minHeight: '30px' }">
        <div class="table-search">
          <p v-if="costInfo.MaterialCost" style="color:red">当前Bom成本:{{ costInfo.MaterialCost || 0 }} ({{ costInfo.ItemOtherInfo.PriceIncompleteMsg }})</p>
          <p v-else></p>
          <a-form layout="inline" :form="keywordForm">
            <a-form-item label="(品号,品名, 产品规格,提示)关键字匹配">
              <a-input v-model="keyword" allowClear @change="listSearch" />
            </a-form-item>
          </a-form>
        </div>
        <a-table :pagination="pagination" size="small" :columns="columns" :data-source="searchList" :rowKey="(searchList) => searchList.CodeId">
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
        </a-table>
      </a-card>
    </a-spin>
  </div>
</template>
<script>
import { getDemandEnter, getCostConfig } from "@/services/web.js";
import { exportjsontoexcelMore } from "@/utils/ExportExcel";
export default {
  props: ["pageType"],
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
          title: "上阶品号",
          dataIndex: "LastCode",
          align: "center",
          width: "10%",
        },
        {
          title: "品号",
          dataIndex: "ChildCode",
          align: "center",
          width: "10%",
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
          width: "25%",
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
          width: "8%",
          align: "center",
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
      ],
      pagination: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      searchForm: this.$form.createForm(this),
      keywordForm: this.$form.createForm(this),
      plantList: [],
      loading: false,
      costInfo: [],
      costLoading: false,
      top: 10,
      searchData: [],
      quoteRemark: "",
      keyword: "",
      searchList: [],
      isSearch: false,
    };
  },
  created() {
    this.getDemandEnter();
  },
  methods: {
    //清空用量计算
    empty() {
      this.searchDosage = [];
      this.isDosage = false;
    },
    //获取需求公司
    getDemandEnter() {
      let parmas1 = {
        entertypecode: "PLANT",
      };
      getDemandEnter(parmas1).then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
          this.searchForm.setFieldsValue({
            plantid: this.plantList[0].EnterId,
          });
        }
      });
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
      this.keyword = "";
      this.searchList = [];
      this.searchData = [];
      this.isSearch = false;
      this.searchForm.resetFields();
      this.getDemandEnter();
    },
    //关键词搜索
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.costLoading = true;
          this.searchData = values;
          let parmas = {
            querysign: this.pageType == 1 ? "ALL" : "SFG",
            itemcode: values.itemcode,
            plantid: values.plantid,
            querytype: this.pageType == 1 ? values.querytype : "",
          };
          getCostConfig(parmas, "getbommaterialprice").then((res) => {
            if (res.data.success) {
              this.tableData = res.data.data.ItemInfo.ItemChildList;
              this.costInfo = res.data.data.ItemInfo;
              this.tableData.forEach((item) => {
                item.CodeId = item.ChildCode + "_" + item.LastCode + "_" + item.IndexNo;
              });
              this.searchList = this.tableData;
            }
            this.costLoading = false;
            this.isSearch = true;
          });
        } else {
          this.costLoading = false;
        }
      });
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
    handleExcel() {
      if (this.tableData.length == 0) {
        this.$message.warning("请先查询bom信息!");
        return;
      }
      let list = this.tableData;
      this.exportData = list;
      let info = this.costInfo;
      let _data = [];
      let mergeTitle = [];
      for (let i = 0; i < 5; i++) {
        mergeTitle.push({
          s: { r: i, c: 1 },
          e: { r: i, c: 12 },
        });
      }
      let enterInfo = this.searchForm.getFieldsValue();
      let pl = this.plantList.find((item) => item.EnterId === enterInfo.plantid);
      _data.push(["需求工厂", pl.EnterName || 0, null, null, null, null, null, null, null, null, null, null]);
      _data.push(["品号", info.ItemCode, null, null, null, null, null, null, null, null, null, null]);
      _data.push(["品名", info.ItemName, null, null, null, null, null, null, null, null, null, null]);
      _data.push([" 产品规格", info.ItemSpecification, null, null, null, null, null, null, null, null, null, null]);
      _data.push(["最终成本", info.MaterialCost, null, null, null, null, null, null, null, null, null, null]);
      const columns = [];
      this.columns.map((item) => {
        columns.push(item.title);
      });
      _data.push(columns);
      list.map((item) => {
        let array = [];
        this.columns.map((items) => {
          array.push(item[items.dataIndex]);
        });
        _data.push(array);
      });
      let excelArray = [];
      let contentList = [];
      let merges2 = []; // 设置表格内容单元格合并
      let aoa = [..._data, ...contentList]; // 导出的数据
      let merges = [...mergeTitle, ...merges2]; // 合并单元格
      // 样式修改
      const sheetCols = [
        { wch: 8 }, // 序号
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
        Sheet: `${info.ItemCode}`, // 下方tab切换名称
        data: aoa, // 表格数据
        merges, //  合并单元格
        autoWidth: false, // 自适应宽度
        formStyle: formStyle, // 特殊行或列样式
        sheetCols,
      });
      try {
        console.log(excelArray);
        // var temp = info.ItemName.replace(/['//<>%;.)(&+]/g, " ").replace(/(^\s)|(\s$)/g, "");
        exportjsontoexcelMore({
          dataList: excelArray,
          bookType: "xlsx", // 导出类型
          filename: `${info.ItemCode}`, // 导出标题名
        });
        this.$message.success("导出数据成功!");
      } catch (error) {
        console.log(error);
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
