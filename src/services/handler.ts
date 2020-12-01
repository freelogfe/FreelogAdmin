import request from '@/utils/request';
import {createClient} from '@/utils/request';

import { Api, placeHolder } from './api'
import apis from './api'


export default function frequest(action: string, urlData: Array<string | number>, data: string | object | Array<any> | null | JSON): any {
    if (action.indexOf('.') < -1) {
        console.error('action is not exists: ' + action)
        return
    }
    console.log(action, urlData, data)
    let arr = action.split('.')
    if (!apis[arr[0].toLowerCase()] || !apis[arr[0].toLowerCase()][arr[1].toLowerCase()]) {
        console.error('action is not exists: ' + action)
        return
    }
    let api: Api = Object.assign({},apis[arr[0].toLowerCase()][arr[1].toLowerCase()])
    // type Api2 = Exclude<Api, 'url' | 'before' | 'after'>
    let url = api.url
    if (url.indexOf(placeHolder) > -1) {
        if (!urlData.length) {
            console.error('urlData is required: ' + urlData)
            return
        }
        urlData.forEach((item)=>{
            url = url.replace(placeHolder, item + '')
        })
    }
    // pre method
    api.before && api.before(data)
    let req = request
    if(api.after){
        req = createClient()
        request.interceptors.response.use((response, options) => {
           api.after && api.after(response)
           return response;
        });
    }
    if(api.method.toLowerCase() === 'get'){
        api.params = data
    }else{
        api.data = data
    }
    // after method: create a new request
    ;['url', 'before', 'after'].forEach((item) => {
        delete api[item]
    })
    let _api: object = Object.assign({}, api)
    return req(url, _api)
}