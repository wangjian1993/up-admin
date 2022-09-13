/*
 * @Author: max
 * @Date: 2022-08-10 16:38:42
 * @LastEditTime: 2022-09-07 15:25:15
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/services/srm.js
 */
import {
    UP_SRM
} from '@/services/api'
import {
    request,
    METHOD
} from '@/utils/request';
const Enterpriseld = localStorage.getItem("COMPANY_ID") || ""

//采购收货管理
export function getPurchaseOrders(params, action) {
    return request(`${UP_SRM}/purchase/${action}`, METHOD.GET, params, {
        headers: {
            Enterpriseld: Enterpriseld,
        }
    });
}
export function setPurchaseOrders(params, action) {
    return request(`${UP_SRM}/purchase/${action}`, METHOD.POST, params, {
        headers: {
            Enterpriseld: Enterpriseld,
        }
    });
}

export function getPurchaseChange(params, action) {
    return request(`${UP_SRM}/purchasechange/${action}`, METHOD.GET, params, {
        headers: {
            Enterpriseld: Enterpriseld,
        }
    });
}

export function getDelivery(params, action) {
    return request(`${UP_SRM}/delivery/${action}`, METHOD.GET, params, {
        headers: {
            Enterpriseld: Enterpriseld,
        }
    });
}

export function getArrival(params, action) {
    return request(`${UP_SRM}/arrival/${action}`, METHOD.GET, params, {
        headers: {
            Enterpriseld: Enterpriseld,
        }
    });
}

export function getReturn(params, action) {
    return request(`${UP_SRM}/return/${action}`, METHOD.GET, params, {
        headers: {
            Enterpriseld: Enterpriseld,
        }
    });
}
//财务对账管理
export function getBill(params, action) {
    return request(`${UP_SRM}/bill/${action}`, METHOD.GET, params, {
        headers: {
            Enterpriseld: Enterpriseld,
        }
    });
}

//供应商管理
export function getAuthentication(params, action) {
    return request(`${UP_SRM}/qua/${action}`, METHOD.GET, params, {
        headers: {
            Enterpriseld: Enterpriseld,
        }
    });
}
export function getSupplierAction(params, action) {
    return request(`${UP_SRM}/supplier/${action}`, METHOD.GET, params, {
        headers: {
            Enterpriseld: Enterpriseld,
        }
    });
}
export function setSupplierAction(params, action) {
    return request(`${UP_SRM}/supplier/${action}`, METHOD.POST, params, {
        headers: {
            Enterpriseld: Enterpriseld,
        }
    });
}
//供应商通知
export function getNotification(params, action) {
    return request(`${UP_SRM}/news/${action}`, METHOD.GET, params, {
        headers: {
            Enterpriseld: Enterpriseld,
        }
    });
}
export function setNotification(params, action) {
    return request(`${UP_SRM}/news/${action}`, METHOD.POST, params, {
        headers: {
            Enterpriseld: Enterpriseld,
        }
    });
}
//客户订单
export function getClientOrder(params, action) {
    return request(`${UP_SRM}/clientpurchase/${action}`, METHOD.GET, params, {
        headers: {
            Enterpriseld: Enterpriseld,
        }
    });
}

export function getClientChange(params, action) {
    return request(`${UP_SRM}/clientpurchasechange/${action}`, METHOD.GET, params, {
        headers: {
            Enterpriseld: Enterpriseld,
        }
    });
}

//送货单通知
export function getClientDelivery(params, action) {
    return request(`${UP_SRM}/clientdelivery/${action}`, METHOD.GET, params, {
        headers: {
            Enterpriseld: Enterpriseld,
        }
    });
}
//客户退货
export function getClientReturn(params, action) {
    return request(`${UP_SRM}/clientreturn/${action}`, METHOD.GET, params, {
        headers: {
            Enterpriseld: Enterpriseld,
        }
    });
}

//供应商发票
export function getInvoice(params, action) {
    return request(`${UP_SRM}/invoice/${action}`, METHOD.GET, params, {
        headers: {
            Enterpriseld: Enterpriseld,
        }
    });
}
export function setInvoice(params, action) {
    return request(`${UP_SRM}/invoice/${action}`, METHOD.POST, params, {
        headers: {
            Enterpriseld: Enterpriseld,
        }
    });
}

//供应商费用
export function getExpense(params, action) {
    return request(`${UP_SRM}/expense/${action}`, METHOD.GET, params, {
        headers: {
            Enterpriseld: Enterpriseld,
        }
    });
}
export function setExpense(params, action) {
    return request(`${UP_SRM}/expense/${action}`, METHOD.POST, params, {
        headers: {
            Enterpriseld: Enterpriseld,
        }
    });
}
