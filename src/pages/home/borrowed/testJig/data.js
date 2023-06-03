/*
 * @Author: max
 * @Date: 2022-05-11 11:49:33
 * @LastEditTime: 2023-04-26 15:15:55
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/borrowed/testJig/data.js
 */
export const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 50,
  },
  {
    title: "编号",
    dataIndex: "No",
    scopedSlots: { customRender: "No" },
    align: "center",
  },
  {
    title: "机型",
    dataIndex: "Type",
    scopedSlots: { customRender: "Type" },
    align: "center",
  },
  {
    title: "数量",
    dataIndex: "Count",
    scopedSlots: { customRender: "Count" },
    align: "center",
  },
  {
    title: "PCB料号",
    dataIndex: "PcbNo",
    scopedSlots: { customRender: "PcbNo" },
    align: "center",
  },
  {
    title: "同源编号",
    dataIndex: "Other",
    scopedSlots: { customRender: "Other" },
    align: "center",
  },
  {
    title: "类型",
    dataIndex: "Type2",
    scopedSlots: { customRender: "Type2" },
    align: "center",
  },
  {
    title: "PCB型号",
    dataIndex: "PcbTypeNo",
    scopedSlots: { customRender: "PcbTypeNo" },
    align: "center",
  },
  {
    title: "货架",
    dataIndex: "StorageRack",
    scopedSlots: { customRender: "StorageRack" },
    align: "center",
  },
  {
    title: "位置",
    dataIndex: "Position",
    scopedSlots: { customRender: "Position" },
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "Status",
    scopedSlots: { customRender: "Status" },
    align: "center",
  },
  {
    title: "使用次数",
    dataIndex: "UseCount",
    scopedSlots: { customRender: "UseCount" },
    align: "center",
  },
  {
    title: "最近借出时间",
    dataIndex: "LastTime",
    scopedSlots: { customRender: "LastTime" },
    align: "center",
  },
  {
    title: "最近借出人",
    dataIndex: "LastUser",
    scopedSlots: { customRender: "LastUser" },
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];