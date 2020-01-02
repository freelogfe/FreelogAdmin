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
    data: params,
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
  status?: 0 | 1 | 2;
}

export async function selectBetaCodes(params: ISelectBetaCodesType) {
  return request('/v1/testQualifications/beta/codes', {
    method: 'GET',
    data: params,
    // getResponse: true,
  });
}
