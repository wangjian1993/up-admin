<!--
 * @Author: max
 * @Date: 2021-10-14 11:30:23
 * @LastEditTime: 2022-05-18 14:37:12
 * @LastEditors: max
 * @Description: BOM查询
 * @FilePath: /up-admin/src/pages/home/erp/BomPack/index.vue
-->
<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-row>
      <a-col :md="24" :sm="24">
        <span style="display:flex;justify-content: flex-end">
          <a-button style="margin-right: 8px" @click="reset">重置</a-button>
          <a-button type="primary" @click="advancedQuery">高级查询</a-button>
        </span>
      </a-col>
    </a-row>
    <a-table ref="tableRef" :columns="columns" :data-source="data" size="small" :scroll="{ y: scrollY, x: 1500 }" :loading="loading" :pagination="pagination" @change="handleTableChange" :rowKey="(data) => data.ITEM_CODE" bordered>
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
    </a-table>
    <advancedQuery v-if="isAdvancedQuery" @closeModal="closeModal" :editData="editData" @success="getListAll" />
  </a-card>
</template>
<script>
import getTableScroll from "@/utils/setTableHeight";
import { getBomPack } from "@/services/erp.js";
import { splitData, modelType } from "@/utils/util.js";
import { columns } from "./data";
import { PublicVarErp } from "@/mixins/publicVarErp.js";
import { bomSort } from "@/mixins/bomSort.js";
import { resizeableTitle } from "@/utils/resizeableTitle.js";
import advancedQuery from "./advancedQuery.vue";
export default {
  components: { advancedQuery },
  mixins: [PublicVarErp, bomSort],
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
      isAdvancedQuery: false,
      editData: [],
    };
  },
  created() {
    this.$nextTick(() => {
      this.scrollY = getTableScroll(70);
    });
  },
  methods: {
    splitData,
    modelType,
    advancedQuery() {
      this.isAdvancedQuery = true;
    },
    closeModal() {
      this.isAdvancedQuery = false;
    },
    //获取列表数据
    getListAll(values) {
      this.loading = true;
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        itemcode: values.itemcode,
        itemname: values.itemname,
        itemspecification: values.itemspecification,
        maxlength: values.maxlength,
        minlength: values.minlength,
        maxwidth: values.maxwidth,
        minwidth: values.minwidth,
        maxheight: values.maxheight,
        minheight: values.minheight,
        itemcodesign: values.itemcodesign,
        itemnamesign:values.itemnamesign,
        itemspecificationsign:values.itemspecificationsign,
      };
      this.editData = values
      getBomPack(parmas, "get").then((res) => {
        if (res.data.success) {
          this.data = res.data.data.list;
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.totalCount;
          this.pagination = pagination;
          this.loading = false;
        } else {
          this.loading = false;
        }
      });
    },
    //重置搜索
    reset() {
      this.data = [];
      this.editData =[]
      this.pagination.total = 0;
      this.pagination.current = 1;
    },
    //分页
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.getListAll();
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
