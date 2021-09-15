/*
 * @Author: max
 * @Date: 2021-06-23 09:27:52
 * @LastEditTime: 2021-09-15 18:39:25
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/store/index.js
 */
import Vue from 'vue';
import Vuex from 'vuex';
import modules from './modules';

Vue.use(Vuex)
const store = new Vuex.Store({modules});

export default store;
