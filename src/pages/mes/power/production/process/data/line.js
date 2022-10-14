/*
 * @Author: max
 * @Date: 2022-10-13 10:24:14
 * @LastEditTime: 2022-10-13 14:34:46
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/power/production/process/data/line.js
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