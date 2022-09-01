/*
 * @Author: max
 * @Date: 2022-05-11 11:49:33
 * @LastEditTime: 2022-08-29 17:52:43
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/productionBi/schedule/order.js
 */
export const columns = [
  {
    title: "工单",
    dataIndex: "MoCode",
    scopedSlots: { customRender: "MoCode" },
    align: "left",
    width: 120,
  },
  {
    title: "品号",
    dataIndex: "ProCode",
    scopedSlots: { customRender: "ProCode" },
    align: "left",
    width: 180,
  },
  {
    title: "品名",
    dataIndex: "ProName",
    scopedSlots: { customRender: "ProName" },
    align: "left",
    width: 250,
  },
  {
    title: "组装前加工",
    dataIndex: "PreAssemblyProcess",
    scopedSlots: { customRender: "PreAssemblyProcess" },
    align: "left",
  },
  {
    title: "组装",
    dataIndex: "AssemblyProcess",
    scopedSlots: { customRender: "AssemblyProcess" },
    align: "left",
  },
  {
    title: "老化",
    dataIndex: "AgeingProcess",
    scopedSlots: { customRender: "AgeingProcess" },
    align: "left",
  },
  {
    title: "包装",
    dataIndex: "PackingProcess",
    scopedSlots: { customRender: "PackingProcess" },
    align: "left",
  },
];