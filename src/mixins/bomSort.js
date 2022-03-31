/*
 * @Author: max
 * @Date: 2021-12-22 10:22:05
 * @LastEditTime: 2022-03-31 11:53:17
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/mixins/bomSort.js
 */
export const bomSort = {
    data() {
        return {
            itemNameSort: "ascend",
        }
    },
    methods: {
        tableSort() {
            console.log("点击1====")
            this.itemNameSort = this.itemNameSort == "ascend" ? "descend" : "ascend";
            this.data.sort(this.sortData);
        },
        tableDataSort() {
            console.log("点击2====")
            this.itemNameSort = this.itemNameSort == "ascend" ? "descend" : "ascend";
            this.data.sort(this.dateData);
        },
        dateData(a,b) { //property是你需要排序传入的key,bol为true时是升序，false为降序
            var value1 = a.TRANSACTION_DATE;
            var value2 = b.TRANSACTION_DATE;
            if (this.itemNameSort == "ascend") {
                return Date.parse(value1) - Date.parse(value2);
            } else {
                return Date.parse(value2) - Date.parse(value1)
            }
        },
        sortData(a, b) {
            var stringA = a.ITEM_NAME.toUpperCase(); // ignore upper and lowercase
            var stringB = b.ITEM_NAME.toUpperCase(); // ignore upper and lowercase
            if (this.itemNameSort == "ascend") {
                if (stringB < stringA) {
                    return -1;
                }
                if (stringB > stringA) {
                    return 1;
                }
            } else {
                if (stringA < stringB) {
                    return -1;
                }
                if (stringA > stringB) {
                    return 1;
                }
            }
            return 0;
            // return this.itemNameSort == "ascend" ? stringA < stringB : stringA > stringB;
        },
    },
}