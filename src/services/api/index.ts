import user from './modules/user'
import admin from './modules/admin'
import contract from './modules/contract'
import node from './modules/node'
import resource from './modules/resource'

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
export const placeHolder: string = 'urlPlaceHolder'

const apis = { user, admin, contract, node, resource }

export default apis