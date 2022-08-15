<template>
  <div id="app">
    <div>
      <div id="designer"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {};
  },
  //   mounted: function() {
  //     console.log("加载查看器视图");
  //     // 工具栏
  //     console.log("创建具有默认选项的报表查看器");
  //     var viewer = new window.Stimulsoft.Viewer.StiViewer(null, "StiViewer", false);

  //     // 报表
  //     console.log("创建一个新的报表实例");
  //     var report = new window.Stimulsoft.Report.StiReport();

  //     // 加载文件
  //     console.log("从url加载报告");
  //     report.loadFile("./reports/SimpleList.mrt");

  //     // 创建报表
  //     console.log("将报表分配给查看器，报表将在呈现查看器之后自动生成 ");
  //     viewer.report = report;

  //     // 注入标签
  //     console.log("将查看器呈现给选定的元素");
  //     viewer.renderHtml("viewer");

  //     console.log("加载成功完成!");
  //   },
  methods: {
    // 调用打印机打印数据
    print() {
      var report = new window.Stimulsoft.Report.StiReport();
      report.loadFile("/reports/SimpleList.mrt");
      report.print();
    },
    // 导出保存数据
    save() {
      var report = new window.Stimulsoft.Report.StiReport();
      report.loadFile("/reports/SimpleList.mrt");
      // 将呈现的报告保存为JSON字符串
      var json = report.saveDocumentToJsonString();
      console.log("json", json);
      // 获取报告文件名
      var fileName = report.reportAlias ? report.reportAlias : report.reportName;
      console.log("report.reportName", report.reportName);
      console.log("report.reportAlias", report.reportAlias);
      console.log("fileName", fileName);
      // 将数据保存到文件
      window.Stimulsoft.System.StiObject.saveAs(json, fileName + ".mdc", "application/json;charset=utf-8");
    },
    // 获取json数据并写入页面
    setJson() {
      var report = new window.Stimulsoft.Report.StiReport();

      // report.loadFile("/reports/SimpleList.mrt");// 官方数据模板
      report.loadFile("/reports/Test.mrt"); // 自己的数据模板

      // 创建新的DataSet对象
      var dataSet = new window.Stimulsoft.System.Data.DataSet("JSON");
      // 将JSON数据文件从指定的URL加载到DataSet对象

      // dataSet.readJsonFile("/reports/Demo.json");//官方数据
      dataSet.readJsonFile("/reports/Test.json"); // 自己的json数据

      //文件用上面的readJsonFile方式导入，接口网络请求用下面这种方式进行导入
      // let json=/*此处省略获取数据请求*/
      // dataSet.readJson(JSON.stringify(json));

      // 清除报告模板中数据
      report.dictionary.databases.clear();

      // 注册数据集对象
      report.regData("JSON", "JSON", dataSet);

      // 用注册数据呈现报表
      // report.render();
      // 工具栏
      var viewer = new window.Stimulsoft.Viewer.StiViewer(null, "StiViewer", false);
      // 创建报表
      viewer.report = report;
      // 注入标签
      viewer.renderHtml("viewer");
    },
  },
  mounted: function() {
    console.log("Loading Designer view");

    console.log("Set full screen mode for the designer");
    window.Stimulsoft.Base.StiLicense.key =
      "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHkcgIvwL0jnpsDqRpWg5FI5kt2G7A0tYIcUygBh1sPs7plofUOqPB1a4HBIXJB621mau2oiAIj+ysU7gKUXfjn/D5BocmduNB+ZMiDGPxFrAp3PoD0nYNkkWh8r7gBZ1v/JZSXGE3bQDrCQCNSy6mgby+iFAMV8/PuZ1z77U+Xz3fkpbm6MYQXYp3cQooLGLUti7k1TFWrnawT0iEEDJ2iRcU9wLqn2g9UiWesEZtKwI/UmEI2T7nv5NbgV+CHguu6QU4WWzFpIgW+3LUnKCT/vCDY+ymzgycw9A9+HFSzARiPzgOaAuQYrFDpzhXV+ZeX31AxWlnzjDWqpfluygSNPtGul5gyNt2CEoJD1Yom0VN9fvRonYsMsimkFFx2AwyVpPcs+JfVBtpPbTcZscnzUdmiIvxv8Gcin6sNSibM6in/uUKFt3bVgW/XeMYa7MLGF53kvBSwi78poUDigA2n12SmghLR0AHxyEDIgZGOTbNI33GWu7ZsPBeUdGu55R8w=";
    var options = new window.Stimulsoft.Designer.StiDesignerOptions();
    // options.appearance.fullScreenMode = false;
    options.appearance.scrollbarsMode = true;
    options.toolbar.showDesignButton = true;
    options.toolbar.printDestination = window.Stimulsoft.Viewer.StiPrintDestination.Direct;
    options.appearance.htmlRenderMode = window.Stimulsoft.Report.Export.StiHtmlExportMode.Table;
    console.log("Create the report designer with specified options");
    var designer = new window.Stimulsoft.Designer.StiDesigner(options, "StiDesigner", false);
    
    console.log("Create a new report instance");
    var report = new window.Stimulsoft.Report.StiReport();
//  var cultureName = "zh-CN";
    // console.log("designer=====",designer)
    // report.localizeReport(cultureName);
    console.log("Load report from url");
    report.loadFile("./reports/SimpleList.mrt");

    console.log("Edit report template in the designer");
    designer.report = report;

    console.log("Rendering the viewer to selected element");
    designer.renderHtml("designer");

    console.log("Loading completed successfully!");
  },
};
</script>

<style></style>
