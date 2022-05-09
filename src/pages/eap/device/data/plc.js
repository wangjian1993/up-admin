/*
 * @Author: max
 * @Date: 2022-05-05 11:32:50
 * @LastEditTime: 2022-05-09 14:52:22
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/eap/device/data/plc.js
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
      title: "设备编码",
      dataIndex: "EquimentCode",
      scopedSlots: { customRender: "EquimentCode" },
      align: "center",
    },
    {
      title: "设备名称",
      dataIndex: "EquimentName",
      scopedSlots: { customRender: "EquimentName" },
      align: "center",
    },
    {
      title: "PLC编码",
      dataIndex: "PlcCode",
      scopedSlots: { customRender: "PlcCode" },
      align: "center",
    },
    {
      title: "PLC名称",
      dataIndex: "PlcName",
      scopedSlots: { customRender: "PlcName" },
      align: "center",
    },
    {
      title: "PLC地址端口",
      dataIndex: "PlcIp",
      scopedSlots: { customRender: "PlcIp" },
      align: "center",
      customRender: (text,record) => {
        return record.PlcIp + ":" +  record.PlcPort
      }
    },
    {
      title: "PLCMAC地址",
      dataIndex: "PlcMac",
      scopedSlots: { customRender: "PlcMac" },
      align: "center",
    },
    {
      title: "PLC类型",
      dataIndex: "PlcTypeName",
      scopedSlots: { customRender: "PlcTypeName" },
      align: "center",
    },
    {
      title: "PLC品牌",
      dataIndex: "PlcBrandName",
      scopedSlots: { customRender: "PlcBrandName" },
      align: "center",
    },
    {
      title: "PLC状态",
      dataIndex: "Status",
      scopedSlots: { customRender: "Status" },
      align: "center",
    },
    {
      title: "创建时间",
      dataIndex: "DatetimeCreated",
      scopedSlots: { customRender: "DatetimeCreated" },
      align: "center",
    },
    {
      title: "创建人",
      dataIndex: "UserCreated",
      scopedSlots: { customRender: "UserCreated" },
      align: "center",
    },
    {
      title: "操作",
      scopedSlots: { customRender: "action" },
      align: "center",
    },
  ];