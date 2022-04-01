/*
 * @Author: max
 * @Date: 2021-11-18 09:09:28
 * @LastEditTime: 2022-03-30 10:58:30
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/hp/commissions/collection/list.data.js
 */
import { splitData } from "@/utils/util.js";
export const columns = [
    {
      title: "序号",
      scopedSlots: { customRender: "index" },
      align: "center",
    },
    {
      title: "收款日期",
      dataIndex: "BookkeepingDate",
      scopedSlots: { customRender: "BookkeepingDate" },
      align: "center",
      customRender: (text) => {
        return splitData(text);
      }
    },
    {
      title: "收款单号",
      dataIndex: "CtrNo",
      scopedSlots: { customRender: "CtrNo" },
      align: "center",
    },
    {
      title: "合同号",
      dataIndex: "MoNo",
      scopedSlots: { customRender: "MoNo" },
      align: "center",
    },
    {
      title: "收取金额",
      dataIndex: "AmtTc",
      scopedSlots: { customRender: "AmtTc" },
      align: "center",
    },
    {
      title: "收取币别",
      dataIndex: "CurrencyCode",
      scopedSlots: { customRender: "CurrencyCode" },
      align: "center",
    },
    {
      title: "换算金额",
      dataIndex: "AmtChange",
      scopedSlots: { customRender: "AmtChange" },
      align: "center",
    },
    {
      title: "订单总金额",
      dataIndex: "DatetimeCreated",
      scopedSlots: { customRender: "DatetimeCreated" },
      align: "center",
    },
    {
      title: "客户代码",
      dataIndex: "CustomerCode",
      scopedSlots: { customRender: "CustomerCode" },
      align: "center",
    },
    {
      title: "客户名称",
      dataIndex: "CustomerName",
      scopedSlots: { customRender: "CustomerName" },
      align: "center",
    },
    {
      title: "收款业务员",
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
      title: "部门",
      dataIndex: "Department",
      scopedSlots: { customRender: "Department" },
      align: "center",
    },
  ];