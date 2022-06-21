/*
 * @Author: max
 * @Date: 2021-11-29 13:58:17
 * @LastEditTime: 2022-06-21 14:14:54
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/personnel/data.js
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
        title: "用户工号",
        dataIndex: "UserCode",
        scopedSlots: { customRender: "UserCode" },
        align: "center",
        width: 200,
    },
    {
        title: "用户姓名",
        dataIndex: "UserName",
        scopedSlots: { customRender: "UserName" },
        align: "center",
        width:100
    },
    {
        title: "生产车间",
        dataIndex: "WorkshopName",
        scopedSlots: { customRender: "WorkshopName" },
        align: "center",
        width: 100
    },
    {
        title: "生产产线",
        dataIndex: "LineName",
        scopedSlots: { customRender: "LineName" },
        align: "center",
        width: 200
    },
    {
        title: "是否启用",
        dataIndex: "Enable",
        scopedSlots: { customRender: "Enable" },
        align: "center",
        width: 80
    },
    {
        title: "创建时间",
        dataIndex: "DatetimeCreated",
        scopedSlots: { customRender: "DatetimeCreated" },
        align: "center",
        width: 200
    },
    {
        title: "创建人",
        dataIndex: "UserCreated",
        scopedSlots: { customRender: "UserCreated" },
        align: "center",
        width: 120
    },
    {
        title: "操作",
        scopedSlots: { customRender: "action" },
        align: "center",
    },
];
