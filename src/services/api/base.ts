export const placeHolder: string = 'urlPlaceHolder'
// TODO 上传文件进度等需要配置
// TODO  需要给data或params定义类型 
// dataModel限定运行时的提交数据
export interface Api {
    url: string;
    method: string;
    headers?: string;
    getResponse?: boolean;
    params?: any;
    data?: any;
    before?: (data: any) => any;
    after?: (res: any) => void;
    dataModel?: object | Array<any>;
    isDiff?: boolean
}