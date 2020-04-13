import { Effect, EffectsCommandMap } from 'dva';
import { AnyAction, Reducer } from 'redux';
import { selectBetaCodes } from '@/services/admin';
import { message } from 'antd';

export interface InviteCodeModelState {
  dataSource: any[] | null;
  total: number;
}

export interface InviteCodeModelType {
  namespace: string;
  state: InviteCodeModelState;
  effects: {
    handleDataSource: Effect;
  };
  reducers: {
    changeDataSourceStatus: Reducer<InviteCodeModelState>;
  };
}

const defaultState: InviteCodeModelState = {
  dataSource: null,
  total: -1,
};

const Model: InviteCodeModelType = {
  namespace: 'inviteCode',

  state: {
    ...defaultState,
  },

  effects: {
    * handleDataSource(_, { call, put }: EffectsCommandMap) {
      const response = yield call(selectBetaCodes, {
        page: 1,
        pageSize: 10,
        status: -1,
      });
      // console.log(response, 'response');
      if (response.ret !== 0 || response.errcode !== 0) {
        message.error(response.msg);
      } else {
        yield put({
          type: 'changeDataSourceStatus',
          dataSource: response.data.dataList,
          total: response.data.totalItem,
        });
      }
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
  },
};

export default Model;
