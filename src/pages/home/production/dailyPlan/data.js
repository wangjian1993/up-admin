/*
 * @Author: max
 * @Date: 2021-11-15 09:05:35
 * @LastEditTime: 2021-11-17 15:05:28
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/dailyPlan/data.js
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
      title: "生产日计划批号",
      dataIndex: "BatchNo",
      scopedSlots: { customRender: "BatchNo" },
      align: "center",
      width:120
    },
    {
      title: "生产工厂",
      dataIndex: "PlantName",
      scopedSlots: { customRender: "PlantName" },
      align: "center",
    },
    {
      title: "生产车间",
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
      title: "PMC",
      dataIndex: "UserName",
      scopedSlots: { customRender: "UserName" },
      align: "center",
    },
    {
      title: "计划生产日期",
      dataIndex: "PlanDate",
      scopedSlots: { customRender: "PlanDate" },
      align: "center",
      width: "120px",
      customRender: (text) => {
        return splitData(text);
      },
    },
    {
      title: "工单号",
      dataIndex: "WorkOrderNo",
      scopedSlots: { customRender: "WorkOrderNo" },
      align: "center",
    },
    {
      title: "业务订单号",
      dataIndex: "WorkOrderNo1",
      scopedSlots: { customRender: "WorkOrderNo1" },
      align: "center",
    },
    {
      title: "品号",
      dataIndex: "MitemCode",
      scopedSlots: { customRender: "MitemCode" },
      align: "center",
    },
    {
      title: "品名",
      dataIndex: "MitemName",
      scopedSlots: { customRender: "MitemName" },
      align: "center",
      width: "200px",
    },
    {
      title: " 订单交期",
      dataIndex: "OrderDeliveryDate",
      align: "center",
      width: "120px",
      customRender: (text) => {
        return splitData(text);
      },
    },
    {
      title: "下单日期",
      dataIndex: "OrderDate",
      scopedSlots: { customRender: "OrderDate" },
      align: "center",
      customRender: (text) => {
        return splitData(text);
      },
    },
    {
      title: "订单数量",
      dataIndex: "OrderQty",
      scopedSlots: { customRender: "OrderQty" },
      align: "center",
    },
    {
      title: "计划数量",
      dataIndex: "PlanQty",
      scopedSlots: { customRender: "PlanQty" },
      align: "center",
      width: "100px",
    },
    {
      title: "人均标准产能",
      dataIndex: "PerCapiteCapacity",
      scopedSlots: { customRender: "PerCapiteCapacity" },
      align: "center",
    },
    {
      title: "工时",
      dataIndex: "WorkHour",
      scopedSlots: { customRender: "WorkHour" },
      align: "center",
    },
    {
      title: "物料库存情况",
      dataIndex: "MaterialShortage",
      scopedSlots: { customRender: "MaterialShortage" },
      align: "center",
      width: "150px",
    },
    {
      title: "开工日期",
      dataIndex: "StartDateTime",
      scopedSlots: { customRender: "StartDateTime" },
      align: "center",
      width: "100px",
      customRender: (text) => {
        return splitData(text);
      },
    },
    {
      title: "生产进度",
      dataIndex: "ProductionSchedule",
      scopedSlots: { customRender: "ProductionSchedule" },
      align: "center",
      width: "120px",
    },
    {
      title: "备注",
      dataIndex: "Remarks",
      scopedSlots: { customRender: "Remarks" },
      align: "center",
      width: "100px",
    },
    {
      title: "物料领料情况",
      dataIndex: "material",
      scopedSlots: { customRender: "material" },
      align: "center",
      fixed: "right",
      width: 110,
    },
    {
      title: "生产备注",
      dataIndex: "production_remarks",
      scopedSlots: { customRender: "production_remarks" },
      align: "center",
      fixed: "right",
      width: 130,
    },
    {
      title: "状态",
      dataIndex: "StatusName",
      scopedSlots: { customRender: "StatusName" },
      align: "center",
      fixed: "right",
      width: 80,
    },
    {
      title: "操作",
      scopedSlots: { customRender: "action" },
      align: "center",
      fixed: "right",
      width: 100,
    },
  ];