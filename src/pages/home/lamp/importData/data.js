/*
 * @Author: max
 * @Date: 2022-05-11 11:49:33
 * @LastEditTime: 2023-03-22 15:53:58
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/lamp/importData/data.js
 */
export const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
  },
  {
    title: "位号",
    dataIndex: "PlaceCode",
    scopedSlots: { customRender: "PlaceCode" },
    align: "center",
  },
  {
    title: "规格/型号/版本号",
    dataIndex: "ItemSpecification",
    scopedSlots: { customRender: "ItemSpecification" },
    align: "center",
  },
  {
    title: "物料编码",
    dataIndex: "ItemCode",
    scopedSlots: { customRender: "ItemCode" },
    align: "center",
  },
  {
    title: "尺寸",
    dataIndex: "Size",
    scopedSlots: { customRender: "Size" },
    align: "center",
  },
  {
    title: "备注/拼版",
    dataIndex: "Remark",
    scopedSlots: { customRender: "Remark" },
    align: "center",
  },
];