/*
 * @Author: max
 * @Date: 2022-05-11 11:49:33
 * @LastEditTime: 2022-05-11 15:13:42
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/specimen/departmental/data.js
 */
export const columns = [
    {
      title: "序号",
      scopedSlots: { customRender: "index" },
      align: "center",
      width:50,
    },
    {
      title: "公司名称",
      dataIndex: "EnterpriseName",
      scopedSlots: { customRender: "EnterpriseName" },
      align: "center",
    },
    {
      title: "部门名称",
      dataIndex: "DepartmentName",
      scopedSlots: { customRender: "DepartmentName" },
      align: "center",
    },
    {
      title: "接收人",
      dataIndex: "ReceiverList",
      scopedSlots: { customRender: "ReceiverList" },
      align: "center",
    },
    {
      title: "排序",
      dataIndex: "SortNumber",
      scopedSlots: { customRender: "SortNumber" },
      align: "center",
    },
    {
      title: "备注",
      dataIndex: "Remark",
      scopedSlots: { customRender: "Remark" },
      align: "center",
    },
    {
      title: "是否启用",
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