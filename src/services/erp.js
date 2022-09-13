/*
 * @Author: max
 * @Date: 2021-10-14 13:51:11
 * @LastEditTime: 2022-09-06 11:21:19
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/services/erp.js
 */
import {
    UP_ERP,
    UP_BOM,
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
    return request(`${UP_BOM}/report/${action}`, METHOD.GET, params);
}
export function postERPReportAction(params,action) {
    return request(`${UP_BOM}/report/${action}`, METHOD.POST, params);
}
export function setBomPack(params,action) {
    return request(`${UP_BOM}/bom/${action}`, METHOD.POST, params);
}
export function getBomPack(params,action) {
    return request(`${UP_BOM}/bom/${action}`, METHOD.GET, params);
}

export function setImport(params,action) {
    return request(`${UP_ERP}/import/${action}`, METHOD.POST, params);
}
export function getImport(params,action) {
    return request(`${UP_ERP}/import/${action}`, METHOD.GET, params);
}

