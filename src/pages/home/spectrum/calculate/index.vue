<!--
 * @Author: max
 * @Date: 2022-05-11 11:40:06
 * @LastEditTime: 2023-04-24 15:12:40
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/spectrum/calculate/index.vue
-->
<template>
  <div>
    <a-spin tip="导出中..." :spinning="isExportLod">
      <a-row>
        <a-col :span="18">
          <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
            <div class="operator">
              <a-button type="primary" icon="export" :disabled="!isCalculate" @click="exportExcel">导出汇总数据</a-button>
              <a-button style="margin-left: 10px;" type="primary" :disabled="!isCalculate" icon="export" @click="exportFn">导出计算结果</a-button>
              <a-button style="margin-left: 10px;" type="primary" @click="calculate" icon="export">计算</a-button>
              <a-button style="margin-left: 10px;" @click="reset" icon="export">重置</a-button>
            </div>
            <a-table :columns="columns" :data-source="dataSource" size="small" :loading="loading" :pagination="false" :rowKey="(dataSource) => dataSource.Id" bordered>
              <template slot="index" slot-scope="text, record, index">
                <div>
                  <span>光源{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
                </div>
              </template>
              <template slot="Qty" slot-scope="text, record">
                <a-input-number :min="0" v-model="record.Qty" style="width: 80px;" />
              </template>
              <template slot="Power" slot-scope="text, record">
                <a-input-number :min="0" v-model="record.Power" style="width: 80px;" />
              </template>
              <template slot="Files" slot-scope="text, record, index">
                <div style="display:flex;">
                  <a-upload name="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" :data="{ fileIndex: index }" :custom-request="uploadFile" :remove="removeFile" :fileList="record.fileList">
                    <a-button> <a-icon type="upload" />添加光源文件 </a-button>
                  </a-upload>
                </div>
              </template>
              <template slot="action" slot-scope="text, record, index">
                <div>
                  <a style="margin-right: 8px" @click="addTable()">
                    <a-icon type="plus" />
                    新增
                  </a>
                  <a-popconfirm title="确定删除?" v-if="dataSource.length > 1" @confirm="() => onDelete(index)">
                    <a style="margin-right: 8px">
                      <a-icon type="delete" />
                      删除
                    </a>
                  </a-popconfirm>
                </div>
              </template>
            </a-table>
          </a-card>
          <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
            <a-descriptions layout="vertical" bordered :column="5" size="small">
              <a-descriptions-item label="总功率(W)">
                {{ totalPower }}
              </a-descriptions-item>
              <a-descriptions-item label="总光子通量(μmol/s)380-780nm">
                {{ total380 }}
              </a-descriptions-item>
              <a-descriptions-item label="光子通量效率(μmol/s/W)380-780nm">
                {{ totalRatio380 }}
              </a-descriptions-item>
              <a-descriptions-item label="总光子通量(μmol/s)400-700nm">
                {{ total400 }}
              </a-descriptions-item>
              <a-descriptions-item label="光子通量效率(μmol/s/W)400-700nm">
                {{ totalRatio400 }}
              </a-descriptions-item>
              <a-descriptions-item label="*热阻效率">
                <a-input-number :min="0" v-model="wastage" />
              </a-descriptions-item>
              <a-descriptions-item label="*光学器件效率">
                <a-input-number :min="0" v-model="DeviceEfficiency" />
              </a-descriptions-item>
              <a-descriptions-item label="*电源效率">
                <a-input-number :min="0" v-model="powerSupply" />
              </a-descriptions-item>
              <a-descriptions-item label="总价">
                {{ totalPrice }}
              </a-descriptions-item>
              <a-descriptions-item label=""> </a-descriptions-item>
              <a-descriptions-item label="整灯光子通量效率380nm-780nm">
                {{ totalWhole380 }}
              </a-descriptions-item>
              <a-descriptions-item label="整灯光子通量效率400nm-700nm">
                {{ totalWhole400 }}
              </a-descriptions-item>
            </a-descriptions>
          </a-card></a-col
        >
        <a-col :span="6">
          <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
            <div ref="chartColumn" style="width:100%;height:350px;"></div>
            <a-table :columns="columns1" :data-source="photonFluxTable" size="small" :loading="loading" :pagination="false" :rowKey="(dataSource) => dataSource.Id" bordered> </a-table>
            <a-table :columns="columns2" :data-source="powerTable" size="small" :loading="loading" :pagination="false" :rowKey="(dataSource) => dataSource.Id" bordered> </a-table></a-card
        ></a-col>
      </a-row>
    </a-spin>
  </div>
</template>

<script>
import { getSpectrumPrice } from "@/services/web.js";
import { splitData } from "@/utils/util.js";
import { PublicVar } from "@/mixins/publicVar.js";
import { columns } from "./data";
import excel from "@/utils/xlsxTool.js";
import ExportExcel from "@/utils/ExportExcelJS";
import * as echarts from "echarts";
import { exportjsontoexcelMore } from "./ExportExcel.js";
const columns1 = [
  {
    title: "波段(nm)",
    dataIndex: "wave",
    scopedSlots: { customRender: "wave" },
    align: "center",
  },
  {
    title: "光子通量(μmol/s)",
    dataIndex: "total",
    scopedSlots: { customRender: "total" },
    align: "center",
  },
  {
    title: "比例",
    dataIndex: "proportion",
    scopedSlots: { customRender: "proportion" },
    align: "center",
  },
];
const columns2 = [
  {
    title: "波段(nm)",
    dataIndex: "wave",
    scopedSlots: { customRender: "wave" },
    align: "center",
  },
  {
    title: "光功率(W)",
    dataIndex: "total",
    scopedSlots: { customRender: "total" },
    align: "center",
  },
  {
    title: "比例",
    dataIndex: "proportion",
    scopedSlots: { customRender: "proportion" },
    align: "center",
  },
];
export default {
  mixins: [PublicVar],
  data() {
    return {
      scrollY: "",
      advanced: true,
      columns,
      columns1,
      columns2,
      tableMax: "", //最大值
      newDataSource: [], //新数组
      total380: 0, //光子通量 380
      total400: 0, //光子通量400
      totalWhole380: 0, //整灯光子通量 380
      totalWhole400: 0, //整灯光子通量400
      totalRatio380: 0, //光子通量效率 380
      totalRatio400: 0, //光子通量效率400
      totalPower: 0, //总功率
      totalPrice: 0, //总价
      wastage: 0, //热阻损耗
      DeviceEfficiency: 0, //光学器件效率
      powerSupply: 0, //电源效率
      coordinateTotalY: 0, //纵坐标总和
      photonFluxTotal: 0, //光子通量总和
      totalQty: 0,
      dataSource: [
        {
          ItemName: "",
          Qty: 0,
          Power: 0,
          Files: [],
          Price: "",
          fileList: [],
          fileName: "",
          ItemCode: "",
        },
      ],
      photonFluxTable: [],
      powerTable: [],
      waveArray: ["380-399", "400-499", "500-599", "600-699", "700-780"],
      isExportLod: false,
      chartColumn: null,
      eChartsDataX: [],
      eChartsDataY: [],
      rgbArray: [],
      isCalculate: false,
    };
  },
  created() {
    // this.keyupSubmit();
  },
  mounted() {
    // this.initChart();
  },
  methods: {
    // keyupSubmit() {
    //   document.onkeydown = () => {
    //     let _key = window.event.keyCode;
    //     //!this.clickState是防止用户重复点击回车
    //     if (_key === 13) {
    //       this.dataSource.push({
    //         ItemName: "",
    //         Qty: 0,
    //         Power: 0,
    //         Files: [],
    //         Price: 0,
    //         fileList: [],
    //         fileName: "",
    //         ItemCode: "",
    //       });
    //     }
    //   };
    // },
    initChart() {
      this.chartColumn = echarts.init(this.$refs.chartColumn);
      let option = {
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.eChartsDataX,
          name: "Wavelength（nm)",
          nameLocation: "center",
          nameTextStyle: {
            padding: 6,
          },
          axisLabel: {
            interval: 99, //代表显示所有x轴标签显示
          },
        },
        tooltip: {
          trigger: "axis",
        },
        yAxis: {
          name: "Spectrum",
          type: "value",
          min: 0,
          max: 1.2,
        },
        series: [
          {
            data: this.eChartsDataY,
            type: "line",
            smooth: true,
          },
        ],
      };
      this.chartColumn.setOption(option);
    },
    splitData,
    //重置搜索
    reset() {
      this.isCalculate = false;
      this.photonFluxTable = [];
      this.powerTable = [];
      this.eChartsDataX = [];
      this.eChartsDataY = [];
      this.total380 = 0; //光子通量 380
      this.total400 = 0; //光子通量400
      this.totalWhole380 = 0; //整灯光子通量 380
      this.totalWhole400 = 0; //整灯光子通量400
      this.totalRatio380 = 0; //光子通量效率 380
      this.totalRatio400 = 0; //光子通量效率400
      this.totalPower = 0; //总功率
      this.totalPrice = 0; //总价
      this.wastage = 0; //热阻损耗
      this.DeviceEfficiency = 0; //光学器件效率
      this.powerSupply = 0; //电源效率
      this.dataSource = [
        {
          ItemName: "",
          Qty: 0,
          Power: 0,
          Files: [],
          Price: "",
          fileList: [],
          fileName: "",
          ItemCode: "",
        },
      ];
      this.chartColumn.dispose();
    },
    addTable() {
      this.dataSource.push({
        ItemName: "",
        Qty: 0,
        Power: 0,
        Files: [],
        Price: 0,
        fileList: [],
        fileName: "",
        ItemCode: "",
      });
    },
    uploadFile(file) {
      let name = file.file.name.split("_");
      this.getItemName(name[0], file.data.fileIndex);
      // console.log("file---", file);
      this.dataSource[file.data.fileIndex].fileName = file.file.name;
      this.dataSource[file.data.fileIndex].ItemCode = name[0];
      this.dataSource[file.data.fileIndex].uid = file.file.uid;
      let fileList = [...this.dataSource[file.data.fileIndex].fileList, file.file];
      this.dataSource[file.data.fileIndex].fileList = fileList.slice(-1);
      // this.dataSource[file.data.fileIndex].fileName = name[0];
      const reader = new FileReader();
      reader.readAsArrayBuffer(file.file);
      reader.onload = (e) => {
        const data = e.target.result;
        const { results } = excel.read(data, "array");
        this.dataSource[file.data.fileIndex].Files = results;
        this.isUpload = false;
      };
    },
    getItemName(code, index) {
      getSpectrumPrice({ itemcode: code }, "singlebyitemcode").then((res) => {
        if (res.data.success) {
          this.dataSource[index].ItemName = res.data.data.ItemName;
          this.dataSource[index].Price = res.data.data.ItemPrice;
        }
      });
    },
    removeFile(file) {
      // this.dataSource = this.dataSource.filter((item) => item.uid !== file.uid);
      this.dataSource.forEach((item) => {
        if (item.uid == file.uid) {
          item.Price = 0;
          item.ItemName = "";
          item.fileName = "";
          item.ItemCode = "";
          item.uid = "";
          item.fileList = [];
          item.Files = [];
        }
      });
      this.isCalculate = false;
      this.photonFluxTable = [];
      this.powerTable = [];
      this.eChartsDataX = [];
      this.eChartsDataY = [];
      this.total380 = 0; //光子通量 380
      this.total400 = 0; //光子通量400
      this.totalWhole380 = 0; //整灯光子通量 380
      this.totalWhole400 = 0; //整灯光子通量400
      this.totalRatio380 = 0; //光子通量效率 380
      this.totalRatio400 = 0; //光子通量效率400
      this.totalPower = 0; //总功率
      this.totalPrice = 0; //总价
      this.wastage = 0; //热阻损耗
      this.DeviceEfficiency = 0; //光学器件效率
      this.powerSupply = 0; //电源效率
      this.chartColumn.dispose();
    },
    //单个删除
    onDelete(index) {
      this.dataSource.splice(index, 1);
    },
    //计算excel数据
    calculate() {
      this.photonFluxTable = [];
      this.newDataSource = [];
      this.powerTable = [];
      this.eChartsDataX = [];
      this.eChartsDataY = [];
      this.total380 = 0; //光子通量 380
      this.total400 = 0; //光子通量400
      this.totalWhole380 = 0; //整灯光子通量 380
      this.totalWhole400 = 0; //整灯光子通量400
      this.totalRatio380 = 0; //光子通量效率 380
      this.totalRatio400 = 0; //光子通量效率400
      this.totalPower = 0; //总功率
      this.totalPrice = 0; //总价
      this.coordinateTotalY = 0;
      let flag = false;
      let msg = "";
      if (this.chartColumn) {
        this.chartColumn.dispose();
      }
      this.dataSource.forEach((res, index) => {
        if (res.Qty == 0) {
          flag = true;
          msg = "第" + (index + 1) + "行请填写数量";
        }
        if (res.Power == 0) {
          flag = true;
          msg = "第" + (index + 1) + "行请填写功率";
        }
        if (res.Files == "") {
          flag = true;
          msg = "第" + (index + 1) + "行请上次文件";
        }
        if (res.ItemName == "") {
          flag = true;
          msg = "第" + (index + 1) + "行请获取品名";
        }
        if (res.Price == 0) {
          flag = true;
          msg = "第" + (index + 1) + "行请获取价格";
        }
      });
      if (flag) {
        this.$message.warning(msg);
        return;
      }
      if (this.wastage == 0) {
        this.$message.warning("请先输入热阻损耗");
        return;
      }
      if (this.DeviceEfficiency == 0) {
        this.$message.warning("请先输入光学器件效率");
        return;
      }
      if (this.powerSupply == 0) {
        this.$message.warning("请先输入电源效率");
        return;
      }
      // console.log("this.newDataSource1===", this.newDataSource);
      //1.合并
      this.dataSource.forEach((res) => {
        // console.log("res.Files===", res.Files);
        let list = JSON.parse(JSON.stringify(res.Files));
        this.newDataSource = this.newDataSource.concat(this.efficiencyNum(list, res.Qty));
        this.totalPower += Number(res.Power * res.Qty);
        this.totalPrice += Number(res.Price * res.Qty);
      });

      this.totalPower =  this.totalPower.toFixed(4)
      this.totalPrice =  this.totalPrice.toFixed(4)
      // console.log("this.newDataSource2===", this.newDataSource);
      //2.合并数据
      this.newDataSource = this.handelData(this.newDataSource, "WL(nm)", "Spectrum(W)");
      //3.最大值
      this.tableMax = this.countMax(this.newDataSource, "Spectrum(W)");
      // console.log("this.tableMax===", this.tableMax);
      //计算纵坐标数据
      this.newDataSource.forEach((res) => {
        //y坐标
        res.coordinateY = Number(res["Spectrum(W)"] / this.tableMax);
        //光子通量
        res.photonFlux = Number((res["Spectrum(W)"] * res["WL(nm)"] * 0.000000001) / 6.626e-34 / 300000000 / 602000000000000000);
        // console.log(" res.photonFlux===", res.photonFlux.toFixed(4));
        //总功率
        this.coordinateTotalY = Number(this.coordinateTotalY + res["Spectrum(W)"]);
        // this.photonFluxTotal = Number(this.photonFluxTotal + res.coordinateY);
        if (res["WL(nm)"] >= 380 && res["WL(nm)"] <= 780) {
          this.total380 = Number(this.total380 + res.photonFlux);
        }
        if (res["WL(nm)"] >= 400 && res["WL(nm)"] <= 700) {
          this.total400 = Number(this.total400 + res.photonFlux);
        }
        this.eChartsDataX.push(res["WL(nm)"]);
        this.eChartsDataY.push(res.coordinateY);
      });
      //格式化数据
      this.total380 =  this.total380.toFixed(4)
      this.total400 =  this.total400.toFixed(4)
      this.coordinateTotalY =  this.coordinateTotalY.toFixed(4)
      // console.log("res.eChartsDataY", this.eChartsDataY);
      //计算总光子通量380-780
      //计算总光子通量400-780
      this.waveArray.forEach((res) => {
        let str = res.split("-");
        let t = this.getInterval(str[0], str[1]);
        let percent1 = (t.total1 / this.total380) * 100;
        let percent2 = (t.total2 / this.coordinateTotalY) * 100;
        //光子通量
        this.photonFluxTable.push({
          total: t.total1.toFixed(4),
          wave: res,
          proportion: percent1.toFixed(2) + "%",
          max: str[1],
          min: str[0],
        });
        //光效率
        this.powerTable.push({
          total: t.total2.toFixed(4),
          wave: res,
          proportion: percent2.toFixed(2) + "%",
          max: str[1],
          min: str[0],
        });
      });
      //合计行
      this.photonFluxTable.push({
        total: this.total380,
        wave: "合计",
        proportion: "100%",
      });
      this.powerTable.push({
        total: this.coordinateTotalY,
        wave: "合计",
        proportion: "100%",
      });
      //光子通量效率
      this.totalRatio380 = Number(this.total380 / this.totalPower);
      this.totalRatio400 = Number(this.total400 / this.totalPower);
        //格式化数据
      this.totalRatio380 =  this.totalRatio380.toFixed(4)
      this.totalRatio400 =  this.totalRatio400.toFixed(4)
      //整灯光子通量效率
      this.totalWhole380 = Number(this.totalRatio380 * this.wastage * this.DeviceEfficiency * this.powerSupply);
      this.totalWhole400 = Number(this.totalRatio400 * this.wastage * this.DeviceEfficiency * this.powerSupply);
      this.totalWhole380 =  this.totalWhole380.toFixed(4)
      this.totalWhole400 =  this.totalWhole400.toFixed(4)

      //计算光谱颜色
      for (var i = 380.0; i <= 780.0; i += 1) {
        var lambda = i; // double
        var gamma = 0.8; // double
        var intensityMax = 255.0; // double
        var res = this.lambdaToColor(lambda, gamma, intensityMax);
        var rgba = "rgb(" + res.r + ", " + res.g + ", " + res.b + ")";
        // console.log("Lambda:" + lambda + ", " + rgba + ", " + res.y);
        this.rgbArray.push({
          color: rgba,
        });
      }
      // console.log("this.rgbArray===", this.rgbArray);
      this.isCalculate = true;
      this.initChart();
    },
    //计算光效率x数量
    efficiencyNum(arr, qty) {
      arr.forEach((res) => {
        res["Spectrum(W)"] = res["Spectrum(W)"] * qty;
      });
      // console.log("arr====", arr);
      return arr;
    },
    getInterval(minScore, maxScore) {
      const data = this.newDataSource.filter((score) => score["WL(nm)"] >= minScore && score["WL(nm)"] <= maxScore);
      let total1 = 0;
      let total2 = 0;
      data.forEach((res) => {
        total1 += res.photonFlux;
        total2 += res["Spectrum(W)"];
      });
      return {
        total1,
        total2,
      };
    },
    //合并数组
    handelData(r, orgK, orgV) {
      const v = [...r];
      const aMap = new Map();
      const arr = [];
      v.forEach((e) => {
        const k = e[orgK];
        aMap.set(k, (aMap.get(k) || 0) + Number(e[orgV]));
      });
      aMap.forEach((val, key) => {
        const item = {};
        item[orgK] = key;
        item[orgV] = val;
        arr.push(item);
      });
      return arr;
    },
    //找最大值
    countMax(arr, key) {
      return Math.max.apply(
        Math,
        arr.map((item) => {
          return item[key];
        })
      );
    },
    //波长转颜色
    lambdaToColor(lambda, gamma, intensityMax) {
      if (typeof gamma == "undefined") {
        gamma = 0.8; // double
      }
      if (typeof intensityMax == "undefined") {
        intensityMax = 255.0; // double
      }
      var r, g, b, alpha; // double
      if (lambda >= 380.0 && lambda < 440.0) {
        r = (-1.0 * (lambda - 440.0)) / (440.0 - 380.0);
        g = 0.0;
        b = 1.0;
      } else if (lambda >= 440.0 && lambda < 490.0) {
        r = 0.0;
        g = (lambda - 440.0) / (490.0 - 440.0);
        b = 1.0;
      } else if (lambda >= 490.0 && lambda < 510.0) {
        r = 0.0;
        g = 1.0;
        b = (-1.0 * (lambda - 510.0)) / (510.0 - 490.0);
      } else if (lambda >= 510.0 && lambda < 580.0) {
        r = (lambda - 510.0) / (580.0 - 510.0);
        g = 1.0;
        b = 0.0;
      } else if (lambda >= 580.0 && lambda < 645.0) {
        r = 1.0;
        g = (-1.0 * (lambda - 645.0)) / (645.0 - 580.0);
        b = 0.0;
      } else if (lambda >= 645.0 && lambda <= 780.0) {
        r = 1.0;
        g = 0.0;
        b = 0.0;
      } else {
        r = 0.0;
        g = 0.0;
        b = 0.0;
      }
      // 在可见光谱的边缘处强度较低。
      if (lambda >= 380.0 && lambda < 420.0) {
        alpha = 0.3 + (0.7 * (lambda - 380.0)) / (420.0 - 380.0);
      } else if (lambda >= 420.0 && lambda < 701.0) {
        alpha = 1.0;
      } else if (lambda >= 701.0 && lambda < 780.0) {
        alpha = 0.3 + (0.7 * (780.0 - lambda)) / (780.0 - 700.0);
      } else {
        alpha = 0.0;
      }
      // 1953年在引入NTSC电视时,计算具有荧光体的监视器的亮度公式如下
      var Y = 0.212671 * r + 0.71516 * g + 0.072169 * b; // Math.round
      // 伽马射线 gamma
      // 照明强度 intensityMax
      var R = r == 0.0 ? 0 : Math.round(intensityMax * Math.pow(r * alpha, gamma));
      var G = g == 0.0 ? 0 : Math.round(intensityMax * Math.pow(g * alpha, gamma));
      var B = b == 0.0 ? 0 : Math.round(intensityMax * Math.pow(b * alpha, gamma));
      var A = alpha; // Math.round
      // return
      return { r: R, g: G, b: B, a: A, y: Y };
    },
    Export() {
      var img = new Image();
      // pieMyChart1 要导出的图表
      img.src = this.chartColumn.getDataURL({
        type: "png",
        pixelRatio: 2, //放大2倍
        backgroundColor: "#fff",
      });
      img.onload = function() {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");

        var a = document.createElement("a");
        var event = new MouseEvent("click");
        a.download = "图片.png" || "下载图片名称";
        // 将生成的URL设置为a.href属性
        a.href = dataURL;
        // 触发a的单击事件
        a.dispatchEvent(event);
        a.remove();
      };
    },
    //导出汇总数据
    exportExcel() {
      const dataSource = this.newDataSource.map((item) => {
        Object.keys(item).forEach((key) => {
          // 后端传null node写入会有问题
          if (item[key] === null) {
            item[key] = "";
          }
        });
        return item;
      });
      const header = [
        {
          key: "WL(nm)",
          title: "WL(nm)",
        },
        {
          key: "Spectrum",
          title: "Spectrum",
        },
        {
          key: "Spectrum(W)",
          title: "Spectrum(W)",
        },
        {
          key: "coordinateY",
          title: "C列归一化",
        },
        {
          key: "photonFlux",
          title: "photo flux(μmol/s)",
        },
      ];
      var timestamp = Date.parse(new Date());
      try {
        ExportExcel(header, dataSource, `光谱模拟计算-汇总数据_${timestamp}.xlsx`);
        this.$message.success("导出数据成功!");
      } catch (error) {
        // console.log(error);
        this.$message.error("导出数据失败");
      }
      this.isExportLod = false;
    },
    exportFn() {
      let _data = [];
      let excelArray = [];
      let mergeTitle = [];
      _data.push(["项目编号", "", "", "", "", "", "", "", "", "", "", ""]);
      mergeTitle.push({
        s: { r: 0, c: 1 },
        e: { r: 0, c: 11 },
      });
      const hear = ["光源", "品名", "", "数量", "单颗功率(W)", "文件名称", "", "", "", "光谱图", "", ""];
      mergeTitle.push({
        s: { r: 1, c: 1 },
        e: { r: 1, c: 2 },
      });
      mergeTitle.push({
        s: { r: 1, c: 5 },
        e: { r: 1, c: 8 },
      });
      mergeTitle.push({
        s: { r: 1, c: 9 },
        e: { r: 1, c: 11 },
      });
      _data.push(hear);
      this.dataSource.map((item, index) => {
        _data.push(["光源" + (index + 1), item.ItemName, "", item.Qty, item.Power, item.fileName, "", "", "", "", ""]);
        mergeTitle.push({
          s: { r: 2 + index, c: 1 },
          e: { r: 2 + index, c: 2 },
        });
        mergeTitle.push({
          s: { r: 2 + index, c: 5 },
          e: { r: 2 + index, c: 8 },
        });
        mergeTitle.push({
          s: { r: 2 + index, c: 9 },
          e: { r: 2 + index, c: 11 },
        });
      });
      for (let i = 0; i < 8 - this.dataSource.length; i++) {
        _data.push(["", "", "", "", "", "", "", "", "", "", ""]);
        mergeTitle.push({
          s: { r: 2 + this.dataSource.length + i, c: 1 },
          e: { r: 2 + this.dataSource.length + i, c: 2 },
        });
        mergeTitle.push({
          s: { r: 2 + this.dataSource.length + i, c: 5 },
          e: { r: 2 + this.dataSource.length + i, c: 8 },
        });
        mergeTitle.push({
          s: { r: 2 + this.dataSource.length + i, c: 9 },
          e: { r: 2 + this.dataSource.length + i, c: 11 },
        });
      }
      mergeTitle.push({
        s: { r: 2, c: 9 },
        e: { r: 11, c: 11 },
      });
      _data.push(["总功率(W)", "总光子通量(μmol/s)\n380-780nm", "", "光子通量效率(μmol/s/W)\n380-780nm", "", "总光子通量(μmol/s)\n400-700nm", "", "光子通量效率(μmol/s/W)\n400-700nm", ""]);
      mergeTitle.push({
        s: { r: 10, c: 1 },
        e: { r: 10, c: 2 },
      });
      mergeTitle.push({
        s: { r: 10, c: 3 },
        e: { r: 10, c: 4 },
      });
      mergeTitle.push({
        s: { r: 10, c: 5 },
        e: { r: 10, c: 6 },
      });
      mergeTitle.push({
        s: { r: 10, c: 7 },
        e: { r: 10, c: 8 },
      });
      _data.push([this.totalPower, this.total380, "", this.totalRatio380, "", this.total400, "", this.totalRatio400, ""]);
      // this.photonFluxTable.map((item) => {
      //   _data.push(["", "", "", "", "", "", "", "", "", item.wave, item.total, item.proportion]);
      // });
      mergeTitle.push({
        s: { r: 11, c: 1 },
        e: { r: 11, c: 2 },
      });
      mergeTitle.push({
        s: { r: 11, c: 3 },
        e: { r: 11, c: 4 },
      });
      mergeTitle.push({
        s: { r: 11, c: 5 },
        e: { r: 11, c: 6 },
      });
      mergeTitle.push({
        s: { r: 11, c: 7 },
        e: { r: 11, c: 8 },
      });
      _data.push(["热阻效率", "", "", "光学器件效率", "", "", "电源效率", "", "", "波段", "光子通量（μmol/s)", "比例"]);
      mergeTitle.push({
        s: { r: 12, c: 0 },
        e: { r: 12, c: 2 },
      });
      mergeTitle.push({
        s: { r: 12, c: 3 },
        e: { r: 12, c: 5 },
      });
      mergeTitle.push({
        s: { r: 12, c: 6 },
        e: { r: 12, c: 8 },
      });
      _data.push([this.wastage, "", "", this.DeviceEfficiency, "", "", this.powerSupply, "", "", this.photonFluxTable[0].wave, this.photonFluxTable[0].total, this.photonFluxTable[0].proportion]);
      mergeTitle.push({
        s: { r: 13, c: 0 },
        e: { r: 13, c: 2 },
      });
      mergeTitle.push({
        s: { r: 13, c: 3 },
        e: { r: 13, c: 5 },
      });
      mergeTitle.push({
        s: { r: 13, c: 6 },
        e: { r: 13, c: 8 },
      });
      _data.push(["整灯光子通量效率\n380nm-780nm", "", "", "", "", "整灯光子通量效率\n400nm-700nm", "", "", "", this.photonFluxTable[1].wave, this.photonFluxTable[1].total, this.photonFluxTable[1].proportion]);
      mergeTitle.push({
        s: { r: 14, c: 0 },
        e: { r: 14, c: 4 },
      });
      mergeTitle.push({
        s: { r: 14, c: 5 },
        e: { r: 14, c: 8 },
      });
      _data.push([this.totalWhole380, "", "", "", "", this.totalWhole400, "", "", "", this.photonFluxTable[2].wave, this.photonFluxTable[2].total, this.photonFluxTable[2].proportion]);
      mergeTitle.push({
        s: { r: 15, c: 0 },
        e: { r: 15, c: 4 },
      });
      mergeTitle.push({
        s: { r: 15, c: 5 },
        e: { r: 15, c: 8 },
      });
      _data.push(["基板串并", "", "", "", "", "", "", "", "", this.photonFluxTable[3].wave, this.photonFluxTable[3].total, this.photonFluxTable[3].proportion]);
      _data.push(["", "", "", "", "", "", "", "", "", this.photonFluxTable[4].wave, this.photonFluxTable[4].total, this.photonFluxTable[4].proportion]);
      _data.push(["", "", "", "", "", "", "", "", "", this.photonFluxTable[5].wave, this.photonFluxTable[5].total, this.photonFluxTable[5].proportion]);
      mergeTitle.push({
        s: { r: 16, c: 0 },
        e: { r: 18, c: 0 },
      });
      mergeTitle.push({
        s: { r: 16, c: 1 },
        e: { r: 18, c: 8 },
      });
      _data.push(["电源选项", "", "", "", "", "", "", "", "", "波段(nm)", "光功率(W)", "比例"]);
      _data.push(["", "", "", "", "", "", "", "", "", this.powerTable[0].wave, this.powerTable[0].total, this.powerTable[0].proportion]);
      _data.push(["", "", "", "", "", "", "", "", "", this.powerTable[1].wave, this.powerTable[1].total, this.powerTable[1].proportion]);
      _data.push(["", "", "", "", "", "", "", "", "", this.powerTable[2].wave, this.powerTable[2].total, this.powerTable[2].proportion]);
      _data.push(["", "", "", "", "", "", "", "", "", this.powerTable[3].wave, this.powerTable[3].total, this.powerTable[3].proportion]);
      _data.push(["", "", "", "", "", "", "", "", "", this.powerTable[4].wave, this.powerTable[4].total, this.powerTable[4].proportion]);
      mergeTitle.push({
        s: { r: 19, c: 0 },
        e: { r: 24, c: 0 },
      });
      mergeTitle.push({
        s: { r: 19, c: 1 },
        e: { r: 24, c: 8 },
      });
      _data.push(["备注", "", "", "", "", "", "", "", "", this.powerTable[5].wave, this.powerTable[5].total, this.powerTable[5].proportion]);
      mergeTitle.push({
        s: { r: 25, c: 0 },
        e: { r: 25, c: 0 },
      });
      mergeTitle.push({
        s: { r: 25, c: 1 },
        e: { r: 25, c: 8 },
      });
      // _data.push(["波段", "光子通量", "比例"]);
      // this.photonFluxTable.map((item) => {
      //   _data.push([item.wave, item.total, item.proportion, "", ""]);
      // });
      // _data.push(["波段", "光功率", "比例", "", ""]);
      // this.powerTable.map((item) => {
      //   _data.push([item.wave, item.total, item.proportion, "", ""]);
      // });
      const sheetCols = [{ wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
      let contentList = [];
      let merges2 = []; // 设置表格内容单元格合并
      let aoa = [..._data, ...contentList]; // 导出的数据
      let merges = [...mergeTitle, ...merges2]; // 合并单元格
      let formStyle = {};
      excelArray.push({
        Sheet: `光谱模拟计算`, // 下方tab切换名称
        data: aoa, // 表格数据
        merges, //  合并单元格
        autoWidth: false, // 自适应宽度
        formStyle: formStyle, // 特殊行或列样式
        sheetCols,
      });
      try {
        exportjsontoexcelMore({
          dataList: excelArray,
          bookType: "xlsx", // 导出类型
          filename: `光谱模拟计算-计算结果`, // 导出标题名
        });
        this.$message.success("导出数据成功!");
        this.Export();
      } catch (error) {
        this.$message.error("导出数据失败");
      }
      this.isExportLod = false;
    },
  },
};
</script>

<style scoped lang="less">
/deep/.ant-table:nth-of-type(0) {
  min-height: 62vh;
}
.ant-form-item {
  margin-bottom: 5px;
}
/deep/.ant-table {
    font-size: 14px;
}
/deep/.ant-descriptions-bordered .ant-descriptions-item-label{
  background: #C5D9F1;
}
/deep/.ant-table-thead{
  background: #C5D9F1;
}
</style>
