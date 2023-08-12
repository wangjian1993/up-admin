/*
 * @Author: max
 * @Date: 2022-05-11 11:49:33
 * @LastEditTime: 2023-07-05 11:18:17
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/specimen/document/data.js
 */
export const columnsData = [
  {
    title: "序号",
    dataIndex: "index",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 50,
    fixed: "left",
  },
  {
    title: "流程编码",
    dataIndex: "FlowCode",
    scopedSlots: { customRender: "FlowCode" },
    align: "center",
    fixed: "left",
    width: 120,
  },
  {
    title: "采购送样日期",
    dataIndex: "DatetimePurchaseDeliver",
    scopedSlots: { customRender: "DatetimePurchaseDeliver" },
    align: "center",
    fixed: "left",
    width: 120,
  },
  {
    title: "物料编码",
    dataIndex: "ItemCode",
    scopedSlots: { customRender: "ItemCode" },
    align: "center",
    fixed: "left",
    width: 120,
  },
  {
    title: "物料名称",
    dataIndex: "ItemName",
    scopedSlots: { customRender: "ItemName" },
    align: "center",
    fixed: "left",
    width: 120,
  },
  {
    title: "物料型号",
    dataIndex: "ItemSpecification",
    scopedSlots: { customRender: "ItemSpecification" },
    align: "center",
    width:350
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
    title: "供应商",
    dataIndex: "Supplier",
    scopedSlots: { customRender: "Supplier" },
    align: "center",
  },
  {
    title: "是否有承认书",
    dataIndex: "HasApprovalSheet",
    scopedSlots: { customRender: "HasApprovalSheet" },
    align: "center",
  },
  {
    title: "数量",
    dataIndex: "Quantity",
    scopedSlots: { customRender: "Quantity" },
    align: "center",
  },
  {
    title: "送样采购员",
    dataIndex: "Purchaser",
    scopedSlots: { customRender: "Purchaser" },
    align: "center",
  },
  {
    title: "采购取回样品日期",
    dataIndex: "DatetimePurchaseRetrieve",
    scopedSlots: { customRender: "DatetimePurchaseRetrieve" },
    align: "center",
  },
  {
    title: "样品类型",
    dataIndex: "SampleCategory",
    scopedSlots: { customRender: "SampleCategory" },
    align: "center",
  },
  {
    title: "受控公司",
    dataIndex: "CtrledCompany",
    scopedSlots: { customRender: "CtrledCompany" },
    align: "center",
  },
  {
    title: "采购备注",
    dataIndex: "Remark1",
    scopedSlots: { customRender: "Remark1" },
    align: "center",
  },
  {
    title: "签样工程师",
    dataIndex: "SignEngineer",
    scopedSlots: { customRender: "SignEngineer" },
    align: "center",
  },
  {
    title: "承认部门",
    dataIndex: "ApprovalDepartment",
    scopedSlots: { customRender: "ApprovalDepartment" },
    align: "center",
  },
  {
    title: "签样时间",
    dataIndex: "DatetimeSign",
    scopedSlots: { customRender: "DatetimeSign" },
    align: "center",
  },
  {
    title: "签样结果",
    dataIndex: "SignResult",
    scopedSlots: { customRender: "SignResult" },
    align: "center",
  },
  {
    title: "研发/工程备注",
    dataIndex: "Remark2",
    scopedSlots: { customRender: "Remark2" },
    align: "center",
  },
  {
    title: "受控状态",
    dataIndex: "CtrledStatus",
    scopedSlots: { customRender: "CtrledStatus" },
    align: "center",
  },
  {
    title: "受控日期",
    dataIndex: "DatetimeCtrled",
    scopedSlots: { customRender: "DatetimeCtrled" },
    align: "center",
  },
  {
    title: "受控异常描述",
    dataIndex: "CtrledAbnormalDescription",
    scopedSlots: { customRender: "CtrledAbnormalDescription" },
    align: "center",
  },
  {
    title: "异常处理情况",
    dataIndex: "CtrledAbnormalHandleStatus",
    scopedSlots: { customRender: "CtrledAbnormalHandleStatus" },
    align: "center",
  }, {
    title: "异常处理日期",
    dataIndex: "DatetimeCtrledAbnormalHandle",
    scopedSlots: { customRender: "DatetimeCtrledAbnormalHandle" },
    align: "center",
  }, {
    title: "文控备注",
    dataIndex: "Remark3",
    scopedSlots: { customRender: "Remark3" },
    align: "center",
  }, {
    title: "IQC收样日期",
    dataIndex: "DatetimeQicCollect",
    scopedSlots: { customRender: "DatetimeQicCollect" },
    align: "center",
  }, {
    title: "IQC备注",
    dataIndex: "Remark4",
    scopedSlots: { customRender: "Remark4" },
    align: "center",
  },
  {
    title: "流程发起部门",
    dataIndex: "DepartmentName",
    scopedSlots: { customRender: "DepartmentName" },
    align: "center",
  },
  {
    title: "填表发起人/导入人",
    dataIndex: "UserCreated",
    scopedSlots: { customRender: "UserCreated" },
    align: "center",
  },
  {
    title: "发起人备注",
    dataIndex: "Remark",
    scopedSlots: { customRender: "Remark" },
    align: "center",
  },
  {
    title: "发起日期/导入日期",
    dataIndex: "DatetimeCreated",
    scopedSlots: { customRender: "DatetimeCreated" },
    align: "center",
  },
  {
    title: "文控处理时间",
    dataIndex: "DatetimeHandlerActualWk",
    scopedSlots: { customRender: "DatetimeHandlerActualWk" },
    align: "center",
  },
  {
    title: "是否有RoHS报告",
    dataIndex: "HasRohsReport",
    scopedSlots: { customRender: "HasRohsReport" },
    align: "center",
  },
  {
    title: "是否有REACH报告",
    dataIndex: "HasReachReport",
    scopedSlots: { customRender: "HasReachReport" },
    align: "center",
  },
  {
    title: "自动生成命名",
    dataIndex: "AutoName",
    scopedSlots: { customRender: "AutoName" },
    align: "center",
    width:200
  },
  {
    title: "回退原因",
    dataIndex: "ReturnReason",
    scopedSlots: { customRender: "ReturnReason" },
    align: "center",
    width:200
  },
  {
    title: "存放公司",
    dataIndex: "StoredCompany",
    scopedSlots: { customRender: "StoredCompany" },
    align: "center",
    width:80
  },
  {
    title: "储存位置",
    dataIndex: "StoredLocation",
    scopedSlots: { customRender: "StoredLocation" },
    align: "center",
    width:80
  },
  {
    title: "状态",
    dataIndex: "TableStatus",
    fixed: "right",
    scopedSlots: { customRender: "TableStatus" },
    align: "center",
    width:80
  },
  {
    title: "操作",
    dataIndex: "action",
    scopedSlots: { customRender: "action" },
    fixed: "right",
    align: "center",
    width: 100
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