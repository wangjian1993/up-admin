<!--
 * @Author: max
 * @Date: 2021-08-17 10:59:02
 * @LastEditTime: 2021-09-09 14:20:06
 * @LastEditors: max
 * @Description: excel导入导出
 * @FilePath: /up-admin/src/pages/home/quote/purchase/list/List copy.vue
-->
<template>
  <div>
    <!-- <a-upload accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" :beforeUpload="beforeUpload">
      <a-button type="primary">导入Excel</a-button>
    </a-upload>
    <div><a-button type="primary" @click="handleDownClick">导出Excel</a-button></div>
    <a-table :columns="columns" size="small" :data-source="tableData" style="margin-top:45px">
      <a slot="name" slot-scope="text">{{ text }}</a>
      <span slot="__EMPTY" slot-scope="text">{{ formatDate(text, "/") }}</span>
      <span slot="__EMPTY_6" slot-scope="text">{{ formatDate(text, "/") }}</span>
      <span slot="__EMPTY_7" slot-scope="text">{{ formatDate(text, "/") }}</span>
      <span slot="__EMPTY_9" slot-scope="text">{{ toFixed(text) }}</span>
    </a-table> -->
  </div>
</template>

<script>
// import XLSX from "xlsx";
// import XLSX from "xlsx-style"
export default {
  data() {
    return {
      columns: [],
      tableData: [],
    };
  },
  methods: {
    // handleDownClick() {
    //   // 模拟数据
    //   var data = [
    //     { 时间: "2020-01-12", 新注册人数: "12", 在线人数: "12", 累计用户数: "12" },
    //     { 时间: "2020-01-12", 新注册人数: "12", 在线人数: "12", 累计用户数: "13" },
    //     { 时间: "2020-01-12", 新注册人数: "12", 在线人数: "12", 累计用户数: "14" },
    //     { 时间: "2020-01-12", 新注册人数: "12", 在线人数: "12", 累计用户数: "15" },
    //   ];
    //   //表格标题
    //   var dataTitle = "用户统计2020-01-10-2020-01-12";
    //   // 配置文件类型
    //   const wopts = { bookType: "xlsx", bookSST: true, type: "binary", cellStyles: true };
    //   this.downloadExl(data, wopts, dataTitle);
    // },
    // // 下载功能
    // saveAs(obj, fileName) {
    //   var tmpa = document.createElement("a");
    //   tmpa.download = fileName || "未命名";
    //   // 兼容ie
    //   if ("msSaveOrOpenBlob" in navigator) {
    //     window.navigator.msSaveOrOpenBlob(obj, "下载的文件名" + ".xlsx");
    //   } else {
    //     tmpa.href = URL.createObjectURL(obj);
    //   }
    //   tmpa.click();
    //   setTimeout(function() {
    //     URL.revokeObjectURL(obj);
    //   }, 100);
    // },

    // downloadExl(json, type, dataTitle) {
    //   var tmpdata = json[0];
    //   json.unshift({});
    //   var keyMap = []; //获取keys
    //   for (var k in tmpdata) {
    //     keyMap.push(k);
    //     json[0][k] = k;
    //   }
    //   var tmpdata = []; //用来保存转换好的json
    //   json
    //     .map((v, i) => {
    //       let data = keyMap.map((k, j) => {
    //         // console.log(k,this.getCharCol(j));
    //         return Object.assign(
    //           {},
    //           {
    //             v: v[k],
    //             position: (j > 25 ? this.getCharCol(j) : String.fromCharCode(65 + j)) + (i + 2),
    //           }
    //         );
    //       });
    //       return data;
    //     })
    //     .reduce((prev, next) => prev.concat(next))
    //     .forEach(
    //       (v, i) =>
    //         (tmpdata[v.position] = {
    //           v: v.v,
    //         })
    //     );
    //   var outputPos = Object.keys(tmpdata); //设置区域,比如表格从A1到D10
    //   tmpdata["A1"] = { v: dataTitle };
    //   outputPos = ["A1"].concat(outputPos);
    //   tmpdata["A1"].s = { font: { sz: 14, bold: true, vertAlign: true }, alignment: { vertical: "center", horizontal: "center" }, fill: { bgColor: { rgb: "E8E8E8" }, fgColor: { rgb: "E8E8E8" } } }; //<====设置xlsx单元格样式
    //   tmpdata["!merges"] = [
    //     {
    //       s: { c: 0, r: 0 },
    //       e: { c: 3, r: 0 },
    //     },
    //   ]; //<====合并单元格

    //   tmpdata["!cols"] = [{ wpx: 300 }, { wpx: 300 }, { wpx: 300 }, { wpx: 300 }]; //<====设置一列宽度

    //   var tmpWB = {
    //     SheetNames: ["mySheet"], //保存的表标题
    //     Sheets: {
    //       mySheet: Object.assign(
    //         {},
    //         tmpdata, //内容
    //         {
    //           "!ref": outputPos[0] + ":" + outputPos[outputPos.length - 1], //设置填充区域
    //         }
    //       ),
    //     },
    //   };
    //   var tmpDown = new Blob(
    //     [
    //       this.s2ab(
    //         XLSX.write(
    //           tmpWB,
    //           { bookType: type == undefined ? "xlsx" : type.bookType, bookSST: false, type: "binary" } //这里的数据是用来定义导出的格式类型
    //         )
    //       ),
    //     ],
    //     {
    //       type: "",
    //     }
    //   );
    //   this.saveAs(tmpDown, "下载的文件名" + "." + (type.bookType == "biff2" ? "xls" : type.bookType));
    // },
    // // 获取26个英文字母用来表示excel的列
    // getCharCol(n) {
    //   let temCol = "",
    //     s = "",
    //     m = 0;
    //   while (n > 0) {
    //     m = (n % 26) + 1;
    //     s = String.fromCharCode(m + 64) + s;
    //     n = (n - m) / 26;
    //   }
    //   return s;
    // },
    // s2ab(s) {
    //   if (typeof ArrayBuffer !== "undefined") {
    //     var buf = new ArrayBuffer(s.length);
    //     var view = new Uint8Array(buf);
    //     for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
    //     return buf;
    //   } else {
    //     var buf = new Array(s.length);
    //     for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xff;
    //     return buf;
    //   }
    // },
    // //导出
    // exportExcel() {
    //   let titleArr = [];
    //   this.columns.map((item) => {
    //     titleArr.push(item.title);
    //   });
    //   let arr = [];
    //   this.tableData.forEach((item) => {
    //     let itemArray = [];
    //     for (let val in item) {
    //       itemArray.push(item[val]);
    //     }
    //     arr.push(itemArray);
    //   });
    //   this.ToDoExcel(`生产计划`, titleArr, arr);
    // },
    // ToDoExcel(excelName, titleArr, dataArr) {
    //   var filename = excelName + ".xlsx"; //文件名称
    //   var data = [titleArr, ...dataArr]; //数据，一定注意需要时二维数组
    //   var ws_name = "Sheet1"; //Excel第一个sheet的名称
    //   var wb = XLSX.utils.book_new(),
    //     ws = XLSX.utils.aoa_to_sheet(data);
    //   XLSX.utils.book_append_sheet(wb, ws, ws_name); //将数据添加到工作薄
    //   XLSX.writeFile(wb, filename);
    // },
    // //导入excel
    // beforeUpload(file) {
    //   let _this = this;
    //   return new Promise(function(resolve) {
    //     // readExcel方法也使用了Promise异步转同步，此处使用then对返回值进行处理
    //     _this.readExcel(file).then((result) => {
    //       // 此时标识校验成功，为resolve返回
    //       if (result) resolve(result);
    //     });
    //   });
    // },
    // toFixed(num) {
    //   return Math.floor(num * 100) / 100 || "";
    // },
    // formatDate(numb, format) {
    //   const time = new Date((numb - 1) * 24 * 3600000 + 1);
    //   time.setYear(time.getFullYear() - 70);
    //   const year = time.getFullYear() + "";
    //   const month = time.getMonth() + 1 + "";
    //   const date = time.getDate() - 1 + "";
    //   if (format && format.length === 1) {
    //     return year + format + month + format + date;
    //   }
    //   return year + (month < 10 ? "0" + month : month) + (date < 10 ? "0" + date : date);
    // },
    // //解析Excel
    // readExcel(file) {
    //   let _this = this;
    //   _this.columns = [];
    //   _this.tableData = [];
    //   return new Promise(function(resolve, reject) {
    //     // 返回Promise对象
    //     const reader = new FileReader();
    //     reader.onload = (e) => {
    //       // 异步执行
    //       try {
    //         // 以二进制流方式读取得到整份excel表格对象
    //         let data = e.target.result,
    //           workbook = XLSX.read(data, { type: "binary" });
    //         const exlname = workbook.SheetNames[0]; // 取第一张表
    //         const exl = XLSX.utils.sheet_to_json(workbook.Sheets[exlname]); // 生成json表格内容
    //         let tableheader = exl[2];
    //         console.log(exl);
    //         for (let val in tableheader) {
    //           _this.columns.push({
    //             title: tableheader[val],
    //             dataIndex: val,
    //             key: val,
    //             ellipsis: true,
    //             scopedSlots: { customRender: val },
    //           });
    //         }
    //         exl.forEach((v, i) => {
    //           console.log(i);
    //           if (i > 2) {
    //             v = { ...v, key: i };
    //           }
    //         });
    //         _this.tableData = exl;
    //         _this.tableData.splice(0, 3);
    //         resolve();
    //       } catch (e) {
    //         reject(e.message);
    //       }
    //     };
    //     reader.readAsBinaryString(file);
    //   });
    // },
  },
  components: {},
};
</script>

<style></style>
