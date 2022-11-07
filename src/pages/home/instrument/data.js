/*
 * @Author: max
 * @Date: 2022-05-11 11:49:33
 * @LastEditTime: 2022-10-29 14:31:13
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/instrument/data.js
 */
export const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 50,
  },
  {
    title: "证书编号",
    dataIndex: "CertCode",
    scopedSlots: { customRender: "CertCode" },
    align: "center",
  },
  {
    title: "设备名称",
    dataIndex: "InstrumentName",
    scopedSlots: { customRender: "InstrumentName" },
    align: "center",
  },
  {
    title: "制造商",
    dataIndex: "Manufacturer",
    scopedSlots: { customRender: "Manufacturer" },
    align: "center",
  },
  {
    title: "型号",
    dataIndex: "InstrumentCode",
    scopedSlots: { customRender: "InstrumentCode" },
    align: "center",
  },
  {
    title: "固定资产编号",
    dataIndex: "PropertyCode",
    scopedSlots: { customRender: "PropertyCode" },
    align: "center",
  },
  {
    title: "出厂编号",
    dataIndex: "FactoryNo",
    scopedSlots: { customRender: "FactoryNo" },
    align: "center",
  },
  {
    title: "使用部门",
    dataIndex: "UseDepartment",
    scopedSlots: { customRender: "UseDepartment" },
    align: "center",
  },
  {
    title: "使用区域",
    dataIndex: "UseArea",
    scopedSlots: { customRender: "UseArea" },
    align: "center",
  },
  {
    title: "仪器负责人",
    dataIndex: "InstPerInCharge",
    scopedSlots: { customRender: "InstPerInCharge" },
    align: "center",
  },
  {
    title: "校准日期",
    dataIndex: "CalibrateDate",
    scopedSlots: { customRender: "CalibrateDate" },
    align: "center",
  },
  {
    title: "有效日期",
    dataIndex: "EffectiveDate",
    scopedSlots: { customRender: "EffectiveDate" },
    align: "center",
  },
  {
    title: "剩余天数",
    dataIndex: "DaysRemaining",
    scopedSlots: { customRender: "DaysRemaining" },
    align: "center",
  },
  {
    title: "计划校准月份",
    dataIndex: "PlanCaliMonth",
    scopedSlots: { customRender: "PlanCaliMonth" },
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "Status",
    scopedSlots: { customRender: "Status" },
    align: "center",
    width:80
  },
  {
    title: "校准方式",
    dataIndex: "CalibrateWay",
    scopedSlots: { customRender: "CalibrateWay" },
    align: "center",
  },
  {
    title: "备注",
    dataIndex: "Remark",
    scopedSlots: { customRender: "Remark" },
    align: "center",
  },
  {
    title: "导入时间",
    dataIndex: "DatetimeCreated",
    scopedSlots: { customRender: "DatetimeCreated" },
    align: "center",
  },
  {
    title: "更新时间",
    dataIndex: "DatetimeModified",
    scopedSlots: { customRender: "DatetimeModified" },
    align: "center",
  },
  {
    title: "操作",
    fixed: "right",
    scopedSlots: { customRender: "action" },
    align: "center",
    width:80
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