import store from '@/store'
import moment from "moment-timezone";
import dayjs from 'dayjs';
import i18n from "@/i18n";

export const getUrlVal = (name) => {
    let url = location.href
    let urlStr = url?.split('?')[1]
    // 创建空对象存储参数
    let obj = {};
    // 再通过 & 将每一个参数单独分割出来
    let paramsArr = urlStr?.split('&')
    if (paramsArr) {
        for (let i = 0, len = paramsArr?.length; i < len; i++) {
            // 再通过 = 将每一个参数分割为 key:value 的形式
            let arr = paramsArr[i]?.split('=')
            obj[arr[0]] = arr[1];
        }
    }
    return obj[name]
}
/**
 * 
 *  判断是否是手机端
 */
export const is_mobile = () => {
    var regex_match = /(nokia|iphone|android|motorola|^mot-|softbank|foma|docomo|kddi|up.browser|up.link|htc|dopod|blazer|netfront|helio|hosin|huawei|novarra|CoolPad|webos|techfaith|palmsource|blackberry|alcatel|amoi|ktouch|nexian|samsung|^sam-|s[cg]h|^lge|ericsson|philips|sagem|wellcom|bunjalloo|maui|symbian|smartphone|midp|wap|phone|windows ce|iemobile|^spice|^bird|^zte-|longcos|pantech|gionee|^sie-|portalmmm|jigs browser|hiptop|^benq|haier|^lct|operas*mobi|opera*mini|320x320|240x320|176x220)/i;
    var u = navigator.userAgent;
    if (null == u) {
        return true;
    }
    var result = regex_match.exec(u);
    if (null == result) {
        return false
    } else {
        return true
    }
}
/**
 * @description 时间格式处理
 */
export const formatData = (data) => {
    let thisData = formatTime(new Date(), "yyyy-MM-dd hh:mm:ss");
    let myData = data.substr(0, 10);
    if (thisData == myData) {
        let Time = data.substr(11, 5);
        return Time
    } else {
        if (thisData.substr(0, 4) == myData.substr(0, 4) && thisData != myData) {
            let Data = data.substr(5, 11);
            return Data
        } else {
            let Year = myData;
            return Year
        }
    }
}

/**
 * @description 时间格式转化
 * @param {String} date 日期
 * @param {String} fmt 需要的格式
 */
export const formatTime = (date, fmt) => {
    let o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

/**
 * @description 验证手机号格式是否正确
 * @param {String} mobile 电话号码
 */
export const checkMobileformat = mobile => /^1[345789]\d{9}$/.test(mobile);

/**
 * @description Array clear empty item.
 * @param {Array} array
 */
export const arrayClearEmptyItem = array => {
    return array.filter(item => item);
}

/**
 * @description 判断一个日期是过去还是未来
 * @param {String} d 要判断的日期
 * @returns past => false   future => true
 */
export const judgeDateIsPastOrFuture = (d) => {
    if (!d) {
        return false;
    }
    const nowDate = new Date();
    const nowTimeStamp = nowDate.getTime();
    const date = new Date(d.replace(/-/g, "/"));
    const dateTimeStamp = date.getTime();
    return nowTimeStamp < dateTimeStamp;
}

/**
 * @description 判断一个字符串中是否有重复的项（0-9, a-z, A-Z）
 * @param {String} str 判断的目标字符串
 * @returns {Boolean} true: 有重复项   false: 无重复项
 */
export const strIsReplace = str => {
    const passwordRule = /[0-9a-zA-Z]/;
    const arr = str.split("");
    for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        if (passwordRule.test(element)) {
            if (i === arr.length - 1) {
                return false;
            }
            if (str.includes(element, i + 1)) {
                return true;
            }
        }
    }
    return false;
}
// 设置localStorage
export const setStorage = function (key, obj) {
    let json = JSON.stringify(obj)
    window.localStorage.setItem(key, json)
}

// 获取localStorage
export const getStorage = function (key) {
    const str = window.localStorage.getItem(key)
    if (!str) {
        return null
    }
    return str
}

// 移除localStorage
export const removeStorage = function (key) {
    window.localStorage.removeItem(key)
}

// 获取浏览器默认语言
export const getBrowserLang = function () {
    let browserLang = navigator.language ? navigator.language : navigator.browserLanguage
    let defaultBrowserLang = ''
    if (browserLang?.toLowerCase() === 'cn' || browserLang?.toLowerCase() === 'zh' || browserLang?.toLowerCase() === 'cn') {
        defaultBrowserLang = 'cn'
    } else {
        defaultBrowserLang = 'en'
    }
    return defaultBrowserLang
}

// 是否登录
export const isLogin = () => {
    return store.getters.userInfo && localStorage.getItem('token')
}

// 图片地址
export const getImgUrl = (path) => {
    return `https://www.tkshouppig.com/wap/public/showimg!showImg.action?imagePath=${path}`
}

/**
 * 数字千位符格式化
 * eg:
 * 17267737 -> 17,267,737
 */
export const priceFormat = (num, int) => {
    if (num && Number(num)) {
        const numStr = _toFixed(num, 2)
        const numPre = numStr.slice(0, numStr.indexOf('.'))
        const numRi = numStr.slice(numStr.indexOf('.') + 1)
        const intStr = numPre.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
        const floatStr = numRi ? `.${numRi.length < 2 ? numRi + '0' : numRi}` : '.00'
        return int ? `${intStr}` : `${intStr}${floatStr}`
    } else {
        return 0
    }
}
export const priceFormat8 = (num, int) => {
    if (num && Number(num)) {
        const numStr = _toFixed(num, 10)
        const numPre = numStr.slice(0, numStr.indexOf('.'))
        const numRi = numStr.slice(numStr.indexOf('.') + 1)
        const intStr = numPre.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
        const floatStr = numRi ? `.${numRi.length < 2 ? numRi + '0' : numRi}` : '.00'
        return int ? `${intStr}` : `${intStr}${floatStr}`
    } else {
        return 0
    }
}
export const priceFormatInt = (num) => {
    if (num && Number(num)) {
        const numStr = _toFixed(num, 2)
        const numPre = numStr.slice(0, numStr.indexOf('.'))
        const numRi = numStr.slice(numStr.indexOf('.') + 1)
        const intStr = numPre.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
        const floatStr = numRi ? `.${numRi.length < 2 ? numRi + '0' : numRi}` : '.00'
        return intStr
    } else {
        return 0
    }
}
export const formatZoneDate = (time) => {
    if (!time) return '--'
    //设置服务器默认时区
    moment.tz.setDefault('Asia/Shanghai')
    time = moment(time)
    //获取当前时区
    let timezone = moment.tz.guess(true)
    //time转成当前时区的时间
    time = moment.tz(time, timezone).format('YYYY-MM-DD HH:mm:ss')
    return time
}
// 不要四舍五入 直接截取
const _toFixed = (num, decimal) => {
    num = num.toString();
    let index = num.indexOf('.');
    if (index !== -1) {
        num = num.substring(0, decimal + index + 1)
    } else {
        num = num.substring(0)
    }
    return parseFloat(num).toFixed(decimal)
}

/**
 * 身份证/护照号码验证
 * 验证字母或者数字
 */

export const isAlphanumeric = (str) => {
    return /^[a-zA-Z0-9]+$/.test(str);
}

// 数组对象去重
export const deduplication = (arr, key) => {
    const res = new Map();
    return arr.filter((arr) => !res.has(arr[key]) && res.set(arr[key], 1))
}




/**
* 仿照微信中的消息时间显示逻辑，将时间戳（单位：毫秒）转换为友好的显示格式.
*
* 1）7天之内的日期显示逻辑是：今天、昨天(-1d)、前天(-2d)、星期？（只显示总计7天之内的星期数，即<=-4d）；
* 2）7天之外（即>7天）的逻辑：直接显示完整日期时间。
*
* @param  {[long]} timestamp 时间戳（单位：毫秒），形如：1550789954260
* @param {boolean} mustIncludeTime true表示输出的格式里一定会包含“时间:分钟”
* ，否则不包含（参考微信，不包含时分的情况，用于首页“消息”中显示时）
*
* @return {string} 输出格式形如：“刚刚”、“10:30”、“昨天 12:04”、“前天 20:51”、“星期二”、“2019/2/21 12:09”等形式
* @since 1.1
*/
export const shourtTimeString = (date) => {

    const dateTime = dayjs(date);
    const diffMinute = (dayjs().unix() - dateTime.unix()) / 60;
    const diffDays = Math.floor(diffMinute / (60 * 24))
    // const utcDay = dateTime.utc().tz();
    if (diffDays === 0) {
        if (diffMinute < 5) {
            return i18n.i18n.t('just')
        }
        return dateTime.format('HH:mm');
    } else if (diffDays === 1) {
        return i18n.i18n.t('yesterday');
    } else if (diffDays === 2) {
        return i18n.i18n.t('beforeYesterday');
    } else if (diffDays >= 3 && diffDays <= 6) {
        const weeks = [
            i18n.i18n.t('sunday'),
            i18n.i18n.t('monday'),
            i18n.i18n.t('tuesday'),
            i18n.i18n.t('wednesday'),
            i18n.i18n.t('thursday'),
            i18n.i18n.t('friday'),
            i18n.i18n.t('saturday'),
        ]
        return weeks[dateTime.day()]
    }

    return dateTime.format('MM-DD')

}