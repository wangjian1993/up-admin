/*
 * @Author: max
 * @Date: 2022-05-05 11:32:50
 * @LastEditTime: 2022-05-16 09:13:25
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/eap/device/data/operationLog.js
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
      title: "生产工厂",
      dataIndex: "EquimentCode",
      scopedSlots: { customRender: "EquimentCode" },
      align: "center",
    },
    {
      title: "车间",
      dataIndex: "EquimentName",
      scopedSlots: { customRender: "EquimentName" },
      align: "center",
    },
    {
      title: "产线",
      dataIndex: "PlcCode",
      scopedSlots: { customRender: "PlcCode" },
      align: "center",
    },
    {
      title: "配方编码",
      dataIndex: "PlcName",
      scopedSlots: { customRender: "PlcName" },
      align: "center",
    },

    {
      title: "配方名称",
      dataIndex: "ParamsTypeName",
      scopedSlots: { customRender: "ParamsTypeName" },
      align: "center",
    },
    {
      title: "品号",
      dataIndex: "VarName",
      scopedSlots: { customRender: "VarName" },
      align: "center",
    },
    {
      title: "品名",
      dataIndex: "VarCode",
      scopedSlots: { customRender: "VarCode" },
      align: "center",
    },
    {
      title: "是否配置完毕",
      dataIndex: "VarDesc",
      scopedSlots: { customRender: "VarDesc" },
      align: "center",
    },
    {
      title: "配方版本",
      dataIndex: "VarAddress",
      scopedSlots: { customRender: "VarAddress" },
      align: "center",
    },
    {
      title: "配方下发次数",
      dataIndex: "VarAddressBit",
      scopedSlots: { customRender: "VarAddressBit" },
      align: "center",
    },
    {
      title: "创建时间",
      dataIndex: "VarDataType",
      scopedSlots: { customRender: "VarDataType" },
      align: "center",
    },
    {
      title: "创建人",
      dataIndex: "VarDataTypeLen",
      scopedSlots: { customRender: "VarDataTypeLen" },
      align: "center",
    },
    {
      title: "最近下发时间",
      dataIndex: "VarDataTypeAccuracy",
      scopedSlots: { customRender: "VarDataTypeAccuracy" },
      align: "center",
    },
    {
      title: "最近下发人",
      dataIndex: "VarMaxValue",
      scopedSlots: { customRender: "VarMaxValue" },
      align: "center",
    },
    {
      title: "是否启用",
      dataIndex: "VarMinValue",
      scopedSlots: { customRender: "VarMinValue" },
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