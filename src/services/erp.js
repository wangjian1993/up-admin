/*
 * @Author: max
 * @Date: 2021-10-14 13:51:11
 * @LastEditTime: 2022-07-14 14:54:35
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/services/erp.js
 */
import {
    UP_ERP
} from '@/services/api'
import {
    request,
    METHOD
} from '@/utils/request';


/**
 * @description: erp报表查询
 * @param {*} params
 * @param {*} action
 * @return {*}
 */
 export function getERPReportAction(params,action) {
    return request(`${UP_ERP}/report/${action}`, METHOD.GET, params);
}
export function postERPReportAction(params,action) {
    return request(`${UP_ERP}/report/${action}`, METHOD.POST, params);
}
export function setBomPack(params,action) {
    return request(`${UP_ERP}/bom/${action}`, METHOD.POST, params);
}
export function getBomPack(params,action) {
    return request(`${UP_ERP}/bom/${action}`, METHOD.GET, params);
}