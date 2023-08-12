/*
 * @Author: max
 * @Date: 2022-05-11 11:49:33
 * @LastEditTime: 2023-07-05 10:57:28
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/specimen/location/data.js
 */
export const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 50,
  },
  {
    title: "品号",
    dataIndex: "ItemCode",
    scopedSlots: { customRender: "ItemCode" },
    align: "center",
    width: 120,
  },
  {
    title: "品名",
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
    title: "签样日期",
    dataIndex: "DatetimeSign",
    scopedSlots: { customRender: "DatetimeSign" },
    align: "center",
  },
  {
    title: "存放公司",
    dataIndex: "StoredCompanyName",
    scopedSlots: { customRender: "StoredCompanyName" },
    align: "center",
  },
  {
    title: "储存位置",
    dataIndex: "StoredLocation",
    scopedSlots: { customRender: "StoredLocation" },
    align: "center",
  },
  {
    title: "OA是否作废",
    dataIndex: "IsOaNg",
    scopedSlots: { customRender: "IsOaNg" },
    align: "center",
    customRender: (text) => {
      if (text === 'Y') return '是'
      if (text === 'N') return '否'
    }
  },
  {
    title: "是否从IQC回收签样",
    dataIndex: "IsIqcRecovery",
    scopedSlots: { customRender: "IsIqcRecovery" },
    align: "center",
    customRender: (text) => {
      if (text === 'Y') return '是'
      if (text === 'N') return '否'
    }
  },
  {
    title: "所回收的资料登记",
    dataIndex: "RecoveryInfo",
    scopedSlots: { customRender: "RecoveryInfo" },
    align: "center",
  },
  {
    title: "备注",
    dataIndex: "Remark",
    scopedSlots: { customRender: "Remark" },
    align: "center",
    width: 80
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
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