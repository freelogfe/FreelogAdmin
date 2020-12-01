
import { Api } from '../index'
import { isDevelopmentEnv } from '@/utils/utils';

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
 

export default admin;