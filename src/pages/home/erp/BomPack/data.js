/*
 * @Author: max
 * @Date: 2021-11-18 08:48:13
 * @LastEditTime: 2022-10-21 15:26:11
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/erp/BomPack/data.js
 */
export const columns = [
    {
        title: "序号",
        scopedSlots: { customRender: "index" },
        align: "center",
        width:"5%"
    },
    {
        title: "品号",
        dataIndex: "ITEM_CODE",
        scopedSlots: { customRender: "ITEM_CODE" },
        align: "left",
        width:"10%"
    },
    {
        title: "品名",
        dataIndex: "ITEM_NAME",
        scopedSlots: { customRender: "ITEM_NAME" },
        align: "left",
        width:"15%"
    },
    {
        title: "规格",
        dataIndex: "ITEM_SPECIFICATION",
        scopedSlots: { customRender: "ITEM_SPECIFICATION" },
        align: "left",
    },
];