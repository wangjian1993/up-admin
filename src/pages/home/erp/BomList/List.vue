<!--
 * @Author: max
 * @Date: 2021-10-14 11:30:23
 * @LastEditTime: 2021-11-08 15:42:14
 * @LastEditors: max
 * @Description: BOM查询
 * @FilePath: /up-admin/src/pages/home/erp/BomList/List.vue
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
        <a-button icon="check-circle" type="primary" :disabled="!hasSelected" :loading="loading" style="margin-left: 8px" @click="printClick">打印</a-button>
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
        :rowKey="(data) => data.BOM_ID"
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
      <erp-dosage v-if="isDosage" :info="mitemcodeData" @closeModal="closeModal"></erp-dosage>
      <print v-if="isPrint" :printList="printList" @closeModal="closeModal"></print>
    </a-card>
  </div>
</template>
<script>
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: "3%",
  },
  {
    title: "主件品号",
    dataIndex: "ITEM_CODE",
    scopedSlots: { customRender: "ITEM_CODE" },
    align: "center",
    width: 250,
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
    title: "图号",
    dataIndex: "DRAWING_NO",
    scopedSlots: { customRender: "DRAWING_NO" },
    align: "center",
    width: 150,
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
    title: "品号类型",
    dataIndex: "ITEM_PROPERTY",
    scopedSlots: { customRender: "ITEM_PROPERTY" },
    align: "center",
    width: "5%",
  },
  {
    title: "BOM生效状态",
    dataIndex: "ApproveStatus",
    scopedSlots: { customRender: "ApproveStatus" },
    align: "center",
    width: 120,
  },
  {
    title: "工厂",
    dataIndex: "PLANT_CODE_P",
    scopedSlots: { customRender: "PLANT_CODE_P" },
    align: "center",
  },
  {
    title: "工厂名称",
    dataIndex: "PLANT_NAME_P",
    scopedSlots: { customRender: "PLANT_NAME_P" },
    align: "center",
    width: 80,
  },
  {
    title: "引用工厂",
    dataIndex: "PLANT_CODE_R",
    scopedSlots: { customRender: "PLANT_CODE_R" },
    align: "center",
    width: 80,
  },
  {
    title: "引用工厂名称",
    dataIndex: "PLANT_NAME_R",
    scopedSlots: { customRender: "PLANT_NAME_R" },
    align: "center",
    width: 120,
  },
  {
    title: "版次",
    dataIndex: "VERSION_TIMES",
    scopedSlots: { customRender: "VERSION_TIMES" },
    align: "center",
  },
  {
    title: "生效日期",
    dataIndex: "ApproveDate",
    scopedSlots: { customRender: "ApproveDate" },
    align: "center",
    width: 120,
  },
  {
    title: "生效审核人员",
    dataIndex: "EMPLOYEE_NAME_A",
    scopedSlots: { customRender: "EMPLOYEE_NAME_A" },
    align: "center",
    width: 120,
  },
  {
    title: "创建日期",
    dataIndex: "CreateDate",
    scopedSlots: { customRender: "CreateDate" },
    align: "center",
    width: 120,
  },
  {
    title: "创建人员",
    dataIndex: "EMPLOYEE_NAME_C",
    scopedSlots: { customRender: "EMPLOYEE_NAME_C" },
    align: "center",
  },
  {
    title: "最后修改日期",
    dataIndex: "LastModifiedDate",
    scopedSlots: { customRender: "LastModifiedDate" },
    align: "center",
    width: 150,
  },
  {
    title: "最后修改人员",
    dataIndex: "EMPLOYEE_NAME_L",
    scopedSlots: { customRender: "EMPLOYEE_NAME_L" },
    align: "center",
    width: 150,
  },
  {
    title: "备注",
    dataIndex: "REMARK",
    scopedSlots: { customRender: "REMARK" },
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
import getTableScroll from "@/utils/setTableHeight";
import { renderStripe } from "@/utils/stripe.js";
import { getERPReportAction } from "@/services/erp.js";
import { splitData, modelType } from "@/utils/util.js";
import ErpDosage from "../components/ErpDosage.vue";
import { exportjsontoexcelMore } from "@/utils/exportExcel";
import Print from "../components/Print.vue";
export default {
  components: { ErpDosage, Print },
  data() {
    return {
      data: [],
      columns,
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
      isPrint: false,
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
    printClick() {
      this.getExcelData().then((res) => {
        setTimeout(() => {
          this.printList = res;
          this.isPrint = true;
        }, 100);
      });
    },
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    closeModal() {
      this.isDosage = false;
      this.isPrint =false
    },
    //物料需求详情
    detail(item) {
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
          getERPReportAction(parmas, "getbomlist").then((res) => {
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
        this.selectedRowKeys.forEach((item) => {
          this.data.find((items) => {
            if (items.BOM_ID == item) {
              let parmas = {
                pageindex: 1,
                pagesize: 500,
                bomid: item,
              };
              getERPReportAction(parmas, "getbomusinginfo").then((res) => {
                let children = res.data.data.list;
                items.childrenArray = children;
                excelData.push(items);
                resolve(excelData);
              });
            }
          });
        });
      });
    },
    async formattingExcel(excelData) {
      return new Promise((resolve) => {
        let excelArray = [];
        let formStyle = {};
        const sheetCols = [
          { wch: 10 }, // 序号
          { wch: 15 }, // 阶次
          { wch: 15 }, // 类型
          { wch: 20 }, // 上阶BOM号
          { wch: 15 }, // 品号
          { wch: 5 }, // 料名
          { wch: 5 }, //  产品规格
          { wch: 5 }, // 单位
          { wch: 8 }, // 价格来源
          { wch: 15 }, // E10单价
        ];
        console.log(excelData);
        console.log(excelData.length);
        excelData.forEach((item) => {
          let _data = [];
          let mergeTitle = []; //合并单元格
          console.log("遍历====", item);
          for (let i = 0; i < 3; i++) {
            mergeTitle.push({
              s: { r: i, c: 1 },
              e: { r: i, c: 9 },
            });
          }
          _data.push(["产品代码：", `${item.ITEM_CODE}`, null, null, null, null, null, null, null, null]);
          _data.push(["产品名称", `${item.ITEM_NAME}`, null, null, null, null, null, null, null, null]);
          _data.push(["产品规格", `${item.ITEM_SPECIFICATION}`, null, null, null, null, null, null, null, null]);
          _data.push(["阶层", "元件品号", "元件品名", "元件规格", "元件图号", "单位", "组成用量", "底数", "插件位置", "元件快捷码"]);
          item.childrenArray.map((items) => {
            let array = [];
            array.push(items.ROWNUMBER);
            array.push(items.ITEM_CODE);
            array.push(items.ITEM_NAME);
            array.push(items.ITEM_SPECIFICATION);
            array.push(items.DRAWING_NO);
            array.push(items.UNIT_NAME);
            array.push(items.QTY_PER);
            array.push(items.DENOMINATOR);
            array.push(items.COMPONENT_LOCATION);
            array.push(items.SHORTCUT);
            _data.push(array);
          });
          _data.push(["", "制单:", "", "审核:", "", "核准:", "", "", "日期:", ""]);
          let merges2 = [];
          console.log(_data);
          let merges = [...mergeTitle, ...merges2]; // 合并单元格
          excelArray.push({
            Sheet: item.ITEM_CODE, // 下方tab切换名称
            data: _data, // 表格数据
            merges, //  合并单元格
            autoWidth: false, // 自适应宽度
            formStyle: formStyle, // 特殊行或列样式
            sheetCols,
          });
          console.log(excelArray);
        });
        resolve(excelArray);
      });
    },
    //导出数据
    async handleExcel() {
      await this.getExcelData().then((res) => {
        setTimeout(() => {
          this.formattingExcel(res).then((r) => {
            try {
              var timestamp = Date.parse(new Date());
              exportjsontoexcelMore({
                dataList: r,
                bookType: "xlsx", // 导出类型
                filename: `BOM清单_${timestamp}`, // 导出标题名
              });
              this.$message.success("导出数据成功!");
              this.selectedRowKeys = [];
            } catch (error) {
              this.$message.error("导出数据失败");
            }
          });
        }, 100);
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
