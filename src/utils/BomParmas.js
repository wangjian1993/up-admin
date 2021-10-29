/*
 * @Author: max
 * @Date: 2021-10-16 10:20:48
 * @LastEditTime: 2021-10-28 10:30:10
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/utils/BomParmas.js
 */
//生效状态
export function stateType(type) {
    let obj = [
        {
            type: "Y",
            name: "生效"
        },
        {
            type: "N",
            name: "未生效"
        },
        {
            type: "V",
            name: "失效"
        },
    ];
    let codeName = "";
    obj.map(item => {
        if (item.type == type) {
            codeName = item.name;
        }
    });
    return codeName;
}
export function variationType(type) {
    let obj = [
        {
            type: 1,
            name: "修改"
        },
        {
            type: 2,
            name: "新增"
        },
        {
            type: 4,
            name: "失效"
        },
    ];
    let codeName = "";
    obj.map(item => {
        if (item.type == type) {
            codeName = item.name;
        }
    })
    return codeName;
}
export function modelType(type) {
    let obj = [
        {
            type: "P",
            name: "采购件"
        },
        {
            type: "M",
            name: "自制件"
        },
        {
            type: "S",
            name: "委外加工件"
        },
        {
            type: "Y",
            name: "虚设件"
        },
        {
            type: "F",
            name: "产品系列"
        },
        {
            type: "O",
            name: "配送件"
        },
        {
            type: "T",
            name: "调拨件"
        },
    ];
    let codeName = "";
    obj.map(item => {
        if (item.type == type) {
            codeName = item.name;
        }
    })
    return codeName;
}

export function feedSystem(type) {
    //1厂内供料 3供货商供料 5客户供料 4不发料 0全部 6委托方供料
    let obj = [
        {
            type: 0,
            name: "全部"
        },
        {
            type: 1,
            name: "厂内供料"
        },
        {
            type: 3,
            name: "供货商供料"
        },
        {
            type: 5,
            name: "客户供料"
        },
        {
            type: 4,
            name: "不发料"
        },
        {
            type: 6,
            name: "委托方供料"
        },
    ];
    let codeName = "";
    obj.map(item => {
        if (item.type == type) {
            codeName = item.name;
        }
    })
    return codeName;
}
