<!--
 * @Author: max
 * @Date: 2021-11-29 15:04:20
 * @LastEditTime: 2022-10-14 16:04:09
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/power/production/process/components/craftForm.vue
-->
<template>
  <div>
    <a-modal v-model="visible" :title="isEdit ? '编辑工艺路线' : '添加工艺路线'" @cancel="close" @ok="handleOk" centered :width="600">
      <div>
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item ref="PlantId" has-feedback label="生产工厂" prop="PlantId">
            <a-select style="width: 200px" placeholder="请选择生产工厂" v-model="form.PlantId">
              <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item ref="RoutingName" has-feedback label="工艺路线名称" prop="RoutingName">
            <a-input v-model="form.RoutingName" allowClear placeholder="请输入工艺路线名称" />
          </a-form-model-item>
          <a-form-model-item ref="RoutingCode" has-feedback label="工艺路线编码" prop="RoutingCode">
            <a-input v-model.trim="form.RoutingCode" allowClear placeholder="请输入工艺路线编码" :disabled="isEdit" />
          </a-form-model-item>
          <a-form-model-item ref="RoutingDesc" label="工序描述">
            <a-textarea v-model="form.RoutingDesc" placeholder="请输入工序描述" :auto-size="{ minRows: 3, maxRows: 5 }" />
          </a-form-model-item>
          <a-form-model-item ref="Enable" label="是否启用">
            <a-radio-group :value="form.Enable" button-style="solid" @change="enableChange">
              <a-radio-button value="N">否</a-radio-button>
              <a-radio-button value="Y">是</a-radio-button>
            </a-radio-group>
          </a-form-model-item>
        </a-form-model>
        <a-row>
          <!-- <a-col :span="24" v-for="(formItem, index) in dynamicValidateForm" :key="index" style="border-bottom:1px #e9e9e9 solid;margin: 5px 0;padding:5px 0">
            <a-form-model-item label="参数">
              <a-select style="width: 100px" placeholder="请选择生产工序" v-model="form.PlantId">
                <a-select-option v-for="item in mockData" :key="item.Id" :value="item.Id">{{ item.ProcessName }}</a-select-option>
              </a-select>
              <a-icon v-if="dynamicValidateForm.length > 1" style="margin-left:10px" class="dynamic-delete-button" type="minus-circle-o" @click="removeService(formItem)" />
            </a-form-model-item>
          </a-col> -->
          <a-table :columns="columns" :data-source="dataSource" size="small" :pagination="false">
            <template slot="index" slot-scope="text, record, index">
              <div>
                <span>{{ index + 1 }}</span>
              </div>
            </template>
            <template slot="ProcessName" slot-scope="test, record">
              <a-select style="width: 100px" placeholder="请选择生产工序" v-model="record.Id" @change="(e) => processChange(e)">
                <a-select-option v-for="item in mockData" :key="item.Id" :value="item.Id" :disabled="item.disabled">{{ item.ProcessName }}</a-select-option>
              </a-select>
            </template>
            <template slot="action" slot-scope="text, record, index">
              <div>
                <a-popconfirm title="确定删除?" @confirm="() => onDelete(index, record.ProcessId)">
                  <a style="margin-right: 8px">
                    <a-icon type="delete" />
                    删除
                  </a>
                </a-popconfirm>
              </div>
            </template>
          </a-table>
        </a-row>
        <a-form-model-item v-if="!isEdit">
          <div style="text-align: center;">
            <a-button :disabled="isEdit" type="dashed" style="width: 60%;margin: 0 auto;" @click="addService"> <a-icon type="plus" />添加工艺路线</a-button>
          </div>
        </a-form-model-item>
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
  },
  {
    title: "生产工序名称",
    dataIndex: "ProcessName",
    scopedSlots: { customRender: "ProcessName" },
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];
import { setCraft, getProcess } from "@/services/mes.js";
export default {
  props: ["plantList", "editData", "isEdit"],
  data() {
    return {
      columns,
      mockData: [],
      dataSource: [],
      targetKeys: [],
      selectedKeys: [],
      disabled: false,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        PlantId: "",
        RoutingCode: "",
        RoutingName: "",
        RoutingDesc: "",
        Enable: "Y",
        RoutingDetails: [],
      },
      rules: {
        PlantId: [
          {
            required: true,
            message: "请输入生产工厂",
            trigger: "blur",
          },
        ],
        RoutingCode: [
          {
            required: true,
            message: "请输入工序路线编码",
            trigger: "blur",
          },
        ],
        RoutingName: [
          {
            required: true,
            message: "请输入工序路线名称",
            trigger: "blur",
          },
        ],
        Step: [
          {
            required: true,
            message: "请选择工序",
            trigger: "blur",
          },
        ],
      },
      visible: true,
      plantId: "",
      workshopId: "",
      week: "",
      workshopList: [],
      lineList: [],
      lineId: "",
      isUserList: false,
      processList: [],
      processType: [],
      dynamicValidateForm: [],
      newData: [],
    };
  },
  created() {
    this.getProcessLine();
    if (this.isEdit) {
      this.form = this.editData;
      this.form.RoutingDetails.forEach((item) => {
        this.newData.push(item.ProcessId);
        this.dataSource.push({
          ProcessName: item.ProcessName,
          ProcessId: item.ProcessId,
          Id: item.ProcessId,
        });
      });
    }
  },
  methods: {
    addService() {
      this.dataSource.push({
        ProcessName: "",
        Step: "",
      });
    },
    //选择工艺
    processChange(e) {
      console.log(e);
      let findData = this.mockData.find((item) => item.Id == e);
      let newIds = [];
      this.dataSource.forEach((item) => {
        newIds.push(item.Id);
        if (item.Id == e) {
          item.ProcessId = findData.Id;
        }
      });
      this.mockData.forEach((item) => {
        if (newIds.includes(item.Id)) {
          item.disabled = true;
        }else {
          item.disabled = false;
        }
      });
      console.log(this.dataSource);
    },
    onDelete(index, id) {
      this.dataSource.splice(index, 1);
      this.mockData.forEach((item) => {
        if (item.Id == id) {
          item.disabled = false;
        }
      });
    },
    close() {
      this.$emit("closeModal");
    },
    getProcessLine() {
      let params = {
        pageindex: 1,
        pagesize: 100,
      };
      getProcess(params, "getall").then((res) => {
        if (res.data.success) {
          let list = res.data.data.list;
          list.forEach((item) => {
            this.mockData.push({
              ...item,
              disabled: false,
            });
          });
          if (this.isEdit) {
            console.log("this.newData", this.newData);
            this.mockData.forEach((item) => {
              if (this.newData.includes(item.Id)) {
                item.disabled = true;
              }
            });
            console.log("this.mockData===", this.mockData);
          }
        }
      });
    },
    //查看详情
    onClose() {
      this.isDrawer = false;
    },
    enableChange(value) {
      this.form.Enable = value.target.value;
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        console.log(valid);
        if (valid) {
          //编辑
          this.form.RoutingDetails = [];
          this.dataSource.forEach((item, index) => {
            this.form.RoutingDetails.push({
              ProcessId: item.ProcessId,
              Step: index + 1,
            });
          });
          console.log(" this.form.RoutingDetails===", this.form.RoutingDetails);
          if (this.isEdit) {
            let editForm = {
              RoutingId: this.form.RoutingId,
              PlantId: this.form.PlantId,
              RoutingCode: this.form.RoutingCode,
              RoutingName: this.form.RoutingName,
              RoutingDesc: this.form.RoutingDesc,
              Enable: this.form.Enable,
              RoutingDetails: this.form.RoutingDetails,
            };
            setCraft(editForm, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.$emit("closeModal");
                this.$emit("success");
              }
            });
          } else {
            setCraft(this.form, "add").then((res) => {
              if (res.data.success) {
                this.$message.success("添加成功!");
                this.$emit("closeModal");
                this.$emit("success");
              }
            });
          }
        }
      });
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
/deep/.ant-table {
  min-height: 0vh;
}
/deep/.ant-upload-list-item-name {
  white-space: normal;
}
</style>
