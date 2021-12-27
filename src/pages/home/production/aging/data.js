/*
 * @Author: max
 * @Date: 2021-11-29 13:58:17
 * @LastEditTime: 2021-12-27 16:07:44
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/aging/data.js
 */
export const columns = [
    {
        title: "序号",
        scopedSlots: { customRender: "index" },
        align: "center",
        width: 50,
    },
    {
        title: "物料标识卡条码",
        dataIndex: "MoCode1",
        scopedSlots: { customRender: "MoCode1" },
        align: "center",
        width: 120
    },
    {
        title: "工单",
        dataIndex: "MoCode",
        scopedSlots: { customRender: "MoCode" },
        align: "center",
        width: 100,
    },
    {
        title: "生产工厂",
        dataIndex: "PlantName",
        scopedSlots: { customRender: "PlantName" },
        align: "center",
        width: 100,
    },
    {
        title: "老化车间",
        dataIndex: "WorkshopName",
        scopedSlots: { customRender: "WorkshopName" },
        align: "center",
        width: 100
    },
    {
        title: "老化产线",
        dataIndex: "LineName",
        scopedSlots: { customRender: "LineName" },
        align: "center",
        width: 80
    },
    {
        title: "品号",
        dataIndex: "ProCode",
        scopedSlots: { customRender: "ProCode" },
        align: "center",
        width: 150
    },
    {
        title: "品名",
        dataIndex: "ProName",
        scopedSlots: { customRender: "ProName" },
        align: "center",
        width: 120
    },
    {
        title: "老化数量",
        dataIndex: "AgeingQty",
        scopedSlots: { customRender: "AgeingQty" },
        align: "center",
        width: 120
    },
    {
        title: "老化进站数量",
        dataIndex: "AgeingedQty",
        scopedSlots: { customRender: "AgeingedQty" },
        align: "center",
        width: 120
    },
    {
        title: "开始老化时间",
        dataIndex: "DatetimeAgeingStart",
        scopedSlots: { customRender: "DatetimeAgeingStart" },
        align: "center",
        width: 120
    },
    {
        title: "填单人",
        dataIndex: "UserName",
        scopedSlots: { customRender: "UserName" },
        align: "center",
        width: 120
    },
    {
        title: "状态",
        dataIndex: "Status",
        scopedSlots: { customRender: "Status" },
        align: "center",
        width: 120
    },
];
