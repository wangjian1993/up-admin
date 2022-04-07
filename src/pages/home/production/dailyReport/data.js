/*
 * @Author: max
 * @Date: 2022-04-01 17:38:43
 * @LastEditTime: 2022-04-07 15:54:56
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/dailyReport/data.js
 */
/*
 * @Author: max
 * @Date: 2021-11-15 09:05:35
 * @LastEditTime: 2021-11-17 15:05:28
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/dailyPlan/data.js
 */
import { splitData } from "@/utils/util.js";
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
      title: "生产车间",
      dataIndex: "WorkShopName",
      scopedSlots: { customRender: "WorkShopName" },
      align: "center",
    },
    {
      title: "产线",
      dataIndex: "LineName",
      scopedSlots: { customRender: "LineName" },
      align: "center",
    },
    {
      title: "生产日期",
      dataIndex: "ProDate",
      scopedSlots: { customRender: "ProDate" },
      align: "center",
      customRender: (text) => {
        return splitData(text);
      }
    },
    {
      title: "生产时间段",
      dataIndex: "ProTimeQuantum",
      scopedSlots: { customRender: "ProTimeQuantum" },
      align: "center",
    },
    {
      title: "订单号",
      dataIndex: "OrderNo",
      scopedSlots: { customRender: "OrderNo" },
      align: "center",
    },
    {
      title: "订单数量",
      dataIndex: "OrderQty",
      scopedSlots: { customRender: "OrderQty" },
      align: "center",
    },
    {
      title: "工单号",
      dataIndex: "MoCode",
      scopedSlots: { customRender: "MoCode" },
      align: "center",
    },
    {
      title: "工单数量",
      dataIndex: "MoQty",
      scopedSlots: { customRender: "MoQty" },
      align: "center",
    },
    {
      title: "成品编码",
      dataIndex: "ProCode",
      scopedSlots: { customRender: "ProCode" },
      align: "center",
    },
    {
      title: "品名",
      dataIndex: "ProName",
      scopedSlots: { customRender: "ProName" },
      align: "center",
      width: "200px",
    },
    {
      title: "规格",
      dataIndex: "ProSpec",
      scopedSlots: { customRender: "ProSpec" },
      align: "center",
      width: "300px",
    },
    {
      title: "色温(K)",
      dataIndex: "ColorTemperature",
      scopedSlots: { customRender: "ColorTemperature" },
      align: "center",
      width: "100px",
    },
    {
      title: "产出数量(PCS)",
      dataIndex: "ProQty",
      scopedSlots: { customRender: "ProQty" },
      align: "center",
      width: "100px",
    },
    {
      title: "累计数量(PCS)",
      dataIndex: "CumulativeQty",
      scopedSlots: { customRender: "CumulativeQty" },
      align: "center",
      width: "100px",
    },
    {
      title: "尚欠数量(PCS)",
      dataIndex: "DeficiencyQty",
      scopedSlots: { customRender: "DeficiencyQty" },
      align: "center",
      width: "100px",
    },
    {
      title: "生产人数",
      dataIndex: "ProPerQty",
      scopedSlots: { customRender: "ProPerQty" },
      align: "center",
      width: "100px",
    },
    {
      title: "工时(H)",
      dataIndex: "WorkHour",
      scopedSlots: { customRender: "WorkHour" },
      align: "center",
    },
    {
      title: "人均产能/H",
      dataIndex: "PerCapitaCapacity",
      scopedSlots: { customRender: "PerCapitaCapacity" },
      align: "center",
    },
    {
      title: "标准产能(PCS)",
      dataIndex: "StandardCapitaCapacity",
      scopedSlots: { customRender: "StandardCapitaCapacity" },
      align: "center",
      width: "150px",
    },
    {
      title: "达成率(%)",
      dataIndex: "CompletionRate",
      scopedSlots: { customRender: "CompletionRate" },
      align: "center",
      width: "100px",
    },
  ];