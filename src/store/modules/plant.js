/*
 * @Author: max
 * @Date: 2021-09-15 18:19:09
 * @LastEditTime: 2021-09-16 08:55:13
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/store/modules/plant.js
 */
const plant = {
    namespaced: true,
    state: {
        plantList: []
    },
    mutations: {
        setPlantList(state, data) {
            state.plantList = data;
            console.log(state.plantList);
        }
    },
    actions: {
        plantListAction(context, item) { //触发mutations里面的pushCollects ,传入数据形参item 对应到items
            context.commit('setPlantList', item);
        }
    },
    getters: {}
}

export default plant;

