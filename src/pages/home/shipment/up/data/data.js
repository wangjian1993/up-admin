/*
 * @Author: max
 * @Date: 2022-02-21 14:01:19
 * @LastEditTime: 2022-02-21 14:01:21
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/shipment/up/data/data.js
 */
export const columns = [
    {
        title: "序号",
        scopedSlots: { customRender: "index" },
        align: "center",
        width: 100,
    },
    {
        title: "业务订单号",
        dataIndex: "PiNumber",
        scopedSlots: { customRender: "PiNumber" },
        align: "center",
        width: 150,
    },
    {
        title: "客户代码",
        dataIndex: "CustomerCode",
        scopedSlots: { customRender: "CustomerCode" },
        align: "center",
        width: 100,
    },
    {
        title: "出货国家",
        dataIndex: "ToCountry",
        scopedSlots: { customRender: "ToCountry" },
        align: "center",
        width: 80,
    },
    {
        title: "出货方式",
        dataIndex: "ShipmentWay",
        scopedSlots: { customRender: "ShipmentWay" },
        align: "center",
        width: 80,
    },
    {
        title: "是否验货",
        dataIndex: "IsExamine",
        scopedSlots: { customRender: "IsExamine" },
        align: "center",
        width: 80,
    },
    {
        title: "约定验货时间",
        dataIndex: "GoodsExamineTime",
        scopedSlots: { customRender: "GoodsExamineTime" },
        align: "center",
        width: 120,
    },
    {
        title: " 约定提货时间",
        dataIndex: "GoodsPickTime",
        scopedSlots: { customRender: "GoodsPickTime" },
        align: "center",
        width: 120,
    },
    {
        title: "申请时间",
        dataIndex: "DatetimeCreated",
        scopedSlots: { customRender: "DatetimeCreated" },
        align: "center",
        width: 120,
    },
    {
        title: "生产工厂",
        dataIndex: "PlantName",
        scopedSlots: { customRender: "PlantName" },
        align: "center",
        width: "100px",
    },
    {
        title: "备注",
        dataIndex: "Remark",
        scopedSlots: { customRender: "Remark" },
        align: "center",
        width: 120,
    },
    {
        title: "业务员",
        dataIndex: "DisplayName",
        scopedSlots: { customRender: "DisplayName" },
        align: "center",
        width: "100px",
    },
    {
        title: "出货状态",
        dataIndex: "StatusShipment",
        scopedSlots: { customRender: "StatusShipment" },
        align: "center",
        width: 80,
    },
    {
        title: "处理状态",
        dataIndex: "StatusHandle",
        scopedSlots: { customRender: "StatusHandle" },
        align: "center",
        width: 80,
    },
    {
        title: "操作",
        scopedSlots: { customRender: "action" },
        align: "center",
        width: 120,
    },
];
export const innerColumns = [
    {
        title: "品号",
        dataIndex: "ItemCode",
        scopedSlots: { customRender: "ItemCode" },
        align: "left",
        width: 200,
    },
    {
        title: "品名",
        dataIndex: "ItemName",
        scopedSlots: { customRender: "ItemName" },
        align: "left",
        width: 350,
    },
    {
        title: "规格",
        dataIndex: "ItemSpecification",
        scopedSlots: { customRender: "ItemSpecification" },
        align: "left",
    },
    {
        title: "订单数量",
        dataIndex: "ShipmentQtyOrder",
        scopedSlots: { customRender: "ShipmentQtyOrder" },
        align: "center",
        width: 150,
    },
    {
        title: "本次出货数量",
        dataIndex: "ShipmentQtyNow",
        scopedSlots: { customRender: "ShipmentQtyNow" },
        align: "center",
        width: 150,
    },
];