/*
 * @Author: max
 * @Date: 2022-04-27 09:50:33
 * @LastEditTime: 2022-05-03 10:29:34
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/pmc/materialsPrice/record.js
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
      title: "流水编号",
      dataIndex: "SerialNumber",
      scopedSlots: { customRender: "SerialNumber" },
      align: "center",
    },
    {
      title: "供应商编号",
      dataIndex: "SupplierCode",
      scopedSlots: { customRender: "SupplierCode" },
      align: "center",
    },
    {
      title: "面积",
      dataIndex: "Square",
      scopedSlots: { customRender: "Square" },
      align: "center",
    },
    {
      title: "基准价格(小于)",
      dataIndex: "JzPrice1",
      scopedSlots: { customRender: "JzPrice1" },
      align: "center",
    },
    {
      title: "基准价格(大于)",
      dataIndex: "JzPrice2",
      scopedSlots: { customRender: "JzPrice2" },
      align: "center",
    },
    {
      title: "品号",
      dataIndex: "ItemCode",
      scopedSlots: { customRender: "ItemCode" },
      align: "center",
    },
    {
      title: "铜厚",
      dataIndex: "ThStr",
      scopedSlots: { customRender: "ThStr" },
      align: "center",
    },
    {
      title: "耐压",
      dataIndex: "NyStr",
      scopedSlots: { customRender: "NyStr" },
      align: "center",
    },
    {
      title: "板厚",
      dataIndex: "BhStr",
      scopedSlots: { customRender: "BhStr" },
      align: "center",
    },
    {
      title: "生产工艺",
      dataIndex: "ScgyStr",
      scopedSlots: { customRender: "ScgyStr" },
      align: "center",
    },
    {
      title: "创建时间",
      dataIndex: "DatetimeCreated",
      scopedSlots: { customRender: "DatetimeCreated" },
      align: "center",
    },
    {
      title: "审核时间",
      dataIndex: "DatetimeApprove",
      scopedSlots: { customRender: "DatetimeApprove" },
      align: "center",
    },
    {
      title: "审核状态",
      dataIndex: "ApproveStatus",
      scopedSlots: { customRender: "ApproveStatus" },
      align: "center",
    },
    {
      title: "操作",
      scopedSlots: { customRender: "action" },
      align: "center",
    },
  ];