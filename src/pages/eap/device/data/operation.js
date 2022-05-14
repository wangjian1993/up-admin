/*
 * @Author: max
 * @Date: 2022-05-05 11:32:50
 * @LastEditTime: 2022-05-14 13:45:39
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/eap/device/data/operation.js
 */
// import { splitData } from "@/utils/util.js";
export const columns = [
    {
      title: "序号",
      scopedSlots: { customRender: "index" },
      align: "center",
      width:50,
    },
    {
      title: "设备编码",
      dataIndex: "EquimentCode",
      scopedSlots: { customRender: "EquimentCode" },
      align: "center",
    },
    {
      title: "设备名称",
      dataIndex: "EquimentName",
      scopedSlots: { customRender: "EquimentName" },
      align: "center",
    },
    {
      title: "PLC编码",
      dataIndex: "PlcCode",
      scopedSlots: { customRender: "PlcCode" },
      align: "center",
    },
    {
      title: "PLC型号/名称",
      dataIndex: "PlcName",
      scopedSlots: { customRender: "PlcName" },
      align: "center",
    },
    {
      title: "品号",
      dataIndex: "ProCode",
      scopedSlots: { customRender: "ProCode" },
      align: "center",
    },
    {
      title: "产品品名",
      dataIndex: "ProName",
      scopedSlots: { customRender: "ProName" },
      align: "center",
    },
    {
      title: "参数类型",
      dataIndex: "ParamsTypeName",
      scopedSlots: { customRender: "ParamsTypeName" },
      align: "center",
    },
    {
      title: "参数变量名称",
      dataIndex: "VarName",
      scopedSlots: { customRender: "VarName" },
      align: "center",
    },
    {
      title: "参数变量描述",
      dataIndex: "VarDesc",
      scopedSlots: { customRender: "VarDesc" },
      align: "center",
    },
    {
      title: "参数变量地址",
      dataIndex: "VarAddress",
      scopedSlots: { customRender: "VarAddress" },
      align: "center",
    },
    {
      title: "参数变量地址位",
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
      title: "参数类型长度",
      dataIndex: "VarDataTypeLen",
      scopedSlots: { customRender: "VarDataTypeLen" },
      align: "center",
    },
    {
      title: "参数类型精度",
      dataIndex: "VarDataTypeAccuracy",
      scopedSlots: { customRender: "VarDataTypeAccuracy" },
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
      title: "参数标准值",
      dataIndex: "VarStandardValue",
      scopedSlots: { customRender: "VarStandardValue" },
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
      fixed: "right",
      align: "center",
      width:100
    },
  ];