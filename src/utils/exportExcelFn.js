/*
 * @Author: max
 * @Date: 2022-02-11 11:01:39
 * @LastEditTime: 2022-02-11 13:39:25
 * @LastEditors: max
 * @Description:
 * @FilePath: /up-admin/src/pages/home/shipment/agc/excel/exportexcel.js
 */
import ExportExcel from "@/utils/ExportExcelJS";
export function exportExcel(excelData, columns, orderNo) {
    return new Promise(function (resolve, reject) {
        const dataSource = excelData.map((item) => {
            Object.keys(item).forEach((key) => {
                // 后端传null node写入会有问题
                if (item[key] === null) {
                    item[key] = "";
                }
                if (Array.isArray(item[key])) {
                    item[key] = item[key].join(",");
                }
            });
            return item;
        });
        const header = [];
        columns.map((item) => {
            if (item.dataIndex) {
                header.push({ key: item.dataIndex, title: item.title });
            }
        });
        try {
            ExportExcel(header, dataSource, `出货信息_${orderNo}.xlsx`);
            resolve();
        } catch (error) {
            reject();
        }
    })
}
