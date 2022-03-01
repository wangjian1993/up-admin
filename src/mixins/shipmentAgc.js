/*
 * @Author: max
 * @Date: 2022-02-11 13:53:25
 * @LastEditTime: 2022-02-25 10:13:31
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/mixins/shipmentAgc.js
 */
import { exportExcel } from "@/utils/exportExcelFn.js";
export const ShipmentExport = {
    data() {
        return {

        }
    },
    methods: {
        exportExcel(record, type) {
            let parmas = [];
            let id = "";
            if (type != "all") {
                parmas.push(record);
                id = record.PiNumber;
            } else {
                if (this.dataSource.length == 0) {
                    return;
                }
                parmas = this.dataSource;
                id = this.dataSource[0].PiNumber;
            }
            parmas.forEach(item => {
                item.StatusCheck = item.StatusCheck == 2 ? '未处理' : item.StatusCheck == 1 ? '已处理' : '不需要处理';
                item.IsShipment = item.IsShipment == 'N' ? '未出货' : '已出货';
            });
            console.log(parmas);
            exportExcel(parmas, this.columns, id)
                .then(() => {
                    this.$message.success("导出成功!");
                })
                .catch(() => {
                    this.$message.error("导出错误!");
                });
        },
    },
}