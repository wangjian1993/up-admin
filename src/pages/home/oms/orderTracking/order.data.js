/*
 * @Author: max
 * @Date: 2021-11-25 15:13:13
 * @LastEditTime: 2021-11-27 16:42:36
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
        title: "欠数物料齐套数量",
        dataIndex: "DeficiencyMitemCompleteQty",
        scopedSlots: { customRender: "DeficiencyMitemCompleteQty" },
        align: "center",
        width: 150,
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
        width: 150,
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