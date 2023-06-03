/*
 * @Author: max
 * @Date: 2022-05-11 11:49:33
 * @LastEditTime: 2023-06-01 15:26:46
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/qms/product/assembly/data.js
 */
import { splitData } from "@/utils/util.js";
export const columns = [
  {
    title: "序号",
    dataIndex: "index",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 50,
  },
  {
    title: "检验日期",
    dataIndex: "InspectDate",
    scopedSlots: { customRender: "InspectDate" },
    align: "center",
    customRender: (text) => {
      return splitData(text);
    }
  },
  {
    title: "生产工序",
    dataIndex: "ProcessName",
    scopedSlots: { customRender: "ProcessName" },
    align: "center",
  },
  {
    title: "生产工厂",
    dataIndex: "PlantName",
    scopedSlots: { customRender: "PlantName" },
    align: "center",
  },
  {
    title: "车间",
    dataIndex: "WorkShopName",
    scopedSlots: { customRender: "WorkShopName" },
    align: "center",
  },
  {
    title: "产线",
    dataIndex: "LineName",
    scopedSlots: { customRender: "LineName" },
    align: "center",
  },
  {
    title: "订单号",
    dataIndex: "OrderNo",
    scopedSlots: { customRender: "OrderNo" },
    align: "center",
  },
  {
    title: "订单数量",
    dataIndex: "OrderQty",
    scopedSlots: { customRender: "OrderQty" },
    align: "center",
  },
  {
    title: "项目号",
    dataIndex: "OrderItem",
    scopedSlots: { customRender: "OrderItem" },
    align: "center",
  },
  {
    title: "工单号",
    dataIndex: "MoCode",
    scopedSlots: { customRender: "MoCode" },
    align: "center",
  },
  {
    title: "工单数量",
    dataIndex: "MoQty",
    scopedSlots: { customRender: "MoQty" },
    align: "center",
  },
  {
    title: "品号",
    dataIndex: "ProCode",
    scopedSlots: { customRender: "ProCode" },
    align: "center",
  },
  {
    title: "品名",
    dataIndex: "ProName",
    scopedSlots: { customRender: "ProName" },
    align: "center",
    width: 200
  },
  {
    title: "规格",
    dataIndex: "ProSpec",
    scopedSlots: { customRender: "ProSpec" },
    align: "center",
    width: 350
  },
  {
    title: "色温",
    dataIndex: "ColorTemp",
    scopedSlots: { customRender: "ColorTemp" },
    align: "center",
  },
  {
    title: "检验类别",
    dataIndex: "InspectType",
    scopedSlots: { customRender: "InspectType " },
    align: "center",
  },
  {
    title: "检验员",
    dataIndex: "UserNameInspect",
    scopedSlots: { customRender: "UserNameInspect" },
    align: "center",
  },
  {
    title: "检验时间",
    dataIndex: "DateTimeInspect",
    scopedSlots: { customRender: "DateTimeInspect" },
    align: "center",
  },
  {
    title: "检验结果",
    dataIndex: "InspectResultName",
    scopedSlots: { customRender: "InspectResultName" },
    align: "center",
  },
  {
    title: "不合格原因",
    dataIndex: "NGReason",
    scopedSlots: { customRender: "NGReason" },
    align: "center",
  },
  {
    title: "不合格描述",
    dataIndex: "NGRemarks",
    scopedSlots: { customRender: "NGRemarks" },
    align: "center",
  },
  {
    title: "审核结果",
    dataIndex: "StatusName",
    scopedSlots: { customRender: "StatusName" },
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
    fixed: "right",
    width: 100,
  },
];