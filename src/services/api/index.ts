import user from './modules/user'
import admin from './modules/admin'

// todo 上传文件进度等需要配置
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
export const placeHolder: string = 'urlPlaceHolder'

const apis = { user, admin }

export default apis