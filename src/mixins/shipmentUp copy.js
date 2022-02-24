/*
 * @Author: max
 * @Date: 2022-02-11 13:53:25
 * @LastEditTime: 2022-02-24 10:50:44
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/mixins/shipmentUp.js
 */
import { exportjsontoexcelMore } from "@/utils/ExportExcel";
export const ShipmentExport = {
    data() {
        return {}
    },
    methods: {
        //分组
        handlerDatas(arr) {
            let obj = {};
            arr.forEach((item) => {
                let { Id } = item;
                if (!obj[Id]) {
                    obj[Id] = {
                        ...item,
                        group: [],
                    };
                }
                obj[Id].group.push(item);
            });
            let data = Object.values(obj); // 最终输出
            console.log(data);
            return data;
        },
        excelFn(record, type) {
            if (type == "all") {
                this.exportExcel(this.dataSource);
            } else if (type == "allPublic") {
                let list = [];
                this.dataSource.map((item, index) => {
                    let id = item.Id + "_" + index;
                    if (this.selectedRowKeys.includes(id)) {
                        list.push(item);
                    }
                });
                this.exportExcel(list);

            } else {
                let data = [];
                data.push(record);
                this.exportExcel(data);
            }
        },
        exportExcel(list) {
            console.log(list);
            let excelArray = [];
            list.map((listItme, index) => {
                let _data = [];
                let mergeTitle = [];
                let head = [];
                let head2 = [];
                let array = [];
                this.columns.map((item) => {
                    if (item.dataIndex) {
                        head.push(item.title);
                        array.push(listItme[item.dataIndex] || "");
                    }
                });
                _data.push(head);
                let nullArray = ["", "", "", "", "", "", "", ""];
                this.innerColumns.map((item) => {
                    if (item.dataIndex) {
                        head2.push(item.title);
                    }
                });
                _data.push(array);
                _data.push(head2.concat(nullArray));
                listItme.group.map((item) => {
                    let array = [];
                    this.innerColumns.map((items) => {
                        if (items.dataIndex) {
                            array.push(item[items.dataIndex] || "");
                        }
                    });
                    _data.push(array.concat(nullArray));
                });
                console.log(_data);
                const sheetCols = [
                    { wch: 18 }, // 序号
                    { wch: 18 }, // 阶次
                    { wch: 25 }, // 类型
                    { wch: 8 }, // 上阶BOM号
                    { wch: 8 }, // 品号
                    { wch: 8 }, // 料名
                    { wch: 10 }, //  产品规格
                    { wch: 8 }, // 单位
                    { wch: 8 }, // 价格来源
                    { wch: 8 }, // E10单价
                    { wch: 8 }, // 单价
                    { wch: 8 }, // 用量
                    { wch: 8 }, // 金额
                    { wch: 8 }, // 提示
                    { wch: 8 }, // 备注
                    { wch: 8 }, // 备注
                ];
                let contentList = [];
                let merges2 = []; // 设置表格内容单元格合并
                let aoa = [..._data, ...contentList]; // 导出的数据
                let merges = [...mergeTitle, ...merges2]; // 合并单元格
                let formStyle = {};
                excelArray.push({
                    Sheet: `${listItme.PiNumber}_${index + 1}`, // 下方tab切换名称
                    data: aoa, // 表格数据
                    merges, //  合并单元格
                    autoWidth: false, // 自适应宽度
                    formStyle: formStyle, // 特殊行或列样式
                    sheetCols,
                });
            });
            try {
                exportjsontoexcelMore({
                    dataList: excelArray,
                    bookType: "xlsx", // 导出类型
                    filename: "出货信息_", // 导出标题名
                });
                this.$message.success("导出数据成功!");
                this.selectedRowKeys = [];
            } catch (error) {
                this.$message.error("导出数据失败");
            }
        }
    },
}