/*
 * @Author: max
 * @Date: 2021-11-18 09:09:28
 * @LastEditTime: 2022-03-26 13:37:38
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
      title: "折扣率",
      dataIndex: "ZkRate",
      scopedSlots: { customRender: "ZkRate" },
      align: "center",
    },
    {
      title: "更新时间",
      dataIndex: "DatetimeModified",
      scopedSlots: { customRender: "DatetimeModified" },
      align: "center",
    },
    {
      title: "操作",
      scopedSlots: { customRender: "action" },
      align: "center",
      width: 190,
    },
  ];