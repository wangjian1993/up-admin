/*
 * @Author: max
 * @Date: 2023-04-13 16:41:06
 * @LastEditTime: 2023-04-13 16:51:24
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/spectrum/price/data.js
 */

export const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 50,
  },
  {
    title: "品牌",
    dataIndex: "Brand",
    scopedSlots: { customRender: "Brand" },
    align: "center",
  },
  {
    title: "品号",
    dataIndex: "ItemCode",
    scopedSlots: { customRender: "ItemCode" },
    align: "center",
  },
  {
    title: "品名",
    dataIndex: "ItemName",
    scopedSlots: { customRender: "ItemName" },
    align: "center",
  },
  {
    title: "规格",
    dataIndex: "ItemSpecification",
    scopedSlots: { customRender: "ItemSpecification" },
    align: "center",
    width:350
  },
  {
    title: "光源型号",
    dataIndex: "LightSpecification",
    scopedSlots: { customRender: "LightSpecification" },
    align: "center",
  },
  {
    title: "说明",
    dataIndex: "Description",
    scopedSlots: { customRender: "Description" },
    align: "center",
  },
  {
    title: "价格",
    dataIndex: "ItemPrice",
    scopedSlots: { customRender: "ItemPrice" },
    align: "center",
  },
  {
    title: "备注",
    dataIndex: "Remark",
    scopedSlots: { customRender: "Remark" },
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];