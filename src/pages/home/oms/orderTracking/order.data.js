/*
 * @Author: max
 * @Date: 2021-11-25 15:13:13
 * @LastEditTime: 2021-12-02 16:38:22
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/oms/orderTracking/order.data.js
 */
import { splitData } from "@/utils/util.js";
export const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 50,
  },
  {
    title: "销售公司",
    dataIndex: "CompanyName",
    scopedSlots: { customRender: "CompanyName" },
    align: "center",
    width: 120,
  },
  {
    title: "业务部",
    dataIndex: "DeptName",
    scopedSlots: { customRender: "DeptName" },
    align: "center",
    width: 80,
  },
  {
    title: "销售员",
    dataIndex: "UserName",
    scopedSlots: { customRender: "UserName" },
    align: "center",
    width: 80,
  },
  {
    title: "审核时间",
    dataIndex: "ApproveDatetime",
    scopedSlots: { customRender: "ApproveDatetime" },
    align: "center",
    width: 180,
  },
  {
    title: "销售订单",
    dataIndex: "SalesOrderNo",
    scopedSlots: { customRender: "SalesOrderNo" },
    align: "center",
    width: 120,
  },
  {
    title: "项目号",
    dataIndex: "LineItem",
    scopedSlots: { customRender: "LineItem" },
    align: "center",
    width: 80,
  },
  {
    title: "品号",
    dataIndex: "MitemCode",
    scopedSlots: { customRender: "MitemCode" },
    align: "center",
    width: 140,
  },
  {
    title: "品名",
    dataIndex: "MitemName",
    scopedSlots: { customRender: "MitemName" },
    align: "center",
    width: 200,
  },
  {
    title: "规格",
    dataIndex: "MitemSpec",
    scopedSlots: { customRender: "MitemSpec" },
    align: "center",
    width: 300,
  },
  {
    title: "订单数量",
    dataIndex: "OrderQty",
    scopedSlots: { customRender: "OrderQty" },
    align: "center",
    width: 80,
  },
  {
    title: "已交货数量",
    dataIndex: "DeliveredQty",
    scopedSlots: { customRender: "DeliveredQty" },
    align: "center",
    width: 100,
  },
  {
    title: "订单欠数",
    dataIndex: "OrderDeficiencyQty",
    scopedSlots: { customRender: "OrderDeficiencyQty" },
    align: "center",
    width: 80,
  },
  {
    title: "预计交期",
    dataIndex: "PlanShipDate",
    scopedSlots: { customRender: "PlanShipDate" },
    align: "center",
    width: 150,
  },
  {
    title: "生产工厂",
    dataIndex: "PlantName",
    scopedSlots: { customRender: "PlantName" },
    align: "center",
    width: 80,
  },
  {
    title: "库存数",
    dataIndex: "InventoryQty",
    scopedSlots: { customRender: "InventoryQty" },
    align: "center",
    width: 80,
  },
  {
    title: "批次号",
    dataIndex: "LotBatchNo",
    scopedSlots: { customRender: "LotBatchNo" },
    align: "center",
    width: 80,
  },
  {
    title: "可用库存数",
    dataIndex: "AvailableInvQty",
    scopedSlots: { customRender: "AvailableInvQty" },
    align: "center",
    width: 100,
  },
  {
    title: "工单",
    dataIndex: "MoCode",
    scopedSlots: { customRender: "MoCode" },
    align: "center",
    width: 120,
  },
  {
    title: "工单预计开工日期",
    dataIndex: "PlanStartDate",
    scopedSlots: { customRender: "PlanStartDate" },
    align: "center",
    width: 160,
    customRender: (text) => {
      return splitData(text);
    }
  },
  {
    title: "生产总数量",
    dataIndex: "TotalProductionQty",
    scopedSlots: { customRender: "TotalProductionQty" },
    align: "center",
    width: 100,
  },
  {
    title: "生产入库总数量",
    dataIndex: "TotalProWarehouseQty",
    scopedSlots: { customRender: "TotalProWarehouseQty" },
    align: "center",
    width: 120,
  },
  {
    title: "生产中数量",
    dataIndex: "InProductionQty",
    align: "center",
    width: 100,
  },
  {
    title: "工单欠数",
    dataIndex: "MoDeficiencyQty",
    scopedSlots: { customRender: "MoDeficiencyQty" },
    align: "center",
    width: 80,
    customCell: (record) => {		//在此处定义
      if (record.MoDeficiencyQty > 0) {
        return { style: { 'background': 'red', 'color': "#ffffff" } }
      }
    }
  },
  {
    title: "预警信息",
    dataIndex: "EarlyWarningInfo",
    scopedSlots: { customRender: "EarlyWarningInfo" },
    align: "center",
    width: 80,
  },
  {
    title: "物料及采购情况",
    dataIndex: "condition",
    scopedSlots: { customRender: "condition" },
    align: "center",
    width: 120,
    fixed: "right",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
    fixed: "right",
    width: 80,
  },
];
export const detailColumns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 50,
  },
  {
    title: "生产工厂",
    dataIndex: "PlantName",
    align: "center",
    width: 100,
  },
  {
    title: "物料品号",
    dataIndex: "MitemCode",
    scopedSlots: { customRender: "MitemCode" },
    align: "center",
    width: 100,
  },
  {
    title: "物料品名",
    dataIndex: "MitemName",
    align: "center",
  },
  {
    title: "欠数数量",
    dataIndex: "DeficiencyQty",
    align: "center",
    width: 80,
  },
  {
    title: "标准用量",
    dataIndex: "StandardQty",
    align: "center",
  },
  {
    title: " 总需求数量",
    dataIndex: "RequirementQty",
    align: "center",
    width: 100,
  },
  {
    title: "总库存数量",
    dataIndex: "InventoryQty",
    align: "center",
    width: 100,
  },
  {
    title: "预留用量",
    dataIndex: "ReservedQty",
    align: "center",
    width: 80,
  },
  {
    title: "可用用量",
    dataIndex: "AvailableQty",
    scopedSlots: { customRender: "AvailableQty" },
    align: "center",
    width: 80,
  },
  {
    title: "总欠数量",
    dataIndex: "TotalDeficiencyQty",
    scopedSlots: { customRender: "TotalDeficiencyQty" },
    align: "center",
    width: 80,
  },
  {
    title: "采购在途总数",
    dataIndex: "PurchaseTransitQty",
    scopedSlots: { customRender: "PurchaseTransitQty" },
    align: "center",
    width: 120,
  },
  {
    title: "采购在途预留用量",
    dataIndex: "PurchaseTransitReservedQty",
    scopedSlots: { customRender: "PurchaseTransitReservedQty" },
    align: "center",
    width: 135,
  },
  {
    title: "采购在途可用用量",
    dataIndex: "PurchaseTransitAvailableQty",
    scopedSlots: { customRender: "PurchaseTransitAvailableQty" },
    align: "center",
    width: 135,
  },
  {
    title: "预计最早到货时间",
    dataIndex: "EstimatedEarliestArrivalDateTime",
    scopedSlots: { customRender: "EstimatedEarliestArrivalDateTime" },
    align: "center",
    customRender: (text) => {
      return splitData(text);
    },
    width: 135,
  },
  {
    title: "采购欠数",
    dataIndex: "PurchaseDeficiencyQty",
    scopedSlots: { customRender: "PurchaseDeficiencyQty" },
    align: "center",
    width: 80,
  },
  {
    title: "采购在途明细",
    scopedSlots: { customRender: "action" },
    width: 110,
  },
];
export const detailColumnsP = [
  {
    title: "采购在途总数",
    dataIndex: "PurchaseTransitQty",
    scopedSlots: { customRender: "PurchaseTransitQty" },
    align: "center",
    width: 120,
  },
  {
    title: "采购在途预留用量",
    dataIndex: "PurchaseTransitReservedQty",
    scopedSlots: { customRender: "PurchaseTransitReservedQty" },
    align: "center",
    width: 135,
  },
  {
    title: "采购在途可用用量",
    dataIndex: "PurchaseTransitAvailableQty",
    scopedSlots: { customRender: "PurchaseTransitAvailableQty" },
    align: "center",
    width: 135,
  },
  {
    title: "预计最早到货时间",
    dataIndex: "EstimatedEarliestArrivalDateTime",
    scopedSlots: { customRender: "EstimatedEarliestArrivalDateTime" },
    align: "center",
    customRender: (text) => {
      return splitData(text);
    },
    width: 135,
  },
  {
    title: "采购欠数",
    dataIndex: "PurchaseDeficiencyQty",
    scopedSlots: { customRender: "PurchaseDeficiencyQty" },
    align: "center",
    width: 80,
  },
  {
    title: "采购在途明细",
    scopedSlots: { customRender: "action" },
    width: 110,
  },
];
export const TotalDeficiencyQty = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 50,
  },
  {
    title: "工单",
    dataIndex: "MoCode",
    align: "center",
  },
  {
    title: "预计开工日期",
    dataIndex: "PlanStartDate",
    scopedSlots: { customRender: "PlanStartDate" },
    align: "center",
    customRender: (text) => {
      return splitData(text);
    }
  },
  {
    title: "实际开工日期",
    dataIndex: "ActualSartDate",
    align: "center",
    customRender: (text) => {
      return splitData(text);
    }
  },
  {
    title: "生产数量",
    dataIndex: "MoQty",
    align: "center",
  },
  {
    title: "生产入库数量",
    dataIndex: "ReceivedQty",
    align: "center",
  },
  {
    title: " 最后入库日期",
    dataIndex: "ActualEndDate",
    align: "center",
    customRender: (text) => {
      return splitData(text);
    }
  }
];

export const excelHead = [
  {
    title: "销售公司",
    dataIndex: "CompanyName",
    scopedSlots: { customRender: "CompanyName" },
    align: "center",
    width: 120,
  },
  {
    title: "业务部",
    dataIndex: "DeptName",
    scopedSlots: { customRender: "DeptName" },
    align: "center",
    width: 80,
  },
  {
    title: "销售员",
    dataIndex: "UserName",
    scopedSlots: { customRender: "UserName" },
    align: "center",
    width: 80,
  },
  {
    title: "审核时间",
    dataIndex: "ApproveDatetime",
    scopedSlots: { customRender: "ApproveDatetime" },
    align: "center",
    width: 120,
  },
  {
    title: "销售订单",
    dataIndex: "SalesOrderNo",
    scopedSlots: { customRender: "SalesOrderNo" },
    align: "center",
    width: 80,
  },
  {
    title: "项目号",
    dataIndex: "LineItem",
    scopedSlots: { customRender: "LineItem" },
    align: "center",
    width: 80,
  },
  {
    title: "品号",
    dataIndex: "MitemCode",
    scopedSlots: { customRender: "MitemCode" },
    align: "center",
    width: 110,
  },
  {
    title: "品名",
    dataIndex: "MitemName",
    scopedSlots: { customRender: "MitemName" },
    align: "center",
    width: 100,
  },
  {
    title: "规格",
    dataIndex: "MitemSpec",
    scopedSlots: { customRender: "MitemSpec" },
    align: "center",
    width: 300,
  },
  {
    title: "订单数量",
    dataIndex: "OrderQty",
    scopedSlots: { customRender: "OrderQty" },
    align: "center",
    width: 80,
  },
  {
    title: "已交货数量",
    dataIndex: "DeliveredQty",
    scopedSlots: { customRender: "DeliveredQty" },
    align: "center",
    width: 100,
  },
  {
    title: "订单欠数",
    dataIndex: "OrderDeficiencyQty",
    scopedSlots: { customRender: "OrderDeficiencyQty" },
    align: "center",
    width: 80,
  },
  {
    title: "预计交期",
    dataIndex: "PlanShipDate",
    scopedSlots: { customRender: "PlanShipDate" },
    align: "center",
    width: 150,
  },
  {
    title: "生产工厂",
    dataIndex: "PlantName",
    scopedSlots: { customRender: "PlantName" },
    align: "center",
    width: 80,
  },
  {
    title: "库存数",
    dataIndex: "InventoryQty",
    scopedSlots: { customRender: "InventoryQty" },
    align: "center",
    width: 80,
  },
  {
    title: "批次号",
    dataIndex: "LotBatchNo",
    scopedSlots: { customRender: "LotBatchNo" },
    align: "center",
    width: 80,
  },
  {
    title: "可用库存数",
    dataIndex: "AvailableInvQty",
    scopedSlots: { customRender: "AvailableInvQty" },
    align: "center",
    width: 100,
  },
  {
    title: "工单",
    dataIndex: "MoCode",
    scopedSlots: { customRender: "MoCode" },
    align: "center",
    width: 120,
  },
  {
    title: "工单预计开工日期",
    dataIndex: "PlanStartDate",
    scopedSlots: { customRender: "PlanStartDate" },
    align: "center",
    width: 160,
    customRender: (text) => {
      return splitData(text);
    }
  },
  {
    title: "生产总数量",
    dataIndex: "TotalProductionQty",
    scopedSlots: { customRender: "TotalProductionQty" },
    align: "center",
    width: 100,
  },
  {
    title: "生产入库总数量",
    dataIndex: "TotalProWarehouseQty",
    scopedSlots: { customRender: "TotalProWarehouseQty" },
    align: "center",
    width: 120,
  },
  {
    title: "生产中数量",
    dataIndex: "InProductionQty",
    align: "center",
    width: 100,
  },
  {
    title: "工单欠数",
    dataIndex: "MoDeficiencyQty",
    scopedSlots: { customRender: "MoDeficiencyQty" },
    align: "center",
    width: 80,
  },
  {
    title: "预警信息",
    dataIndex: "EarlyWarningInfo",
    scopedSlots: { customRender: "EarlyWarningInfo" },
    align: "center",
    width: 80,
  }
];