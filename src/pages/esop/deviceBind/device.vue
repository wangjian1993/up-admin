<!--
 * @Author: max
 * @Date: 2022-03-30 14:01:21
 * @LastEditTime: 2022-03-31 15:18:54
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/esop/deviceBind/device.vue
-->
<template>
  <div>
    <a-modal title="选择设备" :visible="visible" v-if="visible" destoryOnClose @ok="handleOk" @cancel="handleCancel" width="60%">
      <div>
        <a-row>
          <a-col :md="6" :sm="24">
            <a-form-item label="生产工厂" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select v-model="plantId" style="width: 200px" placeholder="请选择生产工厂" @change="plantChange">
                <a-select-option v-for="item in plantList" :key="item.PlantId" :value="item.PlantId">{{ item.PlantName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="生产车间" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select v-model="workshopId" style="width: 200px" placeholder="请选择生产车间" @change="workShopChange">
                <a-select-option v-for="item in workshopList" :key="item.WorkShopId" :value="item.WorkShopId">{{ item.WorkShopName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="生产产线" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select v-model="lineId" style="width: 200px" placeholder="请选择生产产线" @change="lineChange">
                <a-select-option v-for="item in lineList" :key="item.LineId" :value="item.LineId">{{ item.LineName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </div>
      <div>
        <div class="device-lsit">
          <div class="device-list-header">
            <span>左侧</span>
            <p>拉头</p>
            <span>右侧</span>
          </div>
          <div>
            <div class="device-list-content" v-for="(item, index) in deviceList" :key="item.EquipmentId">
              <p class="process" @click="selectDocs(item, 1)">{{ index + 1 }}</p>
              <div class="device">
                <p>{{ item.EquipmentName }}</p>
                <p :class="item.Status ? 'span-t' : 'span-f'"></p>
              </div>
              <p class="process" @click="selectDocs(item, 2)">{{ index + 1 }}</p>
            </div>
          </div>
          <div class="device-list-footer">
            <span></span>
            <p>拉尾</p>
            <span></span>
          </div>
        </div>
      </div>
    </a-modal>
    <docs v-if="isDocsList" :deviceItem="deviceItem" :plantId="plantId" :documentItem="documentItem" @closeModal="closeModal" @success="success" />
  </div>
</template>

<script>
import { setSopDevice, getDeviceList, getSopDocument } from "@/services/esop.js";
import docs from "./docs.vue";
export default {
  props: ["documentItem"],
  components: { docs },
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
    };
  },
  created() {
    this.getEnterList();
    console.log(this.documentItem);
  },
  methods: {
    selectDocs(record, direction) {
      this.isDocsList = true;
      record.direction = direction;
      this.deviceItem = record;
    },
    closeModal() {
      this.isDocsList = false;
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            this.form.equipmentid = this.editData.EquipmentId;
            setSopDevice(this.form, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.$emit("success");
              }
            });
          } else {
            setSopDevice(this.form, "add").then((res) => {
              if (res.data.success) {
                this.$message.success("添加成功!");
                this.$emit("success");
              }
            });
          }
        }
      });
    },
    handleCancel() {
      this.$emit("close");
    },
    success() {
      this.isDocsList = false;
      this.getDeviceList();
    },
    //工厂选择
    plantChange(e) {
      this.plantId = e;
      this.getWorkshopList();
      this.workshopId = "";
      this.lineId = "";
    },
    //车间选择
    workShopChange(e) {
      this.workshopId = e;
      this.getLineList();
      this.lineId = "";
    },
    //获取设备
    lineChange(e) {
      console.log(e);
      this.lineId = e;
      this.getDeviceList();
    },
    getDeviceList() {
      let parmas = {
        plantid: this.plantId,
        workcenterid: this.workshopId,
        lineid: this.lineId,
      };
      getDeviceList(parmas, "getequipment").then((res) => {
        if (res.data.success) {
          console.log(res);
          this.deviceList = res.data.data.list;
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
      let parmas = {
        plantid: this.plantId,
      };
      getSopDocument(parmas, "getworkcenter").then((res) => {
        if (res.data.success) {
          this.workshopList = res.data.data;
        }
      });
    },
    getLineList() {
      let parmas = {
        plantid: this.plantId,
        workshopid: this.workshopId,
      };
      getSopDocument(parmas, "getline").then((res) => {
        if (res.data.success) {
          this.lineList = res.data.data;
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
  width: 500px;
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
      width: 150px;
      height: 30px;
      border: 1px #000 solid;
      text-align: center;
      line-height: 30px;
      cursor: pointer;
      &:hover {
        background: rgb(150, 227, 158);
      }
    }
    .device {
      width: 80px;
      height: 50px;
      border: 1px #000 solid;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      p {
        margin: 0;
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
