import React from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import { Redirect, connect, ConnectProps } from 'umi';
import { stringify } from 'querystring';
import { ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import frequest from '@/services/handler'

interface SecurityLayoutProps extends ConnectProps {
  loading?: boolean;
  currentUser?: CurrentUser;
  loginStatus:  'ok' | 'error';
}

interface SecurityLayoutState {
  isReady: boolean;
 }

class SecurityLayout extends React.Component<SecurityLayoutProps, SecurityLayoutState> {
  state: SecurityLayoutState = {
    isReady: false
  };
  async componentDidMount() {
    const { loginStatus, dispatch }  = this.props;
    if(loginStatus !== 'ok'){
      let res  = await frequest('user.queryCurrent', [], '')
      console.log(res)
      dispatch &&  dispatch({
        type: 'login/changeLoginStatus',
        payload: res.errcode === 30 ? 'ok' : 'error'
      });
    }
    this.setState({
      isReady: true
    }); 
  }

  render() {
    if (!this.state.isReady) {
      return <PageLoading/>;
    }
    console.log(this.props.loginStatus)
    return this.props.children;
  }
}

export default connect(({ user, loading, login }: ConnectState) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
  loginStatus: login.status
}))(SecurityLayout);
