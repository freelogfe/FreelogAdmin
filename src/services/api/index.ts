import user from './modules/user'
// todo 上传文件进度等需要配置
export interface Api {
  url: string;
  method: string;
  headers?: string;
  getResponse?: boolean;
  params?: any;
  data?: any;
  before?: (data: any)=>void;
  after?: (res: any)=>void;
}
export const placeHolder: string = 'urlPlaceHolder'

const apis = {user}

export default apis