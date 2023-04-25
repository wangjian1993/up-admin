/*
 * @Author: max
 * @Date: 2022-05-11 11:49:33
 * @LastEditTime: 2023-04-25 15:13:24
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/borrowed/sop/data.js
 */
export const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 50,
  },
  {
    title: "文件夹编码",
    dataIndex: "FolderNo",
    scopedSlots: { customRender: "FolderNo" },
    align: "center",
  },
  {
    title: "日期",
    dataIndex: "Date",
    scopedSlots: { customRender: "Date" },
    align: "center",
  },
  {
    title: "文件名称",
    dataIndex: "FileName",
    scopedSlots: { customRender: "FileName" },
    align: "center",
  },
  {
    title: "文件编号",
    dataIndex: "FileNo",
    scopedSlots: { customRender: "FileNo" },
    align: "center",
  },
  {
    title: "编号",
    dataIndex: "No",
    scopedSlots: { customRender: "No" },
    align: "center",
  },
  {
    title: "版本",
    dataIndex: "Version",
    scopedSlots: { customRender: "Version" },
    align: "center",
  },
  {
    title: "页数",
    dataIndex: "PageCount",
    scopedSlots: { customRender: "PageCount" },
    align: "center",
  },
  {
    title: "共用",
    dataIndex: "Other",
    scopedSlots: { customRender: "Other" },
    align: "center",
  },
  {
    title: "备注",
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
    dataIndex: "UseCount",
    scopedSlots: { customRender: "UseCount" },
    align: "center",
  },
  {
    title: "最近借出时间",
    dataIndex: "LastTime",
    scopedSlots: { customRender: "LastTime" },
    align: "center",
  },
  {
    title: "最近借出人",
    dataIndex: "LastUser",
    scopedSlots: { customRender: "LastUser" },
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];