/*
 * @Author: max
 * @Date: 2021-12-24 09:42:09
 * @LastEditTime: 2022-03-09 16:06:18
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/process/list.data.js
 */
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
        width:100,
    },
    {
        title: "当前生产车间",
        dataIndex: "CurWorkshopName",
        scopedSlots: { customRender: "CurWorkshopName" },
        align: "center",
        width:100,
    },
    {
        title: "当前生产产线",
        dataIndex: "CurLineName",
        scopedSlots: { customRender: "CurLineName" },
        align: "center",
        width:100,
    },
    {
        title: "生产工单号",
        dataIndex: "MoCode",
        scopedSlots: { customRender: "MoCode" },
        align: "center",
        width:100,
    },
    {
        title: "生产订单号",
        dataIndex: "OrderNo",
        scopedSlots: { customRender: "OrderNo" },
        align: "center",
        width:100,
    },
    {
        title: "工单数量",
        dataIndex: "MoQty",
        scopedSlots: { customRender: "MoQty" },
        align: "center",
        width: 120,
    },
    {
        title: "品号",
        dataIndex: "ProCode",
        scopedSlots: { customRender: "ProCode" },
        align: "center",
        width:120,
    },
    {
        title: "品名",
        dataIndex: "ProName",
        scopedSlots: { customRender: "ProName" },
        align: "center",
        width:220,
    },
    {
        title: " 上道工序车间",
        dataIndex: "PreProcWorkshopName",
        align: "center",
        width:120,
    },
    {
        title: "待接收数量",
        dataIndex: "NoStartQty",
        scopedSlots: { customRender: "NoStartQty" },
        align: "center",
        width:130,
    },
    {
        title: "已接收数量",
        dataIndex: "StartedQty",
        scopedSlots: { customRender: "StartedQty" },
        align: "center",
        width: 80,
    },
    {
        title: "已生产数量",
        dataIndex: "FinishedQty",
        scopedSlots: { customRender: "FinishedQty" },
        align: "center",
        width: 80,
    },
    {
        title: "报废数量",
        dataIndex: "ScrapedQty",
        scopedSlots: { customRender: "ScrapedQty" },
        align: "center",
        width: "100px",
    },
    {
        title: "返工数量",
        dataIndex: "ReworkQty",
        scopedSlots: { customRender: "ReworkQty" },
        align: "center",
        width: "100px",
    },
    {
        title: "生产开始时间",
        dataIndex: "StartDate",
        scopedSlots: { customRender: "StartDate" },
        align: "center",
        width: "100px",
    },
    {
        title: "生产完成时间",
        dataIndex: "FinishedDate",
        scopedSlots: { customRender: "FinishedDate" },
        align: "center",
        width: "100px",
    },
    {
        title: "接收人",
        dataIndex: "StartUserName",
        scopedSlots: { customRender: "StartUserName" },
        align: "center",
        width: "100px",
    },
    {
        title: "报工人",
        dataIndex: "FinishedUserName",
        scopedSlots: { customRender: "FinishedUserName" },
        align: "center",
        width: "100px",
    },
    {
        title: "备注",
        dataIndex: "Remarks",
        scopedSlots: { customRender: "Remarks" },
        align: "center",
        width: 100,
    },
];