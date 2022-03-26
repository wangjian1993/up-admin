/*
 * @Author: max
 * @Date: 2021-11-18 09:09:28
 * @LastEditTime: 2022-03-26 11:24:56
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/hp/commissions/discount/list.data.js
 */
// import { splitData } from "@/utils/util.js";
export const columns = [
    {
      title: "序号",
      scopedSlots: { customRender: "index" },
      align: "center",
    },
    {
      title: "订单号",
      dataIndex: "BatchNo",
      scopedSlots: { customRender: "BatchNo" },
      align: "center",
    },
    {
      title: "合同号",
      dataIndex: "PlantName",
      scopedSlots: { customRender: "PlantName" },
      align: "center",
    },
    {
      title: "折扣率",
      dataIndex: "WorkShopName",
      scopedSlots: { customRender: "WorkShopName" },
      align: "center",
    },
    {
      title: "更新时间",
      dataIndex: "LineName",
      scopedSlots: { customRender: "LineName" },
      align: "center",
    },
    {
      title: "操作",
      scopedSlots: { customRender: "action" },
      align: "center",
      width: 190,
    },
  ];