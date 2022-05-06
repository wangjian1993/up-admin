/*
 * @Author: max
 * @Date: 2022-04-29 17:34:40
 * @LastEditTime: 2022-05-06 15:34:06
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/eap/mqtt/gateway/data/client.js
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
    title: "生产工厂",
    dataIndex: "PlantName",
    scopedSlots: { customRender: "PlantName" },
    align: "center",
  },
  {
    title: "车间名称",
    dataIndex: "WorkCenterName",
    scopedSlots: { customRender: "WorkCenterName" },
    align: "center",
  },
  {
    title: "产线名称",
    dataIndex: "LineName",
    scopedSlots: { customRender: "LineName" },
    align: "center",
  },
  {
    title: "MQTT客户端编码",
    dataIndex: "ClientName",
    scopedSlots: { customRender: "ClientName" },
    align: "center",
  },
  {
    title: "MQTT客户端名称",
    dataIndex: "ClientCode",
    scopedSlots: { customRender: "ClientCode" },
    align: "center",
  },
  {
    title: "连接的MQTT服务器",
    dataIndex: "ServerName",
    scopedSlots: { customRender: "ServerName" },
    align: "center",
  },
  {
    title: "关联设备",
    dataIndex: "EquipmentName",
    scopedSlots: { customRender: "EquipmentName" },
    align: "center",
  },
  {
    title: "连接协议类型",
    dataIndex: "ServerType",
    scopedSlots: { customRender: "ServerType" },
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "State",
    scopedSlots: { customRender: "State" },
    align: "center",
  },
  {
    title: "启动时间",
    dataIndex: "StartTime",
    scopedSlots: { customRender: "StartTime" },
    align: "center",
  },
  {
    title: "启动人",
    dataIndex: "UserId",
    scopedSlots: { customRender: "UserId" },
    align: "center",
  },
  {
    title: "执行路径",
    dataIndex: "Path",
    scopedSlots: { customRender: "Path" },
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];