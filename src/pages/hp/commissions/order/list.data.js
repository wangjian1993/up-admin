/*
 * @Author: max
 * @Date: 2021-11-18 09:09:28
 * @LastEditTime: 2022-03-29 17:54:24
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/hp/commissions/order/list.data.js
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
      title: "订单日期",
      dataIndex: "DocDate",
      scopedSlots: { customRender: "DocDate" },
      align: "center",
    },
    {
      title: "客户",
      dataIndex: "CustomerName",
      scopedSlots: { customRender: "CustomerName" },
      align: "center",
    },
    {
      title: "客户名称",
      dataIndex: "CustomerFullName",
      scopedSlots: { customRender: "CustomerFullName" },
      align: "center",
    },
    {
      title: "币种",
      dataIndex: "CurrencyName",
      scopedSlots: { customRender: "CurrencyName" },
      align: "center",
    },
    {
      title: "订单总金额",
      dataIndex: "DatetimeCreated",
      scopedSlots: { customRender: "DatetimeCreated" },
      align: "center",
    },
    {
      title: "PI运费",
      dataIndex: "PiYfFy",
      scopedSlots: { customRender: "PiYfFy" },
      align: "center",
    },
    {
      title: "PI手续费",
      dataIndex: "PiSxFy",
      scopedSlots: { customRender: "PiSxFy" },
      align: "center",
    },
    {
      title: "PI其他费用",
      dataIndex: "PiQtFy",
      scopedSlots: { customRender: "PiQtFy" },
      align: "center",
    },
    {
      title: "包材费用",
      dataIndex: "PiBcFy",
      scopedSlots: { customRender: "PiBcFy" },
      align: "center",
    },
    {
      title: "折扣率",
      dataIndex: "ZkRate",
      scopedSlots: { customRender: "ZkRate" },
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
      title: "部门",
      dataIndex: "AdminUnitName",
      scopedSlots: { customRender: "AdminUnitName" },
      align: "center",
    },
    {
      title: "操作",
      scopedSlots: { customRender: "action" },
      align: "center",
      width: 190,
    },
  ];