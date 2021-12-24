<!--
 * @Author: max
 * @Date: 2021-09-02 18:16:28
 * @LastEditTime: 2021-12-24 15:38:33
 * @LastEditors: max
 * @Description: 导入生产日计划
 * @FilePath: /up-admin/src/pages/home/erp/components/Print.vue
-->
<template>
  <a-modal class="bom-detail" v-model="visible" title="打印预览" @cancel="close" width="60%" :footer="null" centered>
    <a-button type="primary" class="no-print" v-print="'#printTest'">打印</a-button>
    <div id="printTest">
      <div v-for="item in printList" :key="item.BOM_ID" style="page-break-after:always">
        <div class="content">
          <a-row>
            <a-col :span="8"
              ><div class="head-img"><img src="@/assets/img/mb.png" alt="" /></div
            ></a-col>
            <a-col :span="8"
              ><div class="head-title">
                <p>深圳民爆光电股份有限公司</p>
                <p>BOM清单</p>
              </div></a-col
            >
          </a-row>
          <div class="info">
            <a-descriptions columns="3">
              <a-descriptions-item label="主件品号">
                {{ item.ITEM_CODE }}
              </a-descriptions-item>
              <a-descriptions-item label="版次">
                {{ item.VERSION_TIMES }}
              </a-descriptions-item>
              <a-descriptions-item label="品号类型">
                {{ modelType(item.ITEM_PROPERTY) }}
              </a-descriptions-item>
              <a-descriptions-item label="主件品名">
                {{ item.ITEM_NAME }}
              </a-descriptions-item>
              <a-descriptions-item label="快捷码">
                {{ item.SHORTCUT }}
              </a-descriptions-item>
              <a-descriptions-item label="修改日期">
                {{ item.LastModifiedDate }}
              </a-descriptions-item>
              <a-descriptions-item label="主件规格" :span="3">
                {{ item.ITEM_SPECIFICATION }}
              </a-descriptions-item>
            </a-descriptions>
          </div>
          <a-table :columns="columns" :data-source="item.childrenArray" size="small" :pagination="false" :rowKey="(data) => data.BOM_D_ID" bordered style="page-break-after:always">
            <template slot="index" slot-scope="text, record, index">
              <div>
                <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
              </div>
            </template>
          </a-table>
        </div>
      </div>
    </div>
  </a-modal>
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
    title: "元件品号",
    dataIndex: "ITEM_CODE",
    scopedSlots: { customRender: "ITEM_CODE" },
    align: "center",
    width: 100,
  },
  {
    title: "品名",
    dataIndex: "ITEM_NAME",
    scopedSlots: { customRender: "ITEM_NAME" },
    align: "center",
    width: 100,
  },
  {
    title: "规格",
    dataIndex: "ITEM_SPECIFICATION",
    scopedSlots: { customRender: "ITEM_SPECIFICATION" },
    align: "center",
    width: 200,
  },
  {
    title: "单位",
    dataIndex: "UNIT_NAME",
    scopedSlots: { customRender: "UNIT_NAME" },
    align: "center",
    width: 60,
  },
  {
    title: "用量",
    dataIndex: "QTY_PER",
    scopedSlots: { customRender: "QTY_PER" },
    align: "center",
    width: 60,
  },
  {
    title: "底数",
    dataIndex: "DENOMINATOR",
    scopedSlots: { customRender: "DENOMINATOR" },
    align: "center",
    width: 60,
  },
  {
    title: "备注",
    dataIndex: "REMARK",
    scopedSlots: { customRender: "REMARK" },
    align: "center",
    width: 60,
  },
  {
    title: "图号",
    dataIndex: "DRAWING_NO",
    scopedSlots: { customRender: "DRAWING_NO" },
    align: "center",
    width: 100,
  },

  {
    title: "位置",
    dataIndex: "COMPONENT_LOCATION",
    scopedSlots: { customRender: "COMPONENT_LOCATION" },
    align: "center",
    width: 60,
  },
];
import { splitData, modelType } from "@/utils/util.js";
export default {
  props: ["printList"],
  data() {
    return {
      data: [],
      columns,
      visible: true,
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
    };
  },
  created() {
    console.log(this.printList);
    // this.data = this.printList.children;
  },
  methods: {
    splitData,
    modelType,
    close() {
      this.$emit("closeModal");
    },
  },
};
</script>
<style scoped lang="less">
.ant-form-item {
  margin-bottom: 5px;
}
.content {
  margin: 0 auto;
}
.head-img {
  text-align: center;
  width: 180px;
  height: 40px;
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
    font-size: 18px;
    color: #000;
    font-weight: 700;
  }
}
.info {
  margin: 0 auto;
  border: 1px #000 solid;
  border-bottom: none;
  padding: 5px 10px;
}
/deep/.ant-descriptions-item {
  padding-bottom: 2px;
}
/deep/.ant-descriptions-item-label {
  font-size: 10px;
}
/deep/.ant-descriptions-item-content {
  font-size: 10px;
}
/deep/.ant-table-small {
  border: 1px #000 solid;
  // border-top: none;
  // border-bottom: none;
}
/deep/.ant-table-bordered .ant-table-thead > tr > th {
  // border: 1px #000 solid;
}
/deep/.ant-table-bordered .ant-table-tbody > tr > td {
  border-right: 1px #000 solid;
  font-size: 10px;
}
/deep/.ant-table-body {
  margin: 0;
}
/deep/.ant-table-column-title {
  font-size: 10px;
}
/deep/.ant-table-thead > tr > th {
  border-bottom: 1px #000 solid;
}
/deep/.ant-table-bordered .ant-table-thead > tr > th,
.ant-table-bordered .ant-table-tbody > tr > td {
  border-right: 1px #000 solid;
}
/deep/.ant-table-tbody > tr > td {
  border-bottom: 1px #000 solid;
}
/deep/.ant-table-small > .ant-table-content > .ant-table-body {
  margin: 0;
}
/deep/.ant-table-row-cell-break-word {
  white-space: break-word;
}
</style>
