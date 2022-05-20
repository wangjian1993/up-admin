/*
 * @Author: max
 * @Date: 2022-05-05 11:32:50
 * @LastEditTime: 2022-05-20 15:19:48
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/eap/formula/config/data.js
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
      title: "配方编码",
      dataIndex: "FormulaCode",
      scopedSlots: { customRender: "FormulaCode" },
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
      title: "品名",
      dataIndex: "ProName",
      scopedSlots: { customRender: "ProName" },
      align: "center",
    },
    {
      title: "是否配置完毕",
      dataIndex: "IsComplete",
      scopedSlots: { customRender: "IsComplete" },
      align: "center",
    },
    {
      title: "配方版本",
      dataIndex: "Version",
      scopedSlots: { customRender: "Version" },
      align: "center",
    },
    {
      title: "配方下发次数",
      dataIndex: "IssuedCount",
      scopedSlots: { customRender: "IssuedCount" },
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
      title: "最近下发时间",
      dataIndex: "DatetimeIssued",
      scopedSlots: { customRender: "DatetimeIssued" },
      align: "center",
    },
    {
      title: "最近下发人",
      dataIndex: "UserIssued",
      scopedSlots: { customRender: "UserIssued" },
      align: "center",
    },
    {
      title: "是否启用",
      dataIndex: "Enable",
      scopedSlots: { customRender: "Enable" },
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