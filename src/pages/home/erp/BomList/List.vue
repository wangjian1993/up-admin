<!--
 * @Author: max
 * @Date: 2021-10-14 11:30:23
 * @LastEditTime: 2021-12-24 18:21:07
 * @LastEditors: max
 * @Description: BOM查询
 * @FilePath: /up-admin/src/pages/home/erp/BomList/List.vue
-->
<template>
  <div>
    <a-spin tip="导出中..." :spinning="isExportLod">
      <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
        <!-- <a-form layout="horizontal" :form="searchForm">
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
        </div>
        <span style="float: right; margin-top: 3px;">
          <a-button type="primary" @click="search">查询</a-button>
          <a-button style="margin-left: 8px" @click="reset">重置</a-button>
        </span>
      </a-form> -->
        <div class="operator">
          <!-- <a-button icon="check-circle" type="primary" :disabled="!hasSelected" :loading="loading" style="margin-left: 8px" @click="printClick">打印</a-button>
        <a-button icon="export" type="primary" :disabled="!hasSelected" :loading="loading" @click="handleExcel" style="margin-left: 8px">导出Excel</a-button> -->
          <a-button v-if="hasPerm('print')" icon="printer" type="primary" :disabled="!hasSelected" :loading="loading" style="margin-left: 8px" @click="printClick">打印</a-button>
          <a-button v-else icon="printer" type="primary" disabled :loading="loading" style="margin-left: 8px" @click="printClick">打印</a-button>
          <a-button v-if="hasPerm('export')" icon="export" type="primary" :disabled="!hasSelected" :loading="loading" @click="handleExcel" style="margin-left: 8px">导出Excel</a-button>
          <a-button v-else icon="export" type="primary" disabled :loading="loading" @click="handleExcel" style="margin-left: 8px">导出Excel</a-button>
          <a-button style="margin-left: 8px" @click="reset">重置</a-button>
          <span style="margin-left: 8px">
            <template v-if="hasSelected">
              {{ `共选中 ${selectedRowKeys.length} 条` }}
            </template>
          </span>
        </div>
        <div class="print-list">
          <a-table
            id="DomPdf"
            v-if="hasPerm('search')"
            :columns="columns"
            :data-source="data"
            size="small"
            :scroll="{ y: scrollY, x: 1500 }"
            :loading="loading"
            :pagination="pagination"
            @change="handleTableChange"
            :rowKey="(data) => data.BOM_ID"
            bordered
            :customRow="handleClickRow"
            ref="tableRef"
            :rowClassName="rowClassName"
            :scrollToFirstRowOnChange="false"
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
            <template slot="ApproveStatus_SELECT">
              <span>
                <p>BOM生效状态</p>
                <div style="display:flex;">
                  <a-select v-model="searchValue.approvestatus" style="width: 80px" defaultValue="ALL" size="small" @change="search" placeholder="">
                    <a-select-option value="">All</a-select-option>
                    <a-select-option value="Y">已生效</a-select-option>
                    <a-select-option value="N">未生效</a-select-option>
                    <a-select-option value="V">失效</a-select-option>
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
            <template slot="ITEM_CODE_INPUT">
              <span>
                <p>主件品号</p>
                <div style="display:flex;">
                  <a-input placeholder="品号" size="small" style="font-size: 10px;" allowClear v-model="searchValue.itemcode" />
                  <a-dropdown>
                    <a-button shape="circle" icon="unordered-list" size="small" @dblclick="(e) => e.preventDefault()" />
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
                <p>品名<a-icon size="18" @click="tableSort" :type="itemNameSort == 'ascend' ? 'sort-ascending' : 'sort-descending'"></a-icon></p>
                <div style="display:flex;">
                  <a-input placeholder="品名" size="small" style="font-size: 10px;" allowClear v-model="searchValue.itemname" />
                  <a-dropdown>
                    <a-button shape="circle" icon="unordered-list" size="small" @dblclick="(e) => e.preventDefault()" />
                    <a-menu slot="overlay">
                      <a-menu-item v-for="(item, index) in filtrate" :key="index" @click="itemFiltrete('itemname', item)">
                        <a href="javascript:;" :class="itemnamesign == item ? 'menuBg' : ''">{{ item }}</a>
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
                    <a-button shape="circle" icon="unordered-list" size="small" @dblclick="(e) => e.preventDefault()" />
                    <a-menu slot="overlay">
                      <a-menu-item v-for="(item, index) in filtrate" :key="index" @click="itemFiltrete('itemspecification', item)">
                        <a href="javascript:;" :class="itemspecificationsign == item ? 'menuBg' : ''">{{ item }}</a>
                      </a-menu-item>
                    </a-menu>
                  </a-dropdown>
                </div>
              </span>
            </template>
            <template slot="DRAWING_NO_INPUT">
              <span>
                <p>图号</p>
                <div style="display:flex;">
                  <a-input placeholder="图号" size="small" style="font-size: 10px;" allowClear v-model="searchValue.drawingno" />
                  <a-dropdown>
                    <a-button shape="circle" icon="unordered-list" size="small" @dblclick="(e) => e.preventDefault()" />
                    <a-menu slot="overlay">
                      <a-menu-item v-for="(item, index) in filtrate" :key="index" @click="itemFiltrete('drawingno', item)">
                        <a href="javascript:;" :class="drawingnosign == item ? 'menuBg' : ''">{{ item }}</a>
                      </a-menu-item>
                    </a-menu>
                  </a-dropdown>
                </div>
              </span>
            </template>
          </a-table>
          <a-empty v-else description="暂无权限" />
        </div>
        <erp-dosage v-if="isDosage" :info="mitemcodeData" @closeModal="closeModal"></erp-dosage>
      </a-card>
      <print v-if="isPrint" :printList="printList" @closeModal="closeModal"></print>
    </a-spin>
  </div>
</template>
<script>
import getTableScroll from "@/utils/setTableHeight";
import { renderStripe } from "@/utils/stripe.js";
import { getERPReportAction } from "@/services/erp.js";
import { splitData, modelType } from "@/utils/util.js";
import ErpDosage from "../components/ErpDosage.vue";
import { exportjsontoexcelMore } from "@/utils/ExportExcel";
import Print from "../components/Print.vue";
import { columns } from "./data";
import { PublicVar } from "@/mixins/publicVar.js";
import { bomSort } from "@/mixins/bomSort.js";
import { resizeableTitle } from "@/utils/resizeableTitle.js";
export default {
  components: { ErpDosage, Print },
  mixins: [PublicVar, bomSort],
  data() {
    this.components = {
      header: {
        cell: (h, props, children) => resizeableTitle(h, props, children, this.columns),
      },
    };
    return {
      isExportLod: false,
      data: [],
      columns,
      isDosage: false,
      isExecl: false,
      isDetail: false,
      detailData: [],
      plantList: [],
      mitemcodeData: [],
      excelData: [],
      printData: [],
      printList: [],
      isPrint: false,
      itemcodesign: "",
      itemnamesign: "",
      itemspecificationsign: "",
      drawingnosign: "",
      ScrollPosition: 0,
      excelList: [],
      treeArray: [],
      searchValue: {
        plantId: "",
        itemcode: "",
        itemname: "",
        drawingno: "",
        itemspecification: "",
        approvestatus: "",
      },
      treeList: [],
      parseList: [],
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
    printClick() {
      this.getExcelPrintData().then((res) => {
        setTimeout(() => {
          this.printList = res;
          this.isPrint = true;
        }, 100);
      });
    },
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
        case "drawingno":
          this.drawingnosign = text;
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
      this.isPrint = false;
    },
    //物料需求详情
    detail(item) {
      // let values = this.searchForm.getFieldsValue();
      this.isDosage = true;
      this.mitemcodeData = item;
      this.mitemcodeData.plantId = this.searchValue.plantId;
      console.log("this.mitemcodeData", this.mitemcodeData);
    },
    getPlant() {
      let parmas = {
        entertypecode: "PLANT",
      };
      getERPReportAction(parmas, "getenterlist").then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
          this.searchValue.plantId = this.plantList[0].PlantId;
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
        approvestatus: "",
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
      this.itemnamesign = "";
      this.itemspecificationsign = "";
      this.searchValue = {
        plantId: "",
        itemcode: "",
        itemname: "",
        itemspecification: "",
        drawingno: "",
        approvestatus: "",
      };
    },
    //关键词搜索
    search() {
      if (this.searchValue.plantId == undefined) {
        this.$message.warning("请选择工厂");
        return;
      }
      if (this.searchValue.itemcode == undefined && this.searchValue.itemname == undefined && this.searchValue.itemspecification == undefined) {
        this.$message.warning("请输入查询条件:品号,品名.规格");
        return;
      }
      this.loading = true;
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        plantid: this.searchValue.plantId,
        itemcode: this.searchValue.itemcode.trim(),
        itemname: this.searchValue.itemname.trim(),
        drawingno: this.searchValue.drawingno.trim(),
        approvestatus: this.searchValue.approvestatus,
        itemspecification: this.searchValue.itemspecification.trim(),
        itemcodesign: this.itemcodesign,
        itemspecificationsign: this.itemspecificationsign,
        itemnamesign: this.itemnamesign,
        drawingnosign: this.drawingnosign,
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
            // let values = this.searchForm.getFieldsValue();
            this.mitemcodeData.plantId = this.searchValue.plantId;
            console.log("this.mitemcodeData", this.mitemcodeData);
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
    getExcelPrintData() {
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
    getExcelData(itemcode) {
      return new Promise((resolve) => {
        this.treeArray = [];
        this.excelList = [];
        let parmas = {
          plantid: this.searchValue.plantId,
          itemcode: itemcode,
        };
        getERPReportAction(parmas, "getbomchildlevel").then((res) => {
          this.excelList = res.data.data.list;
          let treeList = this.initTree(itemcode);
          console.log("treeList===", treeList);
          this.treeArray = [];
          let parseList = this.steamrollArray(treeList);
          console.log("parseList===", parseList);
          resolve(parseList);
        });
        //   /* 你的逻辑代码 */
        // let excelData = [];
        // this.selectedRowKeys.forEach((item) => {
        //   this.data.find((items) => {
        //     if (items.BOM_ID == item) {
        //       this.treeArray = [];
        //       this.excelList = [];
        //       let parmas = {
        //         plantid: this.searchValue.plantId,
        //         itemcode: items.ITEM_CODE,
        //       };
        //       getERPReportAction(parmas, "getbomchildlevel").then((res) => {
        //         // let children = res.data.data.list;
        //         this.excelList = res.data.data.list;
        //         this.excelList = this.initTree(items.ITEM_CODE);
        //         let list = this.steamrollArray(this.excelList);
        //         items.childrenArray = list;
        //         excelData.push(items);
        //         resolve(excelData);
        //       });
        //     }
        //   });
        // });
      });
    },
    initTree(parent_id) {
      // jsonArray 变量数据
      // 第一次以后：根据id去查询parent_id相同的（相同为子数据）
      // 第一次：查找所有parent_id为-1的数据组成第一级
      const child = this.excelList.filter((item) => item.LAST_ITEM_CODE == parent_id);
      // 第一次：循环parent_id为-1数组
      return child.map((item) => ({
        ...item,
        // 当前存在id（id与parent_id应该是必须有的）调用initTree() 查找所有parent_id为本id的数据
        // childs字段写入
        children: this.initTree(item.ITEM_CODE),
      }));
    },
    steamrollArray(arr) {
      arr.forEach((el) => {
        this.treeArray.push(el);
        el.children && el.children.length > 0 ? this.steamrollArray(el.children) : ""; // 子级递归
      });
      return this.treeArray;
    },
    async formattingExcel(excelData) {
      return new Promise((resolve) => {
        let excelArray = [];
        let formStyle = {};
        const sheetCols = [
          { wch: 3 }, // 序号
          { wch: 12 }, // 阶次
          { wch: 12 }, // 类型
          { wch: 32 }, // 上阶BOM号
          { wch: 10 }, // 品号
          { wch: 3 }, // 料名
          { wch: 3 }, //  产品规格
          { wch: 3 }, // 单位
          { wch: 8 }, // 价格来源
          { wch: 8 }, // E10单价
        ];
        excelData.forEach((item) => {
          let _data = [];
          let mergeTitle = []; //合并单元格
          for (let i = 0; i < 3; i++) {
            mergeTitle.push({
              s: { r: i, c: 0 },
              e: { r: i, c: 8 },
            });
          }
          _data.push([`产品代码:  ${item.ITEM_CODE}`, null, null, null, null, null, null, null, null]);
          _data.push([`产品名称:  ${item.ITEM_NAME}`, null, null, null, null, null, null, null, null]);
          _data.push([`产品规格:  ${item.ITEM_SPECIFICATION}`, null, null, null, null, null, null, null, null]);
          _data.push(["阶层", "元件品号", "元件品名", "元件规格", "元件图号", "单位", "组成用量", "底数", "插件位置"]);
          item.childrenArray.map((items) => {
            let array = [];
            if (items.LOWLEVEL) {
              var str = "";
              for (let i = 1; i <= items.LOWLEVEL; i++) {
                str += ".";
              }
              array.push(str + items.LOWLEVEL);
            }
            // array.push(items.LOWLEVEL);
            array.push(items.ITEM_CODE);
            array.push(items.ITEM_NAME);
            array.push(items.ITEM_SPECIFICATION);
            array.push(items.DRAWING_NO);
            array.push(items.UNIT_NAME);
            array.push(items.QTY_PER);
            array.push(items.DENOMINATOR);
            array.push(items.COMPONENT_LOCATION);
            _data.push(array);
          });
          _data.push(["", "制单:", "", "审核:", "", "核准:", "", "日期:", ""]);
          let merges2 = [];
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
    async waitData(code) {
      let n = await this.getExcelData(code);
      return n;
    },
    //导出数据
    async handleExcel() {
      this.isExportLod = true;
      let arr = [];
      let promiseList = [];
      this.data.map((item) => {
        if (this.selectedRowKeys.includes(item.BOM_ID)) {
          this.treeArray = [];
          this.excelList = [];
          promiseList.push(item);
          arr.push(this.waitData(item.ITEM_CODE));
          console.log("arr===", arr);
        }
      });
      Promise.all(arr)
        .then((res) => {
          // let list = res.flat();
          console.log(res);
          res.forEach((items, index) => {
            promiseList[index].childrenArray = items;
          });
          this.formattingExcel(promiseList).then((r) => {
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
              console.log(error);
              this.$message.error("导出数据失败");
            }
            this.isExportLod = false;
          });
        })
        .catch((err) => {
          //  loading.close();
          console.log("error", err);
        });
      // await this.getExcelData().then((res) => {
      //   setTimeout(() => {
      //     this.formattingExcel(res).then((r) => {
      //       console.log("r===", r);
      //       try {
      //         var timestamp = Date.parse(new Date());
      //         exportjsontoexcelMore({
      //           dataList: r,
      //           bookType: "xlsx", // 导出类型
      //           filename: `BOM清单_${timestamp}`, // 导出标题名
      //         });
      //         this.$message.success("导出数据成功!");
      //         this.selectedRowKeys = [];
      //       } catch (error) {
      //         console.log(error);
      //         this.$message.error("导出数据失败");
      //       }
      //     });
      //   }, 200);
      // });
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
/deep/.ant-table {
  font-size: 10px;
}
.menuBg {
  background: #13c2c2;
  color: #fff;
}
/deep/.print-list .ant-table-row-cell-break-word {
  white-space: nowrap;
  overflow: hidden;
}
</style>
