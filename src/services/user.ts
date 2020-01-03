import request from '@/utils/request';

interface ISearchUserType {
  keywords: string;
}

export async function searchUser(params: ISearchUserType) {
  return request('/v1/userinfos/detail', {
    method: 'GET',
    params: params,
  });
}




export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(): Promise<any> {
  return request('/api/currentUser');
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}
