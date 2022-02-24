/*
 * @Author: max
 * @Date: 2022-02-11 13:53:25
 * @LastEditTime: 2022-02-24 13:40:55
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
        //获取当前时间
        getNowTime() {
            var date = new Date();
            //年 getFullYear()：四位数字返回年份
            var year = date.getFullYear();  //getFullYear()代替getYear()
            //月 getMonth()：0 ~ 11
            var month = date.getMonth() + 1;
            //日 getDate()：(1 ~ 31)
            var day = date.getDate();
            //时 getHours()：(0 ~ 23)
            var hour = date.getHours();
            //分 getMinutes()： (0 ~ 59)
            var minute = date.getMinutes();
            //秒 getSeconds()：(0 ~ 59)
            var second = date.getSeconds();

            var time = year + '-' + this.addZero(month) + '-' + this.addZero(day) + ' ' + this.addZero(hour) + ':' + this.addZero(minute) + ':' + this.addZero(second);
            return time;
        },
        //小于10的拼接上0字符串
        addZero(s) {
            return s < 10 ? ('0' + s) : s;
        },
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
            // console.log(data);
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
            let excelArray = [];
            let _data = [];
            let mergeTitle = [];
            let head = [];
            let headArray = this.columns.concat(this.innerColumns);
            let startR = 1
            let endR = 0
            this.columns.map((item) => {
                if (item.dataIndex) {
                    head.push(item.title);
                    // array.push(listItme[item.dataIndex] || "");
                }
            });
            this.innerColumns.map((item) => {
                if (item.dataIndex) {
                    head.push(item.title);
                }
            });
            _data.push(head);
            list.map((listItme) => {
                listItme.group.map((item) => {
                    let array = [];
                    headArray.map((items) => {
                        if (items.dataIndex) {
                            array.push(item[items.dataIndex] || "");
                        }
                    });
                    _data.push(array);
                });
                for (let index = 0; index < 13; index++) {
                    mergeTitle.push({
                        s: { r: startR, c: index },
                        e: { r: listItme.group.length + endR, c: index },
                    });
                }
                startR += listItme.group.length;
                endR += listItme.group.length

            });
            const sheetCols = [
                { wch: 10 }, // 序号
                { wch: 10 }, // 阶次
                { wch: 10 }, // 类型
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
                { wch: 18 }, // 提示
                { wch: 18 }, // 备注
                { wch: 20 }, // 备注
                { wch: 10 }, // 备注
                { wch: 10 }, // 备注
            ];
            let contentList = [];
            let merges2 = []; // 设置表格内容单元格合并
            let aoa = [..._data, ...contentList]; // 导出的数据
            let merges = [...mergeTitle, ...merges2]; // 合并单元格
            let formStyle = {};
            excelArray.push({
                Sheet: '批量导出', // 下方tab切换名称
                data: aoa, // 表格数据
                merges, //  合并单元格
                autoWidth: false, // 自适应宽度
                formStyle: formStyle, // 特殊行或列样式
                sheetCols,
            });
            let style = {
                //居中属性
                font: {
                    name: "宋体",
                    sz: 9
                },
                alignment: {
                    wrapText: 1,
                    horizontal: "center",
                    vertical: "center",
                    indent: 0,
                }
            }
            try {
                exportjsontoexcelMore({
                    dataList: excelArray,
                    bookType: "xlsx", // 导出类型
                    filename: "出货信息_" + this.getNowTime(), // 导出标题名
                }, style);
                this.$message.success("导出数据成功!");
                this.selectedRowKeys = [];
            } catch (error) {
                this.$message.error("导出数据失败");
            }
        }
    },
}