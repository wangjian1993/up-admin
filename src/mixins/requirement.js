/*
 * @Author: max
 * @Date: 2021-10-20 16:38:03
 * @LastEditTime: 2021-10-29 10:50:58
 * @LastEditors: max
 * @Description: 合并明细mixin
 * @FilePath: /up-admin/src/mixins/requirement.js
 */
export const dColumns = {
    data() {
        return {
            dColumns: [
                {
                    title: "序号",
                    scopedSlots: { customRender: "index" },
                    align: "center",
                    width: 50,
                },
                {
                    title: "计划批号",
                    dataIndex: "BatchNo",
                    scopedSlots: { customRender: "BatchNo" },
                    align: "center",
                    width: 200,
                },
                {
                    title: "生产工厂",
                    dataIndex: "PlantName",
                    scopedSlots: { customRender: "PlantName" },
                    align: "center",
                    width: 100,
                },
                {
                    title: "周",
                    dataIndex: "Week",
                    scopedSlots: { customRender: "Week" },
                    align: "center",
                    width: 50,
                },
                {
                    title: "品号",
                    dataIndex: "MitemCode",
                    scopedSlots: { customRender: "MitemCode" },
                    align: "center",
                    width: 200,
                },
                {
                    title: "品名",
                    dataIndex: "MitemName",
                    scopedSlots: { customRender: "MitemName" },
                    align: "center",
                    width: 200,
                },
                {
                    title: " 产品规格",
                    dataIndex: "Spec",
                    scopedSlots: { customRender: "Spec" },
                    align: "center",
                    width: 250,
                },
                {
                    title: "需求数量",
                    dataIndex: "Qty",
                    scopedSlots: { customRender: "Qty" },
                    align: "center",
                    width: 80,
                },
                {
                    title: "计划状态",
                    dataIndex: "Status",
                    scopedSlots: { customRender: "Status" },
                    align: "center",
                    width: 80,
                },
            ]
        }
    },
    methods: {
        //重置搜索
        reset() {
            this.isReset = true;
            this.isExport = false;
            this.week = "";
            this.data = [];
            this.columns =[];
            this.searchForm.resetFields();
            console.log("重置====",this.columns)
        },
        //日期转换
        formatDateTime(inputTime) {
            var date = new Date(inputTime);
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? "0" + m : m;
            var d = date.getDate();
            d = d < 10 ? "0" + d : d;
            var h = date.getHours();
            h = h < 10 ? "0" + h : h;
            var minute = date.getMinutes();
            var second = date.getSeconds();
            minute = minute < 10 ? "0" + minute : minute;
            second = second < 10 ? "0" + second : second;
            return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
        },
        //周选择
        weekChange(date, dateString) {
            let str = dateString.split("-");
            this.week = str[1].replace("周", "");
        },
    }
}