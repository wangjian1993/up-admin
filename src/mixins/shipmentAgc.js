/*
 * @Author: max
 * @Date: 2022-02-11 13:53:25
 * @LastEditTime: 2022-02-11 13:55:29
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/mixins/shipmentUp.js
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