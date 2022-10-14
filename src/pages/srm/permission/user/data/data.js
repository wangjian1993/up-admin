/*
 * @Author: max
 * @Date: 2022-04-30 14:05:19
 * @LastEditTime: 2022-09-29 11:11:07
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/srm/permission/user/data/data.js
 */

// import { splitData } from "@/utils/util.js";
export const columns = [
    {
      title: "序号",
      scopedSlots: { customRender: "index" },
      align: "center",
      width:50,
    },
    {
      title: "工号",
      dataIndex: "UserId",
      scopedSlots: { customRender: "UserId" },
      align: "center",
    },
    {
      title: "姓名",
      dataIndex: "Name",
      scopedSlots: { customRender: "Name" },
      align: "center",
    },
    {
      title: "部门",
      dataIndex: "Department",
      scopedSlots: { customRender: "Department" },
      align: "center",
    },
    {
      title: "公司权限",
      dataIndex: "CompanyCount",
      scopedSlots: { customRender: "CompanyCount" },
      align: "center",
    },
    {
      title: "操作",
      scopedSlots: { customRender: "action" },
      align: "center",
    },
  ];