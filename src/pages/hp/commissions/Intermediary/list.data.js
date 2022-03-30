/*
 * @Author: max
 * @Date: 2021-11-18 09:09:28
 * @LastEditTime: 2022-03-28 14:23:49
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/hp/commissions/Intermediary/list.data.js
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
      dataIndex: "MoNo",
      scopedSlots: { customRender: "MoNo" },
      align: "center",
    },
    {
      title: "合同号",
      dataIndex: "ctrno",
      scopedSlots: { customRender: "ctrno" },
      align: "center",
    },
    {
      title: "金额",
      dataIndex: "CrtAmt",
      scopedSlots: { customRender: "CrtAmt" },
      align: "center",
    },
    {
      title: "合同时间",
      dataIndex: "CrtDate",
      scopedSlots: { customRender: "CrtDate" },
      align: "center",
    },
    {
      title: "录入时间",
      dataIndex: "DatetimeCreated",
      scopedSlots: { customRender: "DatetimeCreated" },
      align: "center",
    },
    {
      title: "操作",
      scopedSlots: { customRender: "action" },
      align: "center",
      width: 190,
    },
  ];