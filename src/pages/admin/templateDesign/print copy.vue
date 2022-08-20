<template>
  <div>
    <a-modal :title="isEdit ? '编辑应用' : '添加应用'" v-if="isForm" :visible="isForm" :width="800" centered :confirm-loading="confirmLoading" @ok="handleOk" @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="12">
            <a-form-model-item ref="AppName" has-feedback label="模板名称" prop="AppName">
              <a-input v-model="form.AppName" placeholder="请输入模板名称" allowClear />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item ref="AppName" has-feedback label="模板编码" prop="AppName">
              <a-input v-model="form.AppName" placeholder="请输入模板编码" allowClear />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item ref="AppTypeId" has-feedback label="模板类型" prop="AppTypeId">
              <a-select v-model="form.AppTypeId" placeholder="请选择模板类型" @change="appTypeChange">
                <a-select-option v-for="item in appTypeList" :key="item.AppTypeId" :value="item.AppTypeId">{{ item.AppTypeName }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item ref="AppTypeId" has-feedback label="机构" prop="AppTypeId">
              <a-select v-model="form.AppTypeId" placeholder="请选择机构" @change="appTypeChange">
                <a-select-option v-for="item in appTypeList" :key="item.AppTypeId" :value="item.AppTypeId">{{ item.AppTypeName }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item ref="AppTypeId" has-feedback label="公司" prop="AppTypeId">
              <a-select v-model="form.AppTypeId" placeholder="请选择公司" @change="appTypeChange">
                <a-select-option v-for="item in appTypeList" :key="item.AppTypeId" :value="item.AppTypeId">{{ item.AppTypeName }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>
    <a-drawer :visible="visible" placement="right" :get-container="false" :wrap-style="{ position: 'absolute' }" width="100%" :footer="null" :closable="false" centered :bodyStyle="{ padding: '5px 10px' }">
      <div style="display:flex;justify-content: flex-end">
        <a-button style="margin-right:10px;" type="primary" @click="save">保存模板</a-button>
        <a-button type="" @click="close">关闭</a-button>
      </div>
      <!-- <button @click="setJson">设置JSON</button> -->
      <div id="designer"></div>
    </a-drawer>
  </div>
</template>

<script>
export default {
  name: "app",
  props: ["isEdit"],
  data() {
    return {
      visible: true,
      isForm: false,
      jsonReport: "",
    };
  },
  methods: {
    close() {
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
    window.Stimulsoft.Base.StiLicense.key =
      "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHkcgIvwL0jnpsDqRpWg5FI5kt2G7A0tYIcUygBh1sPs7plofUOqPB1a4HBIXJB621mau2oiAIj+ysU7gKUXfjn/D5BocmduNB+ZMiDGPxFrAp3PoD0nYNkkWh8r7gBZ1v/JZSXGE3bQDrCQCNSy6mgby+iFAMV8/PuZ1z77U+Xz3fkpbm6MYQXYp3cQooLGLUti7k1TFWrnawT0iEEDJ2iRcU9wLqn2g9UiWesEZtKwI/UmEI2T7nv5NbgV+CHguu6QU4WWzFpIgW+3LUnKCT/vCDY+ymzgycw9A9+HFSzARiPzgOaAuQYrFDpzhXV+ZeX31AxWlnzjDWqpfluygSNPtGul5gyNt2CEoJD1Yom0VN9fvRonYsMsimkFFx2AwyVpPcs+JfVBtpPbTcZscnzUdmiIvxv8Gcin6sNSibM6in/uUKFt3bVgW/XeMYa7MLGF53kvBSwi78poUDigA2n12SmghLR0AHxyEDIgZGOTbNI33GWu7ZsPBeUdGu55R8w=";
    var options = new window.Stimulsoft.Designer.StiDesignerOptions();
    options.appearance.scrollbarsMode = true;
    options.toolbar.showDesignButton = true;
    options.toolbar.printDestination = window.Stimulsoft.Viewer.StiPrintDestination.Direct;
    options.appearance.htmlRenderMode = window.Stimulsoft.Report.Export.StiHtmlExportMode.Table;
    var designer = new window.Stimulsoft.Designer.StiDesigner(options, "StiDesigner", false);
    designer.renderHtml("designer");
    designer.onSaveReport = (args) => {
      this.isForm = true;
      this.jsonReport = args.report.saveToJsonString(); //拿到当前设计的这个模板的jsonfile
      //   console.log("jsonReport===", jsonReport);
    };
  },
};
</script>

<style></style>
