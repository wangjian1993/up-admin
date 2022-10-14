/*
 * @Author: max
 * @Date: 2022-04-30 14:05:19
 * @LastEditTime: 2022-09-28 08:48:56
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/srm/purchase/supplier/data/list.js
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
      title: "供应商",
      dataIndex: "SupplierFullName",
      scopedSlots: { customRender: "SupplierFullName" },
      align: "center",
    },
    {
      title: "ERP分类",
      dataIndex: "ClassName",
      scopedSlots: { customRender: "ClassName" },
      align: "center",
    },
    {
      title: "状态",
      dataIndex: "Status",
      scopedSlots: { customRender: "Status" },
      align: "center",
    },
    {
      title: "待上传",
      dataIndex: "UploadCount",
      scopedSlots: { customRender: "UploadCount" },
      align: "center",
    },
    {
      title: "待审核",
      dataIndex: "AuditCount",
      scopedSlots: { customRender: "AuditCount" },
      align: "center",
    },
    {
      title: "已确认",
      dataIndex: "ConfirmCount",
      scopedSlots: { customRender: "ConfirmCount" },
      align: "center",
    },
    {
      title: "已过期",
      dataIndex: "ExpiredCount",
      scopedSlots: { customRender: "ExpiredCount" },
      align: "center",
    },
    {
      title: "操作",
      scopedSlots: { customRender: "action" },
      align: "center",
    },
  ];