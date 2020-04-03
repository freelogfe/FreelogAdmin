import { Reducer } from 'redux';
import { Effect } from 'dva';
// import { query as queryUsers } from '../services/user';
import { applyRecords as applyRecordsAPI } from '../services/admin';
// import {stringify} from 'querystring';
// import router from 'umi/router';

// import {fakeAccountLogin, getFakeCaptcha} from '@/services/login';
// import {setAuthority} from '@/utils/authority';
// import {getPageQuery} from '@/utils/utils';

export interface StateType {
  applyRecords: any[];
}

export interface ApplicationModelType {
  namespace: string;
  state: StateType;
  effects: {
    getApplyRecords: Effect,
  };
  reducers: {
    changeApplyRecordsStatus: Reducer<StateType>;
  };
}

const Model: ApplicationModelType = {
  namespace: 'application',

  state: {
    applyRecords: [],
  },

  effects: {
    // * getAllUsers({payload}, {call, put}) {
    * getApplyRecords(_, { call, put }) {
      const response = yield call(applyRecordsAPI);
      // console.log(response, 'response');
      yield put({
        type: 'application/changeApplyRecordsStatus',
        applyRecords: response.data.dataList,
      });
    },

  },

  reducers: {
    changeApplyRecordsStatus(state, { applyRecords }) {
      console.log(applyRecords, 'applyRecords');
      console.log(state, 'state');
      return {
        ...state,
        applyRecords: [
          ...(state?.applyRecords || []),
          ...applyRecords,
        ],
      };
    },
  },
};

export default Model;
