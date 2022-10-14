<!--
 * @Author: max
 * @Date: 2022-03-30 14:01:21
 * @LastEditTime: 2022-09-22 17:53:22
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/esop/deviceBind/device.vue
-->
<template>
  <div>
    <a-modal title="选择设备" :visible="visible" v-if="visible" destoryOnClose :ok-button-props="{ props: { disabled: deviceList.length == 0 } }" @ok="handleOk" @cancel="handleCancel" width="70%">
      <div>
        <a-row>
          <a-col :md="6" :sm="24" v-if="!isDetail">
            <a-button type="primary" @click="docsList">选择SOP文档</a-button>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="生产工厂" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select :disabled="isDetail" v-model="plantId" style="width: 200px" placeholder="请选择生产工厂" @change="plantChange">
                <a-select-option v-for="item in plantList" :key="item.PlantId" :value="item.PlantId">{{ item.PlantName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="生产车间" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select :disabled="isDetail" v-model="workshopId" style="width: 200px" placeholder="请选择生产车间" @change="workShopChange">
                <a-select-option v-for="item in workshopList" :key="item.WorkShopId" :value="item.WorkShopId">{{ item.WorkShopName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!-- <a-col :md="6" :sm="24">
            <a-form-item label="生产产线" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select :disabled="isDetail" v-model="lineId" style="width: 200px" placeholder="请选择生产产线" @change="lineChange">
                <a-select-option v-for="item in lineList" :key="item.LineId" :value="item.LineId">{{ item.LineName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col> -->
        </a-row>
      </div>
      <a-descriptions v-if="selectDocsList.length != 0" :column="4" size="small">
        <a-descriptions-item label="文件名称">
          {{ selectDocsList.DocumentName }}
        </a-descriptions-item>
        <a-descriptions-item label="生产工厂">
          {{ selectDocsList.PlantName }}
        </a-descriptions-item>
        <a-descriptions-item label="产品大类">
          {{ selectDocsList.ProType }}
        </a-descriptions-item>
        <a-descriptions-item label="产品系列">
          {{ selectDocsList.ProTypeDetail }}
        </a-descriptions-item>
      </a-descriptions>
      <div v-for="item in deviceList" :key="item.LineId">
        <div class="device-lsit" v-if="item.list.length != 0">
          <div class="device-list-left">
            <p>{{ item.LineName }}</p>
          </div>
          <div class="device-list-box">
            <div class="device-list-content" v-for="(list, index) in item.list" :key="index">
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
    </a-modal>
    <docs v-if="isDocsList" :deviceItem="deviceItem" :plantId="plantId" :documentItem="documentRecord" @closeModal="closeModal" @success="success" />
    <docsList v-if="isDocs" @closeModal="closeModal" @success="successDocs" />
  </div>
</template>

<script>
import { getDeviceList, getSopDocument } from "@/services/esop.js";
import docs from "./docs.vue";
import docsList from "./docsList.vue";
export default {
  props: ["editData", "isEdit", "isDetail"],
  components: { docs, docsList },
  data() {
    return {
      visible: true,
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      plantId: "", //工厂
      plantList: [],
      workshopList: [],
      workshopId: "", //车间
      lineId: "",
      lineList: [],
      deviceList: [],
      isDocsList: false,
      deviceItem: [],
      isDocs: false,
      selectDocsList: [],
      documentRecord: [],
    };
  },
  mounted() {
    this.getEnterList();
    if (this.isEdit) {
      console.log("编辑====");
      this.deviceList = [];
      this.plantId = this.editData.PlantId;
      this.workshopId = this.editData.WorkCenterId;
      this.lineId = this.editData.LineId;
      this.selectDocsList = this.editData;
      this.getWorkshopList();
      this.deviceList.push({
        LineName: this.editData.LineName,
        LineId: this.editData.LineId,
        list: [],
      });
      this.getDeviceList(0);
      // this.getLineList("single");
      // this.getDeviceList();
    }
    if (this.isDetail) {
      console.log("详情====");
      this.deviceList = [];
      this.plantId = this.editData.PlantId;
      this.workshopId = this.editData.WorkCenterId;
      this.lineId = this.editData.LineId;
      this.selectDocsList = this.editData;
      this.getWorkshopList();
      this.deviceList.push({
        LineName: this.editData.LineName,
        LineId: this.editData.LineId,
        list: [],
      });
      this.getDeviceList(0);
      // this.getLineList("single");
      // this.getDeviceList();
    }
  },
  methods: {
    docsList() {
      this.isDocs = true;
    },
    selectDocs(record, index) {
      if (this.isDetail) {
        return;
      }
      console.log(index);
      this.isDocsList = true;
      record.direction = index % 2;
      this.documentRecord = this.selectDocsList;
      this.deviceItem = record;
    },
    successDocs(record) {
      this.selectDocsList = record;
      this.isDocs = false;
      this.deviceList = [];
      this.plantId = "";
      this.workshopId = "";
      this.lineId = "";
    },
    closeModal() {
      this.isDocsList = false;
      this.isDocs = false;
    },
    handleOk() {
      this.$emit("close");
    },
    handleCancel() {
      this.$emit("close");
    },
    success() {
      this.deviceList = [];
      this.isDocsList = false;
      this.getLineList();
    },
    //工厂选择
    plantChange(e) {
      this.deviceList = [];
      this.plantId = e;
      this.getWorkshopList();
      this.workshopId = "";
      this.lineId = "";
    },
    //车间选择
    workShopChange(e) {
      this.deviceList = [];
      this.workshopId = e;
      this.getLineList();
      this.lineId = "";
    },
    //获取设备
    lineChange(e) {
      this.lineId = e;
      this.deviceList = [];
      this.getDeviceList();
    },
    getDeviceList(index) {
      let params = {
        plantid: this.plantId,
        workcenterid: this.workshopId,
        lineid: this.lineId,
        documentid: this.selectDocsList.DocumentId,
      };
      getDeviceList(params, "getequipment").then((res) => {
        if (res.data.success) {
          let list = res.data.data.list;
          let array = [];
          for (let i = 0; i < list.length; i += 2) {
            let rowArray = list.slice(i, i + 2);
            array.push(([rowArray[0], rowArray[1]] = [rowArray[1], rowArray[0]]));
          }
          if (array.length > 0) {
            // array[array.length - 1][0] = array[array.length - 1][0] == undefined ? array[array.length - 1][1] : array[array.length - 1][0];
            console.log("array[array.length - 1][0]---",array[array.length - 1][0] == undefined)
            if (array[array.length - 1][0] == undefined) {
              console.log("删除=====")
              array[array.length - 1].splice(0,1);
              console.log("删除=====",array[array.length - 1])
            }
            console.log("去最后一个", array);
            this.deviceList[index].list = array;
            console.log("deviceList==", this.deviceList);
          }
        }
      });
    },
    //获取生产工厂
    getEnterList() {
      getSopDocument("", "getplant").then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
        }
      });
    },
    getWorkshopList() {
      let params = {
        plantid: this.plantId,
      };
      getSopDocument(params, "getworkcenter").then((res) => {
        if (res.data.success) {
          this.workshopList = res.data.data;
        }
      });
    },
    getLineList() {
      let params = {
        plantid: this.plantId,
        workshopid: this.workshopId,
      };
      getSopDocument(params, "getline").then((res) => {
        if (res.data.success) {
          this.lineList = res.data.data;
          this.lineList.forEach((line, index) => {
            this.lineId = line.LineId;
            this.deviceList.push({
              ...line,
              list: [],
            });
            this.getDeviceList(index);
          });
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
