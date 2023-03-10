/*
 * @Author: max
 * @Date: 2022-05-27 16:27:23
 * @LastEditTime: 2023-03-01 09:02:50
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/store/modules/specimen.js
 */
const specimen = {
    namespaced: true,
    state: {
        RegisterId: "",
        DatetimePurchaseDeliver: "",
        Purchaser: "",
        Supplier: "",
        SupplierCode:""
    },
    mutations: {
        setRegisterId(state, data) {
            console.log("data----",data);
            state.RegisterId = data.RegisterId;
            state.DatetimePurchaseDeliver = data.DatetimePurchaseDeliver;
            state.Purchaser = data.Purchaser;
            state.Supplier = data.Supplier;
            state.SupplierCode = data.SupplierCode;
        },
        deleteId(state) {
            state.RegisterId = "";
            state.DatetimePurchaseDeliver = "";
            state.Purchaser = "";
            state.Supplier = "";
            state.SupplierCode = "";
            console.log("state.RegisterId====", state.RegisterId)
        },
    },
    actions: {
        registerIdActions(context, data) { //触发mutations里面的pushCollects ,传入数据形参item 对应到items
            context.commit('setRegisterId', data);
        },
        closeRegisterId(context) {
            context.commit('deleteId');
        }
    },
    getters: {}
}

export default specimen;