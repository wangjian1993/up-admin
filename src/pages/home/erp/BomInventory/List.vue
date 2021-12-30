<!--
 * @Author: max
 * @Date: 2021-10-14 11:30:23
 * @LastEditTime: 2021-12-30 15:03:34
 * @LastEditors: max
 * @Description: BOM查询
 * @FilePath: /up-admin/src/pages/home/erp/BomInventory/List.vue
-->
<template>
  <div>
    <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
      <a-form layout="horizontal" :form="searchForm">
        <div :class="advanced ? null : 'fold'">
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
                <a-dropdown>
                  <a-button style="margin-left:5px" shape="circle" icon="filter" size="small" @click="(e) => e.preventDefault()" />
                  <a-menu slot="overlay">
                    <a-menu-item v-for="(item, index) in filtrate" :key="index" @click="itemFiltrete('itemcode', item)">
                      <a href="javascript:;" :class="itemcodesign == item ? 'menuBg' : ''">{{ item }}</a>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="品名" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input placeholder="请输入品名" allowClear style="width: 200px" v-decorator="['itemname']" />
                <a-dropdown>
                  <a-button style="margin-left:5px" shape="circle" icon="filter" size="small" @click="(e) => e.preventDefault()" />
                  <a-menu slot="overlay">
                    <a-menu-item v-for="(item, index) in filtrate" :key="index" @click="itemFiltrete('itemname', item)">
                      <a href="javascript:;" :class="itemnamesign == item ? 'menuBg' : ''">{{ item }}</a>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="产品规格" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input placeholder="请输入产品规格" allowClear style="width: 200px" v-decorator="['itemspecification']" />
                <a-dropdown>
                  <a-button style="margin-left:5px" shape="circle" icon="filter" size="small" @click="(e) => e.preventDefault()" />
                  <a-menu slot="overlay">
                    <a-menu-item v-for="(item, index) in filtrate" :key="index" @click="itemFiltrete('itemspecification', item)">
                      <a href="javascript:;" :class="itemspecificationsign == item ? 'menuBg' : ''">{{ item }}</a>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-if="advanced">
            <a-col :md="6" :sm="24">
              <a-form-item label="库存数量" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input-number placeholder="请输入库存数量" allowClear style="width: 200px" v-decorator="['inventoryqty']" />
                <a-dropdown>
                  <a-button style="margin-left:5px" shape="circle" icon="filter" size="small" @click="(e) => e.preventDefault()" />
                  <a-menu slot="overlay">
                    <a-menu-item v-for="(item, index) in ['不过滤', '等于', '不等于', '小于', '小于或等于', '大于', '大于或等于']" :key="index" @click="itemFiltrete('inventoryqty', item)">
                      <a href="javascript:;" :class="inventoryqtysign == item ? 'menuBg' : ''">{{ item }}</a>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="图号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input placeholder="请输入图号" allowClear style="width: 200px" v-decorator="['drawingno']" />
                <a-dropdown>
                  <a-button style="margin-left:5px" shape="circle" icon="filter" size="small" @click="(e) => e.preventDefault()" />
                  <a-menu slot="overlay">
                    <a-menu-item v-for="(item, index) in filtrate" :key="index" @click="itemFiltrete('drawingno', item)">
                      <a href="javascript:;" :class="drawingnosign == item ? 'menuBg' : ''">{{ item }}</a>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="首次入库日" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-date-picker placeholder="首次入库日" style="width: 200px" v-decorator="['originialreceiptdate']" />
                <a-dropdown>
                  <a-button style="margin-left:5px" shape="circle" icon="filter" size="small" @click="(e) => e.preventDefault()" />
                  <a-menu slot="overlay">
                    <a-menu-item v-for="(item, index) in ['不过滤', '等于', '不等于', '小于', '小于或等于', '大于', '大于或等于']" :key="index" @click="itemFiltrete('originialreceiptdate', item)">
                      <a href="javascript:;" :class="originialreceiptdatesign == item ? 'menuBg' : ''">{{ item }}</a>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="最后入库日" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-date-picker placeholder="最后入库日" style="width: 200px" v-decorator="['lastreceiptdate']" />
                <a-dropdown>
                  <a-button style="margin-left:5px" shape="circle" icon="filter" size="small" @click="(e) => e.preventDefault()" />
                  <a-menu slot="overlay">
                    <a-menu-item v-for="(item, index) in ['不过滤', '等于', '不等于', '小于', '小于或等于', '大于', '大于或等于']" :key="index" @click="itemFiltrete('lastreceiptdate', item)">
                      <a href="javascript:;" :class="lastreceiptdatesign == item ? 'menuBg' : ''">{{ item }}</a>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="最后出库日" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-date-picker placeholder="最后出库日" style="width: 200px" v-decorator="['lastissuedate']" />
                <a-dropdown>
                  <a-button style="margin-left:5px" shape="circle" icon="filter" size="small" @click="(e) => e.preventDefault()" />
                  <a-menu slot="overlay">
                    <a-menu-item v-for="(item, index) in ['不过滤', '等于', '不等于', '小于', '小于或等于', '大于', '大于或等于']" :key="index" @click="itemFiltrete('lastissuedate', item)">
                      <a href="javascript:;" :class="lastissuedatesign == item ? 'menuBg' : ''">{{ item }}</a>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <span style="float: right; margin-top: 3px;">
          <a-button type="primary" @click="search">查询</a-button>
          <a-button style="margin-left: 8px" @click="reset">重置</a-button>
          <a @click="toggleAdvanced" style="margin-left: 8px">
            {{ advanced ? "收起" : "展开" }}
            <a-icon :type="advanced ? 'up' : 'down'" />
          </a>
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
        :rowKey="(data, index) => data.ITEM_ID + '_' + index"
        bordered
        :customRow="handleClickRow"
        :rowClassName="rowClassName"
        ref="tableRef"
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
        <template slot="ITEM_NAME" slot-scope="text">
        <a-tooltip placement="topLeft">
          <template slot="title" >
            {{ text }}
          </template>
          {{ text }}
        </a-tooltip>
      </template>
      <template slot="ITEM_SPECIFICATION" slot-scope="text">
        <a-tooltip placement="topLeft">
          <template slot="title" >
            {{ text }}
          </template>
          {{ text }}
        </a-tooltip>
      </template>
      </a-table>
      <a-empty v-else description="暂无权限" />
      <dosage v-if="isDosage" :info="mitemcodeData" @closeModal="closeModal"></dosage>
    </a-card>
  </div>
</template>
<script>
import getTableScroll from "@/utils/setTableHeight";
import { renderStripe } from "@/utils/stripe.js";
import { getERPReportAction } from "@/services/erp.js";
import { splitData, modelType } from "@/utils/util.js";
import Dosage from "./Dosage.vue";
import ExportExcel from "@/utils/ExportExcelJS";
import { columns, columnsPrint } from "./data";
import { PublicVar } from "@/mixins/publicVar.js";
import { resizeableTitle } from "@/utils/resizeableTitle.js";
export default {
  components: { Dosage },
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
      columnsPrint,
      isDosage: false,
      isExecl: false,
      isDetail: false,
      advanced: false,
      detailData: [],
      plantList: [],
      mitemcodeData: [],
      excelData: [],
      printData: [],
      printList: [],
      itemcodesign: "",
      itemnamesign: "",
      itemspecificationsign: "",
      inventoryqtysign: "",
      drawingnosign: "",
      originialreceiptdatesign: "",
      lastissuedatesign: "",
      lastreceiptdatesign: "",
      ScrollPosition: 0,
    };
  },
  activated() {
    this.$refs.tableRef.$el.querySelector(".ant-table-body").scrollTop = this.ScrollPosition;
  },
  beforeRouteLeave(to, from, next) {
    this.ScrollPosition = this.$refs.tableRef.$el.querySelector(".ant-table-body").scrollTop;
    next();
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
    itemFiltrete(type, text) {
      switch (type) {
        case "itemcode":
          this.itemcodesign = text;
          break;
        case "itemname":
          this.itemnamesign = text;
          break;
        case "itemspecification":
          this.itemspecificationsign = text;
          break;
        case "inventoryqty":
          this.inventoryqtysign = text;
          break;
        case "drawingno":
          this.drawingnosign = text;
          break;
        case "originialreceiptdate":
          this.originialreceiptdatesign = text;
          break;
        case "lastreceiptdate":
          this.lastreceiptdatesign = text;
          break;
        case "lastissuedate":
          this.lastissuedatesign = text;
          break;
      }
      this.pagination.current = 1;
      this.search();
    },
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
      this.pagination.current = 1;
      this.pagination.total = 0;
      this.searchForm.resetFields();
      this.getPlant();
      this.itemcodesign = "";
      this.itemspecificationsign = "";
      this.itemnamesign = "";
      this.originialreceiptdatesign = "";
      this.lastissuedatesign = "";
      this.lastreceiptdatesign = "";
      this.drawingnosign = "";
      this.inventoryqtysign = "";
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    //关键词搜索
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          console.log(values);
          // console.log("Received values of form: ", values.week);
          if (values.itemcode == undefined && values.itemname == undefined && values.itemspecification == undefined) {
            this.$message.warning("请输入查询条件:品号,品名.规格");
            this.loading = false;
            return;
          }
          if (values["originialreceiptdate"] && values["originialreceiptdate"].length == 1) {
            var originialreceiptdate = values["originialreceiptdate"].format("YYYY-MM-DD");
          }
          if (values["lastreceiptdate"] && values["lastreceiptdate"].length == 1) {
            var lastreceiptdate = values["lastreceiptdate"].format("YYYY-MM-DD");
          }
          if (values["lastissuedate"] && values["lastissuedate"].length == 1) {
            var lastissuedate = values["lastissuedate"].format("YYYY-MM-DD");
          }
          this.loading = true;
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            plantid: values.plantid,
            itemcode: values.itemcode || "",
            itemname: values.itemname || "",
            drawingno: values.drawingno || "",
            inventoryqty: values.inventoryqty || "",
            originialreceiptdate: originialreceiptdate || "",
            lastreceiptdate: lastreceiptdate || "",
            lastissuedate: lastissuedate || "",
            itemspecification: values.itemspecification || "",
            itemcodesign: this.itemcodesign,
            itemspecificationsign: this.itemspecificationsign,
            itemnamesign: this.itemnamesign,
            originialreceiptdatesign: this.originialreceiptdatesign,
            lastissuedatesign: this.lastissuedatesign,
            lastreceiptdatesign: this.lastreceiptdatesign,
            drawingnosign: this.drawingnosign,
            inventoryqtysign: this.inventoryqtysign,
          };
          console.log("111111", parmas);
          getERPReportAction(parmas, "getwarehousestockinfo").then((res) => {
            if (res.data.success) {
              this.data = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.recordsTotal;
              this.pagination = pagination;
              this.isSearch = true;
            } else {
              this.data = [];
              this.pagination.current = 1;
              this.pagination.total = 0;
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
          list.find((items, index) => {
            if (items.ITEM_ID + "_" + index == item) {
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
