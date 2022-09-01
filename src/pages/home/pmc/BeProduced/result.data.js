/*
 * @Author: max
 * @Date: 2021-11-25 11:48:45
 * @LastEditTime: 2022-08-22 11:32:10
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/pmc/BeProduced/result.data.js
 */
export const columns = [
    {
      title: "序号",
      scopedSlots: { customRender: "index" },
      align: "center",
      width: 50,
    },
    {
      title: "计划批号",
      dataIndex: "BatchNo",
      scopedSlots: { customRender: "BatchNo" },
      align: "center",
      width: 180,
    },
    {
      title: "生产工厂",
      dataIndex: "PlantName",
      scopedSlots: { customRender: "PlantName" },
      align: "center",
      width: 80,
    },
    {
      title: "子件品号",
      dataIndex: "MitemCode",
      scopedSlots: { customRender: "MitemCode" },
      align: "center",
      width: 180,
    },
    {
      title: "子件品名",
      dataIndex: "MitemName",
      scopedSlots: { customRender: "MitemName" },
      align: "center",
      width: 180,
    },
    {
      title: "子件规格",
      dataIndex: "MitemSpec",
      scopedSlots: { customRender: "MitemSpec" },
      align: "center",
      width: 180,
    },
    {
      title: "需求日期",
      dataIndex: "RequirementDate",
      scopedSlots: { customRender: "RequirementDate" },
      align: "center",
      width: 100,
    },
    {
      title: "库存数量",
      dataIndex: "StockQty",
      scopedSlots: { customRender: "StockQty" },
      align: "center",
      width: 100,
    },
    {
      title: "待排产需求总数量",
      dataIndex: "WaitScheduleQty",
      scopedSlots: { customRender: "WaitScheduleQty" },
      align: "center",
      width: 160,
    },
    {
      title: "待产需求总数量",
      dataIndex: "WaitProductionQty",
      scopedSlots: { customRender: "WaitProductionQty" },
      align: "center",
      width: 160,
    },
    {
      title: "未来可用需求总量",
      dataIndex: "FutureAvailableQty",
      scopedSlots: { customRender: "FutureAvailableQty" },
      align: "center",
      width: 160,
    },
    {
      title: "已预留总数",
      dataIndex: "TotalReservedQty",
      scopedSlots: { customRender: "TotalReservedQty" },
      align: "center",
      width: 100,
    },
    {
      title: "可用总数",
      dataIndex: "AvailableQty",
      scopedSlots: { customRender: "AvailableQty" },
      align: "center",
      width: "5%",
    },
    {
      title: "需求数量",
      dataIndex: "PurchaseQty",
      scopedSlots: { customRender: "PurchaseQty" },
      align: "center",
      width: 100,
    },
    {
      title: "采购在途数量",
      dataIndex: "TransitQty",
      scopedSlots: { customRender: "TransitQty" },
      align: "center",
      width: 100,
    },
    {
      title: "到货未入数",
      dataIndex: "QtyNoIn",
      scopedSlots: { customRender: "QtyNoIn" },
      align: "center",
      width: 100,
    },
     {
      title: "己请末购数",
      dataIndex: "RequestedNotPurchasedQty",
      scopedSlots: { customRender: "RequestedNotPurchasedQty" },
      align: "center",
      width: 100,
    },
    {
      title: "PMC",
      dataIndex: "Pmcs",
      scopedSlots: { customRender: "Pmcs" },
      align: "center",
      width: 100,
    },
    {
      title: "业务单号",
      dataIndex: "SalesOrderNos",
      scopedSlots: { customRender: "SalesOrderNos" },
      align: "center",
      width: 100,
    },
  ];