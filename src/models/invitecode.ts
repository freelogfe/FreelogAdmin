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
  status: number;
}

export interface InviteCodeModelType {
  namespace: string;
  state: InviteCodeModelState;
  effects: {
    handleDataSource: Effect;
    changePage: Effect;
    changeStatus: Effect;
    // fresh: Effect;
  };
  reducers: {
    changeDataSourceStatus: Reducer<InviteCodeModelState>;
    changePageStatus: Reducer<InviteCodeModelState>;
    changeStatusStatus: Reducer<InviteCodeModelState>;
  };
  // subscriptions: any;
}

const defaultState: InviteCodeModelState = {
  dataSource: null,
  total: -1,
  pageSize: 10,
  current: 1,
  status: -1,
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
        status: inviteCode.status,
      }));
      const response = yield call(selectBetaCodes, params);
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
      yield put({ type: 'changePageStatus', payload });
      yield put({ type: 'handleDataSource' });
    },

    * changeStatus({ payload }: any, { put }: EffectsCommandMap): Generator<any, void, any> {
      yield put({ type: 'changeStatusStatus', payload });
      yield put({ type: 'handleDataSource' });
    },

    // * fresh(_: any, { take, put }: EffectsCommandMap): Generator<any, void, any> {
    //   console.log('inviteCodeinviteCode');
    //   while (yield take('changePage')) {
    //     put({ type: 'handleDataSource' });
    //   }
    // },
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
    changeStatusStatus(state: InviteCodeModelState = defaultState, { payload }: AnyAction) {
      return {
        ...state,
        current: 1,
        status: payload,
      };
    },
  },

  // subscriptions: {
  //   fresh1({ dispatch }: SubscriptionAPI) {
  //     dispatch({type: 'fresh'});
  //   },
  // },
};

export default Model;