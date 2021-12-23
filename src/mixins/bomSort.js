/*
 * @Author: max
 * @Date: 2021-12-22 10:22:05
 * @LastEditTime: 2021-12-22 10:26:04
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
            console.log("点击====")
            this.itemNameSort = this.itemNameSort == "ascend" ? "descend" : "ascend";
            this.data.sort(this.sortData);
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