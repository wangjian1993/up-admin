/*
 * @Author: max
 * @Date: 2023-04-13 16:41:06
 * @LastEditTime: 2023-04-25 09:53:01
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/arrival/testData/data.js
 */

export const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 50,
  },
  {
    title: "到货单号",
    dataIndex: "OrderNo",
    scopedSlots: { customRender: "OrderNo" },
    align: "center",
  },
  {
    title: "品号",
    dataIndex: "ProductNo",
    scopedSlots: { customRender: "ProductNo" },
    align: "center",
  },
  {
    title: "采购单号",
    dataIndex: "PuchaseOrderNo",
    scopedSlots: { customRender: "PuchaseOrderNo" },
    align: "center",
  },
  {
    title: "供应商代码",
    dataIndex: "SuplierCode",
    scopedSlots: { customRender: "SuplierCode" },
    align: "center",
  },
  {
    title: "供应商名称",
    dataIndex: "SuplierName",
    scopedSlots: { customRender: "SuplierName" },
    align: "center",
  },
  {
    title: "产品型号",
    dataIndex: "ProductModel",
    scopedSlots: { customRender: "ProductModel" },
    align: "center",
    width:350
  },
  {
    title: "白光分类(WHITE)",
    dataIndex: "WhiteLightClassification",
    scopedSlots: { customRender: "WhiteLightClassification" },
    align: "center",
  },
  {
    title: "IF(mA)",
    dataIndex: "IF",
    scopedSlots: { customRender: "IF" },
    align: "center",
  },
  {
    title: "VF(V)",
    dataIndex: "VF",
    scopedSlots: { customRender: "VF" },
    align: "center",
  },
  {
    title: "P(mW)",
    dataIndex: "P",
    scopedSlots: { customRender: "P" },
    align: "center",
  },
  {
    title: "光通量Φ(lm)",
    dataIndex: "LightQuantity",
    scopedSlots: { customRender: "LightQuantity" },
    align: "center",
  },
  {
    title: "色坐标 x",
    dataIndex: "X",
    scopedSlots: { customRender: "X" },
    align: "center",
  },
  {
    title: "色坐标 y",
    dataIndex: "Y",
    scopedSlots: { customRender: "Y" },
    align: "center",
  },
  {
    title: "光效(lm/W)",
    dataIndex: "LightEffect",
    scopedSlots: { customRender: "LightEffect" },
    align: "center",
  },
  {
    title: "Ip",
    dataIndex: "Ip",
    scopedSlots: { customRender: "Ip" },
    align: "center",
  },
  {
    title: "色温(K)",
    dataIndex: "ColorTemperature",
    scopedSlots: { customRender: "ColorTemperature" },
    align: "center",
  },
  {
    title: "平均波长(nm)",
    dataIndex: "MeanWavelength",
    scopedSlots: { customRender: "MeanWavelength" },
    align: "center",
  },
  {
    title: "Φe(mW)",
    dataIndex: "E",
    scopedSlots: { customRender: "E" },
    align: "center",
  },
   {
    title: "峰值波长(nm)",
    dataIndex: "PeakWavelength",
    scopedSlots: { customRender: "PeakWavelength" },
    align: "center",
  },
  {
    title: "半波宽(nm)",
    dataIndex: "HalfWaveWidth",
    scopedSlots: { customRender: "HalfWaveWidth" },
    align: "center",
  },
  {
    title: "色容差 SDCM",
    dataIndex: "SDCM",
    scopedSlots: { customRender: "SDCM" },
    align: "center",
  },
  {
    title: "Ra",
    dataIndex: "Ra",
    scopedSlots: { customRender: "Ra" },
    align: "center",
  },
  {
    title: "R1",
    dataIndex: "R1",
    scopedSlots: { customRender: "R1" },
    align: "center",
  },
  {
    title: "R2",
    dataIndex: "R2",
    scopedSlots: { customRender: "R2" },
    align: "center",
  },
  {
    title: "R3",
    dataIndex: "R3",
    scopedSlots: { customRender: "R3" },
    align: "center",
  },
  {
    title: "R4",
    dataIndex: "R4",
    scopedSlots: { customRender: "R4" },
    align: "center",
  },
  {
    title: "R5",
    dataIndex: "R5",
    scopedSlots: { customRender: "R5" },
    align: "center",
  },
  {
    title: "R6",
    dataIndex: "R6",
    scopedSlots: { customRender: "R6" },
    align: "center",
  },
  {
    title: "R7",
    dataIndex: "R7",
    scopedSlots: { customRender: "R7" },
    align: "center",
  },
  {
    title: "R8",
    dataIndex: "R8",
    scopedSlots: { customRender: "R8" },
    align: "center",
  },
  {
    title: "R9",
    dataIndex: "R9",
    scopedSlots: { customRender: "R9" },
    align: "center",
  },
  {
    title: "R10",
    dataIndex: "R10",
    scopedSlots: { customRender: "R10" },
    align: "center",
  },
  {
    title: "R11",
    dataIndex: "R11",
    scopedSlots: { customRender: "R11" },
    align: "center",
  },
  {
    title: "R12",
    dataIndex: "R12",
    scopedSlots: { customRender: "R12" },
    align: "center",
  },
  {
    title: "R13",
    dataIndex: "R13",
    scopedSlots: { customRender: "R13" },
    align: "center",
  },
  {
    title: "R14",
    dataIndex: "R14",
    scopedSlots: { customRender: "R14" },
    align: "center",
  },
  {
    title: "R15",
    dataIndex: "R15",
    scopedSlots: { customRender: "R15" },
    align: "center",
  },
  {
    title: "时间",
    dataIndex: "Date",
    scopedSlots: { customRender: "Date" },
    align: "center",
  },
];