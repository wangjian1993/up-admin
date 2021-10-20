/*
 * @Author: max
 * @Date: 2021-10-20 17:08:56
 * @LastEditTime: 2021-10-20 17:11:48
 * @LastEditors: max
 * @Description: 公共 变量
 * @FilePath: /up-admin/src/mixins/publicVar.js
 */
import { renderStripe } from "@/utils/stripe.js";
export const PublicVar = {
    data() {
        return {
            isSearch: false,  //是否搜索
            scrollY: "",  //table 动态高度
            loading: false, //loading
            selectedRowKeys: [], //多选
            searchForm: this.$form.createForm(this), //输入
            pagination: {   //分页参数
                current: 1,
                total: 0,
                pageSize: 20, //每页中显示10条数据
                showSizeChanger: true,
                showLessItems: true,
                showQuickJumper: true,
                pageSizeOptions: ["10", "20", "50", "100"], //每页中显示的数据
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
            },
        }
    },
    updated() {
        renderStripe();
    },
    computed: {
        hasSelected() {
            return this.selectedRowKeys.length > 0;
        },
    },
    methods: {

    },
}