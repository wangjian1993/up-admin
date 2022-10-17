<template>
  <div>
    <a-modal :title="isEdit ? '编辑任务' : '添加任务'" v-if="visible" :visible="visible" @ok="handleOk" @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item has-feedback label="Job名称" prop="jobname">
          <a-input v-model="form.jobname" allowClear placeholder="请输入Job名称" :disabled="isEdit" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="执行次数" prop="runnum">
          <a-input-number :min="0" v-model="form.runnum" allowClear placeholder="请输入执行次数" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="执行频率" prop="runtimingnum">
          <a-input v-model="form.runtimingnum" suffix="单位/次" allowClear placeholder="请输入执行频率" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="单位" prop="unit">
          <a-select v-model="form.unit" allowClear placeholder="请选择单位">
            <a-select-option value="天">天</a-select-option>
            <a-select-option value="时">时</a-select-option>
            <a-select-option value="分">分</a-select-option>
            <a-select-option value="秒">秒</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item has-feedback label="定时启动时间" prop="starttime">
          <a-date-picker v-model="form.starttime" show-time type="date" placeholder="启动时间" style="width: 100%;" @change="startChange" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="定时关闭时间" prop="endtime">
          <a-date-picker v-model="form.endtime" show-time type="date" placeholder="关闭时间" style="width: 100%;" @change="endChange" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="执行API" prop="methodpath">
          <a-input-group compact>
            <a-select style="width: 200px" placeholder="请选择工序类型" v-model="host">
              <a-select-option v-for="item in hostList" :key="item.ParamValue" :value="item.ParamValue">{{ item.ParamValue }}</a-select-option>
            </a-select>
            <a-input style="width: 200px" v-model="form.methodpath" allowClear placeholder="请输入执行API" />
          </a-input-group>
        </a-form-model-item>
        <a-form-model-item has-feedback label="请求方式" prop="method">
          <a-select v-model="form.method" allowClear placeholder="请输入请求方式">
            <a-select-option value="POST">POST</a-select-option>
            <a-select-option value="GET">GET</a-select-option>
            <a-select-option value="PUT">PUT</a-select-option>
            <a-select-option value="DELETE">DELETE</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="parameters" label="参数">
          <a-textarea v-model="form.parameters" placeholder="请输入参数" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-form-model-item>
        <!-- <a-row>
          <a-col :span="24" v-for="(formItem, index) in dynamicValidateForm" :key="index" style="border-bottom:1px #e9e9e9 solid;margin: 5px 0;padding:5px 0">
            <a-form-model-item label="参数">
              <a-input v-model="formItem.key" style="width:120px" allowClear placeholder="请输入key值" />
              <a-input v-model="formItem.value" style="width:120px;margin-left: 10px;" allowClear placeholder="请输入value值" />
              <a-icon v-if="dynamicValidateForm.length > 1" style="margin-left:10px" class="dynamic-delete-button" type="minus-circle-o" @click="removeService(formItem)" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-form-model-item v-if="!isEdit">
          <div style="text-align: center;">
            <a-button :disabled="isEdit" type="dashed" style="width: 60%;margin: 0 auto;" @click="addService"> <a-icon type="plus" />添加参数</a-button>
          </div>
        </a-form-model-item> -->
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { setJob } from "@/services/admin.js";
import { lowerJSONKey } from "@/utils/util";
import moment from "moment";
import { getParamData } from "@/services/admin.js";
export default {
  props: ["editData", "isEdit"],
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        jobname: "",
        runnum: 0,
        unit: "",
        runtimingnum: 0,
        endtime: "",
        starttime: "",
        methodpath: "",
        method: "",
        parameters: "",
      },
      ids: [],
      rules: {
        jobname: [
          {
            required: true,
            message: "请输入Job名称",
            trigger: "blur",
          },
        ],
        runnum: [
          {
            required: true,
            message: "请输入执行次数",
            trigger: "blur",
          },
        ],
        unit: [
          {
            required: true,
            message: "请选择单位",
            trigger: "change",
          },
        ],
        runtimingnum: [
          {
            required: true,
            message: "请输入执行频率",
            trigger: "blur",
          },
        ],
        starttime: [
          {
            required: true,
            message: "请选择启动时间",
            trigger: "change",
          },
        ],
        endtime: [
          {
            required: true,
            message: "请选择结束时间",
            trigger: "change",
          },
        ],
        methodpath: [
          {
            required: true,
            message: "请输入执行API",
            trigger: "blur",
          },
        ],
        method: [
          {
            required: true,
            message: "请选择请求方式",
            trigger: "blur",
          },
        ],
      },
      dynamicValidateForm: [],
      hostList: [],
      host:""
    };
  },
  created() {
    this.getProcessType();
    if (this.isEdit) {
      let newData = { ...this.editData };
      this.form = lowerJSONKey(newData);
      let matcht = /^(https?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/i
      let host = matcht.exec(this.form.methodpath);
      console.log(host)
      this.host = host[1] +  host[2] +  host[3]
      this.form.methodpath = host[4]
      // this.form.parameters = JSON.parse(this.form.parameters);
      // let parma = this.form.parameters;
      // Object.keys(parma).map((key) => {
      //   this.dynamicValidateForm.push({
      //     key: key,
      //     value: parma[key],
      //   });
      // });
    }
  },
  methods: {
    getProcessType() {
      let params = {
        groupcode: "JOB_SCHEDULER_SERVER",
      };
      getParamData(params).then((res) => {
        if (res.data.success) {
          this.hostList = res.data.data;
        }
      });
    },
    addService() {
      this.dynamicValidateForm.push({
        key: "",
        value: "",
      });
    },
    close() {
      this.$emit("closeModal");
    },
    handleCancel() {
      this.$emit("closeModal");
    },
    startChange(e) {
      this.form.starttime = moment(e);
    },
    endChange(e) {
      this.form.endtime = moment(e);
    },
    handleOk() {
      console.log(this.form);
      this.$refs.ruleForm.validate((valid) => {
        console.log("valid===", valid);
        if (valid) {
          if (this.isEdit) {
            let editForm = {
              id: this.editData.Id,
              jobname: this.form.jobname,
              runnum: this.form.runnum,
              runtimingnum: this.form.runtimingnum,
              starttime: this.form.starttime,
              methodpath: this.host + this.form.methodpath,
              method: this.form.method,
              unit: this.form.unit,
              endtime: this.form.endtime,
              parameters: this.form.parameters,
            };
            // let obj = {};
            // this.dynamicValidateForm.forEach((item) => {
            //   obj[item.key] = item.value;
            // });
            // editForm.parameters = obj;
            setJob(editForm, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.$emit("closeModal");
                this.$emit("success");
                this.visible = false;
              }
            });
          } else {
            //添加
            // let obj = {};
            // this.dynamicValidateForm.forEach((item) => {
            //   // console.log(this.form.parameters[item.key]);
            //   // str += item.key + ":" + item.value + ",";
            //   obj[item.key] = item.value;
            // });
            // console.log(obj);
            // this.form.parameters = obj;
            this.form.methodpath = this.host + this.form.methodpath
            this.form.parameters = setJob(this.form, "add").then((res) => {
              if (res.data.success) {
                this.$message.success("添加成功!");
                this.$emit("closeModal");
                this.$emit("success");
                this.visible = false;
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
/deep/.ant-form-item {
  margin-bottom: 5px;
}
</style>
