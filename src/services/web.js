/*
 * @Author: max
 * @Date: 2021-09-04 08:45:48
 * @LastEditTime: 2021-09-04 14:27:17
 * @LastEditors: max
 * @Description: 前端业务接口
 * @FilePath: /up-admin/src/services/web.js
 */
import {
    UP_WEB,UP_ADMIN
} from '@/services/api'
import {
    request,
    METHOD
} from '@/utils/request';

/**
 * @description: 生成部门配置
 * @param {*} params
 * @return {*}
 */
export function getLineAll(params) {
    return request(`${UP_WEB}/line/getall`, METHOD.GET, params);
}
export function lineAction(params, action) {
    return request(`${UP_WEB}/line/${action}`, METHOD.POST, params);
}
//获取车间
export function getWorkshopList(params) {
    return request(`${UP_WEB}/workshop/getlist`, METHOD.GET, params);
}
//添加车间j
export function addWorkshop(params) {
    return request(`${UP_WEB}/workshop/add`, METHOD.POST, params);
}
/**
 * @description: 获取需求公司
 * @param {*} params
 * @return {*}
 */
export function getDemandEnter(params) {
    return request(`${UP_ADMIN}/enter/getlistbytypecode`, METHOD.GET, params);
}


export function getCostList(params) {
    return request(`${UP_ADMIN}/costbase/getcostbaselist`, METHOD.GET, params);
}
export function costAction(params, action) {
    return request(`${UP_ADMIN}/costbase/${action}`, METHOD.POST, params);
}