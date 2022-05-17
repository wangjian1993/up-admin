/*
 * @Author: max
 * @Date: 2021-11-18 08:48:13
 * @LastEditTime: 2022-05-17 10:53:23
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/erp/BomPack/data.js
 */
export const columns = [
    {
        title: "序号",
        scopedSlots: { customRender: "index" },
        align: "center",
    },
    {
        title: "品号",
        dataIndex: "ITEM_CODE",
        scopedSlots: { customRender: "ITEM_CODE" },
        align: "left",
    },
    {
        title: "品名",
        dataIndex: "ITEM_NAME",
        scopedSlots: { customRender: "ITEM_NAME" },
        align: "left",
    },
    {
        title: "规格",
        dataIndex: "ITEM_SPECIFICATION",
        scopedSlots: { customRender: "ITEM_SPECIFICATION" },
        align: "left",
    },
];