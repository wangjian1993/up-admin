<!--
 * @Author: max
 * @Date: 2021-10-14 11:30:23
 * @LastEditTime: 2021-12-14 14:27:18
 * @LastEditors: max
 * @Description: BOM查询
 * @FilePath: /up-admin/src/pages/home/erp/BomCode/List copy 2.vue
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
    <a-table v-if="hasPerm('search')" :columns="columns" :data-source="data" size="small" :scroll="{ y: scrollY, x: 1500 }" :loading="loading" :pagination="pagination" @change="handleTableChange" :rowKey="(data) => data.ITEM_BUSINESS_ID" bordered :customRow="handleClickRow" :rowClassName="rowClassName" :components="components">
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
      <template slot="ITEM_CODE_INPUT">
        <div style="display:flex;align-items: center;">
          <a-input placeholder="请输入"/>
          <a-dropdown>
            <a-button style="margin-left:5px" shape="circle" icon="filter" size="small" @click="(e) => e.preventDefault()" />
            <a-menu slot="overlay">
              <a-menu-item v-for="(item, index) in filtrate" :key="index" @click="itemFiltrete('itemspecification', item)">
                <a href="javascript:;" :class="itemspecificationsign == item ? 'menuBg' : ''">{{ item }}</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
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
import { columns } from "./data";
import { PublicVar } from "@/mixins/publicVar.js";
import { resizeableTitle } from "@/utils/resizeableTitle.js";
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
      data: [
        {
          ITEM_NAME: "",
          ITEM_CODE: "",
        },
      ],
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
    };
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
      }
      this.search();
    },
    //物料需求详情
    detail(record) {
      this.isModelInfo = true;
      this.mitemcodeData.ITEM_CODE = record.ITEM_CODE;
      this.mitemcodeData.plantid = this.searchForm.getFieldsValue().plantid;
    },
    //工厂获取
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
      this.searchForm.resetFields();
      this.getPlant();
      this.itemcodesign = "";
      this.itemnamesign = "";
      this.itemspecificationsign = "";
    },
    //关键词搜索
    search() {
      console.log(this.data);
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          console.log("Received values of form: ", values);
          this.data = [];
          this.pagination.total = 0;
          if (values.itemcode == undefined && values.itemname == undefined && values.itemspecification == undefined) {
            this.$message.warning("请输入查询条件:品号,品名.规格");
            this.loading = false;
            return;
          }
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            plantid: values.plantid,
            itemcode: values.itemcode || "",
            itemname: values.itemname || "",
            itemspecification: values.itemspecification || "",
            itemcodesign: this.itemcodesign,
            itemspecificationsign: this.itemspecificationsign,
            itemnamesign: this.itemnamesign,
          };
          getERPReportAction(parmas, "getbominfo").then((res) => {
            if (res.data.success) {
              let list = res.data.data.list;
              let aearchArray = [
                {
                  ITEM_NAME: "",
                  ITEM_CODE: "",
                },
              ];
              this.data = [...aearchArray, ...list];
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
            this.mitemcodeData.plantid = this.searchForm.getFieldsValue().plantid;
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
    //设置行数据背景
    rowClassName(record) {
      return record.ApproveStatus == "V" ? "color2" : record.ApproveStatus == "N" ? "color1" : "";
    },
  },
};
</script>
<style src="vx-easyui/dist/themes/default/easyui.css"  scoped>
</style>
<style src="vx-easyui/dist/themes/icon.css"  scoped>
</style>
<style src="vx-easyui/dist/themes/vue.css"  scoped>
</style>
<style lang="less" scoped>
// @import "vx-easyui/dist/themes/default/easyui.css";
// @import "vx-easyui/dist/themes/icon.css";
// @import "vx-easyui/dist/themes/vue.css";
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
</style>