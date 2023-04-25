/*
 * @Author: max
 * @Date: 2023-04-13 08:37:57
 * @LastEditTime: 2023-04-21 10:11:18
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/report/aging/data.js
 */
import { splitData } from '@/utils/util';
export const columnsData = [
  {
    title: "序号",
    dataIndex: "index",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 50,
  },
  {
    title: "生产工厂",
    dataIndex: "PlantName",
    scopedSlots: { customRender: "PlantName" },
    align: "center",
    width: 150,
  },
  {
    title: "生产车间",
    dataIndex: "WorkShopName",
    scopedSlots: { customRender: "WorkShopName" },
    align: "center",
    width: 150,
  },
  {
    title: "生产产线",
    dataIndex: "LineName",
    scopedSlots: { customRender: "LineName" },
    align: "center",
    width: 150,
  },
  {
    title: "生产日期",
    dataIndex: "ProDate",
    scopedSlots: { customRender: "ProDate" },
    align: "center",
    width: 100,
    customRender: (text) => {
      return splitData(text);
    }
  },
  {
    title: "订单号",
    dataIndex: "OrderNo",
    scopedSlots: { customRender: "OrderNo" },
    align: "center",
    width: 80,
  },
  {
    title: "订单数量",
    dataIndex: "OrderQty",
    scopedSlots: { customRender: "OrderQty" },
    align: "center",
    width: 90,
  },
  {
    title: "订单项",
    dataIndex: "OrderItem",
    scopedSlots: { customRender: "OrderItem" },
    align: "center",
    width: 80,
  },
  {
    title: "工单号",
    dataIndex: "MoCode",
    scopedSlots: { customRender: "MoCode" },
    align: "center",
    width: 100,
  },
  {
    title: "工单数量",
    dataIndex: "MoQty",
    scopedSlots: { customRender: "MoQty" },
    align: "center",
    width: 100,
  },
  {
    title: "成品编码",
    dataIndex: "ProCode",
    scopedSlots: { customRender: "ProCode" },
    align: "center",
    width: 100,
  },
  {
    title: "品名",
    dataIndex: "ProName",
    scopedSlots: { customRender: "ProName" },
    align: "center",
    width: 200,
  },
  {
    title: "规格",
    dataIndex: "ProSpec",
    scopedSlots: { customRender: "ProSpec" },
    align: "center",
    width: 300,
  },
  {
    title: "色温(K)",
    dataIndex: "ColorTemperature",
    scopedSlots: { customRender: "ColorTemperature" },
    align: "center",
    width: 100,
  },
  {
    title: "开始老化数量(PCS)",
    dataIndex: "StartQty",
    scopedSlots: { customRender: "StartQty" },
    align: "center",
    width: 150,
  },
  {
    title: "老化出站数量(PCS)",
    dataIndex: "FinishedQty",
    scopedSlots: { customRender: "FinishedQty" },
    align: "center",
    width: 150,
  },
  {
    title: "累计老化数量(PCS)",
    dataIndex: "CumulativeQty",
    scopedSlots: { customRender: "CumulativeQty" },
    align: "center",
    width: 150,
  },
  {
    title: "未老化数量(PCS)",
    dataIndex: "DeficiencyQty",
    scopedSlots: { customRender: "DeficiencyQty" },
    align: "center",
    width: 150,
  },
  {
    title: "开始老化时间",
    dataIndex: "StartDateTime",
    scopedSlots: { customRender: "StartDateTime" },
    align: "center",
    width: 150,
    customRender: (text) => {
      let str = text.split('T');
      let time = str[1].split('.')
      return str[0] + " " + time[0];
    }
  },
  {
    title: "完成老化时间",
    dataIndex: "FinishedDateTime",
    scopedSlots: { customRender: "FinishedDateTime" },
    align: "center",
    width: 150,
    customRender: (text) => {
      let str = text.split('T');
      let time = str[1].split('.')
      return str[0] + " " + time[0];
    }
  },
  {
    title: "老化用时(H)",
    dataIndex: "WorkHour",
    scopedSlots: { customRender: "WorkHour" },
    align: "center",
    width: 100,
  },
  {
    title: "达成率(%)",
    dataIndex: "CompletionRate",
    scopedSlots: { customRender: "CompletionRate" },
    align: "center",
    width: 100,
  },
];