/*
 * @Author: max
 * @Date: 2022-08-16 09:44:19
 * @LastEditTime: 2022-08-23 09:32:46
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/srm/data/params.js
 */
// 采购类型
export const purchaseType = ['全部', '一般采购', '委外采购', '多角采购', '费用采购', '固资采购', '境外直送', '境外采购', '平台采购', 'VMI采购', '样品采购', '折让订单']

// 客户订单转态
export const orderType = ['全部', '已留置', '作废', '撤回答交', '预订单', '待答打', '答交差异', '退回', '变更中', '已确认', '已结案', '已冻结', '供应商拒绝', '待发送', '采购方撤回']

// 送货状态
export const deliveryStatus = ['全部', '待发货', '部分发货', '发货完成', '已结案']

//签章状态
export const signatureStatus = ['全部', '未签章', '签章中', '完成', '撤销', '过期', '拒签', '失败', '作废', '忽略']

//供应商状态
export const supportStatus = ['全部', '无效', '有效', '黑名单']

//送货状态 
export const deliverStatus = ['全部', '部分同意', '撤回', '申请中', '退回', '已同意', '已冻结', '作废', '申请退回', '未发送', '待签收', '签收中', '已完成']
//物料送货类型
export const materielDeliverType = ['全部', '按备品', '按订单', '按排程', '按退货']

//送货类型
export const deliverType = ['全部', '正常', '补单', '备品', 'VMI']

//送货方式
export const deliverMode = ['全部', '供应商送货', '快递', '采购方自提', '直运指定地点', '物流']
