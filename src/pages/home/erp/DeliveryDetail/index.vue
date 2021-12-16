<!--
 * @Author: max
 * @Date: 2021-12-15 17:30:45
 * @LastEditTime: 2021-12-16 13:40:17
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/erp/DeliveryDetail/index.vue
-->
<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-row>
      <a-col :md="24" :sm="24">
        <span>
          <a-button v-if="hasPerm('export')" icon="export" type="primary" :disabled="!hasSelected" :loading="loading" @click="handleExcel" style="margin-left: 8px">导出Excel</a-button>
          <a-button v-else icon="export" type="primary" disabled :loading="loading" @click="handleExcel" style="margin-left: 8px">导出Excel</a-button>
          <a-button style="margin-left: 8px" @click="reset">重置</a-button>
          <span style="margin-left: 8px">
            <template v-if="hasSelected">
              {{ `共选中 ${selectedRowKeys.length} 条` }}
            </template>
          </span>
        </span>
      </a-col>
    </a-row>
    <a-table
      v-if="hasPerm('search')"
      :columns="columns"
      :data-source="data"
      size="small"
      :scroll="{ y: scrollY, x: 2000 }"
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
      :rowKey="(data) => data.Id"
      bordered
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
      :components="components"
    >
      <template slot="index" slot-scope="text, record, index">
        <div>
          <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
        </div>
      </template>
      <template slot="action" slot-scope="text, record">
        <div>
          <a style="margin-right: 8px" @click="detail(record)">
            <a-icon type="profile" />
            查看
          </a>
        </div>
      </template>
      <template slot="SUPPLIER_NAME_INPUT">
        <span>
          <p>供应商简称</p>
          <div style="display:flex;">
            <a-input placeholder="供应商简称" size="small" style="font-size: 10px;" allowClear v-model="searchValue.suppliername" />
            <a-dropdown>
              <a-button style="margin-left:5px" shape="circle" icon="unordered-list" size="small" @click="(e) => e.preventDefault()" />
              <a-menu slot="overlay">
                <a-menu-item v-for="(item, index) in filtrate" :key="index" @click="itemFiltrete('suppliername', item)">
                  <a href="javascript:;" :class="suppliernamesign == item ? 'menuBg' : ''">{{ item }}</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </span>
      </template>
      <template slot="TRANSACTION_DATE_FILTERS">
        <span>
          <p>交货日期</p>
          <div style="display:flex;">
            <a-date-picker size="small" v-model="searchValue.transactiondate" />
            <a-dropdown>
              <a-button style="margin-left:5px" shape="circle" icon="unordered-list" size="small" @click="(e) => e.preventDefault()" />
              <a-menu slot="overlay">
                <a-menu-item v-for="(item, index) in ['不过滤', '等于', '不等于', '小于', '小于或等于', '大于', '大于或等于']" :key="index" @click="itemFiltrete('transactiondate', item)">
                  <a href="javascript:;" :class="transactiondatesign == item ? 'menuBg' : ''">{{ item }}</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </span>
      </template>
      <template slot="PO_RECEIVE_TYPE_SELECT">
        <span>
          <p>进退货别</p>
          <div style="display:flex;">
            <a-select v-model="searchValue.poreceivetype" defaultValue="1" size="small" @change="search" placeholder="请选择需求工厂">
              <a-select-option value="1">All</a-select-option>
              <a-select-option value="2">进货</a-select-option>
              <a-select-option value="3">退货</a-select-option>
            </a-select>
          </div>
        </span>
      </template>
      <template slot="PLANT_NAME_P_SELECT">
        <span>
          <p>工厂/储运</p>
          <div style="display:flex;">
            <a-select v-model="searchValue.plantId" size="small" placeholder="请选择需求工厂">
              <a-select-option v-for="item in plantList" :key="item.PlantId" :value="item.PlantId">{{ item.PlantName }}</a-select-option>
            </a-select>
          </div>
        </span>
      </template>
      <template slot="DOC_NO_PO_FILTERS">
        <span>
          <p>采购订单号</p>
          <div style="display:flex;">
            <a-input placeholder="采购订单号" size="small" style="font-size: 10px;" allowClear v-model="searchValue.docnopo" />
            <a-dropdown>
              <a-button style="margin-left:5px" shape="circle" icon="unordered-list" size="small" @click="(e) => e.preventDefault()" />
              <a-menu slot="overlay">
                <a-menu-item v-for="(item, index) in filtrate" :key="index" @click="itemFiltrete('docnopo', item)">
                  <a href="javascript:;" :class="docnoposign == item ? 'menuBg' : ''">{{ item }}</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </span>
      </template>
      <template slot="DOC_NO_A_FILTERS">
        <span>
          <p>到货/退货单号</p>
          <div style="display:flex;">
            <a-input placeholder="到货/退货单号" size="small" style="font-size: 10px;" allowClear v-model="searchValue.docnoa" />
            <a-dropdown>
              <a-button style="margin-left:5px" shape="circle" icon="unordered-list" size="small" @click="(e) => e.preventDefault()" />
              <a-menu slot="overlay">
                <a-menu-item v-for="(item, index) in filtrate" :key="index" @click="itemFiltrete('docnoa', item)">
                  <a href="javascript:;" :class="docnoasign == item ? 'menuBg' : ''">{{ item }}</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </span>
      </template>
      <template slot="DOC_NO_R_FILTERS">
        <span>
          <p>出入库单号</p>
          <div style="display:flex;">
            <a-input placeholder="出入库单号" size="small" style="font-size: 10px;" allowClear v-model="searchValue.docnor" />
            <a-dropdown>
              <a-button style="margin-left:5px" shape="circle" icon="unordered-list" size="small" @click="(e) => e.preventDefault()" />
              <a-menu slot="overlay">
                <a-menu-item v-for="(item, index) in filtrate" :key="index" @click="itemFiltrete('docnor', item)">
                  <a href="javascript:;" :class="docnorsign == item ? 'menuBg' : ''">{{ item }}</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </span>
      </template>
      <template slot="ITEM_CODE_INPUT">
        <span>
          <p>品号</p>
          <div style="display:flex;">
            <a-input placeholder="品号" size="small" style="font-size: 10px;" allowClear v-model="searchValue.itemcode" />
            <a-dropdown>
              <a-button style="margin-left:5px" shape="circle" icon="unordered-list" size="small" @click="(e) => e.preventDefault()" />
              <a-menu slot="overlay">
                <a-menu-item v-for="(item, index) in filtrate" :key="index" @click="itemFiltrete('itemcode', item)">
                  <a href="javascript:;" :class="itemcodesign == item ? 'menuBg' : ''">{{ item }}</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </span>
      </template>
      <template slot="ITEM_NAME_INPUT">
        <span>
          <p>品名</p>
          <div style="display:flex;">
            <a-input placeholder="品名" size="small" style="font-size: 10px;" allowClear v-model="searchValue.itemdescription" />
            <a-dropdown>
              <a-button style="margin-left:5px" shape="circle" icon="unordered-list" size="small" @click="(e) => e.preventDefault()" />
              <a-menu slot="overlay">
                <a-menu-item v-for="(item, index) in filtrate" :key="index" @click="itemFiltrete('itemdescription', item)">
                  <a href="javascript:;" :class="itemdescriptionsign == item ? 'menuBg' : ''">{{ item }}</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </span>
      </template>
      <template slot="ITEM_SPECIFICATION_INPUT">
        <span>
          <p>规格</p>
          <div style="display:flex;">
            <a-input placeholder="规格" size="small" style="font-size: 10px;" allowClear v-model="searchValue.itemspecification" />
            <a-dropdown>
              <a-button style="margin-left:5px" shape="circle" icon="unordered-list" size="small" @click="(e) => e.preventDefault()" />
              <a-menu slot="overlay">
                <a-menu-item v-for="(item, index) in filtrate" :key="index" @click="itemFiltrete('itemspecification', item)">
                  <a href="javascript:;" :class="itemspecificationsign == item ? 'menuBg' : ''">{{ item }}</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </span>
      </template>
    </a-table>
    <a-empty v-else description="暂无权限" />
    <model-info v-if="isModelInfo" :modelData="mitemcodeData" @closeModal="closeModal"></model-info>
  </a-card>
</template>
<script>
import getTableScroll from "@/utils/setTableHeight";
import { getERPReportAction } from "@/services/erp.js";
import { splitData, modelType } from "@/utils/util.js";
import ModelInfo from "../components/ModelInfo.vue";
import { columns, columnsHeard } from "./data";
import { PublicVar } from "@/mixins/publicVar.js";
import { resizeableTitle } from "@/utils/resizeableTitle.js";
import { exportjsontoexcelMore } from "@/utils/ExportExcel";
export default {
  components: { ModelInfo },
  mixins: [PublicVar],
  data() {
    this.components = {
      header: {
        cell: (h, props, children) => resizeableTitle(h, props, children, this.columns),
      },
    };
    return {
      data: [],
      columns,
      isModelInfo: false,
      selectedRows: [],
      isExecl: false,
      isDetail: false,
      detailData: [],
      plantList: [],
      mitemcodeData: [],
      itemcodesign: "",
      itemdescriptionsign: "",
      itemspecificationsign: "",
      suppliernamesign: "",
      transactiondatesign: "",
      docnoposign: "",
      docnoasign: "",
      docnorsign: "",
      searchValue: {
        plantId: "",
        itemcode: "",
        itemdescription: "",
        itemspecification: "",
        poreceivetype: "1",
        suppliername: "",
        transactiondate: "",
        docnopo: "",
        docnoa: "",
        docnor: "",
      },
    };
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  created() {
    this.$nextTick(() => {
      this.scrollY = getTableScroll(70);
    });
    this.getPlant();
  },
  methods: {
    splitData,
    modelType,
    closeModal() {
      this.isModelInfo = false;
    },
    itemFiltrete(type, text) {
      switch (type) {
        case "itemcode":
          this.itemcodesign = text;
          break;
        case "itemdescription":
          this.itemdescriptionsign = text;
          break;
        case "itemspecification":
          this.itemspecificationsign = text;
          break;
        case "suppliername":
          this.suppliernamesign = text;
          break;
        case "transactiondate":
          this.transactiondatesign = text;
          break;
        case "docnopo":
          this.docnoposign = text;
          break;
        case "docnoa":
          this.docnoasign = text;
          break;
        case "docnor":
          this.docnorsign = text;
          break;
      }
      this.search();
    },
    //物料需求详情
    detail(record) {
      this.isModelInfo = true;
      this.mitemcodeData.ITEM_CODE = record.ITEM_CODE;
      this.mitemcodeData.plantid = this.searchValue.plantId;
    },
    //工厂获取
    getPlant() {
      let parmas = {
        entertypecode: "PLANT",
      };
      getERPReportAction(parmas, "getenterlist").then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
          this.searchValue.plantId = this.plantList[0].PlantId;
          // this.searchForm.setFieldsValue({
          //   plantid: this.plantList[0].PlantId,
          // });
        }
      });
    },
    //重置搜索
    reset() {
      this.data = [];
      this.week = "";
      this.searchForm.resetFields();
      this.getPlant();
      this.itemcodesign = "";
      this.itemdescriptionsign = "";
      this.itemspecificationsign = "";
      this.suppliernamesign = "";
      this.transactiondatesign = "";
      this.docnoposign = "";
      this.docnoasign = "";
      this.docnor = "";
      this.searchValue = {
        itemcode: "",
        itemdescription: "",
        itemspecification: "",
        poreceivetype: "1",
        suppliername: "",
        transactiondate: "",
        docnopo: "",
        docnoa: "",
        docnor: "",
      };
    },
    //关键词搜索
    search() {
      console.log(this.searchValue);
      if (this.searchValue.plantId == undefined) {
        this.$message.warning("请选择工厂");
        return;
      }
      if (this.searchValue.transactiondate) {
        var transactiondate = this.searchValue.transactiondate.format("YYYY-MM-DD");
      }
      this.loading = true;
      this.data = [];
      this.pagination.total = 0;
      console.log(this.searchValue);
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        plantid: this.searchValue.plantId,
        poreceivetype: this.searchValue.poreceivetype,
        suppliername: this.searchValue.suppliername.trim(),
        transactiondate: transactiondate || "",
        docnopo: this.searchValue.docnopo.trim(),
        docnoa: this.searchValue.docnoa.trim(),
        docnor: this.searchValue.docnor.trim(),
        itemcode: this.searchValue.itemcode.trim(),
        itemdescription: this.searchValue.itemdescription.trim(),
        itemspecification: this.searchValue.itemspecification.trim(),
        itemcodesign: this.itemcodesign,
        itemspecificationsign: this.itemspecificationsign,
        itemdescriptionsign: this.itemdescriptionsign,
        suppliernamesign: this.suppliernamesign,
        transactiondatesign: this.transactiondatesign,
        docnoposign: this.docnoposign,
        docnoasign: this.docnoasign,
        docnorsign: this.docnorsign,
      };
      getERPReportAction(parmas, "suppliersupplydetails").then((res) => {
        if (res.data.success) {
          let list = res.data.data.list;
          list.map((item, index) => {
            item.Id = item.DOC_NO_A + "_" + index;
          });
          this.data = list;
          console.log(this.data);
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination = pagination;
          this.isSearch = true;
        }
        this.loading = false;
      });
    },
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //分页
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      if (this.isSearch) {
        this.search();
        return;
      }
    },
    handleExcel() {
      let _data = [];
      let excelArray = [];
      let mergeTitle = [];
      const hear = ["工厂/储运编号", "工厂/储运名称", "供应商编号", "供应商简称", "交易日期", "采购订单单号", "进退货别", "到货/退货单号", "出/入库单号", "品号", "品名", "规格", "采购员姓名", "部门名称", "计价单位", "计价数量", "采购类型", "仓库编号", "仓库名称", "发票种类", "交易币种", "汇率", "商品类型", "税种", "税率", "结算状态", "已结算数量", "采购域编号", "采购域名称"];
      _data.push(hear);
      this.data.forEach((item) => {
        let array = [];
        if (this.selectedRowKeys.includes(item.Id)) {
          columnsHeard.map((items) => {
            if (items.dataIndex == "PO_RECEIVE_TYPE") {
              array.push(item[items.dataIndex] == 1 ? "进货" : "退货");
            } else if (items.dataIndex == "SETTLEMENT_CLOSE") {
              array.push(item[items.dataIndex] == 0 ? "0.不需结算" : item[items.dataIndex] == 1 ? "1.结算未完成" : "2.结算已完成");
            } else {
              array.push(item[items.dataIndex]);
            }
          });
        }
        _data.push(array);
      });
      console.log(_data);
      const sheetCols = [];
      let contentList = [];
      let merges2 = []; // 设置表格内容单元格合并
      let aoa = [..._data, ...contentList]; // 导出的数据
      let merges = [...mergeTitle, ...merges2]; // 合并单元格
      let formStyle = {};
      excelArray.push({
        Sheet: `供应商供货明细表`, // 下方tab切换名称
        data: aoa, // 表格数据
        merges, //  合并单元格
        autoWidth: false, // 自适应宽度
        formStyle: formStyle, // 特殊行或列样式
        sheetCols,
      });
      let excelStyle = {
        border: "none",
        font: {
          name: "宋体",
          sz: 9,
        },
        alignment: {
          horizontal: "left",
          vertical: "left",
        },
      };
      try {
        exportjsontoexcelMore(
          {
            dataList: excelArray,
            bookType: "xlsx", // 导出类型
            filename: `供应商供货明细表`, // 导出标题名
          },
          excelStyle
        );
        this.$message.success("导出数据成功!");
        this.percent = 100;
        this.progressUp = "下载已完成";
        this.processVisible = false;
        this.pagination.current = 1;
      } catch (error) {
        this.$message.error("导出数据失败");
      }
      this.isExportLod = false;
    },
  },
};
</script>
<style lang="less" scoped>
.ant-form-item {
  margin-bottom: 5px;
}
/deep/.color2 {
  color: red;
}
/deep/.color1 {
  color: #0000ff;
}
.menuBg {
  background: #13c2c2;
  color: #fff;
}
/deep/.ant-table {
  font-size: 10px;
}
/deep/.ant-table-row-cell-break-word {
  white-space: nowrap;
  overflow: hidden;
}
</style>
