/*
 * @Author: max
 * @Date: 2022-04-01 17:38:43
 * @LastEditTime: 2022-04-01 17:44:11
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/dailyReport/data.js
 */
/*
 * @Author: max
 * @Date: 2021-11-15 09:05:35
 * @LastEditTime: 2021-11-17 15:05:28
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/dailyPlan/data.js
 */
// import { splitData } from "@/utils/util.js";
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
    },
    {
      title: "生产车间",
      dataIndex: "WorkShopName",
      scopedSlots: { customRender: "WorkShopName" },
      align: "center",
    },
    {
      title: "产线",
      dataIndex: "LineName",
      scopedSlots: { customRender: "LineName" },
      align: "center",
    },
    {
      title: "订单号",
      dataIndex: "LineName",
      scopedSlots: { customRender: "LineName" },
      align: "center",
    },
    {
      title: "工单号",
      dataIndex: "WorkOrderNo",
      scopedSlots: { customRender: "WorkOrderNo" },
      align: "center",
    },
    {
      title: "工单数量",
      dataIndex: "WorkOrderNo",
      scopedSlots: { customRender: "WorkOrderNo" },
      align: "center",
    },
    {
      title: "成品编码",
      dataIndex: "MitemCode",
      scopedSlots: { customRender: "MitemCode" },
      align: "center",
    },
    {
      title: "品名",
      dataIndex: "MitemName",
      scopedSlots: { customRender: "MitemName" },
      align: "center",
      width: "200px",
    },
    {
      title: "规格",
      dataIndex: "MitemName",
      scopedSlots: { customRender: "MitemName" },
      align: "center",
      width: "200px",
    },
    {
      title: "订单数量",
      dataIndex: "OrderQty",
      scopedSlots: { customRender: "OrderQty" },
      align: "center",
    },
    {
      title: "色温(K)",
      dataIndex: "PlanQty",
      scopedSlots: { customRender: "PlanQty" },
      align: "center",
      width: "100px",
    },
    {
      title: "产出数量(PCS)",
      dataIndex: "PlanQty",
      scopedSlots: { customRender: "PlanQty" },
      align: "center",
      width: "100px",
    },
    {
      title: "累计数量(PCS)",
      dataIndex: "PlanQty",
      scopedSlots: { customRender: "PlanQty" },
      align: "center",
      width: "100px",
    },
    {
      title: "生产人数",
      dataIndex: "PlanQty",
      scopedSlots: { customRender: "PlanQty" },
      align: "center",
      width: "100px",
    },
    {
      title: "工时(H)",
      dataIndex: "WorkHour",
      scopedSlots: { customRender: "WorkHour" },
      align: "center",
    },
    {
      title: "人均产能/H",
      dataIndex: "PerCapiteCapacity",
      scopedSlots: { customRender: "PerCapiteCapacity" },
      align: "center",
    },
    {
      title: "标准产能(PCS)",
      dataIndex: "MaterialShortage",
      scopedSlots: { customRender: "MaterialShortage" },
      align: "center",
      width: "150px",
    },
    {
      title: "达成率",
      dataIndex: "StartDateTime",
      scopedSlots: { customRender: "StartDateTime" },
      align: "center",
      width: "100px",
    },
    {
      title: "操作",
      scopedSlots: { customRender: "action" },
      align: "center",
      fixed: "right",
      width: 100,
    },
  ];