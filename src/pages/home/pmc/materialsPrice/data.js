/*
 * @Author: max
 * @Date: 2022-04-14 11:32:32
 * @LastEditTime: 2022-04-14 14:01:04
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/pmc/materialsPrice/data.js
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
      title: "状态",
      dataIndex: "ApproveStatus",
      scopedSlots: { customRender: "ApproveStatus" },
      align: "center",
    },
    {
      title: "供应商编号",
      dataIndex: "SupplierCode",
      scopedSlots: { customRender: "SupplierCode" },
      align: "center",
    },
    {
      title: "供应商名称",
      dataIndex: "SupplierName",
      scopedSlots: { customRender: "SupplierName" },
      align: "center",
    },
    {
      title: "品号",
      dataIndex: "ItemCode",
      scopedSlots: { customRender: "ItemCode" },
      align: "center",
    },
    {
      title: "品名",
      dataIndex: "ItemName",
      scopedSlots: { customRender: "ItemName" },
      align: "center",
    },
    {
      title: "规格",
      dataIndex: "ItemSpecification",
      scopedSlots: { customRender: "ItemSpecification" },
      align: "center",
      width: "300px",
    },
    {
      title: "生效日期",
      scopedSlots: { customRender: "EffectiveDate" },
      align: "center",
    },
    {
      title: "失效日期",
      dataIndex: "IneffectiveDate",
      scopedSlots: { customRender: "IneffectiveDate" },
      align: "center",
    },
    {
      title: "采购单价",
      dataIndex: "Price",
      scopedSlots: { customRender: "Price" },
      align: "center",
    },
    {
      title: "含税",
      dataIndex: "TaxIncluded",
      scopedSlots: { customRender: "TaxIncluded" },
      align: "center",
    },
    {
      title: "分量计价",
      dataIndex: "ComponentPrice",
      scopedSlots: { customRender: "ComponentPrice" },
      align: "center",
    },
    {
      title: "开始数量",
      dataIndex: "BeginQty",
      scopedSlots: { customRender: "BeginQty" },
      align: "center",
    },
    {
      title: "结束数量",
      dataIndex: "EndQty",
      scopedSlots: { customRender: "EndQty" },
      align: "center",
    },
    {
      title: "单身采购单价",
      scopedSlots: { customRender: "PriceD" },
      align: "center",
    },
    {
      title: "描述",
      dataIndex: "Description",
      scopedSlots: { customRender: "Description" },
      align: "center",
      width:500
    },
  ];