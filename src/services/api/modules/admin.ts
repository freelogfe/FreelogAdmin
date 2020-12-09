
import { Api, placeHolder } from '../index'
import { isDevelopmentEnv } from '@/utils/utils';
// TODO 使用namespace来做
interface Admin {
  [propName: string]: Api
}

// todo  需要给data或params定义类型 
const admin: Admin = {}


interface IApplyRecordsType {
  page?: number;
  pageSize?: number;
  status?: number;
  userId?: number;
}

admin.applyRecord = {
  url: '/v1/testQualifications/beta/applyRecords',
  method: 'GET'
}

interface IBatchCreateType {
  quantity?: number;
}

admin.batchCreate = {
  // console.log(params, 'paramsparams');
  url: '/v1/testQualifications/beta/codes/batchCreate',
  method: 'POST'
}


interface ISelectBetaCodesType {
  page?: number;
  pageSize?: number;
  // 状态 0:未使用 1:已分发 2:已核销 默认全部
  status?: number;
}

admin.selectBetaCodes = {
  url: '/v1/testQualifications/beta/codes',
  method: 'GET',
}


interface IBetaAuditType {
  recordIds: string[];
  // 审核状态 ( 1:审核通过 2:审核不通过 )
  status: number;
  auditMsg?: string;
}

admin.betaAudit = {
  url: '/v1/testQualifications/beta/audit',
  method: 'PUT'
}


interface IBatchUpdateType {
  codes: string[];
  // 审核状态 ( 1:审核通过 2:审核不通过 )
  status: number;
}

admin.batchUpdate = {
  url: '/v1/testQualifications/beta/codes/batchUpdate',
  method: 'PUT'
}


// 获取用户列表
admin.getUsers = {
  url: '/api/users',
  method: 'GET',
  dataModel: {
    skip: 'int',
    limit: 'int',
    keywords: 'string',
    tagIds: 'string',
    startRegisteredDate: 'date',
    endRegisteredDate: 'date'
  }
}
// 设置用户标签
admin.setUserTag = {
  url: `/api/users/${placeHolder}/setTag`,
  method: 'PUT',
  dataModel: {
    tagId: ''
  }
}
// 取消用户标签
admin.cancelUserTag = {
  url: `/api/users/${placeHolder}/unsetTag`,
  method: 'PUT',
  dataModel: {
    tagId: ''
  }
}
// 获取标签列表
admin.getTags = {
  url: '/api/users/tags',
  method: 'GET',
}
// 获取标签列表
admin.postTag = {
  url: '/api/users/tags',
  method: 'POST',
  dataModel:{
    tag: 'string',
    type: 'int' // 1 手动  2 自动
  }
}
// 删除标签
admin.deleteTag = {
  url: '/api/users/tags',
  method: 'POST',
  dataModel:{
    tagId: 'string',
  }
}
export default admin;