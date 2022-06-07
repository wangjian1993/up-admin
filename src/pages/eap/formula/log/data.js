/*
 * @Author: max
 * @Date: 2022-05-05 11:32:50
 * @LastEditTime: 2022-06-07 09:31:20
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/eap/formula/log/data.js
 */
// import { splitData } from "@/utils/util.js";
export const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 50,
  },
  {
    title: "生产工厂",
    dataIndex: "PlantName",
    scopedSlots: { customRender: "PlantName" },
    align: "center",
  },
  {
    title: "车间",
    dataIndex: "WorkshopName",
    scopedSlots: { customRender: "WorkshopName" },
    align: "center",
  },
  {
    title: "产线",
    dataIndex: "LineName",
    scopedSlots: { customRender: "LineName" },
    align: "center",
  },
  {
    title: "设备名称",
    dataIndex: "EquimentName",
    scopedSlots: { customRender: "EquimentName" },
    align: "center",
  },

  {
    title: "配方名称",
    dataIndex: "FormulaName",
    scopedSlots: { customRender: "FormulaName" },
    align: "center",
  },
  {
    title: "品号",
    dataIndex: "ProCode",
    scopedSlots: { customRender: "ProCode" },
    align: "center",
  },
  {
    title: "PLC名称",
    dataIndex: "PlcName",
    scopedSlots: { customRender: "PlcName" },
    align: "center",
  },
  {
    title: "配方参数名称",
    dataIndex: "VarName",
    scopedSlots: { customRender: "VarName" },
    align: "center",
  },
  {
    title: "参数地址",
    dataIndex: "VarAddress",
    scopedSlots: { customRender: "VarAddress" },
    align: "center",
  },
  {
    title: "参数地址位",
    dataIndex: "VarAddressBit",
    scopedSlots: { customRender: "VarAddressBit" },
    align: "center",
  },
  {
    title: "参数数据类型",
    dataIndex: "VarDataType",
    scopedSlots: { customRender: "VarDataType" },
    align: "center",
  },
  {
    title: "参数长度",
    dataIndex: "VarDataSize",
    scopedSlots: { customRender: "VarDataSize" },
    align: "center",
  },
  {
    title: "参数精度",
    dataIndex: "VarDataAccuuacy",
    scopedSlots: { customRender: "VarDataAccuuacy" },
    align: "center",
  },
  {
    title: "参数标准值",
    dataIndex: "VarStdValue",
    scopedSlots: { customRender: "VarStdValue" },
    align: "center",
  },
  {
    title: "参数最大值",
    dataIndex: "VarMaxValue",
    scopedSlots: { customRender: "VarMaxValue" },
    align: "center",
  },
  {
    title: "参数最小值",
    dataIndex: "VarMinValue",
    scopedSlots: { customRender: "VarMinValue" },
    align: "center",
  },
  {
    title: "参数单位",
    dataIndex: "VarUnit",
    scopedSlots: { customRender: "VarUnit" },
    align: "center",
  },
  {
    title: "配方旧值",
    dataIndex: "VarValue",
    scopedSlots: { customRender: "VarValue" },
    align: "center",
  },
  {
    title: "当前配方值",
    dataIndex: "VarOldValue",
    scopedSlots: { customRender: "VarOldValue" },
    align: "center",
  },
  {
    title: "创建人",
    dataIndex: "[UserCreatedName:",
    scopedSlots: { customRender: "[UserCreatedName:" },
    align: "center",
  },
  {
    title: "创建时间",
    dataIndex: "DatetimeCreated",
    scopedSlots: { customRender: "DatetimeCreated" },
    align: "center",
    customRender: (text) => {
      let str = text.split('T');
      let time = str[1].split('.')
      return str[0] + " " + time[0];
    }
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    fixed: "right",
    align: "center",
    width: 100
  },
];