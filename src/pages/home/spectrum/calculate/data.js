/*
 * @Author: max
 * @Date: 2022-05-11 11:49:33
 * @LastEditTime: 2023-04-22 14:27:29
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/spectrum/calculate/data.js
 */
export const columns = [
  {
    title: "序号",
    dataIndex: "Index",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 60,
  },
  {
    title: "品名",
    dataIndex: "ItemName",
    scopedSlots: { customRender: "ItemName" },
    align: "center",
    width: 200,
  },
  {
    title: "数量",
    dataIndex: "Qty",
    scopedSlots: { customRender: "Qty" },
    align: "center",
    width: 80,
  },
  {
    title: "单颗功率",
    dataIndex: "Power",
    scopedSlots: { customRender: "Power" },
    align: "center",
    width: 80,
  },
  {
    title: "上传文件",
    dataIndex: "Files",
    scopedSlots: { customRender: "Files" },
    align: "center",
    width: 360,
  },
  {
    title: "价格",
    dataIndex: "Price",
    scopedSlots: { customRender: "Price" },
    align: "center",
    width: 80,
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];