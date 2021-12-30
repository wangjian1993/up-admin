<!--
 * @Author: max
 * @Date: 2021-10-16 11:00:40
 * @LastEditTime: 2021-12-29 14:45:41
 * @LastEditors: max
 * @Description: 品号信息
 * @FilePath: /up-admin/src/pages/home/erp/components/ModelInfo.vue
-->
<template>
  <div>
    <a-drawer class="bom-detail" :visible="visible" title="BOM信息" placement="right" @close="close" :get-container="false" :wrap-style="{ position: 'absolute' }" width="100%" :footer="null" centered :headerStyle="{ padding: '5px 20px' }" :bodyStyle="{ padding: '5px 10px' }">
      <a-spin tip="loading..." :spinning="loading">
        <div class="info-box">
          <div>
            <a-descriptions :column="4" bordered size="small">
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
              <a-descriptions-item label="品名" :span="2">
                {{ info.ITEM_NAME }}
              </a-descriptions-item>
              <a-descriptions-item label="生命周期">
                {{ info.DESCRIPTION }}
              </a-descriptions-item>
              <a-descriptions-item label="周期种类">
                {{ info.CYCLEL_STATUS == "1" ? "1.新建" : info.CYCLEL_STATUS == "2" ? "2.发行" : "3.终止" }}
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
            <a-tabs type="card" style="width:70%;height:100%;">
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
                    <span v-if="item.layout">{{ info[item.dataIndex] + item.layout }}</span>
                    <span v-else-if="!item.checkbox && item.filter">{{ item.filter(info[item.dataIndex]) }}</span>
                    <span v-else-if="!item.checkbox && !item.filter">{{ info[item.dataIndex] }}</span>
                    <a-checkbox v-else-if="item.checkbox" :checked="info[item.dataIndex]"></a-checkbox>
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
                <div v-if="imgUrl != ''">
                  <div style="margin:10px 0">
                    <a-button type="primary" icon="file-image" @click="downImg('img')">
                      导出图片
                    </a-button>
                    <!-- <a-button style="margin-left:10px" type="primary" icon="file-pdf" @click="downImg('pdf')">
                    导出PDF
                  </a-button> -->
                  </div>
                  <div style="width:100%">
                    <viewer>
                      <img style="width:100%;height:100%;" :src="imgUrl" alt="" />
                    </viewer>
                  </div>
                </div>
                <a-empty v-else description="暂无图片" />
              </a-tab-pane>
              <a-tab-pane key="8" tab="品号附件"> </a-tab-pane>
            </a-tabs>
          </div>
        </div>
      </a-spin>
    </a-drawer>
  </div>
</template>

<script>
const columns = [
  {
    title: "段号",
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
import { uploadFile } from "@/services/admin.js";
// import { jsPDF } from "jspdf";
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
    downImg(type) {
      if (type == "img") {
        var alink = document.createElement("a");
        alink.href = this.imgUrl;
        alink.download = this.info.ITEM_CODE; //图片名
        alink.click();
      }
    },
    close() {
      this.$emit("closeModal");
    },
    getImg() {
      let parmas = {
        itemcode: this.modelData.ITEM_CODE || this.modelData.itemcode,
      };
      getERPReportAction(parmas, "getitemimage").then((res) => {
        if (res.data.success) {
          this.imgUrl = res.data.data.ImgUrl;
        }
      });
    },
    updated(info) {
      let parmas = {
        FileName: info.FileName,
        FileContent: info.FileContent,
        FileSuffix: info.FileSuffix,
      };
      uploadFile(parmas).then((res) => {
        if (res.data.success) {
          // this.$message.success("上传成功!");
          this.imgUrl = res.data.data.ImgUrl;
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
/deep/.ant-modal-content {
  height: 100%;
}
/deep/ .ant-modal {
  height: auto;
  max-height: auto;
}
.info-box {
  width: 100%;
  overflow-y: auto;
}
/deep/.ant-descriptions-item-content {
  font-size: 10px;
}
/deep/.ant-descriptions-item-label {
  font-size: 10px;
}
/deep/.ant-drawer-close{
  width: 36px;
  height:36px;
  line-height: 36px;
}
</style>
