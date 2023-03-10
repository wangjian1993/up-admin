/*
 * @Author: max
 * @Date: 2022-08-10 16:38:42
 * @LastEditTime: 2022-12-29 17:44:37
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
//上传图片
export function updateFile(params) {
    return request(`${UP_SRM}/common/upload`, METHOD.POST, params, {
        headers: {
            Enterpriseld: Enterpriseld,
        }
    });
}
export function deleteFile(params) {
    return request(`${UP_SRM}/common/deletefile`, METHOD.POST, params, {
        headers: {
            Enterpriseld: Enterpriseld,
        }
    });
}

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

export function getClientBill(params, action) {
    return request(`${UP_SRM}/clientbill/${action}`, METHOD.GET, params, {
        headers: {
            Enterpriseld: Enterpriseld,
        }
    });
}

//供应商管理
export function getAuthentication(params, action) {
    return request(`${UP_SRM}/qua/supplier/${action}`, METHOD.GET, params, {
        headers: {
            Enterpriseld: Enterpriseld,
        }
    });
}
export function setAuthentication(params, action) {
    return request(`${UP_SRM}/qua/supplier/${action}`, METHOD.POST, params, {
        headers: {
            Enterpriseld: Enterpriseld,
        }
    });
}
export function getQuaList(params, action) {
    return request(`${UP_SRM}/qua/${action}`, METHOD.GET, params, {
        headers: {
            Enterpriseld: Enterpriseld,
        }
    });
}
export function setQuaList(params, action) {
    return request(`${UP_SRM}/qua/${action}`, METHOD.POST, params, {
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
export function setClientOrder(params, action) {
    return request(`${UP_SRM}/clientpurchase/${action}`, METHOD.POST, params, {
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
export function setClientDelivery(params, action) {
    return request(`${UP_SRM}/clientdelivery/${action}`, METHOD.POST, params, {
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
//交易权限
export function getPermission(params, action) {
    return request(`${UP_SRM}/permission/${action}`, METHOD.GET, params, {
        headers: {
            Enterpriseld: Enterpriseld,
        }
    });
}
export function setPermission(params, action) {
    return request(`${UP_SRM}/permission/${action}`, METHOD.POST, params, {
        headers: {
            Enterpriseld: Enterpriseld,
        }
    });
}

//客户档案
export function getClientList(params, action) {
    return request(`${UP_SRM}/client/${action}`, METHOD.GET, params, {
        headers: {
            Enterpriseld: Enterpriseld,
        }
    });
}
export function setClientList(params, action) {
    return request(`${UP_SRM}/client/${action}`, METHOD.POST, params, {
        headers: {
            Enterpriseld: Enterpriseld,
        }
    });
}
export function getClientNews(params, action) {
    return request(`${UP_SRM}/client/news/${action}`, METHOD.GET, params, {
        headers: {
            Enterpriseld: Enterpriseld,
        }
    });
}
export function setClientNews(params, action) {
    return request(`${UP_SRM}/client/news/${action}`, METHOD.POST, params, {
        headers: {
            Enterpriseld: Enterpriseld,
        }
    });
}
