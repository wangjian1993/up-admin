import FileSaver from 'file-saver'
import XLSX from 'xlsx-style'

// 设置表格中cell默认的字体，居中，颜色等

var defaultCellStyle = {
    font: {
        name: "宋体", sz: 11, color: { auto: 1 },
    },
    border: {
        color: { auto: 1 },
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' }
    },
    alignment: {
        /// 自动换行
        wrapText: 1,
        // 居中
        horizontal: "left",
        vertical: "left",
        indent: 0
    }
};
// 从json转化为sheet，xslx中没有aoaToSheet的方法，该方法摘自官方test
function sheet_from_array_of_arrays(data) {
    const ws = {};
    const range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
    for (let R = 0; R !== data.length; ++R) {
        for (let C = 0; C !== data[R].length; ++C) {
            if (range.s.r > R) range.s.r = R;
            if (range.s.c > C) range.s.c = C;
            if (range.e.r < R) range.e.r = R;
            if (range.e.c < C) range.e.c = C;
            /// 这里生成cell的时候，使用上面定义的默认样式
            const cell = { v: data[R][C], s: defaultCellStyle };
            if (cell.v == null) continue;
            const cell_ref = XLSX.utils.encode_cell({ c: C, r: R });

            /* TEST: proper cell types and value handling */
            if (typeof cell.v === 'number') cell.t = 'n';
            else if (typeof cell.v === 'boolean') cell.t = 'b';
            else if (cell.v instanceof Date) {
                cell.t = 'n'; cell.z = XLSX.SSF._table[14];
                cell.v = this.dateNum(cell.v);
            }
            else cell.t = 's';
            ws[cell_ref] = cell;
        }
    }

    /* TEST: proper range */
    if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
    return ws;
}


// 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
function sheet2blob(sheet, sheetName) {
    sheetName = sheetName || 'sheet1';
    const workbook = {
        SheetNames: [sheetName],
        Sheets: {}
    };
    workbook.Sheets[sheetName] = sheet

    window.console.log(workbook)
    // 生成excel的配置项
    const wopts = {
        bookType: 'xlsx', // 要生成的文件类型
        bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        type: 'binary'
    };

    const wbout = XLSX.write(workbook, wopts, { defaultCellStyle: defaultCellStyle });
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
    // 字符串转ArrayBuffer
    function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
    return blob;
}


function addRangeBorder(range, ws) {
    let arr = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

    range.forEach(item => {
        let startColNumber = Number(item.s.r), endColNumber = Number(item.e.r);
        let startRowNumber = Number(item.s.c), endRowNumber = Number(item.e.c);
        const test = ws[arr[startRowNumber] + (startColNumber + 1)];
        for (let col = startColNumber; col <= endColNumber; col++) {
            for (let row = startRowNumber; row <= endRowNumber; row++) {
                //const test = ws[arr[j] + i];
                //console.log(arr[row] + (col + 1));
                ws[arr[row] + (col + 1)] = test;
                //{s:{border:{top:{style:'thin'}, left:{style:'thin'},bottom:{style:'thin'},right:{style:'thin'}}}};
            }
        }
    })
    return ws;
}

/**
 * @description: 
 * @param {*} data 表格数据
 * @param {*} mergeTitle  合并单元格
 * @param {*} sheetCols  列宽
 * @param {*} xlsxName  导出文件名
 * @return {*}
 */
function funtransformF(data, mergeTitle = [], sheetCols = [], xlsxName = '采购报价导出.xlsx') {

    // 表头信息 要合并的字段用null代替
    // let aoa = [
    //     ['江苏省多式联运示范工程项目2019年第二季度动态监测信息表'],
    //     ['序号', '市别', '示范工程项目名称', '示范工程项目运行情况'],
    //     [null, null, null, '联运组织', null, null, null, null, null, null, '企业总货物运输量（万吨/万标箱）', null, '枢纽场站建设投资额（万元）', '装备配备建设投资额（万元）', '信息化建设投资额（万元）', '其他'],
    //     [null, null, null, '联运线路（条）', '联运线路运营情况', null, null, null, null, null],
    //     [null, null, null, null, '线路', '联运路线', '联运模式', '联运量', null, '联运周转量（万吨公里）', null, null, null, null, null, null],
    //     [null, null, null, null, null, null, null, '万吨', '万标箱', null, '万吨', '万标箱', null, null, null]
    // ]

    // json => sheet
    const sheet = sheet_from_array_of_arrays(data);

    // 表头合并： r: row 行；c:column 列
    sheet['!merges'] = mergeTitle;
    // 冻结前6行和第一列，右下可以滑动
    sheet["!freeze"] = {
        xSplit: "1",
        ySplit: "6",
        topLeftCell: "B7",
        activePane: "bottomRight",
        state: "frozen",
    }
    sheet["!margins"] = { left: 1.0, right: 1.0, top: 1.0, bottom: 1.0, header: 0.5, footer: 0.5 }
    // 列宽 使用的不是像素值
    // const sheetCols = [
    //    { wch: 8 }, // 序号
    // ];
    sheet['!cols'] = sheetCols;

    addRangeBorder(mergeTitle, sheet);

    const wbBlob = sheet2blob(sheet,'sheet1')
    // 保存下载
    FileSaver.saveAs(wbBlob, xlsxName);
}
export {
    funtransformF
}

