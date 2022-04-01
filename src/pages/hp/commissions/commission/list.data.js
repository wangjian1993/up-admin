/*
 * @Author: max
 * @Date: 2021-11-18 09:09:28
 * @LastEditTime: 2022-03-30 11:37:56
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/hp/commissions/commission/list.data.js
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
    {
      title: "合同号",
      dataIndex: "MoNo",
      scopedSlots: { customRender: "MoNo" },
      align: "center",
    },
    {
      title: "本次本币",
      dataIndex: "AmtTc",
      scopedSlots: { customRender: "AmtTc" },
      align: "center",
    },
    {
      title: "销售订单日期",
      dataIndex: "DocDate",
      scopedSlots: { customRender: "DocDate" },
      align: "center",
    },
    {
      title: "订单总金额",
      dataIndex: "MoAmount",
      scopedSlots: { customRender: "MoAmount" },
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
      title: "居间费",
      dataIndex: "CrtAmt",
      scopedSlots: { customRender: "CrtAmt" },
      align: "center",
    },
    {
      title: "折扣费",
      dataIndex: "ZkRate",
      scopedSlots: { customRender: "ZkRate" },
      align: "center",
    },
    {
      title: "基础提成比率",
      dataIndex: "ZkjctcRate",
      scopedSlots: { customRender: "ZkjctcRate" },
      align: "center",
    },
    {
      title: "基础提成金额",
      dataIndex: "JctcAmt",
      scopedSlots: { customRender: "JctcAmt" },
      align: "center",
    },
    {
      title: "月度任务",
      dataIndex: "MonthTask",
      scopedSlots: { customRender: "MonthTask" },
      align: "center",
    },
    {
      title: "月业绩总值",
      dataIndex: "MonthAllYj",
      scopedSlots: { customRender: "MonthAllYj" },
      align: "center",
    },
    {
      title: "月度任务达成率",
      dataIndex: "MonthTaskCompletionRate",
      scopedSlots: { customRender: "MonthTaskCompletionRate" },
      align: "center",
    },
    {
      title: "月度任务提成比率",
      dataIndex: "MonthTaskTcRate",
      scopedSlots: { customRender: "MonthTaskTcRate" },
      align: "center",
    },
    {
      title: "月度提成",
      dataIndex: "MonthTcAmt",
      scopedSlots: { customRender: "MonthTcAmt" },
      align: "center",
    },
    {
      title: "此笔收款总提成",
      dataIndex: "CollectionTc",
      scopedSlots: { customRender: "CollectionTc" },
      align: "center",
    },
  ];