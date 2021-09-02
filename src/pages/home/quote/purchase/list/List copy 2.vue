<!--
 * @Author: max
 * @Date: 2021-08-17 10:59:02
 * @LastEditTime: 2021-08-27 16:57:35
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/quote/purchase/list/List.vue
-->
<template>
  <div><a-button type="primary" size="small" @click="handleDownload">Excel导出 </a-button></div>
</template>
<script>
import XLSX from "xlsx";
export default {
  data() {
    return {
      wopts: {
        //出力文件类型
        bookType: "xlsx",
        // Generate Shared String Table
        bookSST: false,
        // Output data encoding
        type: "binary",
      },
    };
  },
  methods: {
    // 字符串转ArrayBuffer
    s2ab(s) {
      if (typeof ArrayBuffer !== "undefined") {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (let i = 0; i !== s.length; ++i) {
          view[i] = s.charCodeAt(i) & 0xff;
        }
        return buf;
      } else {
        const buf = new Array(s.length);
        for (let i = 0; i !== s.length; ++i) {
          buf[i] = s.charCodeAt(i) & 0xff;
        }
        return buf;
      }
    },
    // 自定义简单的下载文件实现方式
    saveAs(obj, fileName) {
      var tmpa = document.createElement("a");
      tmpa.download = fileName || "下载";
      // 绑定a标签
      tmpa.href = URL.createObjectURL(obj);
      // 模拟点击实现下载
      tmpa.click();
      // 延时释放
      setTimeout(function() {
        // 用URL.revokeObjectURL()来释放这个object URL
        URL.revokeObjectURL(obj);
      }, 100);
    },
    //点击Excel出力按钮
    handleDownload() {
      //想导出的数据
      var data = [
        {
          商品名称: "aaa",
          单价: 5,
          件数: 5,
          总价: "",
        },
        {
          商品名称: "bbb",
          单价: 3,
          件数: 5,
          总价: "",
        },
      ];
      const wb = { SheetNames: ["Sheet1"], Sheets: {}, Props: {} };
      // 将JS对象数组转换为工作表
      data = XLSX.utils.json_to_sheet(data);
      wb.Sheets["Sheet1"] = data;
      //循环根据自己的需求写，注：不能再用data，data已经被转换了，可以输出看一下
      for (let i = 2; i < 4; i++) {
        //总价=单价*件数
        wb.Sheets["Sheet1"]["D" + i] = { t: "n", f: "B" + i + "*C" + i };
      }
      // wb.Sheets["A1"] = { v: dataTitle };
      wb.Sheets["Sheet1"]["B4"] = { f: "SUM(B:B)"};
      wb.Sheets["Sheet1"]["C4"] = { f: "SUM(C2:C3)"};
      wb.Sheets["Sheet1"]["D4"] = { f: "SUM(D2:D3)"};
      this.saveAs(
        new Blob([this.s2ab(XLSX.write(wb, this.wopts))], {
          type: "application/octet-stream",
        }),
        "Excel的名字." + this.wopts.bookType
      );
    },
  },
};
</script>
