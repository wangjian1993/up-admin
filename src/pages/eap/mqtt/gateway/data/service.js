/*
 * @Author: max
 * @Date: 2022-04-29 17:35:33
 * @LastEditTime: 2022-06-01 17:54:35
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/eap/mqtt/gateway/data/service.js
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
      title: "MQTT服务编码",
      dataIndex: "ServerCode",
      scopedSlots: { customRender: "ServerCode" },
      align: "center",
    },
    {
      title: "MQTT服务名称",
      dataIndex: "ServerName",
      scopedSlots: { customRender: "ServerName" },
      align: "center",
    },
    {
      title: "服务器IP",
      dataIndex: "ServerIP",
      scopedSlots: { customRender: "ServerIP" },
      align: "center",
    },
    {
      title: "服务类型/端口",
      dataIndex: "Ports",
      scopedSlots: { customRender: "Ports" },
      align: "center",
    },
    {
      title: "状态",
      dataIndex: "State",
      scopedSlots: { customRender: "State" },
      align: "center",
    },
    {
      title: "服务启动时间",
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