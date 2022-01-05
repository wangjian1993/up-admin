/*
 * @Author: max
 * @Date: 2021-10-20 17:08:56
 * @LastEditTime: 2022-01-05 11:34:34
 * @LastEditors: max
 * @Description: 公共 变量
 * @FilePath: /up-admin/src/mixins/publicVarErp.js
 */
import { renderStripe } from "@/utils/stripe.js";
export const PublicVarErp = {
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
                pageSize: 100, //每页中显示10条数据
                showSizeChanger: true,
                showLessItems: true,
                showQuickJumper: true,
                pageSizeOptions: ["20", "50", "100", "150"], //每页中显示的数据
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
            },
            filtrate: ['不过滤', '包含(A,B,C)', '不包含', '等于', '不等于', '开始于', '结束于', '小于', '小于或等于', '大于', '大于或等于']
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