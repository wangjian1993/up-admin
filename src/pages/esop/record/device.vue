<!--
 * @Author: max
 * @Date: 2022-04-04 17:03:33
 * @LastEditTime: 2022-07-08 15:31:01
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
          <!-- <div class="device-list-left">
            <p>{{ item.LineName }}</p>
          </div> -->
          <div class="device-list-box">
            <div class="device-list-content" v-for="(list, index) in deviceList" :key="index">
              <div class="device" v-for="(items, indexs) in list" :key="indexs">
                <div class="device-content" v-for="fileItem in items.Detail" :key="fileItem.Id" @click="selectDocs(items, indexs)">
                  <!-- <a-popover title="Title" >
                    <template slot="content">
                      {{ fileItem.FileName }}
                    </template>
                    <span>{{ items.EquipmentCode }}</span>
                  </a-popover> -->

                  <a-popover title="附件">
                    <template slot="content">
                      {{ fileItem.FileName }}
                    </template>
                    <span>
                      {{ items.EquipmentCode }}
                    </span>
                  </a-popover>
                  <img v-if="items.Status" src="@/assets/img/lcd.png" alt="" />
                  <img v-else src="@/assets/img/lcd-2.png" alt="" />
                  <!-- <p><a-icon type="folder" style="'marginLeft':'10px'" />{{ items.Detail.length }}</p> -->
                </div>
              </div>
            </div>
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
    console.log("documentItem---", this.documentItem);
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
      let params = {
        recordid: this.documentItem.RecordId,
        lineid: this.documentItem.LineId,
        documentid: this.documentItem.DocumentId,
      };
      getSopDocument(params, "record/getequipment").then((res) => {
        if (res.data.success) {
          let list = res.data.data.list;
          let array = [];
          for (let i = 0; i < list.length; i += 2) {
            let rowArray = list.slice(i, i + 2);
            if (rowArray[0] != undefined && rowArray[1] != undefined) {
              array.push(([rowArray[0], rowArray[1]] = [rowArray[1], rowArray[0]]));
            } else {
              array.push(rowArray);
            }
          }
          this.deviceList = array;
          console.log(this.deviceList);
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
  border: 1px #000 solid;
  padding: 0 10px;
  display: flex;
  align-items: center;
  margin: 10px 0;
  .device-list-left {
    // display: flex;
    // height:100%;
    // border-right: 1px solid #b4b3b3;
  }
  .device-list-box {
    display: flex;
  }
  .device-list-content {
    display: flex;
    align-items: center;
    flex-direction: column;
    .process {
      width: 50px;
      height: 50px;
      border: 1px #000 solid;
      text-align: center;
      line-height: 50px;
      img {
        width: 15px;
        height: 12px;
        margin-right: 2px;
      }
      p {
        overflow: hidden;
        text-overflow: ellipsis; //文本溢出显示省略号
        white-space: nowrap; //文本不会换行
        line-height: 1;
      }
    }
    .device {
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 5px;
      cursor: pointer;
      p {
        margin: 0;
      }
      .device-content {
        // width: 100px;
        // height: 50px;
        // border: 1px #000 solid;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 0 10px;
        img {
          width: 30px;
          height: 30px;
        }
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
