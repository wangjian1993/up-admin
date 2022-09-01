<!--
 * @Author: max
 * @Date: 2022-03-31 09:19:37
 * @LastEditTime: 2022-06-23 15:34:56
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/esop/deviceBind/docs.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="选择sop文档" @cancel="close" @ok="handleOk" centered width="70%">
      <div>
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <a-table
            :columns="columns"
            :data-source="docsFile"
            :size="size"
            :pagination="false"
            :scroll="{ y: 400 }"
            :rowKey="(docsFile) => docsFile.FileCode"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
            }"
            bordered
          >
            <template slot="index" slot-scope="text, record, index">
              <div>
                <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
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
    </a-modal>
    <preview v-if="isPreview" :previewRecord="previewRecord" @close="closeModal" />
  </div>
</template>
<script>
const columns = [
  {
    title: "展示顺序",
    dataIndex: "order",
    scopedSlots: { customRender: "order" },
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
import { getDeviceList, deviceSopBind } from "@/services/esop.js";
import preview from "../components/preview.vue";
export default {
  props: ["documentItem", "deviceItem", "plantId"],
  components: { preview },
  data() {
    return {
      data: [],
      columns,
      size: "small",
      visible: true,
      selectedRowKeys: [],
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
      docsFile: [],
      isPreview: false,
      previewRecord: [],
    };
  },
  created() {
    console.log(this.documentItem);
    this.getDocsFile();
  },
  methods: {
    preview(record) {
      this.previewRecord = record;
      if (record.FileType == "image" || record.FileType == "video") {
        this.isPreview = true;
      } else {
        window.open("." + record.FilePath, "_blank");
      }
    },
    download(record) {
      window.open("." + record.FilePath, "_blank");
    },
    closeModal() {
      this.isPreview = false;
    },
    getDocsFile() {
      let params = {
        documentid: this.documentItem.DocumentId,
      };
      getDeviceList(params, "getfile").then((res) => {
        if (res.data.success) {
          this.docsFile = res.data.data.list;
        }
      });
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRowKeys.forEach((item, index) => {
        this.docsFile.forEach((items) => {
          if (item == items.FileCode) {
            items.order = index + 1;
          }
        });
      });
      this.docsFile.forEach((item)=>{
        if(!this.selectedRowKeys.includes(item.FileCode)){
          item.order =""
        }
      })
    },
    getItemIndex(id) {
      this.selectedRowKeys.forEach((item, index) => {
        if (item == id) {
          console.log("index===", index);
          return index;
        }
      });
    },
    close() {
      this.$emit("closeModal");
    },
    handleOk() {
      let params = {
        documentid: this.documentItem.DocumentId,
        documentcode: this.documentItem.DocumentCode,
        equipmentlist: [
          {
            id: this.deviceItem.Id,
            equipmentid: this.deviceItem.EquipmentId,
            equipmentcode: this.deviceItem.EquipmentCode,
            equipmentname: this.deviceItem.EquipmentName,
            plantid: this.deviceItem.PlantId,
            workcenterid: this.deviceItem.WorkCenterId,
            lineid: this.deviceItem.LineId,
            station: this.deviceItem.Station,
            stationlocation: this.deviceItem.direction == 0 ? "左" : "右",
            filecode: this.selectedRowKeys,
          },
        ],
      };
      deviceSopBind(params, "bind").then((res) => {
        if (res.data.success) {
          // this.docsFile = res.data.data.list;
          this.$message.success("绑定成功!");
          this.$emit("success");
        }
      });
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
