/*
 * @Author: max
 * @Date: 2021-11-18 09:09:28
 * @LastEditTime: 2022-03-30 11:27:09
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/hp/commissions/performance/list.data.js
 */
// import { splitData } from "@/utils/util.js";
export const columns = [
    {
      title: "序号",
      scopedSlots: { customRender: "index" },
      align: "center",
    },
    {
      title: "年度",
      dataIndex: "TheYear",
      scopedSlots: { customRender: "TheYear" },
      align: "center",
    },
    {
      title: "月份",
      dataIndex: "TheMonth",
      scopedSlots: { customRender: "TheMonth" },
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
      title: "月任务",
      dataIndex: "MonthTask",
      scopedSlots: { customRender: "MonthTask" },
      align: "center",
    },
    {
      title: "币种",
      dataIndex: "CurrencyCode",
      scopedSlots: { customRender: "CurrencyCode" },
      align: "center",
    },
    {
      title: "合计销售订单金额",
      dataIndex: "SumAmount",
      scopedSlots: { customRender: "SumAmount" },
      align: "center",
    },
    {
      title: "任务达成率",
      dataIndex: "CompletionRate",
      scopedSlots: { customRender: "CompletionRate" },
      align: "center",
    },
    {
      title: "月度任务提成率",
      dataIndex: "TaskTcRate",
      scopedSlots: { customRender: "TaskTcRate" },
      align: "center",
    }
  ];