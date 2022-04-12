<!--
 * @Author: max
 * @Date: 2022-04-04 17:03:33
 * @LastEditTime: 2022-04-12 13:43:33
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/esop/record/device.vue
-->
<template>
  <div>
    <a-modal title="设备信息" :visible="visible" v-if="visible" destoryOnClose :footer="null" @cancel="handleCancel" width="60%">
      <a-descriptions v-if="documentItem.length != 0" :column="4" size="small">
        <a-descriptions-item label="文件名称">
          {{ documentItem.DocumentName }}
        </a-descriptions-item>
        <a-descriptions-item label="生产工厂">
          {{ documentItem.PlantName }}
        </a-descriptions-item>
        <a-descriptions-item label="生产产线">
          {{ documentItem.LineName }}
        </a-descriptions-item>
      </a-descriptions>
      <div>
        <div class="device-lsit">
          <div class="device-list-header">
            <span>左侧</span>
            <p>拉头</p>
            <span>右侧</span>
          </div>
          <div>
            <div class="device-list-content" v-for="(item, index) in deviceList" :key="index">
              <div class="device" v-for="(items, indexs) in item" :key="items.EquipmentId">
                <div v-if="indexs == 0" class="process" @click="checkDocs(items)">
                  <p v-for="fileItem in items.Detail" :key="fileItem.Id">{{ fileItem.FileName }}</p>
                </div>
                <div class="device-content">
                  <p>{{ items.EquipmentName }}</p>
                  <p :class="items.Status ? 'span-t' : 'span-f'"></p>
                </div>
                <div v-if="indexs == 1" class="process" @click="checkDocs(items)">
                  <p v-for="fileItem in items.Detail" :key="fileItem.Id">{{ fileItem.FileName }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="device-list-footer">
            <span></span>
            <p>拉尾</p>
            <span></span>
          </div>
        </div>
      </div>
      <docs v-if="isDocs" :documentItem="documentItem" :deviceItem="deviceItem" @close="close" />
    </a-modal>
  </div>
</template>
<script>
import { getSopDocument } from "@/services/esop.js";
import docs from "./docs.vue";
export default {
  props: ["documentItem"],
  components: { docs },
  data() {
    return {
      visible: true,
      deviceList: [],
      isDocsList: false,
      deviceItem: [],
      isDocs: false,
      selectDocsList: [],
      documentRecord: [],
    };
  },
  created() {
    this.getDeviceList();
    console.log("documentItem---",this.documentItem)
  },
  methods: {
    handleCancel() {
      this.$emit("close");
    },
    close() {
      this.isDocs = false;
    },
    checkDocs(item) {
      this.isDocs = true;
      this.deviceItem = item;
    },
    getDeviceList() {
      let parmas = {
        recordid: this.documentItem.RecordId,
        lineid: this.documentItem.LineId,
        documentid: this.documentItem.DocumentId,
      };
      getSopDocument(parmas, "record/getequipment").then((res) => {
        if (res.data.success) {
          let list = res.data.data.list;
          for (var i = 0; i < list.length; i += 2) {
            this.deviceList.push(list.slice(i, i + 2));
          }
        }
      });
    },
  },
};
</script>

<style lang="less">
.ant-form-item {
  margin-bottom: 5px;
}
.device-lsit {
  width: 550px;
  margin: 0 auto;
  text-align: center;
  border: 1px #000 solid;
  padding: 10px;
  .device-list-header,
  .device-list-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      width: 150px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      color: rgb(228, 23, 23);
    }
    p {
      width: 180px;
      height: 30px;
      border: 1px #000 solid;
      text-align: center;
      line-height: 30px;
    }
  }
  .device-list-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0;
    .process {
      width: 130px;
      height: 30px;
      border: 1px #000 solid;
      text-align: center;
      line-height: 30px;
      cursor: pointer;
      p {
        overflow: hidden;
        text-overflow: ellipsis; //文本溢出显示省略号
        white-space: nowrap; //文本不会换行
      }
      &:hover {
        background: rgb(150, 227, 158);
      }
    }
    .device {
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      p {
        margin: 0;
      }
      .device-content {
        width: 100px;
        height: 50px;
        border: 1px #000 solid;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 0 10px;
      }
      .span-f {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: rgb(240, 6, 6);
      }
      .span-t {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #06f035;
      }
    }
  }
}
</style>
