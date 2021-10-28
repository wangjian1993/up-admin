<!--
 * @Author: max
 * @Date: 2021-10-16 11:00:40
 * @LastEditTime: 2021-10-28 17:53:18
 * @LastEditors: max
 * @Description: 品号信息
 * @FilePath: /up-admin/src/pages/home/erp/components/ModelInfo.vue
-->
<template>
  <div>
    <a-modal class="bom-detail" v-model="visible" title="BOM信息" @cancel="close" width="90%" :footer="null" centered>
      <a-spin tip="loading..." :spinning="loading">
        <div>
          <a-descriptions :column="3" bordered size="small">
            <a-descriptions-item label="品号">
              {{ info.ITEM_CODE }}
            </a-descriptions-item>
            <a-descriptions-item label="品号群组">
              {{ info.FEATURE_GROUP_NAME }}
            </a-descriptions-item>
            <a-descriptions-item label="启用特征码">
              <a-checkbox :checked="info.ITEM_FEATURE_CONTROL"></a-checkbox>
            </a-descriptions-item>
            <a-descriptions-item label="快捷码">
              {{ info.SHORTCUT }}
            </a-descriptions-item>
            <a-descriptions-item label="生命周期">
              {{ info.DESCRIPTION }}
            </a-descriptions-item>
            <a-descriptions-item label="周期种类">
              {{ info.CYCLEL_STATUS == "1" ? "1.新建" : info.CYCLEL_STATUS == "2" ? "2.发行" : "3.终止" }}
            </a-descriptions-item>
            <a-descriptions-item label="产品型号" :span="2">
              {{ info.FILENAME }}
            </a-descriptions-item>
            <a-descriptions-item label="状态">
              {{ info.ApproveStatus == "Y" ? "Y.已生效" : info.ApproveStatus == "N" ? "N.未生效" : "V.已失效" }}
            </a-descriptions-item>
            <a-descriptions-item label=" 图号">
              {{ info.DRAWING_NO }}
            </a-descriptions-item>
            <a-descriptions-item label="品号描述">
              {{ info.ITEM_DESC }}
            </a-descriptions-item>
            <a-descriptions-item label=" 品号图片">
              {{ modelType(info.ITEM_DESC) }}
            </a-descriptions-item>
            <a-descriptions-item label=" 规格">
              {{ info.ITEM_SPECIFICATION }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
        <div>
          <a-tabs type="card" style="width:70%">
            <a-tab-pane key="1" tab="通用属性值信息">
              <a-table :columns="columns" size="small" :data-source="data">
                <a slot="name" slot-scope="text">{{ text }}</a>
              </a-table>
            </a-tab-pane>
            <a-tab-pane key="2" tab="通用信息">
              <a-descriptions :column="3" bordered size="small">
                <a-descriptions-item v-for="(item, index) in general" :key="index" :label="item.title">
                  <span v-if="!item.checkbox && item.filter">{{ item.filter(info[item.dataIndex]) }}</span>
                  <span v-if="!item.checkbox && !item.filter">{{ info[item.dataIndex] }}</span>
                  <a-checkbox v-if="item.checkbox" :checked="info[item.dataIndex]"></a-checkbox>
                </a-descriptions-item>
              </a-descriptions>
            </a-tab-pane>
            <a-tab-pane key="3" tab="仓储信息">
              <a-descriptions :column="3" bordered size="small">
                <a-descriptions-item v-for="(item, index) in storage" :key="index" :label="item.title">
                  <span v-if="!item.checkbox && item.filter">{{ item.filter(info[item.dataIndex]) }}</span>
                  <span v-if="!item.checkbox && !item.filter">{{ info[item.dataIndex] }}</span>
                  <a-checkbox v-if="item.checkbox" :checked="info[item.dataIndex]"></a-checkbox>
                </a-descriptions-item>
              </a-descriptions>
            </a-tab-pane>
            <a-tab-pane key="4" tab="生产信息">
              <a-descriptions :column="3" bordered size="small">
                <a-descriptions-item v-for="(item, index) in production" :key="index" :label="item.title">
                  <span v-if="!item.checkbox && item.filter">{{ item.filter(info[item.dataIndex]) }}</span>
                  <span v-if="!item.checkbox && !item.filter">{{ info[item.dataIndex] }}</span>
                  <a-checkbox v-if="item.checkbox" :checked="info[item.dataIndex]"></a-checkbox>
                </a-descriptions-item>
              </a-descriptions>
            </a-tab-pane>
            <a-tab-pane key="5" tab="计划信息">
              <a-descriptions :column="3" bordered size="small">
                <a-descriptions-item v-for="(item, index) in plant" :key="index" :label="item.title">
                  <span v-if="!item.checkbox && item.filter">{{ item.filter(info[item.dataIndex]) }}</span>
                  <span v-if="!item.checkbox && !item.filter">{{ info[item.dataIndex] }}</span>
                  <a-checkbox v-if="item.checkbox" :checked="info[item.dataIndex]"></a-checkbox>
                </a-descriptions-item>
              </a-descriptions>
            </a-tab-pane>
            <a-tab-pane key="6" tab="财务信息">
              <a-descriptions :column="3" bordered size="small">
                <a-descriptions-item v-for="(item, index) in finance" :key="index" :label="item.title">
                  <span v-if="!item.checkbox && item.filter">{{ item.filter(info[item.dataIndex]) }}</span>
                  <span v-if="!item.checkbox && !item.filter">{{ info[item.dataIndex] }}</span>
                  <a-checkbox v-if="item.checkbox" :checked="info[item.dataIndex]"></a-checkbox>
                </a-descriptions-item>
              </a-descriptions>
            </a-tab-pane>
            <a-tab-pane key="7" tab="品号图片">
              <img style="width:100%" :src="imgUrl" alt="" />
            </a-tab-pane>
            <a-tab-pane key="8" tab="品号附件"> </a-tab-pane>
          </a-tabs>
        </div>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
const columns = [
  {
    title: "序号",
    dataIndex: "SECTION_NO",
    scopedSlots: { customRender: "SECTION_NO" },
    align: "center",
    width: 50,
  },
  {
    title: "属性",
    dataIndex: "FEATURE_NAME",
    scopedSlots: { customRender: "FEATURE_NAME" },
    align: "center",
    width: 250,
  },
  {
    title: "属性值",
    dataIndex: "FEATURE_VALUE",
    scopedSlots: { customRender: "FEATURE_VALUE" },
    align: "center",
    width: 150,
  },
  {
    title: "属性值描述",
    dataIndex: "FEATURE_VALUE_DESC",
    scopedSlots: { customRender: "FEATURE_VALUE_DESC" },
    align: "center",
    width: 250,
    ellipsis: true,
  },
  {
    title: "备注",
    dataIndex: "REMARK",
    scopedSlots: { customRender: "REMARK" },
    align: "center",
    width: 300,
    ellipsis: true,
  },
];
import { getERPReportAction } from "@/services/erp.js";
import { splitData } from "@/utils/util.js";
import { feedSystem, modelType } from "@/utils/BomParmas.js";
import { general, storage, production, plant, finance } from "./common";
export default {
  props: ["modelData"],
  data() {
    return {
      size: "small",
      columns,
      visible: true,
      data: [],
      info: [],
      loading: false,
      general,
      storage,
      production,
      plant,
      finance,
      imgUrl: "",
    };
  },
  created() {
    this.getImg();
    this.getList();
  },
  methods: {
    splitData,
    modelType,
    feedSystem,
    close() {
      this.$emit("closeModal");
    },
    getImg() {
      let parmas = {
        itemcode: this.modelData.ITEM_CODE || this.modelData.itemcode,
      };
      getERPReportAction(parmas, "getitemimage").then((res) => {
        if (res.data.success) {
          this.imgUrl = res.data.data.imgUrl;
        }
      });
    },
    getList() {
      this.loading = true;
      console.log(this.modelData);
      let parmas = {
        plantid: this.modelData.Owner_Org_ROid || this.modelData.plantid,
        itemcode: this.modelData.ITEM_CODE || this.modelData.itemcode,
      };
      getERPReportAction(parmas, "getbomdetailinfo").then((res) => {
        if (res.data.success) {
          this.info = Object.assign(res.data.data.info_1[0], res.data.data.info_2[0]);
          console.log(this.info);
          this.data = res.data.data.firstPageInfo;
          this.loading = false;
          this.isSearch = false;
        } else {
          this.loading = false;
        }
      });
    },
    //查看详情
    onClose() {
      this.isDrawer = false;
    },
    //关闭对话框
    handleCancel() {
      this.isAddModal = false;
    },
  },
  components: {},
};
</script>

<style lang="less" scoped>
.rowActive {
  background: #000;
}
.form-box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
/deep/.ant-descriptions-bordered .ant-descriptions-item-label {
  background: rgba(0, 0, 0, 0.05);
}
/deep/.ant-card-head {
  padding: 0;
}
/deep/div {
  -moz-user-select: none; /*火狐*/
  -webkit-user-select: none; /*webkit浏览器*/
  -ms-user-select: none; /*IE10*/
  -khtml-user-select: none; /*早期浏览器*/
  user-select: none;
}
/deep/.ant-modal {
  height: 100%;
}
/deep/.ant-modal-content {
  height: 100%;
}
</style>
