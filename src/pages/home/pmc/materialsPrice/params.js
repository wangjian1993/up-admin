/*
 * @Author: max
 * @Date: 2022-04-14 11:32:32
 * @LastEditTime: 2022-06-21 11:20:40
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/pmc/materialsPrice/params.js
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
      width: 280,
    },
    {
      title: "长",
      dataIndex: "LenthStr",
      scopedSlots: { customRender: "LenthStr" },
      align: "center",
    },
    {
      title: "宽",
      dataIndex: "WidthStr",
      scopedSlots: { customRender: "WidthStr" },
      align: "center",
    },
    {
      title: "厚度",
      dataIndex: "ThickStr",
      scopedSlots: { customRender: "ThickStr" },
      align: "center",
    },
    {
      title: "拼版数",
      dataIndex: "PinStr",
      scopedSlots: { customRender: "PinStr" },
      align: "center",
    },
    {
      title: "耐压",
      dataIndex: "PressStr",
      scopedSlots: { customRender: "PressStr" },
      align: "center",
    },
    {
      title: "描述",
      dataIndex: "Description",
      scopedSlots: { customRender: "Description" },
      align: "center",
      width: 280,
    },
  ];