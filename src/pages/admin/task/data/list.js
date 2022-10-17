/*
 * @Author: max
 * @Date: 2022-04-30 14:05:19
 * @LastEditTime: 2022-10-14 11:32:13
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/admin/task/data/list.js
 */

// import { splitData } from "@/utils/util.js";
export const columns = [
    {
      title: "序号",
      scopedSlots: { customRender: "index" },
      align: "center",
      width:50,
    },
    {
      title: "创建时间",
      dataIndex: "CreateTime",
      scopedSlots: { customRender: "CreateTime" },
      align: "center",
    },
    {
      title: "最近运行时间",
      dataIndex: "LastRunTime",
      scopedSlots: { customRender: "LastRunTime" },
      align: "center",
    },
    {
      title: "最近结束时间",
      dataIndex: "LastStopTime",
      scopedSlots: { customRender: "LastStopTime" },
      align: "center",
    },
    {
      title: "Job名称",
      dataIndex: "JobName",
      scopedSlots: { customRender: "JobName" },
      align: "center",
    },
    {
      title: "耗时(毫秒)",
      dataIndex: "RunTime",
      scopedSlots: { customRender: "RunTime" },
      align: "center",
    },
    {
      title: "单位",
      dataIndex: "Unit",
      scopedSlots: { customRender: "Unit" },
      align: "center",
    },
    {
      title: "执行次数",
      dataIndex: "RunNum",
      scopedSlots: { customRender: "RunNum" },
      align: "center",
    },
    {
      title: "执行频率(秒)",
      dataIndex: "RunTimingNum",
      scopedSlots: { customRender: "RunTimingNum" },
      align: "center",
    },
    {
      title: "执行API",
      dataIndex: "MethodPath",
      scopedSlots: { customRender: "MethodPath" },
      align: "center",
    },
    {
      title: "定时启动时间",
      dataIndex: "StartTime",
      scopedSlots: { customRender: "StartTime" },
      align: "center",
    },
    {
      title: "定时结束时间",
      dataIndex: "EndTime",
      scopedSlots: { customRender: "EndTime" },
      align: "center",
    },
    {
      title: "API请求方式",
      dataIndex: "Method",
      scopedSlots: { customRender: "Method" },
      align: "center",
    },
    {
      title: "状态",
      dataIndex: "Status",
      scopedSlots: { customRender: "Status" },
      align: "center",
    },
    {
      title: "参数",
      dataIndex: "Parameters",
      scopedSlots: { customRender: "Parameters" },
      align: "center",
    },
    {
      title: "返回结果",
      dataIndex: "Result",
      scopedSlots: { customRender: "Result" },
      align: "center",
    },
    {
      title: "操作",
      scopedSlots: { customRender: "action" },
      align: "center",
    },
  ];