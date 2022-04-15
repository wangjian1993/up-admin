<!--
 * @Author: max
 * @Date: 2022-04-01 14:02:21
 * @LastEditTime: 2022-04-15 09:20:31
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/esop/document/details.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="sop文档详情" @cancel="close" :footer="null" centered width="70%">
      <div>
        <a-descriptions :column="4" size="small">
          <a-descriptions-item label="文件名称">
            {{ docsInfo.DocumentName }}
          </a-descriptions-item>
          <a-descriptions-item label="生产工厂">
            {{ docsInfo.PlantName }}
          </a-descriptions-item>
          <a-descriptions-item label="产品大类">
            {{ docsInfo.ProType }}
          </a-descriptions-item>
          <a-descriptions-item label="产品系列">
            {{ docsInfo.ProTypeDetail }}
          </a-descriptions-item>
        </a-descriptions>
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <a-table :columns="columns" :data-source="docsFile" :size="size" :pagination="false" :rowKey="(docsFile) => docsFile.FileCode" bordered>
            <template slot="index" slot-scope="text, record, index">
              <div>
                <span>{{ index + 1 }}</span>
              </div>
            </template>
            <template slot="Sort" slot-scope="text">
              <div>
                <span>工序{{ text }}</span>
              </div>
            </template>
            <template slot="FileSize" slot-scope="text">
              <p>{{ getFileSize(text) }}</p>
            </template>
            <template slot="action" slot-scope="text, record">
              <div>
                <a style="margin-right: 8px" @click="preview(record)">
                  <a-icon type="profile" />
                  预览
                </a>
                <a style="margin-right: 8px" v-if="record.FileType == 'xlsx' || record.FileType == 'word'" @click="download(record)">
                  <a-icon type="download" />
                  下载
                </a>
              </div>
            </template>
          </a-table>
        </a-card>
      </div>
      <preview v-if="isPreview" :previewRecord="previewRecord" @close="closeModal" />
    </a-modal>
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
    title: "工序",
    dataIndex: "Sort",
    scopedSlots: { customRender: "Sort" },
    align: "center",
  },
  {
    title: "附件名称",
    dataIndex: "FileName",
    scopedSlots: { customRender: "FileName" },
    align: "center",
  },
  {
    title: "附件大小",
    dataIndex: "FileSize",
    scopedSlots: { customRender: "FileSize" },
    align: "center",
  },
  {
    title: "附件类型",
    dataIndex: "FileType",
    scopedSlots: { customRender: "FileType" },
    align: "center",
  },
  {
    title: "附件时长",
    dataIndex: "FileLength",
    scopedSlots: { customRender: "FileLength" },
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];
import { getSopDocument } from "@/services/esop.js";
import preview from "../components/preview.vue";
export default {
  components: { preview },
  props: ["drawerItem"],
  data() {
    return {
      data: [],
      columns,
      size: "small",
      visible: true,
      docsFile: [],
      docsInfo: [],
      isPreview: false,
      previewRecord: [],
    };
  },
  created() {
    this.getDocsFile();
  },
  methods: {
    closeModal() {
      this.isPreview = false;
    },
    preview(record) {
      this.previewRecord = record;
      if (record.FileType == "image" || record.FileType == "video") {
        this.isPreview = true;
      } else {
        window.open("http://192.168.1.245:8080" + record.FilePath, "_blank");
      }
    },
    download(record) {
      window.open("http://192.168.1.245:8080" + record.FilePath, "_blank");
    },
    getDocsFile() {
      let parmas = {
        id: this.drawerItem.DocumentId,
      };
      getSopDocument(parmas, "single").then((res) => {
        if (res.data.success) {
          this.docsFile = res.data.data.files;
          this.docsInfo = res.data.data.doc;
        }
      });
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    close() {
      this.$emit("closeModal");
    },
    getFileSize(size) {
      if (!size) return 0;
      var num = 1024.0; //byte
      if (size < num) return size + "B";
      if (size < Math.pow(num, 2)) return (size / num).toFixed(2) + "K"; //kb
      if (size < Math.pow(num, 3)) return (size / Math.pow(num, 2)).toFixed(2) + "M"; //M
      if (size < Math.pow(num, 4)) return (size / Math.pow(num, 3)).toFixed(2) + "G"; //G
      return (size / Math.pow(num, 4)).toFixed(2) + "T"; //T
    },
  },
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
/deep/.ant-form-item {
  margin-bottom: 5px;
}
/deep/.ant-table {
  min-height: 0vh;
}
</style>
