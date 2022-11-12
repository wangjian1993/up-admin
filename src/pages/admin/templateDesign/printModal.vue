<template>
  <div>
    <a-modal :title="isEdit ? '编辑模板' : '新增模板'" v-if="isForm" :visible="isForm" :width="600" centered @ok="handleOk" @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="24">
            <a-form-model-item ref="TemplateName" has-feedback label="模板名称" prop="TemplateName">
              <a-input v-model="form.TemplateName" placeholder="请输入模板名称" allowClear />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item ref="TemplateCode" has-feedback label="模板编码" prop="TemplateCode">
              <a-input :disabled="isEdit" v-model="form.TemplateCode" placeholder="请输入模板编码" allowClear />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item ref="TemplateType" has-feedback label="模板类型" prop="TemplateType">
              <a-select :disabled="isEdit" v-model="form.TemplateType" placeholder="请选择模板类型">
                <a-select-option v-for="item in templateType" :key="item.ParamValue" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item ref="OrgId" has-feedback label="机构类型" prop="OrgId">
              <a-select :disabled="isEdit" v-model="form.OrgId" placeholder="请选择机构类型" @change="orgChange">
                <a-select-option :value="item.EnterTypeId" v-for="item in orgList" :key="item.EnterTypeId">{{ item.EnterTypeName }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item ref="CompanyId" has-feedback label="机构名称" prop="CompanyId">
              <a-select :disabled="isEdit" v-model="form.CompanyId" placeholder="请选择机构名称">
                <a-select-option value="*">全部</a-select-option>
                <a-select-option :value="item.EnterId" v-for="item in companyList" :key="item.EnterId">{{ item.EnterName }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item ref="TemplateDesc" label="描述">
              <a-textarea v-model="form.TemplateDesc" placeholder="请输入模板描述" :auto-size="{ minRows: 3, maxRows: 5 }" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>
    <a-drawer :visible="visible" placement="right" :get-container="false" :wrap-style="{ position: 'absolute' }" width="100%" :footer="null" :closable="false" centered :bodyStyle="{ padding: '5px 10px' }">
      <div style="display:flex;justify-content: flex-end">
        <!-- <a-button style="margin-right:10px;" type="primary" @click="setJson">设置json</a-button> -->
        <a-button type="" @click="close">关闭</a-button>
      </div>
      <!-- <button @click="setJson">设置JSON</button> -->
      <div id="designer"></div>
    </a-drawer>
  </div>
</template>

<script>
import { getEnterTypeList, setTemplateAction } from "@/services/admin.js";
export default {
  name: "app",
  props: ["isEdit", "templateType", "orgList", "editData"],
  data() {
    return {
      visible: true,
      isForm: false,
      jsonReport: "",
      form: {
        TemplateCode: "",
        TemplateName: "",
        TemplateType: "",
        TemplateDesc: "",
        TemplateDesign: "",
        OrgId: "",
        CompanyId: "",
      },
      rules: {
        TemplateCode: [
          {
            required: true,
            message: "请输入模板编码",
            trigger: "blur",
          },
        ],
        TemplateName: [
          {
            required: true,
            message: "请输入模板名称",
            trigger: "blur",
          },
        ],
        TemplateType: [
          {
            required: true,
            message: "请选择模板类型",
            trigger: "blur",
          },
        ],
        OrgId: [
          {
            required: true,
            message: "请先选择机构类型",
            trigger: "blur",
          },
        ],
        CompanyId: [
          {
            required: true,
            message: "请选择机构名称",
            trigger: "blur",
          },
        ],
      },
      companyList: [],
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
  },
  created() {},
  methods: {
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            let params = {
              Id: this.form.Id,
              TemplateCode: this.form.TemplateCode,
              TemplateName: this.form.TemplateName,
              TemplateType: this.form.TemplateType,
              TemplateDesc: this.form.TemplateDesc,
              TemplateDesign: this.jsonReport,
              OrgId: this.form.OrgId,
              CompanyId: this.form.CompanyId,
            };
            setTemplateAction(params, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.isForm = false;
                this.$emit("succeed");
                this.$emit("closeModal");
              }
            });
          } else {
            this.form.TemplateDesign = this.jsonReport;
            setTemplateAction(this.form, "add").then((res) => {
              if (res.data.success) {
                this.$message.success("添加成功!");
                this.isForm = false;
                this.$emit("succeed");
                this.$emit("closeModal");
              }
            });
          }
        }
      });
    },
    handleCancel() {
      this.isForm = false;
    },
    //公司选择
    orgChange(e) {
      let item = this.orgList.find((item) => item.EnterTypeId == e);
      let params = {
        entertypecode: item.EnterTypeCode,
      };
      getEnterTypeList(params).then((res) => {
        if (res.data.success) {
          this.companyList = res.data.data;
        }
      });
    },
    close() {
      var report = new window.Stimulsoft.Report.StiReport();
      report.dictionary.databases.clear();
      this.isForm = false;
      this.$emit("closeModal");
    },
    // 调用打印机打印数据
    print() {
      var report = new window.Stimulsoft.Report.StiReport();
      report.loadFile("/reports/SimpleList.mrt");
      report.print();
    },
    // 导出保存数据
    save() {
      var report = new window.Stimulsoft.Report.StiReport();
      //   report.loadFile("SimpleList.mrt");
      //   var jsonString = report.saveToJsonString();
      //   // 将呈现的报告保存为JSON字符串
      //   console.log("json===", jsonString);
      report.loadFile("SimpleList.mrt");
      console.log("report===", report.pages);
      for (var index = 0; index < report.pages.count; index++) {
        alert(report.pages.getByIndex(index).name);
      }
    },
    // 获取json数据并写入页面
    setJson() {
      var report = new window.Stimulsoft.Report.StiReport();

      // report.loadFile("/reports/SimpleList.mrt");// 官方数据模板
      report.loadFile("/reports/SimpleList.mrt"); // 自己的数据模板

      // 创建新的DataSet对象
      var dataSet = new window.Stimulsoft.System.Data.DataSet("JSON");
      // 将JSON数据文件从指定的URL加载到DataSet对象

      // dataSet.readJsonFile("/reports/Demo.json");//官方数据
      dataSet.readJsonFile("/reports/Demo.json"); // 自己的json数据

      //文件用上面的readJsonFile方式导入，接口网络请求用下面这种方式进行导入
      // let json=/*此处省略获取数据请求*/
      // dataSet.readJson(JSON.stringify(json));

      // 清除报告模板中数据
      report.dictionary.databases.clear();

      // 注册数据集对象
      report.regData("JSON", "JSON", dataSet);

      // 用注册数据呈现报表
      // report.renderAsync();
      // 工具栏
      var viewer = new window.Stimulsoft.Viewer.StiViewer(null, "StiViewer", false);
      // // 创建报表
      viewer.report = report;
      // // 注入标签
      viewer.renderHtml("designer");
    },
  },
  mounted: function() {
    var designer = new window.Stimulsoft.Designer.StiDesigner(null, "StiDesigner", false);
    var report = new window.Stimulsoft.Report.StiReport();
    if (this.isEdit) {
      this.form = this.editData;
      let jsonFile = JSON.parse(this.editData.TemplateDesign);
      console.log("jsonFile===", jsonFile);
      report.load(jsonFile);
      designer.report = report;
    }
    designer.renderHtml("designer");
    designer.onSaveReport = (args) => {
      this.jsonReport = args.report.saveToJsonString(); //拿到当前设计的这个模板的jsonfile
      this.isForm = true;
      //   console.log("jsonReport===", jsonReport);
    };
  },
};
</script>

<style></style>
