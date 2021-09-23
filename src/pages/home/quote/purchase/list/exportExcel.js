// Export2Excel.js
/* eslint-disable */
import 'script-loader!file-saver';
import './Blob.js'; //转二进制用  这边要写你的blob的实际地址
import 'script-loader!xlsx/dist/xlsx.core.min';
import XLSXS from 'xlsx-style'

function datenum(v, date1904) {
    if (date1904) v += 1462;
    var epoch = Date.parse(v);
    return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheet_from_array_of_arrays(data, opts) {
    var ws = {};
    var range = {
        s: {
            c: 10000000,
            r: 10000000
        },
        e: {
            c: 0,
            r: 0
        }
    };
    for (var R = 0; R != data.length; ++R) {
        for (var C = 0; C != data[R].length; ++C) {
            if (range.s.r > R) range.s.r = R;
            if (range.s.c > C) range.s.c = C;
            if (range.e.r < R) range.e.r = R;
            if (range.e.c < C) range.e.c = C;
            var cell = {
                v: data[R][C]
            };
            if (cell.v == null) continue;
            var cell_ref = XLSXS.utils.encode_cell({
                c: C,
                r: R
            });

            if (typeof cell.v === 'number') cell.t = 'n';
            else if (typeof cell.v === 'boolean') cell.t = 'b';
            else if (cell.v instanceof Date) {
                cell.t = 'n';
                cell.z = XLSXS.SSF._table[14];
                cell.v = datenum(cell.v);
            } else cell.t = 's';

            ws[cell_ref] = cell;
        }
    }
    if (range.s.c < 10000000) ws['!ref'] = XLSXS.utils.encode_range(range);
    return ws;
}

function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();
    this.SheetNames = [];
    this.Sheets = {};
}

function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}

// 导出单个表格
export function exportjsontoexcel({
    data, //格式后的数据
    filename, //表名
    merges = [], //合并单元格格式
    autoWidth = true,
    bookType = 'xlsx',
    formStyle, // 样式修改
} = {}) {
    /* original data */
    //判断是否有表名、没有则赋予固定表名
    filename = filename || 'excel-list'

    var ws_name = "SheetJS";
    var wb = new Workbook(),
        //将data转化格式 用于接下来动态宽度
        ws = sheet_from_array_of_arrays(data);

    //合并单元格
    ws['!merges'] = merges
    //动态设置宽度
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
        //判断合并单元格中是否有同行合并，有则将其长度设为0
        if (merges.length > 0) {
            if (!ws['!merges']) ws['!merges'] = [];
            merges.forEach(a => {
                let w1 = a.s.c
                let e1 = a.s.r
                let w2 = a.e.c
                let e2 = a.e.r
                if (e1 == e2) {
                    if (+w1 > +w2) {
                        let jh = w1
                        w1 = w2
                        w2 = jh
                    }
                    for (let i = +w1; i <= +w2; i++) {
                        colWidth[e1][i]['wch'] = 0;
                    }
                }
            })
        }
        /*以第一行为初始值 判断对应每一列的最大长度*/
        let result = colWidth[0];
        for (let i = 1; i < colWidth.length; i++) {
            for (let j = 0; j < colWidth[i].length; j++) {
                if (result[j]['wch'] < colWidth[i][j]['wch']) {
                    result[j]['wch'] = colWidth[i][j]['wch'];
                }
            }
        }
        ws['!cols'] = result;
    }

    /* add worksheet to workbook */
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;
    var dataInfo = wb.Sheets[wb.SheetNames[0]];

    const borderAll = { //单元格外侧框线
        top: {
            style: 'thin'
        },
        bottom: {
            style: 'thin'
        },
        left: {
            style: 'thin'
        },
        right: {
            style: 'thin'
        }
    };
    //给所以单元格加上边框
    const letter = {
        "A": 0,
        "B": 1,
        "C": 2,
        "D": 3,
        "E": 4,
        "F": 5,
        "G": 6,
        "H": 7,
        "I": 8,
        "J": 9,
        "K": 10,
        "L": 11,
        "M": 12,
        "N": 13,
        "O": 14,
        "P": 15,
        "Q": 16,
        "R": 17,
        "S": 18,
        "T": 19,
        "U": 20,
        "V": 21,
        "W": 22,
        "X": 23,
        "Y": 24,
        "Z": 25
    }
    const range = dataInfo['!ref'].split(':') // 表格范围区域
    let a1 = range[0].slice(0, 1) // A
    let b1 = +range[0].slice(1) // 1
    let a2 = range[1].slice(0, 1) // 最大为Z（26） 表格的列数
    let b2 = +range[1].slice(1) // 表格的行数
    for (let i = letter[a1]; i <= letter[a2]; i++) {
        for (let j = b1; j <= b2; j++) {
            let value = ''
            for (let key in letter) {
                if (letter[key] == i) {
                    value = key
                }
            }
            if (!dataInfo[value + j]) {
                dataInfo[value + j] = {
                    s: {
                        border: borderAll,
                    }
                }
            }

        }
    }

    for (var i in dataInfo) {
        if (i == '!ref' || i == '!merges' || i == '!cols') {

        } else {
            dataInfo[i + ''].s = {
                border: borderAll,
                //居中属性left
                alignment: {
                    horizontal: "left",
                    vertical: "left"
                },
            }
        }
    }

    //设置主标题样式
    for (let key in formStyle) {
        dataInfo[key].s = formStyle[key]
        dataInfo[key].s.border = borderAll
    }

    var wbout = XLSXS.write(wb, {
        bookType: bookType,
        bookSST: false,
        type: 'binary'
    });
    saveAs(new Blob([s2ab(wbout)], {
        type: "application/octet-stream"
    }), `${filename}.${bookType}`);
};

// 导出多个表格  下方带tab切换
export function exportjsontoexcelMore({
    dataList,
    filename,
    bookType = 'xlsx',
}) {
    //判断是否有表名、没有则赋予固定表名
    filename = filename || 'excel-list'
    var wb = new Workbook()
    dataList.forEach((item, index) => {
        let {
            Sheet,
            data,
            merges,
            autoWidth,
            formStyle,
            sheetCols
        } = item
        let ws = sheet_from_array_of_arrays(data)
        //合并单元格
        ws['!merges'] = merges
        //动态设置宽度
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
            //判断合并单元格中是否有同行合并，有则将其长度设为0
            if (merges.length > 0) {
                if (!ws['!merges']) ws['!merges'] = [];
                merges.forEach(a => {
                    let w1 = a.s.c
                    let e1 = a.s.r
                    let w2 = a.e.c
                    let e2 = a.e.r
                    if (e1 == e2) {
                        if (+w1 > +w2) {
                            let jh = w1
                            w1 = w2
                            w2 = jh
                        }
                        for (let i = +w1; i <= +w2; i++) {
                            colWidth[e1][i]['wch'] = 0;
                        }
                    }
                })
            }
            /*以第一行为初始值 判断对应每一列的最大长度*/
            let result = colWidth[0];
            for (let i = 1; i < colWidth.length; i++) {
                for (let j = 0; j < colWidth[i].length; j++) {
                    if (result[j]['wch'] < colWidth[i][j]['wch']) {
                        result[j]['wch'] = colWidth[i][j]['wch'];
                    }
                }
            }
            ws['!cols'] = result;
        }else {
            // console.log("不自适应",sheetCols);
            ws['!cols'] = sheetCols;
        }

        /* add worksheet to workbook */
        wb.SheetNames.push(Sheet);
        wb.Sheets[Sheet] = ws;
        let dataInfo = wb.Sheets[wb.SheetNames[index]];

        const borderAll = { //单元格外侧框线
            top: {
                style: 'thin'
            },
            bottom: {
                style: 'thin'
            },
            left: {
                style: 'thin'
            },
            right: {
                style: 'thin'
            }
        };
        //给所以单元格加上边框
        const letter = {
            "A": 0,
            "B": 1,
            "C": 2,
            "D": 3,
            "E": 4,
            "F": 5,
            "G": 6,
            "H": 7,
            "I": 8,
            "J": 9,
            "K": 10,
            "L": 11,
            "M": 12,
            "N": 13,
            "O": 14,
            "P": 15,
            "Q": 16,
            "R": 17,
            "S": 18,
            "T": 19,
            "U": 20,
            "V": 21,
            "W": 22,
            "X": 23,
            "Y": 24,
            "Z": 25
        }
        const range = dataInfo['!ref'].split(':') // 表格范围区域
        let a1 = range[0].slice(0, 1) // A
        let b1 = +range[0].slice(1) // 1
        let a2 = range[1].slice(0, 1) // 最大为Z（26） 表格的列数
        let b2 = +range[1].slice(1) // 表格的行数
        for (let i = letter[a1]; i <= letter[a2]; i++) {
            for (let j = b1; j <= b2; j++) {
                let value = ''
                for (let key in letter) {
                    if (letter[key] == i) {
                        value = key
                    }
                }
                if (!dataInfo[value + j]) {
                    dataInfo[value + j] = {
                        s: {
                            border: borderAll,
                        }
                    }
                }

            }
        }

        for (var i in dataInfo) {
            if (i == '!ref' || i == '!merges' || i == '!cols') {

            } else {
                dataInfo[i + ''].s = {
                    border: borderAll,
                    //居中属性
                    alignment: {
                        horizontal: "left",
                        vertical: "left"
                    },
                }
            }
        }
        //设置主标题样式
        for (let key in formStyle) {
            dataInfo[key].s = formStyle[key]
            dataInfo[key].s.border = borderAll
        }
    })

    var wbout = XLSXS.write(wb, {
        bookType: bookType,
        bookSST: false,
        type: 'binary'
    });
    saveAs(new Blob([s2ab(wbout)], {
        type: "application/octet-stream"
    }), `${filename}.${bookType}`);
}