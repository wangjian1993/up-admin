/*
 * @Author: max
 * @Date: 2021-09-15 18:19:09
 * @LastEditTime: 2021-09-15 19:04:35
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/store/modules/plan.js
 */
export default {
    namespaced: true,
    strict: true,
    state: {
        planList: []
    },
    getters: {

    },
    action: {
        // planListAction({
        //     commit
        // }, data) {
        //     commit('setPlanList', data);
        // },
        planListAction(context, item) { //触发mutations里面的pushCollects ,传入数据形参item 对应到items
            console.log("11111111111")
            context.commit('setPlanList', item);
        }
    },
    mutations: {
        setPlanList(state, data) {
            console.log("工厂信息=====", data);
            state.planList = data;
        }
    }
}
