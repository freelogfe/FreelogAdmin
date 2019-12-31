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
