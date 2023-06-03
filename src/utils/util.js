/*
 * @Author: max
 * @Date: 2021-06-23 09:27:52
 * @LastEditTime: 2023-04-27 15:46:29
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/utils/util.js
 */
import enquireJs from 'enquire.js'

export function isDef(v) {
  return v !== undefined && v !== null
}

/**
 * Remove an item from an array.
 */
export function remove(arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

export function isRegExp(v) {
  return _toString.call(v) === '[object RegExp]'
}
//截取时间
export function splitData(data) {
  if (data !== null && data !== "" && data !== undefined) {
    let str = data.split('T');
    return str[0];
  }
  return;
}

export function splitDataTime(data) {
  if (data !== null && data !== "" && data !== undefined) {
    let str = data.split('T');
    let time = str[1].split('.')
    return str[0] + " " + time[0];
  }
  return;
}

export function enquireScreen(call) {
  const handler = {
    match: function () {
      call && call(true)
    },
    unmatch: function () {
      call && call(false)
    }
  }
  enquireJs.register('only screen and (max-width: 767.99px)', handler)
}
//品号类型转换
export function modelType(type) {
  let obj = [
    {
      type: "P",
      name: "采购价"
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
      name: "采购价"
    },
    {
      type: "F",
      name: "采购价"
    },
    {
      type: "O",
      name: "采购价"
    },
    {
      type: "T",
      name: "采购价"
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
export function getTimeData() {
  var date = new Date();
  var year = date.getFullYear(); //年 ,从 Date 对象以四位数字返回年份
  var month = date.getMonth() + 1; //月 ,从 Date 对象返回月份 (0 ~ 11) ,date.getMonth()比实际月份少 1 个月
  var day = date.getDate(); //日 ,从 Date 对象返回一个月中的某一天 (1 ~ 31)
  var hours = date.getHours(); //小时 ,返回 Date 对象的小时 (0 ~ 23)
  var minutes = date.getMinutes(); //分钟 ,返回 Date 对象的分钟 (0 ~ 59)
  var seconds = date.getSeconds(); //秒 ,返回 Date 对象的秒数 (0 ~ 59)
  //修改月份格式
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  //修改日期格式
  if (day >= 0 && day <= 9) {
    day = "0" + day;
  }
  //修改小时格式
  if (hours >= 0 && hours <= 9) {
    hours = "0" + hours;
  }
  //修改分钟格式
  if (minutes >= 0 && minutes <= 9) {
    minutes = "0" + minutes;
  }
  //修改秒格式
  if (seconds >= 0 && seconds <= 9) {
    seconds = "0" + seconds;
  }
  //获取当前系统时间  格式(yyyy-mm-dd hh:mm:ss)
  let currentFormatDate = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
  return currentFormatDate;
}

// 大写转换
export function upperJSONKey(jsonObj){
  for (var key in jsonObj){
    jsonObj[key.toUpperCase()] = jsonObj[key];
    delete(jsonObj[key]);
  }
  return jsonObj;
}
 
// 小写转换
export function lowerJSONKey(jsonObj){
  for (var key in jsonObj){
    jsonObj[key.toLowerCase()] = jsonObj[key];
    delete(jsonObj[key]);
  }
  return jsonObj;
}
const _toString = Object.prototype.toString
