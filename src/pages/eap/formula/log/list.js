/*
 * @Author: max
 * @Date: 2022-05-23 10:52:59
 * @LastEditTime: 2022-05-23 10:59:32
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/eap/formula/log/list.js
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
    title: "操作版本",
    dataIndex: "Version",
    scopedSlots: { customRender: "Version" },
    align: "center",
  },
  {
    title: "操作内容",
    dataIndex: "LogType",
    scopedSlots: { customRender: "LogType" },
    align: "center",
  },
  {
    title: "操作时间",
    dataIndex: "DatetimeCreated",
    scopedSlots: { customRender: "DatetimeCreated" },
    align: "center",
  },
  {
    title: "操作人",
    dataIndex: "UserCreated",
    scopedSlots: { customRender: "UserCreated" },
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "Status",
    scopedSlots: { customRender: "Status" },
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    fixed: "right",
    align: "center",
    width: 100
  },
];