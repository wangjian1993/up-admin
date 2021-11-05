<!--
 * @Author: max
 * @Date: 2021-10-14 11:30:23
 * @LastEditTime: 2021-11-04 18:22:28
 * @LastEditors: max
 * @Description: BOM查询
 * @FilePath: /up-admin/src/pages/home/erp/BomInventory/List.vue
-->
<template>
  <div>
    <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
      <a-form layout="horizontal" :form="searchForm">
        <div>
          <a-row>
            <a-col :md="6" :sm="24">
              <a-form-item label="需求工厂" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-select v-decorator="['plantid', { rules: [{ required: true, message: '请选择需求工厂' }] }]" style="width: 200px" placeholder="请选择需求工厂">
                  <a-select-option v-for="item in plantList" :key="item.PlantId" :value="item.PlantId">{{ item.PlantName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="主件品号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input placeholder="请输入主件品号" allowClear style="width: 200px" v-decorator="['itemcode']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="品名" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input placeholder="请输入品名" allowClear style="width: 200px" v-decorator="['itemname']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="产品规格" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input placeholder="请输入产品规格" allowClear style="width: 200px" v-decorator="['itemspecification']" />
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
        <a-button icon="export" type="primary" :disabled="!hasSelected" :loading="loading" @click="handleExcel" style="margin-left: 8px">导出Excel</a-button>
        <span style="margin-left: 8px">
          <template v-if="hasSelected">
            {{ `共选中 ${selectedRowKeys.length} 条` }}
          </template>
        </span>
      </div>
      <a-table
        id="DomPdf"
        v-if="hasPerm('search')"
        :columns="columns"
        :data-source="data"
        size="small"
        :scroll="{ y: scrollY, x: 3000 }"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        :rowKey="(data) => data.ITEM_ID"
        bordered
        :customRow="handleClickRow"
        :rowClassName="rowClassName"
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
        <template slot="action" slot-scope="text, record">
          <div>
            <a style="margin-right: 8px" @click="detail(record)">
              <a-icon type="profile" />
              查看
            </a>
          </div>
        </template>
        <template slot="ApproveStatus" slot-scope="text">
          <a-tag :color="text === 'Y' ? 'green' : text === 'N' ? '#0000ff' : 'red'">{{ text == "Y" ? "生效" : text == "N" ? "未生效" : "失效" }}</a-tag>
        </template>
        <template slot="ITEM_PROPERTY" slot-scope="text">
          <span>{{ modelType(text) }}</span>
        </template>
        <template slot="ApproveDate" slot-scope="text">
          <span>{{ splitData(text) }}</span>
        </template>
        <template slot="LastModifiedDate" slot-scope="text">
          <span>{{ splitData(text) }}</span>
        </template>
        <template slot="CreateDate" slot-scope="text">
          <span>{{ splitData(text) }}</span>
        </template>
      </a-table>
      <a-empty v-else description="暂无权限" />
      <dosage v-if="isDosage" :info="mitemcodeData" @closeModal="closeModal"></dosage>
    </a-card>
  </div>
</template>
<script>
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 50,
  },
  {
    title: "品号",
    dataIndex: "ITEM_CODE",
    scopedSlots: { customRender: "ITEM_CODE" },
    align: "center",
    width: 200,
  },
  {
    title: "快捷码",
    dataIndex: "SHORTCUT",
    scopedSlots: { customRender: "SHORTCUT" },
    align: "center",
    width: 150,
    ellipsis: true,
  },
  {
    title: "品名",
    dataIndex: "ITEM_NAME",
    scopedSlots: { customRender: "ITEM_NAME" },
    align: "center",
    width: 250,
    ellipsis: true,
  },
  {
    title: "规格",
    dataIndex: "ITEM_SPECIFICATION",
    scopedSlots: { customRender: "ITEM_SPECIFICATION" },
    align: "center",
    width: 300,
    ellipsis: true,
  },
  {
    title: "库存数量",
    dataIndex: "INVENTORY_QTY",
    scopedSlots: { customRender: "INVENTORY_QTY" },
    align: "center",
    width: 150,
    ellipsis: true,
  },
  {
    title: "工厂编号",
    dataIndex: "PLANT_CODE",
    scopedSlots: { customRender: "PLANT_CODE" },
    align: "center",
    width: 80,
  },
  {
    title: "工厂/储运",
    dataIndex: "PLANT_NAME",
    scopedSlots: { customRender: "PLANT_NAME" },
    align: "center",
    width: 80,
  },
  {
    title: "仓库代号",
    dataIndex: "WAREHOUSE_CODE",
    scopedSlots: { customRender: "WAREHOUSE_CODE" },
    align: "center",
    width: 120,
  },
  {
    title: "仓库名称",
    dataIndex: "WAREHOUSE_NAME",
    scopedSlots: { customRender: "WAREHOUSE_NAME" },
    align: "center",
    width: 100,
  },
  {
    title: "仓库单位",
    dataIndex: "UNIT_NAME",
    scopedSlots: { customRender: "UNIT_NAME" },
    align: "center",
    width: 80,
  },
  {
    title: "仓库属性",
    dataIndex: "WAREHOUSE_CHARACTER",
    scopedSlots: { customRender: "WAREHOUSE_CHARACTER" },
    align: "center",
    width: 80,
    customRender: (text) => {
      return text == 1 ? "1.普通仓" : text == 2 ? "2.VMI仓" : text == 3 ? "3.寄售客户仓" : text == 4 ? "4.客户寄库仓" : text == 5 ? "5.在途仓" : "6.客供料仓";
    },
  },
  {
    title: "仓库性质",
    dataIndex: "WAREHOUSE_PROPERTY",
    scopedSlots: { customRender: "WAREHOUSE_PROPERTY" },
    align: "center",
    width: 120,
    customRender: (text) => {
      return text == "1" ? "1.存货仓" : "2.非存货仓";
    },
  },
  {
    title: "库位管理",
    dataIndex: "BIN_CONTROL",
    scopedSlots: { customRender: "BIN_CONTROL" },
    align: "center",
    width: 80,
    customRender: (text) => {
      return text == 1 ? "1.启用" : "0.不启用";
    },
  },
  {
    title: "纳入可用量计算",
    dataIndex: "INCLUDED_AVAILABLE_QTY",
    scopedSlots: { customRender: "INCLUDED_AVAILABLE_QTY" },
    align: "center",
    width: 120,
    customRender: (text) => {
      return text ? "Y" : "N";
    },
  },
  {
    title: "库存量不足准许出库",
    dataIndex: "NEGATIVE_INVENTORY_ALLOWED",
    scopedSlots: { customRender: "NEGATIVE_INVENTORY_ALLOWED" },
    align: "center",
    width: 150,
    customRender: (text) => {
      return text ? "Y" : "N";
    },
  },
  {
    title: "首次入库日",
    dataIndex: "ORIGINIAL_RECEIPT_DATE",
    scopedSlots: { customRender: "ORIGINIAL_RECEIPT_DATE" },
    align: "center",
    width: 120,
    customRender: (text) => {
      return splitData(text);
    },
  },
  {
    title: "最后入库日",
    dataIndex: "LAST_RECEIPT_DATE",
    scopedSlots: { customRender: "LAST_RECEIPT_DATE" },
    align: "center",
    width: 100,
    customRender: (text) => {
      return splitData(text);
    },
  },
  {
    title: "最后出库日",
    dataIndex: "LAST_ISSUE_DATE",
    scopedSlots: { customRender: "LAST_ISSUE_DATE" },
    align: "center",
    width: 100,
    customRender: (text) => {
      return splitData(text);
    },
  },
  {
    title: "品号类型",
    dataIndex: "ITEM_PROPERTY",
    scopedSlots: { customRender: "ITEM_PROPERTY" },
    align: "center",
    width: 100,
  },
  {
    title: "批次控制",
    dataIndex: "LOT_CONTROL",
    scopedSlots: { customRender: "LOT_CONTROL" },
    align: "center",
    width: 150,
    customRender: (text) => {
      return text == "N" ? "N.不需求" : text == "T" ? "T.需要且检查库存量" : "Y.需要不检查库存量";
    },
  },
  {
    title: "图号",
    dataIndex: "DRAWING_NO",
    scopedSlots: { customRender: "DRAWING_NO" },
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
    fixed: "right",
    width: 100,
  },
];
const columnsPrint = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 50,
  },
  {
    title: "元件品号",
    dataIndex: "ITEM_CODE",
    scopedSlots: { customRender: "ITEM_CODE" },
    align: "center",
    width: 250,
  },
  {
    title: "品名",
    dataIndex: "ITEM_NAME",
    scopedSlots: { customRender: "ITEM_NAME" },
    align: "center",
    width: 250,
    ellipsis: true,
  },
  {
    title: "规格",
    dataIndex: "ITEM_SPECIFICATION",
    scopedSlots: { customRender: "ITEM_SPECIFICATION" },
    align: "center",
    width: 300,
    ellipsis: true,
  },
  {
    title: "单位",
    dataIndex: "UNIT_NAME",
    scopedSlots: { customRender: "UNIT_NAME" },
    align: "center",
    width: 50,
  },
  {
    title: "用量",
    dataIndex: "QTY_PER",
    scopedSlots: { customRender: "QTY_PER" },
    align: "center",
    width: 80,
  },
  {
    title: "底数",
    dataIndex: "DENOMINATOR",
    scopedSlots: { customRender: "DENOMINATOR" },
    align: "center",
    width: 50,
  },
  {
    title: "备注",
    dataIndex: "REMARK",
    scopedSlots: { customRender: "REMARK" },
    align: "center",
  },
  {
    title: "图号",
    dataIndex: "DRAWING_NO",
    scopedSlots: { customRender: "DRAWING_NO" },
    align: "center",
    width: 200,
  },

  {
    title: "位置",
    dataIndex: "COMPONENT_LOCATION",
    scopedSlots: { customRender: "COMPONENT_LOCATION" },
    align: "center",
    width: 80,
  },
];
import getTableScroll from "@/utils/setTableHeight";
import { renderStripe } from "@/utils/stripe.js";
import { getERPReportAction } from "@/services/erp.js";
import { splitData, modelType } from "@/utils/util.js";
import Dosage from './Dosage.vue'
import ExportExcel from "@/utils/ExportExcelJS";
export default {
  components: { Dosage },
  data() {
    return {
      data: [],
      columns,
      columnsPrint,
      loading: false,
      isDosage: false,
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
      selectedRows: [],
      isExecl: false,
      selectedRowKeys: [],
      scrollY: "",
      searchForm: this.$form.createForm(this),
      week: "",
      isSearch: false,
      isDetail: false,
      detailData: [],
      plantList: [],
      mitemcodeData: [],
      excelData: [],
      printData: [],
      printList: [],
    };
  },
  updated() {
    renderStripe();
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
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    closeModal() {
      this.isDosage = false;
    },
    //物料需求详情
    detail(item) {
      if (item.INVENTORY_QTY < 1) {
        this.$message.warning(`品号:[${item.ITEM_CODE}],当前暂无库存`, 5);
        return;
      }
      this.isDosage = true;
      this.mitemcodeData = item;
    },
    getPlant() {
      let parmas = {
        entertypecode: "PLANT",
      };
      getERPReportAction(parmas, "getenterlist").then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
          this.plantId = this.plantList[0].PlantId;
          this.searchForm.setFieldsValue({
            plantid: this.plantList[0].PlantId,
          });
          // this.getListAll();
        }
      });
    },
    //获取列表数据
    getListAll() {
      this.loading = true;
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        plantid: this.plantId,
        itemcode: "",
        itemname: "",
        itemspecification: "",
      };
      getERPReportAction(parmas, "getbomlist").then((res) => {
        if (res.data.success) {
          this.data = res.data.data.list;
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination = pagination;
          this.loading = false;
          this.isSearch = false;
        } else {
          this.loading = false;
        }
      });
    },
    //重置搜索
    reset() {
      // this.getListAll();
      this.data = [];
      this.week = "";
      this.searchForm.resetFields();
      this.getPlant();
    },
    //关键词搜索
    search() {
      this.loading = true;
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          // console.log("Received values of form: ", values.week);
          if (values.itemcode == undefined && values.itemname == undefined && values.itemspecification == undefined) {
            this.$message.warning("请输入查询条件:品号,品名.规格");
            this.loading = false;
            return;
          }
          this.data = [];
          this.pagination.total = 0;
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            plantid: values.plantid,
            itemcode: values.itemcode || "",
            itemname: values.itemname || "",
            itemspecification: values.itemspecification || "",
          };
          getERPReportAction(parmas, "getwarehousestockinfo").then((res) => {
            if (res.data.success) {
              this.data = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.recordsTotal;
              this.pagination = pagination;
              this.isSearch = true;
            }
            this.loading = false;
          });
          // do something
        }
      });
    },
    handleClickRow(record) {
      return {
        style: {
          // 行背景色
          cursor: "pointer",
        },
        on: {
          dblclick: () => {
            if (record.INVENTORY_QTY < 1) {
              this.$message.warning(`品号:[${record.ITEM_CODE}],当前暂无库存`, 5);
              return;
            }
            this.isDosage = true;
            this.mitemcodeData = record;
          },
        },
      };
    },
    //分页
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      if (this.isSearch) {
        this.search();
        return;
      }
      this.getListAll();
    },
    rowClassName(record) {
      return record.ApproveStatus == "V" ? "color2" : record.ApproveStatus == "N" ? "color1" : "";
    },
    getExcelData() {
      return new Promise((resolve) => {
        //   /* 你的逻辑代码 */
        let excelData = [];
        let list = JSON.parse(JSON.stringify(this.data));
        this.selectedRowKeys.forEach((item) => {
          list.find((items) => {
            if (items.ITEM_ID == item) {
              items.ORIGINIAL_RECEIPT_DATE = splitData(items.ORIGINIAL_RECEIPT_DATE);
              items.LAST_RECEIPT_DATE = splitData(items.LAST_RECEIPT_DATE);
              items.LAST_ISSUE_DATE = splitData(items.LAST_ISSUE_DATE);
              items.WAREHOUSE_CHARACTER = items.WAREHOUSE_CHARACTER == 1 ? "1.普通仓" : items.WAREHOUSE_CHARACTER == 2 ? "2.VMI仓" : items.WAREHOUSE_CHARACTER == 3 ? "3.寄售客户仓" : items.WAREHOUSE_CHARACTER == 4 ? "4.客户寄库仓" : items.WAREHOUSE_CHARACTER == 5 ? "5.在途仓" : "6.客供料仓";
              items.WAREHOUSE_PROPERTY = items.WAREHOUSE_PROPERTY == "1" ? "1.存货仓" : "2.非存货仓";
              items.BIN_CONTROL = items.BIN_CONTROL == 1 ? "1.启用" : "0.不启用";
              items.LOT_CONTROL = items.LOT_CONTROL == "N" ? "N.不需求" : items.LOT_CONTROL == "T" ? "T.需要且检查库存量" : "Y.需要不检查库存量";
              items.ITEM_PROPERTY = modelType(items.ITEM_PROPERTY);
              items.INCLUDED_AVAILABLE_QTY = items.INCLUDED_AVAILABLE_QTY ? "Y" : "N";
              items.NEGATIVE_INVENTORY_ALLOWED = items.NEGATIVE_INVENTORY_ALLOWED ? "Y" : "N";
              excelData.push(items);
              resolve(excelData);
            }
          });
        });
      });
    },
    //导出数据
    async handleExcel() {
      console.log("导出====");
      await this.getExcelData().then((res) => {
        console.log(res);
        this.isExportLod = true;
        const header = [];
        this.columns.map((item) => {
          if (item.dataIndex) {
            header.push({ key: item.dataIndex, title: item.title });
          }
        });
        var timestamp = Date.parse(new Date());
        try {
          ExportExcel(header, res, `品号仓库存货信息_${timestamp}.xlsx`);
          this.$message.success("导出数据成功!");
        } catch (error) {
          console.log(error);
          this.$message.error("导出数据失败");
        }
        this.isExportLod = false;
      });
    },
  },
};
</script>

<style scoped lang="less">
.ant-form-item {
  margin-bottom: 5px;
}
/deep/.color2 {
  color: red;
}
/deep/.color1 {
  color: #0000ff;
}
/deep/html {
  background-color: #ffffff;
  margin: 0; /* this affects the margin on the html before sending to printer */
}

/deep/body {
  border: solid 1px blue;
  margin: 10mm 15mm 10mm 15mm; /* margin you want for the content */
}
/*去除页眉页脚*/
.content-print {
  margin: 0 auto;
}
.head-img {
  text-align: center;
  width: 200px;
  height: 50px;
  margin: 0 auto;
  img {
    width: 100%;
    height: 100%;
  }
}
.head-qr {
  text-align: center;
  width: 100px;
  height: 100px;
  margin: 0 auto;
  img {
    width: 100%;
    height: 100%;
  }
}
.head-title {
  text-align: center;
  p {
    padding: 0;
    margin: 0;
    font-size: 20px;
    color: #000;
    font-weight: 700;
  }
}
.info {
  margin: 0 auto;
  border: 1px #000 solid;
  padding: 10px 10px;
}
</style>
