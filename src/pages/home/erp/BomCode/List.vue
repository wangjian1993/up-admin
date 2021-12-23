<!--
 * @Author: max
 * @Date: 2021-10-14 11:30:23
 * @LastEditTime: 2021-12-22 10:26:41
 * @LastEditors: max
 * @Description: BOM查询
 * @FilePath: /up-admin/src/pages/home/erp/BomCode/List.vue
-->
<template>
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
            <a-form-item label="品号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-input placeholder="请输入品号" allowClear style="width: 200px" v-decorator="['itemcode']" />
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
        <a-row>
          <a-col :md="24" :sm="24">
            <span style="float: right; margin-top: 3px;">
              <a-button type="primary" @click="search">查询</a-button>
              <a-button style="margin-left: 8px" @click="reset">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </div>
    </a-form> -->
    <a-row>
      <a-col :md="24" :sm="24">
        <span>
          <!-- <a-button type="primary" @click="search">查询</a-button> -->
          <a-button style="margin-left: 8px" @click="reset">重置</a-button>
        </span>
      </a-col>
    </a-row>
    <a-table ref="tableRef" :columns="columns" :data-source="data" size="small" :scroll="{ y: scrollY, x: 1500 }" :loading="loading" :pagination="pagination" @change="handleTableChange" :rowKey="(data) => data.ITEM_BUSINESS_ID" bordered :customRow="handleClickRow" :rowClassName="rowClassName" :components="components">
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
          <p>状态</p>
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
          <p>品号</p>
          <div style="display:flex;">
            <a-input placeholder="品号" size="small" style="font-size: 10px;" allowClear v-model="searchValue.itemcode" />
            <a-dropdown>
              <a-button shape="circle" icon="unordered-list" size="small" @click="(e) => e.preventDefault()" />
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
          <p>品名 <a-icon @click="tableSort" :type="itemNameSort == 'ascend' ? 'sort-ascending' : 'sort-descending'"></a-icon></p>
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
    <model-info v-if="isModelInfo" :modelData="mitemcodeData" @closeModal="closeModal"></model-info>
  </a-card>
</template>
<script>
import getTableScroll from "@/utils/setTableHeight";
import { getERPReportAction } from "@/services/erp.js";
import { splitData, modelType } from "@/utils/util.js";
import ModelInfo from "../components/ModelInfo.vue";
import { columns } from "./data";
import { PublicVar } from "@/mixins/publicVar.js";
import { bomSort } from "@/mixins/bomSort.js";
import { resizeableTitle } from "@/utils/resizeableTitle.js";
export default {
  components: { ModelInfo },
  mixins: [PublicVar,bomSort],
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
      itemnamesign: "",
      itemspecificationsign: "",
      drawingnosign: "",
      ScrollPosition: 0,
      searchValue: {
        plantId: "",
        itemcode: "",
        itemname: "",
        itemspecification: "",
        drawingno: "",
        approvestatus: "",
      }    
    };
  },
  activated() {
    this.$refs.tableRef.$el.querySelector(".ant-table-body").scrollTop = this.ScrollPosition;
  },
  beforeRouteLeave(to, from, next) {
    this.ScrollPosition = this.$refs.tableRef.$el.querySelector(".ant-table-body").scrollTop;
    next();
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
    //获取列表数据
    getListAll() {
      this.loading = true;
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize + 1,
        plantid: this.plantId,
        itemcode: "",
        itemname: "",
        itemspecification: "",
      };
      getERPReportAction(parmas, "getbominfo").then((res) => {
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
        itemcode: "",
        itemname: "",
        itemspecification: "",
        drawingno: "",
        approvestatus: "",
      };
    },
    //关键词搜索
    search() {
      if (this.searchValue.itemcode == undefined && this.searchValue.itemname == undefined && this.searchValue.itemspecification == undefined && this.searchValue.drawingno == undefined) {
        this.$message.warning("请输入查询条件:品号,品名.规格");
        return;
      }
      if (this.searchValue.plantId == undefined) {
        this.$message.warning("请选择工厂");
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
      getERPReportAction(parmas, "getbominfo").then((res) => {
        if (res.data.success) {
          let list = res.data.data.list;
          this.data = list;
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination = pagination;
          this.isSearch = true;
        }
        this.loading = false;
      });
    },
    //行数据双击
    handleClickRow(record) {
      return {
        style: {
          // 行背景色
          cursor: "pointer",
        },
        on: {
          dblclick: () => {
            console.log(record);
            this.isModelInfo = true;
            this.mitemcodeData.ITEM_CODE = record.ITEM_CODE;
            this.mitemcodeData.plantid = this.searchValue.plantId;
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
    },
    //设置行数据背景
    rowClassName(record) {
      return record.ApproveStatus == "V" ? "color2" : record.ApproveStatus == "N" ? "color1" : "";
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
