<template>
  <div>
    <a-drawer :visible="visible" placement="right" :get-container="false" :wrap-style="{ position: 'absolute' }" width="100%" :footer="null" :closable="false" centered :bodyStyle="{ padding: '5px 10px' }">
      <div style="display:flex;justify-content: flex-end;">
        <a-button type="" @click="close">取消打印</a-button>
      </div>
      <div id="designer"></div>
    </a-drawer>
  </div>
</template>

<script>
import { getArrivalList } from "@/services/web.js";
export default {
  name: "app",
  props: ["printData"],
  data() {
    return {
      visible: true,
      isForm: false,
      jsonReport: "",
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      temp: "",
    };
  },
  created() {},
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
    getPrintData(DocNo) {
      return new Promise((resolve) => {
        let params = {
          docno: DocNo,
          count: 100,
        };
        getArrivalList(params, "print").then((res) => {
          if (res.data.success) {
            let dataJson = res.data.data.list;
            this.temp = res.data.data.template.TemplateDesign;
            resolve(dataJson);
          }
        });
      });
    },
  },
  mounted: function() {
    let fnArr = [];
    console.log("===", this.printData);
    this.printData.forEach((item) => {
      fnArr.push(this.getPrintData(item.DocNo));
    });
    let list = {
      list: [],
    };
    Promise.all(fnArr).then((res) => {
      console.log("res===", res);
      res.forEach((item) => {
        list.list.push(item);
      });
      var report = new window.Stimulsoft.Report.StiReport();
      let jsonFile = JSON.parse(this.temp);
      report.load(jsonFile);
      var dataSet = new window.Stimulsoft.System.Data.DataSet("JSON");
      dataSet.readJson(list);
      report.dictionary.databases.clear();
      report.regData("JSON", "JSON", dataSet);
      console.log("dataJson==", list);
      var options = new window.Stimulsoft.Viewer.StiViewerOptions();
      options.appearance.scrollbarsMode = true;
      options.appearance.pageBorderColor = window.Stimulsoft.System.Drawing.Color.navy;
      options.toolbar.borderColor = window.Stimulsoft.System.Drawing.Color.navy;
      options.height = "750px";
      var viewer = new window.Stimulsoft.Viewer.StiViewer(options, "StiViewer", false);
      viewer.report = report;
      viewer.renderHtml("designer");
    });
  },
};
</script>

<style></style>
