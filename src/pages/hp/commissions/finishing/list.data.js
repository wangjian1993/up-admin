/*
 * @Author: max
 * @Date: 2021-11-18 09:09:28
 * @LastEditTime: 2022-03-29 14:24:50
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/hp/commissions/finishing/list.data.js
 */
// import { splitData } from "@/utils/util.js";
export const columns = [
    {
      title: "序号",
      scopedSlots: { customRender: "index" },
      align: "center",
    },
    {
      title: "业务员",
      dataIndex: "EmployeeName",
      scopedSlots: { customRender: "EmployeeName" },
      align: "center",
    },
    {
      title: "工号",
      dataIndex: "EmployeeCode",
      scopedSlots: { customRender: "EmployeeCode" },
      align: "center",
    },
    {
      title: "完成率起始",
      dataIndex: "RateStart",
      scopedSlots: { customRender: "RateStart" },
      align: "center",
    },
    {
      title: "完成率至",
      dataIndex: "RateEnd",
      scopedSlots: { customRender: "RateEnd" },
      align: "center",
    },
    {
      title: "月度完成率",
      dataIndex: "TaskTcRate",
      scopedSlots: { customRender: "TaskTcRate" },
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