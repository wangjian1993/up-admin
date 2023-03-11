/*
 * @Author: max
 * @Date: 2021-12-24 09:42:09
 * @LastEditTime: 2023-03-11 14:08:22
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/power/qrcode/list.data.js
 */
// import { splitData} from '@/utils/util';
export const columns = [
    {
        title: "序号",
        scopedSlots: { customRender: "index" },
        align: "center",
        width: 50,
    },
    {
        title: "生产工厂",
        dataIndex: "PlantName",
        scopedSlots: { customRender: "PlantName" },
        align: "center",
        width: 100,
    },
    {
        title: "当前生产车间",
        dataIndex: "WorkshopName",
        scopedSlots: { customRender: "CurWorkshopName" },
        align: "center",
        width: 100,
    },
    {
        title: "当前生产产线",
        dataIndex: "LineName",
        scopedSlots: { customRender: "CurLineName" },
        align: "center",
        width: 100,
    },
    {
        title: "生产工单号",
        dataIndex: "MoCode",
        scopedSlots: { customRender: "MoCode" },
        align: "center",
        width: 100,
    },
    {
        title: "生产订单号",
        dataIndex: "OrderNo",
        scopedSlots: { customRender: "OrderNo" },
        align: "center",
        width: 100,
    },
    {
        title: "追溯码序号",
        dataIndex: "SortNo",
        scopedSlots: { customRender: "SortNo" },
        align: "center",
        width: 100,
    },
    {
        title: "产品追溯码",
        dataIndex: "QrCode",
        scopedSlots: { customRender: "QrCode" },
        align: "center",
        width: 120,
    },
    {
        title: "工单数量",
        dataIndex: "MoQty",
        scopedSlots: { customRender: "MoQty" },
        align: "center",
        width: 120,
    },
    {
        title: "开工时间",
        dataIndex: "DateTimeFinished",
        scopedSlots: { customRender: "DateTimeFinished" },
        align: "center",
        width: "100px",
    },
    {
        title: "完工时间",
        dataIndex: "DatetimeStarted",
        scopedSlots: { customRender: "DatetimeStarted" },
        align: "center",
        width: "100px",
    },
    {
        title: "品号",
        dataIndex: "ProCode",
        scopedSlots: { customRender: "ProCode" },
        align: "center",
        width: "100px",
    },
    {
        title: "品名",
        dataIndex: "ProName",
        scopedSlots: { customRender: "ProName" },
        align: "center",
        width: "200px",
    },
    {
        title: "打印时间",
        dataIndex: "DateTimePrint",
        scopedSlots: { customRender: "DateTimePrint" },
        align: "center",
        width: "100px",
    },
    {
        title: "打印用户",
        dataIndex: "UserPrinted",
        scopedSlots: { customRender: "UserPrinted" },
        align: "center",
        width: "100px",
    },
    {
        title: "补打时间",
        dataIndex: "DateTimeReprint",
        scopedSlots: { customRender: "DateTimeReprint" },
        align: "center",
        width: "100px",
    },
    {
        title: "补打用户",
        dataIndex: "UserReprint",
        scopedSlots: { customRender: "UserReprint" },
        align: "center",
        width: "100px",
    },
    {
        title: "打印次数",
        dataIndex: "PrintCount",
        scopedSlots: { customRender: "PrintCount" },
        align: "center",
        width: 100,
    },
    {
        title: "操作",
        fixed: "right",
        scopedSlots: { customRender: "action" },
        align: "center",
        width: 100
    },
];