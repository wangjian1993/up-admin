/*
 * @Author: max
 * @Date: 2022-04-08 08:55:56
 * @LastEditTime: 2022-04-08 09:32:25
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/workOrder/data.js
 */
import { splitData } from "@/utils/util.js";
export const columns = [
    {
      title: "序号",
      scopedSlots: { customRender: "index" },
      align: "center",
      width:50,
    },
    {
      title: "生产工厂",
      dataIndex: "PlantName",
      scopedSlots: { customRender: "PlantName" },
      align: "center",
    },
    {
      title: "业务订单号",
      dataIndex: "BusinessOrderNo",
      scopedSlots: { customRender: "BusinessOrderNo" },
      align: "center",
    },
    {
      title: "工单号",
      dataIndex: "MoCode",
      scopedSlots: { customRender: "MoCode" },
      align: "center",
    },
    {
      title: "成品编码",
      dataIndex: "ProCode",
      scopedSlots: { customRender: "ProCode" },
      align: "center",
    },
    {
      title: "成品名称",
      dataIndex: "ProName",
      scopedSlots: { customRender: "ProName" },
      align: "center",
    },
    {
      title: "规格",
      dataIndex: "ProSpec",
      scopedSlots: { customRender: "ProSpec" },
      align: "center",
      width: "300px",
    },
    {
      title: "订单数量",
      dataIndex: "SalesOrderQty",
      scopedSlots: { customRender: "SalesOrderQty" },
      align: "center",
    },
    {
      title: "工单数量",
      dataIndex: "MoQty",
      scopedSlots: { customRender: "MoQty" },
      align: "center",
    },
    {
      title: "计划开始日期",
      dataIndex: "DateTimePlanStart",
      scopedSlots: { customRender: "DateTimePlanStart" },
      align: "center",
      customRender: (text) => {
        return splitData(text);
      }
    },
    {
      title: "计划结束日期",
      dataIndex: "DateTimePlanEnd",
      scopedSlots: { customRender: "DateTimePlanEnd" },
      align: "center",
      customRender: (text) => {
        return splitData(text);
      }
    },
    {
      title: "实际开始时间",
      dataIndex: "DateTimeMoCteaed",
      scopedSlots: { customRender: "DateTimeMoCteaed" },
      align: "center",
      customRender: (text) => {
        return splitData(text);
      }
    },
    {
      title: "实际完工时间",
      dataIndex: "DateTimeEnd",
      scopedSlots: { customRender: "DateTimeEnd" },
      align: "center",
      customRender: (text) => {
        return splitData(text);
      }
    },
    {
      title: "已入库产量",
      dataIndex: "WarehouseQty",
      scopedSlots: { customRender: "WarehouseQty" },
      align: "center",
    },
    {
      title: "生产状态",
      dataIndex: "StatusName",
      scopedSlots: { customRender: "StatusName" },
      align: "center",
    },
  ];