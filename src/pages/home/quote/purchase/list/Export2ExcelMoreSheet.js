/*
 * @Author: max
 * @Date: 2021-09-22 16:54:53
 * @LastEditTime: 2021-09-22 17:20:05
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/quote/purchase/list/Export2ExcelMoreSheet.js
 */
/* eslint-disable */
import { saveAs } from 'file-saver'
import XLSX from 'xlsx-style'
export function export_json_to_excel({
    title = [], // 新增的参数，表格标题
    multiHeader = [],
    SheetNames = [],// 新增的参数，sheet名称
    header,
    data,
    filename,
    merges = [],
    autoWidth = true,
    bookType = 'xlsx'
} = {}) {
    /* original data */
    filename = filename || 'excel-list'
    data = [...data]
    var wb = new Workbook();
    data.forEach((item, index) => {
        let sheet = oneSheet(item, title[index], header[index], merges[index], autoWidth)
        wb.SheetNames.push(SheetNames[index])
        wb.Sheets[SheetNames[index]] = sheet
        setExcelStyle(sheet, data.length)
    })
    var wbout = XLSX.write(wb, {
        bookType: bookType,
        bookSST: false,
        type: 'binary'
    });
    saveAs(new Blob([s2ab(wbout)], {
        type: "application/octet-stream"
    }), `${filename}.${bookType}`);
}

//渲染一个sheet
function oneSheet(data, title, header, merges, autoWidth) {
    data.unshift(header);
    //写死的二级标题以及倒数两行（空行和合计）
    data.unshift(['资料区间：2021-08-04~2021-08-05']); // 表格标题
    data.unshift([title]); // 表格标题
    data.push(['']); // 接一行
    data.push(['份数：4 金额：96911.76元 税额：12557.32元']); // 接一行
    //最后两行合并单元格
    let merges_prev_last = 'A' + String(data.length - 1) + ':M' + String(data.length - 1);
    let merges_last = 'A' + String(data.length) + ':M' + String(data.length);
    merges.push(merges_prev_last)
    merges.push(merges_last)
    //调用上面的合并单元格函数
    var ws = sheet_from_array_of_arrays(data);
    if (merges.length > 0) {
        if (!ws['!merges']) ws['!merges'] = [];
        merges.forEach(item => {
            ws['!merges'].push(XLSX.utils.decode_range(item))
        })
    }
    if (autoWidth) {
        /*设置worksheet每列的最大宽度*/
        const colWidth = data.map(row => row.map(val => {
            /*先判断是否为null/undefined*/
            if (val == null) {
                return {
                    'wch': 10
                };
            }
            /*再判断是否为中文*/
            else if (val.toString().charCodeAt(0) > 255) {
                return {
                    'wch': val.toString().length * 2
                };
            } else {
                return {
                    'wch': val.toString().length
                };
            }
        }))
        /*以主表第三行为初始值，因为我的第一行是表格标题，第二行是副标题时间，所以以主表第三行表头为初始值*/
        let result = colWidth[3];
        for (let i = 2; i < colWidth.length - 1; i++) {  //从第二行（i=2）开始到倒数第二行（i<colWidth.length-1）进行比较，调整列宽
            for (let j = 0; j < colWidth[i].length; j++) {
                if (result[j]['wch'] < colWidth[i][j]['wch']) {
                    result[j]['wch'] = colWidth[i][j]['wch'];
                }
            }
        }
        ws['!cols'] = result;
    }
    return ws;
}

//设置表格样式
function setExcelStyle(dataInfo, length) {
    // 设置单元格框线
    const borderAll = {
        top: {
            style: "thin"
        },
        bottom: {
            style: "thin"
        },
        left: {
            style: "thin"
        },
        right: {
            style: "thin"
        }
    };
    // 给所有单元格加上边框，内容居中，字体，字号，标题表头特殊格式部分后面替换
    for (var i in dataInfo) {
        if (i == "!ref" || i == "!merges" || i == "!cols" || i == "!rows" || i == "A1" || i == "A2" || i == "A" + String(length + 1) || i == "A" + String(length + 2)) {  //第一行A1，第二行A2以及倒数第二行，倒数第一行不加border
            //不做处理
        } else {
            dataInfo[i + ""].s = {
                border: borderAll,
                alignment: {
                    horizontal: "center",
                    vertical: "center"
                },
                font: {
                    name: "微软雅黑",
                    sz: 10
                }
            };
        }
    }

    // 设置表格样式，数字不够可以再往后面加AA，AB……
    const arrabc = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

    // 给标题、表格描述信息、表头等部分加上特殊格式
    arrabc.some(function (v) {
        for (let j = 1; j < 4; j++) {
            const _v = v + j
            if (dataInfo[_v]) {
                dataInfo[_v].s = {};
                // 标题部分A1-Z1
                if (j == 1) { //A1第一行居中加粗
                    dataInfo[v + j].s = {
                        font: {
                            name: "微软雅黑",
                            sz: 11,
                            color: {
                                rgb: "000000"
                            },
                            bold: true,
                            italic: false,
                            underline: false
                        },
                        alignment: {
                            horizontal: "center",
                            vertical: "center"
                        }
                    };
                } else if (j == 2) { //A1第一行居左
                    dataInfo[v + j].s = {
                        font: {
                            name: "微软雅黑",
                            sz: 10,
                            bold: false,
                            italic: false,
                            underline: false
                        },
                        alignment: {
                            horizontal: "left",
                            vertical: "center"
                        }
                    };
                } else { //表头  加背景加粗
                    const fv = v + 3
                    dataInfo[fv].s = {
                        border: borderAll,
                        font: {
                            name: "微软雅黑",
                            sz: 10,
                            bold: true
                        },
                        alignment: {
                            horizontal: "center",
                            vertical: "center"
                        },
                        fill: {
                            fgColor: {
                                rgb: "f0f0f0"
                            },
                        },
                    }
                }
            }
        }
    });
}