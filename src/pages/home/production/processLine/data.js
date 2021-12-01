/*
 * @Author: max
 * @Date: 2021-11-30 14:42:25
 * @LastEditTime: 2021-12-01 10:01:13
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/processLine/data.js
 */
export const columns = [
    {
        title: "序号",
        scopedSlots: { customRender: "index" },
        align: "center",
    },
    {
        title: "生产工厂",
        dataIndex: "PlantName",
        scopedSlots: { customRender: "PlantName" },
        align: "center",
    },
    {
        title: "工序编码",
        dataIndex: "ProcessCode",
        scopedSlots: { customRender: "ProcessCode" },
        align: "center",
    },
    {
        title: "工序名称",
        dataIndex: "ProcessName",
        scopedSlots: { customRender: "ProcessName" },
        align: "center",
    },
    {
        title: "工序步骤",
        dataIndex: "Step",
        scopedSlots: { customRender: "Step" },
        align: "center",
    },
    {
        title: "工序描述",
        dataIndex: "ProcessDesc",
        scopedSlots: { customRender: "ProcessDesc" },
        align: "center",
    },
    {
        title: "状态",
        dataIndex: "Enable",
        scopedSlots: { customRender: "Enable" },
        align: "center",
    },
    {
        title: "创建时间",
        dataIndex: "DateTimeCreated",
        scopedSlots: { customRender: "DateTimeCreated" },
        align: "center",
        width:200
    },
    {
        title: "创建人",
        dataIndex: "UserCreated",
        scopedSlots: { customRender: "UserCreated" },
        align: "center",
    },
    {
        title: "操作",
        scopedSlots: { customRender: "action" },
        align: "center",
    },
];
export const columnsLine = [
    {
        title: "序号",
        scopedSlots: { customRender: "index" },
        align: "center",
    },
    {
        title: "生产工厂",
        dataIndex: "PlantName",
        scopedSlots: { customRender: "PlantName" },
        align: "center",
    },
    {
        title: "工序名称",
        dataIndex: "ProcessName",
        scopedSlots: { customRender: "ProcessName" },
        align: "center",
    },
    {
        title: "生产车间",
        dataIndex: "WorkshopName",
        scopedSlots: { customRender: "WorkshopName" },
        align: "center",
    },
    {
        title: "生产产线",
        dataIndex: "LineNames",
        scopedSlots: { customRender: "LineNames" },
        align: "center",
    },
    {
        title: "状态",
        dataIndex: "Enable",
        scopedSlots: { customRender: "Enable" },
        align: "center",
    },
    {
        title: "创建时间",
        dataIndex: "DateTimeCreated",
        scopedSlots: { customRender: "DateTimeCreated" },
        align: "center",
        width:200
    },
    {
        title: "创建人",
        dataIndex: "UserCreated",
        scopedSlots: { customRender: "UserCreated" },
        align: "center",
    },
    {
        title: "操作",
        scopedSlots: { customRender: "action" },
        align: "center",
    },
];