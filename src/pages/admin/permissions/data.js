/*
 * @Author: max
 * @Date: 2022-04-22 10:13:52
 * @LastEditTime: 2022-04-22 10:48:37
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/admin/permissions/data.js
 */
export const columns = [
    {
      title: "序号",
      scopedSlots: { customRender: "index" },
      align: "center",
      width:50,
    },
    {
      title: "业务公司",
      dataIndex: "EnterpriseName",
      scopedSlots: { customRender: "EnterpriseName" },
      align: "center",
      width:300,
    },
    {
      title: "上级部门",
      dataIndex: "SurOrgName",
      scopedSlots: { customRender: "SurOrgName" },
      align: "center",
    },
    {
      title: "所属部门",
      dataIndex: "UserOrgName",
      scopedSlots: { customRender: "UserOrgName" },
      align: "center",
    },
    {
      title: "工号",
      dataIndex: "UserCode",
      scopedSlots: { customRender: "UserCode" },
      align: "center",
    },
    {
      title: "姓名",
      dataIndex: "UserName",
      scopedSlots: { customRender: "UserName" },
      align: "center",
    },
    {
      title: "应用名称",
      dataIndex: "AppName",
      scopedSlots: { customRender: "AppName" },
      align: "center",
      width: "300px",
    },
    {
      title: "应用菜单",
      dataIndex: "MoudleName",
      scopedSlots: { customRender: "MoudleName" },
      align: "center",
    },
    {
      title: "菜单权限",
      dataIndex: "PermissionMoudleName",
      scopedSlots: { customRender: "PermissionMoudleName" },
      align: "center",
    },
  ];