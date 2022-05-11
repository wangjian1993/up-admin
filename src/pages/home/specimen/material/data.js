/*
 * @Author: max
 * @Date: 2022-05-11 11:49:33
 * @LastEditTime: 2022-05-11 15:49:57
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/specimen/material/data.js
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
      title: "物料编码范围",
      dataIndex: "MaterialPrefix",
      scopedSlots: { customRender: "MaterialPrefix" },
      align: "center",
    },
    {
      title: "权限用户名单",
      dataIndex: "PermissionUserList",
      scopedSlots: { customRender: "PermissionUserList" },
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