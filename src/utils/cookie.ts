import { ConsoleSqlOutlined } from "@ant-design/icons";

// 设置cookie
export function setCookie(c_name: string, value: string, expiremMinutes: number) {
    const exdate: Date = new Date();
    exdate.setTime(exdate.getTime() + expiremMinutes * 60 * 1000);
    document.cookie = c_name + '=' + escape(value) + ((expiremMinutes == null) ? '' : ';expires=' + exdate.toGMTString());
}

// 读取cookie
export function getCookie(c_name: string) {
    if (document.cookie.length > 0) {
        let c_start = document.cookie.indexOf(c_name + '=');
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            let c_end = document.cookie.indexOf(';', c_start);
            if (c_end == -1) { c_end = document.cookie.length }
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ''
}

// 删除cookie
export function delCookie(c_name: string) {
    const exp: Date = new Date();
    exp.setTime(exp.getTime() - 1);
    const cval = getCookie(c_name);
    console.log(cval)
    if (cval != null) {
        document.cookie = c_name + '=' + cval + ';expires=' + exp.toGMTString();
    }
}

export default {
    getCookie,
    setCookie,
    delCookie,
}