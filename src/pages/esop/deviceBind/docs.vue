<!--
 * @Author: max
 * @Date: 2022-03-31 09:19:37
 * @LastEditTime: 2022-03-31 10:40:55
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
          </a-table>
        </a-card>
      </div>
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
    title: "附件名称",
    dataIndex: "FileName",
    scopedSlots: { customRender: "FileName" },
    align: "center",
    width: "130px",
  },
  {
    title: "附件大小",
    dataIndex: "FileSize",
    scopedSlots: { customRender: "FileSize" },
    align: "center",
    width: 120,
  },
  {
    title: "附件类型",
    dataIndex: "FileType",
    scopedSlots: { customRender: "FileType" },
    align: "center",
    width: 120,
  },
  {
    title: "附件时长",
    dataIndex: "FileLength",
    scopedSlots: { customRender: "FileLength" },
    align: "center",
    width: 120,
  },
];
import { getDeviceList, deviceSopBind } from "@/services/esop.js";
export default {
  props: ["documentItem", "deviceItem", "plantId"],
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
    };
  },
  created() {
    console.log(this.documentItem);
    this.getDocsFile();
  },
  methods: {
    closeModal() {
      this.isPrint = true;
    },
    getDocsFile() {
      let parmas = {
        documentid: this.documentItem.DocumentId,
      };
      getDeviceList(parmas, "getfile").then((res) => {
        if (res.data.success) {
          this.docsFile = res.data.data.list;
        }
      });
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
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
            stationlocation: this.deviceItem.direction == 1 ? "左" : "右",
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
