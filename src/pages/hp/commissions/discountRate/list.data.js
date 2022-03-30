/*
 * @Author: max
 * @Date: 2021-11-18 09:09:28
 * @LastEditTime: 2022-03-30 13:34:46
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/hp/commissions/discountRate/list.data.js
 */
// import { splitData } from "@/utils/util.js";
export const columns = [
    {
      title: "序号",
      scopedSlots: { customRender: "index" },
      align: "center",
    },
    {
      title: "折扣选择",
      dataIndex: "ZkOptions",
      scopedSlots: { customRender: "ZkOptions" },
      align: "center",
    },
    {
      title: "折扣起含",
      dataIndex: "ZkStartLine",
      scopedSlots: { customRender: "ZkStartLine" },
      align: "center",
    },
    {
      title: "折扣至",
      dataIndex: "ZkEndLine",
      scopedSlots: { customRender: "ZkEndLine" },
      align: "center",
    },
    {
      title: "基础提成比率",
      dataIndex: "BaseTcRate",
      scopedSlots: { customRender: "BaseTcRate" },
      align: "center",
    },
    {
      title: "操作",
      scopedSlots: { customRender: "action" },
      align: "center",
      width: 190,
    },
  ];