/*
 * @Author: max
 * @Date: 2022-05-11 11:49:33
 * @LastEditTime: 2022-08-12 16:37:24
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/specimen/report/data.js
 */
export const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 50,
  },
  {
    title: "公司名称",
    dataIndex: "CompanyName",
    scopedSlots: { customRender: "CompanyName" },
    align: "center",
    width: 120,
  },
  {
    title: "订单日期",
    dataIndex: "DocDate",
    scopedSlots: { customRender: "DocDate" },
    align: "center",
    width: 120,
  },
  {
    title: "采购订单",
    dataIndex: "DocNo",
    scopedSlots: { customRender: "DocNo" },
    align: "center",
    width: 120,
  },
  {
    title: "品名",
    dataIndex: "ItemCode",
    scopedSlots: { customRender: "ItemCode" },
    align: "center",
    width: 120,
  },
  {
    title: "品号",
    dataIndex: "ItemName",
    scopedSlots: { customRender: "ItemName" },
    align: "center",
    width: 120,
  },
  {
    title: "规格",
    dataIndex: "ItemSpecification",
    scopedSlots: { customRender: "ItemSpecification" },
    align: "center",
    width: 350
  },
  {
    title: "图号",
    dataIndex: "DrawingNo",
    scopedSlots: { customRender: "DrawingNo" },
    align: "center",
  },
  {
    title: "采购员",
    dataIndex: "Purchaser",
    scopedSlots: { customRender: "Purchaser" },
    align: "center",
    width: 80,
  },
  {
    title: "采购次数",
    dataIndex: "TransactionTimes",
    scopedSlots: { customRender: "TransactionTimes" },
    align: "center",
    width: 80,
  },
  {
    title: "供应商编码",
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
    title: "是否签样",
    dataIndex: "IsQy",
    scopedSlots: { customRender: "IsQy" },
    align: "center",
    width: 80,
  }
];
export const innerColumns = [{
  title: " 顺序",
  dataIndex: "index",
  scopedSlots: { customRender: "index" },
  align: "center",
}, {
  title: "接收部门",
  dataIndex: "DepartmentName",
  scopedSlots: { customRender: "DepartmentName" },
  align: "center",
}, {
  title: "接收人",
  dataIndex: "ReceiverList",
  scopedSlots: { customRender: "ReceiverList" },
  align: "center",
}];
export const detailColumns = [
  {
    title: "顺序",
    dataIndex: "SortNumber",
    scopedSlots: { customRender: "SortNumber" },
    align: "center",
  },
  {
    title: "接收部门",
    dataIndex: "DepartmentName",
    scopedSlots: { customRender: "DepartmentName" },
    align: "center",
  },
  {
    title: "接收人",
    dataIndex: "Receiver",
    scopedSlots: { customRender: "Receiver" },
    align: "center",
    width: "30%",
  },
  {
    title: "接收时间",
    dataIndex: "DatetimeReceive",
    scopedSlots: { customRender: "DatetimeReceive" },
    align: "center",
  },
  {
    title: "实际处理人",
    dataIndex: "UserHandlerActual",
    scopedSlots: { customRender: "UserHandlerActual" },
    align: "center",
  },
  {
    title: "实际处理时间",
    dataIndex: "DatetimeHandlerActual",
    scopedSlots: { customRender: "DatetimeHandlerActual" },
    align: "center",
  },
  {
    title: "处理耗时",
    dataIndex: "DatetimeHandlerSpend",
    scopedSlots: { customRender: "DatetimeHandlerSpend" },
    align: "center",
  },
  {
    title: "处理状态",
    dataIndex: "PointStatus",
    scopedSlots: { customRender: "PointStatus" },
    align: "center",
  },
  {
    title: "备注",
    dataIndex: "Remark",
    scopedSlots: { customRender: "Remark" },
    align: "center",
  }
];