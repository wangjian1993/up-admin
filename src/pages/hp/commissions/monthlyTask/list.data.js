/*
 * @Author: max
 * @Date: 2021-11-18 09:09:28
 * @LastEditTime: 2022-03-28 18:03:26
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/hp/commissions/monthlyTask/list.data.js
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
      title: "月任务",
      dataIndex: "MonthTask",
      scopedSlots: { customRender: "MonthTask" },
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