<!--
 * @Author: max
 * @Date: 2021-08-17 10:59:02
 * @LastEditTime: 2021-08-23 10:51:55
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/quote/purchase/list/List.vue
-->
<template>
  <div>
    <a-upload accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" :beforeUpload="beforeUpload">
      <a-button type="primary">导入Excel</a-button>
    </a-upload>
    <a-table :columns="columns" size="small" :data-source="tableData" style="margin-top:45px">
      <a slot="name" slot-scope="text">{{ text }}</a>
      <span slot="__EMPTY" slot-scope="text">{{ formatDate(text,"/") }}</span>
      <span slot="__EMPTY_6" slot-scope="text">{{ formatDate(text,"/") }}</span>
      <span slot="__EMPTY_7" slot-scope="text">{{ formatDate(text,"/") }}</span>
      <span slot="__EMPTY_9" slot-scope="text">{{ toFixed(text) }}</span>
    </a-table>
  </div>
</template>

<script>
import XLSX from "xlsx";
export default {
  data() {
    return {
      columns: [],
      tableData: [],
    };
  },
  methods: {
    //导入excel
    beforeUpload(file) {
      let _this = this;
      return new Promise(function(resolve) {
        // readExcel方法也使用了Promise异步转同步，此处使用then对返回值进行处理
        _this.readExcel(file).then((result) => {
          // 此时标识校验成功，为resolve返回
          if (result) resolve(result);
        });
      });
    },
    toFixed(num){
      return Math.floor(num * 100) / 100 || ""
    },
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1);
      time.setYear(time.getFullYear() - 70);
      const year = time.getFullYear() + "";
      const month = time.getMonth() + 1 + "";
      const date = time.getDate() - 1 + "";
      if (format && format.length === 1) {
        return year + format + month + format + date;
      }
      return year + (month < 10 ? "0" + month : month) + (date < 10 ? "0" + date : date);
    },
    //解析Excel
    readExcel(file) {
      let _this = this;
      _this.columns = [];
      _this.tableData = [];
      return new Promise(function(resolve, reject) {
        // 返回Promise对象
        const reader = new FileReader();
        reader.onload = (e) => {
          // 异步执行
          try {
            // 以二进制流方式读取得到整份excel表格对象
            let data = e.target.result,
              workbook = XLSX.read(data, { type: "binary" });
            const exlname = workbook.SheetNames[0]; // 取第一张表
            const exl = XLSX.utils.sheet_to_json(workbook.Sheets[exlname]); // 生成json表格内容
            let tableheader = exl[2];
            console.log(exl);
            for (let val in tableheader) {
              _this.columns.push({
                title: tableheader[val],
                dataIndex: val,
                key: val,
                ellipsis: true,
                scopedSlots: { customRender:val },
              });
            }
            exl.forEach((v, i) => {
              console.log(i);
              if (i > 2) {
                v = { ...v, key: i };
              }
            });
            _this.tableData = exl;
            _this.tableData.splice(0, 3);
            resolve();
          } catch (e) {
            reject(e.message);
          }
        };
        reader.readAsBinaryString(file);
      });
    },
  },
  components: {},
};
</script>

<style></style>
