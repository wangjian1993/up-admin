/*
 * @Author: max
 * @Date: 2022-05-27 16:27:23
 * @LastEditTime: 2022-06-07 17:35:47
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/store/modules/specimen.js
 */
const specimen = {
    namespaced: true,
    state: {
        RegisterId: ""
    },
    mutations: {
        setRegisterId(state, data) {
            state.RegisterId = data;
            console.log(state.RegisterId);
        },
        deleteId(state) {
            state.RegisterId = "";
            console.log("state.RegisterId====", state.RegisterId)
        },
    },
    actions: {
        registerIdActions(context, id) { //触发mutations里面的pushCollects ,传入数据形参item 对应到items
            context.commit('setRegisterId', id);
        },
        closeRegisterId(context) {
            context.commit('deleteId');
        }
    },
    getters: {}
}

export default specimen;