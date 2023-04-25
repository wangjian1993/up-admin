/*
 * @Author: max
 * @Date: 2022-05-11 11:49:33
 * @LastEditTime: 2023-04-03 16:22:48
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/lamp/register/data.js
 */
export const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 50,
  },
  {
    title: "位号",
    dataIndex: "PlaceCode",
    scopedSlots: { customRender: "PlaceCode" },
    align: "center",
  },
  {
    title: "规格/型号/版本号",
    dataIndex: "ItemSpecification",
    scopedSlots: { customRender: "ItemSpecification" },
    align: "center",
  },
  {
    title: "物料编码",
    dataIndex: "ItemCode",
    scopedSlots: { customRender: "ItemCode" },
    align: "center",
  },
  {
    title: "尺寸",
    dataIndex: "Size",
    scopedSlots: { customRender: "Size" },
    align: "center",
  },
  {
    title: "备注/拼版",
    dataIndex: "Remark",
    scopedSlots: { customRender: "Remark" },
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "Status",
    scopedSlots: { customRender: "Status" },
    align: "center",
  },
  {
    title: "使用次数",
    dataIndex: "UseTimes",
    scopedSlots: { customRender: "UseTimes" },
    align: "center",
  },
  {
    title: "最后借出时间",
    dataIndex: "DatetimeLend",
    scopedSlots: { customRender: "DatetimeLend" },
    align: "center",
  },
  {
    title: "最后借出人",
    dataIndex: "UserLend",
    scopedSlots: { customRender: "UserLend" },
    align: "center",
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