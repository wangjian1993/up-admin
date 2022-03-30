<!--
 * @Author: max
 * @Date: 2022-03-30 14:01:21
 * @LastEditTime: 2022-03-30 15:10:13
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
              <a-select v-decorator="['plantid']" style="width: 200px" placeholder="请选择生产工厂" @change="plantChange">
               <a-select-option v-for="item in plantList" :key="item.PlantId" :value="item.PlantId">{{ item.PlantName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="生产车间" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select v-decorator="['workcenterid']" style="width: 200px" placeholder="请选择生产车间" @change="workShopChange">
                <a-select-option v-for="item in workshopList" :key="item.WorkShopId" :value="item.WorkShopId">{{ item.WorkShopName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="生产产线" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select v-decorator="['lineid']" style="width: 200px" placeholder="请选择生产产线" @change="lineChange">
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
            <!-- <div class="device-list-content">
              <p class="process">工序1</p>
              <p class="device">设备</p>
              <p class="process">工序1</p>
            </div> -->
          </div>
          <div class="device-list-footer">
            <span></span>
            <p>拉尾</p>
            <span></span>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { setSopDevice, getDeviceList ,getSopDocument} from "@/services/esop.js";
export default {
  data() {
    return {
      visible: true,
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      plantid: "", //工厂
      plantList: [],
      workshopList: [],
      workshopId: "", //车间
      lineList: [],
    };
  },
  created() {
    this.getEnterList();
  },
  methods: {
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
    //工厂选择
    plantChange(e) {
      this.plantid = e;
      this.getWorkshopList();
      this.form.workcenterid = "";
      this.form.lineid = "";
    },
    //车间选择
    workShopChange(e) {
      this.workshopId = e;
      this.getLineList();
      this.form.lineid = "";
    },
    //获取设备
    lineChange(e) {
      console.log(e);
      let parmas = {
        plantid: this.plantid,
        workcenterid: this.workshopId,
        lineid: e,
      };
      getDeviceList(parmas, "getequipment").then((res) => {
        if (res.data.success) {
          console.log(res);
        }
      });
    },
    //获取生产工厂
    getEnterList() {
      let parmas = {
        entertypecode: "PLANT",
      };
      getSopDocument(parmas, "getplant").then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
        }
      });
    },
    getWorkshopList() {
      let parmas = {
        plantid: this.plantid,
      };
      getSopDocument(parmas, "getworkcenter").then((res) => {
        if (res.data.success) {
          this.workshopList = res.data.data;
        }
      });
    },
    getLineList() {
      let parmas = {
        plantid: this.plantid,
        workshopid: this.workshopId,
      };
      getSopDocument(parmas, "getline").then((res) => {
        if (res.data.success) {
          this.lineList = res.data.data;
        }
      });
    },
  },
  components: {},
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
    .process {
      width: 150px;
      height: 30px;
      border: 1px #000 solid;
      text-align: center;
      line-height: 30px;
      cursor: pointer;
    }
    .device {
      width: 80px;
      height: 50px;
      border: 1px #000 solid;
      text-align: center;
      line-height: 50px;
    }
  }
}
</style>
