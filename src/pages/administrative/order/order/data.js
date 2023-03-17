/*
 * @Author: max
 * @Date: 2022-05-11 11:49:33
 * @LastEditTime: 2023-03-17 10:26:26
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/administrative/order/address/data.js
 */
export const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 50,
  },
  {
    title: "点单公司",
    dataIndex: "CompanyName",
    scopedSlots: { customRender: "CompanyName" },
    align: "center",
  },
  {
    title: "点餐地址类型",
    dataIndex: "Type",
    scopedSlots: { customRender: "Type" },
    align: "center",
  },
  {
    title: "点单地点",
    dataIndex: "Place",
    scopedSlots: { customRender: "Place" },
    align: "center",
  },
  {
    title: "点单地点地址",
    dataIndex: "Address",
    scopedSlots: { customRender: "Address" },
    align: "center",
  },
  {
    title: "可点单人员",
    dataIndex: "Users",
    scopedSlots: { customRender: "Users" },
    align: "center",
  },
  {
    title: "创建人",
    dataIndex: "CreateUser",
    scopedSlots: { customRender: "CreateUser" },
    align: "center",
  },
  {
    title: "创建时间",
    dataIndex: "CreateDatetime",
    scopedSlots: { customRender: "CreateDatetime" },
    align: "center",
  },
  {
    title: "二维码",
    dataIndex: "QCode",
    scopedSlots: { customRender: "QCode" },
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "Enable",
    scopedSlots: { customRender: "Enable" },
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