/*
 * @Author: max
 * @Date: 2022-03-26 10:33:17
 * @LastEditTime: 2022-03-29 17:47:38
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/services/hp.js
 */
import {
    UP_HP
} from '@/services/api'
import {
    request,
    METHOD
} from '@/utils/request';


/**
 * @description: 折扣率
 * @param {*} params
 * @param {*} action
 * @return {*}
 */
export function getDiscountList(params) {
    return request(`${UP_HP}/getzkratelist`, METHOD.GET, params);
}

export function importDiscountList(params) {
    return request(`${UP_HP}/importzkrate`, METHOD.POST, params);
}
export function editDiscount(params) {
    return request(`${UP_HP}/editzkratesingle`, METHOD.POST, params);
}

/**
 * @description: 居间费
 * @param {*} params
 * @param {*} action
 * @return {*}
 */
 export function getIntermediaryList(params) {
    return request(`${UP_HP}/getjjfeelist`, METHOD.GET, params);
}

export function importIntermediaryList(params) {
    return request(`${UP_HP}/importjjfee`, METHOD.POST, params);
}
export function editIntermediary(params) {
    return request(`${UP_HP}/editjjfeesingle`, METHOD.POST, params);
}


/**
 * @description: 月任务
 * @param {*} params
 * @param {*} action
 * @return {*}
 */
 export function getMonthlyTaskList(params) {
    return request(`${UP_HP}/getyjmonthtasklist`, METHOD.GET, params);
}
export function importMonthlyTaskList(params) {
    return request(`${UP_HP}/importyjmonthtask`, METHOD.POST, params);
}
export function editMonthlyTask(params) {
    return request(`${UP_HP}/edityjmonthtasksingle`, METHOD.POST, params);
}
export function getSalesmanList(params) {
    return request(`${UP_HP}/getsalesmanlist`, METHOD.GET, params);
}
export function deleteItem(params) {
    return request(`${UP_HP}/deleteyjmonthtasksalesman`, METHOD.POST, params);
}


/**
 * @description: 完成率
 * @param {*} params
 * @param {*} action
 * @return {*}
 */
export function getFinishingList(params) {
    return request(`${UP_HP}/getmonthcomratelist`, METHOD.GET, params);
}
export function importFinishingList(params) {
    return request(`${UP_HP}/importmonthcomrate`, METHOD.POST, params);
}
export function editFinishing(params) {
    return request(`${UP_HP}/editmonthcomratesingle`, METHOD.POST, params);
}
export function deleteFinishing(params) {
    return request(`${UP_HP}/deletemonthcomratesalesman`, METHOD.POST, params);
}


export function getOrderList(params) {
    return request(`${UP_HP}/getsalesorderlist`, METHOD.GET, params);
}