import { Effect, EffectsCommandMap } from 'dva';
import { AnyAction, Reducer } from 'redux';
import { selectBetaCodes } from '@/services/admin';
import { message } from 'antd';
import { userinfos } from '@/services/user';

export interface InviteCodeModelState {
  dataSource: any[] | null;
  total: number;
  pageSize: number;
  current: number;
}

export interface InviteCodeModelType {
  namespace: string;
  state: InviteCodeModelState;
  effects: {
    handleDataSource: Effect;
    changePage: Effect;
  };
  reducers: {
    changeDataSourceStatus: Reducer<InviteCodeModelState>;
    changePageStatus: Reducer<InviteCodeModelState>;
  };
}

const defaultState: InviteCodeModelState = {
  dataSource: null,
  total: -1,
  pageSize: 10,
  current: 1,
};

const Model: InviteCodeModelType = {
  namespace: 'inviteCode',

  state: {
    ...defaultState,
  },

  effects: {
    * handleDataSource(_, { call, put, select }: EffectsCommandMap): Generator<any, void, any> {
      const params = yield select(({ inviteCode }: any) => ({
        pageSize: inviteCode.pageSize,
        page: inviteCode.current,
        // status: application.status,
      }));
      const response = yield call(selectBetaCodes, {
        ...params,
        status: -1,
      });
      // console.log(response, 'response');
      if (response.ret !== 0 || response.errcode !== 0) {
        message.error(response.msg);
        return;
      }

      yield put({
        type: 'changeDataSourceStatus',
        dataSource: response.data.dataList,
        total: response.data.totalItem,
      });

      if (response.data.totalItem === 0) {
        return;
      }

      const userIds = response.data.dataList
        .filter((j: any) => j.usedUsers.length > 0)
        .map((i: any) => i.usedUsers[0]);

      // console.log('#######');
      if (userIds.length === 0) {
        return;
      }

      const response1 = yield call(userinfos, {
        userIds: userIds.join(','),
      });

      if (response1.errcode !== 0 || response1.ret !== 0) {
        message.error(response1.msg);
        return;
      }

      yield put({
        type: 'changeDataSourceStatus',
        dataSource: response.data.dataList.map((i: any) => ({
          ...i,
          userInfo: response1.data.find((j: any) => j.userId === i.usedUsers[0]),
        })),
        total: response.data.totalItem,
      });
    },

    * changePage({ payload }: any, { put }: EffectsCommandMap): Generator<any, void, any> {
      // console.log(payload, 'payloadpayload');
      yield put({
        type: 'changePageStatus',
        payload,
      });
      yield put({
        type: 'handleDataSource',
      });
    },
  },

  reducers: {
    changeDataSourceStatus(state: InviteCodeModelState = defaultState, { dataSource, total }: AnyAction) {
      return {
        ...state,
        dataSource,
        total,
      };
    },
    changePageStatus(state: InviteCodeModelState = defaultState, { payload }: AnyAction) {
      return {
        ...state,
        current: 1,
        ...payload,
      };
    },
  },
};

export default Model;
