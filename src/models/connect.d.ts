import { AnyAction } from 'redux';
import { MenuDataItem } from '@ant-design/pro-layout';
import { RouterTypes } from 'umi';
import { GlobalModelState } from './global';
import { DefaultSettings as SettingModelState } from '../../config/defaultSettings';
import { UserModelState } from './user';
import { StateType } from './login';
import {ApplicationModelState } from './application';
import { InviteCodeModelState } from '@/models/invitecode';

export { GlobalModelState, SettingModelState, UserModelState, ApplicationModelState };

export interface ConnectState {
  global: GlobalModelState;
  settings: SettingModelState;
  user: UserModelState;
  login: StateType;
  application: ApplicationModelState,
  inviteCode: InviteCodeModelState,
}

export interface Route extends MenuDataItem {
  routes?: Route[];
}

/**
 * @type T: Params matched in dynamic routing
 */
export interface ConnectProps<T = {}> extends Partial<RouterTypes<Route, T>> {
  dispatch?: Dispatch<AnyAction>;
}
