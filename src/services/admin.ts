import request from '@/utils/request';

interface IApplyRecordsType {
  page?: number;
  pageSize?: number;
  status?: number;
  userId?: number;
}

export async function applyRecords(params: IApplyRecordsType) {
  return request('/v1/testQualifications/beta/applyRecords', {
    method: 'GET',
    params: params,
    // getResponse: true,
  });
}

interface IBatchCreateType {
  createQuantity?: number;
}

export async function batchCreate(params: IBatchCreateType) {
  return request('/v1/testQualifications/beta/codes/batchCreate', {
    method: 'POST',
    data: params,
    // getResponse: true,
  });
}


interface ISelectBetaCodesType {
  page?: number;
  pageSize?: number;
  // 状态 0:未使用 1:已分发 2:已核销 默认全部
  status?: number;
}

export async function selectBetaCodes(params: ISelectBetaCodesType) {
  return request('/v1/testQualifications/beta/codes', {
    method: 'GET',
    params: params,
    // getResponse: true,
  });
}


interface IBetaAuditType {
  recordIds: string[];
  // 审核状态 ( 1:审核通过 2:审核不通过 )
  status: number;
  auditMsg?: string;
}

export async function betaAudit(params: IBetaAuditType) {
  return request('/v1/testQualifications/beta/audit', {
    method: 'PUT',
    data: params,
  });
}


interface IBatchUpdateType {
  codes: string[];
  // 审核状态 ( 1:审核通过 2:审核不通过 )
  status: number;
}

export async function batchUpdate(params: IBatchUpdateType) {
  return request('/v1/testQualifications/beta/codes/batchUpdate', {
    method: 'PUT',
    data: params,
  });
}


