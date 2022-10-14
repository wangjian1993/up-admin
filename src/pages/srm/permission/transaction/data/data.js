/*
 * @Author: max
 * @Date: 2022-04-30 14:05:19
 * @LastEditTime: 2022-09-28 11:46:21
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/srm/permission/transaction/data/data.js
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
      title: "供应商权限",
      dataIndex: "SupplierCount",
      scopedSlots: { customRender: "SupplierCount" },
      align: "center",
    },
    {
      title: "操作",
      scopedSlots: { customRender: "action" },
      align: "center",
    },
  ];