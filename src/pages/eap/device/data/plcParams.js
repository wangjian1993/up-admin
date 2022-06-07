/*
 * @Author: max
 * @Date: 2022-05-05 11:32:50
 * @LastEditTime: 2022-06-07 08:56:18
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/eap/device/data/plcParams.js
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
    title: "参数类型",
    dataIndex: "ParamsTypeName",
    scopedSlots: { customRender: "ParamsTypeName" },
    align: "center",
  },
  {
    title: "参数名称",
    dataIndex: "VarName",
    scopedSlots: { customRender: "VarName" },
    align: "center",
  },
  {
    title: "参数编码",
    dataIndex: "VarCode",
    scopedSlots: { customRender: "VarCode" },
    align: "center",
  },
  {
    title: "参数描述",
    dataIndex: "VarDesc",
    scopedSlots: { customRender: "VarDesc" },
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
    title: "数据类型",
    dataIndex: "VarDataType",
    scopedSlots: { customRender: "VarDataType" },
    align: "center",
  },
  {
    title: "数据长度",
    dataIndex: "VarDataTypeLen",
    scopedSlots: { customRender: "VarDataTypeLen" },
    align: "center",
  },
  {
    title: "数据经度",
    dataIndex: "VarDataTypeAccuracy",
    scopedSlots: { customRender: "VarDataTypeAccuracy" },
    align: "center",
  },
  {
    title: "最大值",
    dataIndex: "VarMaxValue",
    scopedSlots: { customRender: "VarMaxValue" },
    align: "center",
  },
  {
    title: "最小值",
    dataIndex: "VarMinValue",
    scopedSlots: { customRender: "VarMinValue" },
    align: "center",
  },
  {
    title: "默认值",
    dataIndex: "VarStandardValue",
    scopedSlots: { customRender: "VarStandardValue" },
    align: "center",
  },
  {
    title: "参数单位",
    dataIndex: "VarUnit",
    scopedSlots: { customRender: "VarUnit" },
    align: "center",
  },
  {
    title: "是否必填",
    dataIndex: "VarIsMust",
    scopedSlots: { customRender: "VarIsMust" },
    align: "center",
  },
  {
    title: "PLC权限",
    dataIndex: "VarPlcAuth",
    scopedSlots: { customRender: "VarPlcAuth" },
    align: "center",
  },
  {
    title: "上位机权限",
    dataIndex: "UpperComputerAuth",
    scopedSlots: { customRender: "UpperComputerAuth" },
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
      return str[0] +" "+ time[0];
    }
  },
  {
    title: "创建人",
    dataIndex: "UserCreated",
    scopedSlots: { customRender: "UserCreated" },
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];