/*
 * @Author: max
 * @Date: 2022-05-11 11:49:33
 * @LastEditTime: 2022-09-02 15:49:54
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/arrival/list/data.js
 */
import { splitData } from '@/utils/util'
export const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 50,
  },
  {
    title: "到货单号",
    dataIndex: "DocNo",
    scopedSlots: { customRender: "DocNo" },
    align: "center",
  },
  {
    title: "单据类型",
    dataIndex: "DocName",
    scopedSlots: { customRender: "DocName" },
    align: "center",
  },
  {
    title: "供应商送货单号",
    dataIndex: "OrderNo",
    scopedSlots: { customRender: "OrderNo" },
    align: "center",
  },
  {
    title: "单据日期",
    dataIndex: "DocDate",
    scopedSlots: { customRender: "DocDate" },
    align: "center",
    customRender: (text) => {
      return splitData(text);
    }
  },
  {
    title: "到货日期",
    dataIndex: "ArrivalDate",
    scopedSlots: { customRender: "ArrivalDate" },
    align: "center",
    customRender: (text) => {
      return splitData(text);
    }
  },
  {
    title: "工厂名称",
    dataIndex: "CompanyName",
    scopedSlots: { customRender: "CompanyName" },
    align: "center",
  },
  {
    title: "供应商编号",
    dataIndex: "SupplierCode",
    scopedSlots: { customRender: "SupplierCode" },
    align: "center",
  },
  {
    title: "供应商全称",
    dataIndex: "SupplierName",
    scopedSlots: { customRender: "SupplierName" },
    align: "center",
  },
  {
    title: "入库状态",
    dataIndex: "SignStatus",
    scopedSlots: { customRender: "SignStatus" },
    align: "center",
  },
  {
    title: "签核状态",
    dataIndex: "ReceiptedStatus",
    scopedSlots: { customRender: "ReceiptedStatus" },
    align: "center",
  },
  {
    title: "打印状态",
    dataIndex: "PrintStatus",
    scopedSlots: { customRender: "PrintStatus" },
    align: "center",
  },
  {
    title: "打印日期",
    dataIndex: "PrintDate",
    scopedSlots: { customRender: "PrintDate" },
    align: "center",
    customRender: (text) => {
      return splitData(text);
    }
  },
  {
    title: "打印次数",
    dataIndex: "PrintCount",
    scopedSlots: { customRender: "PrintCount" },
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];