import React from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import { connect, ConnectProps, history } from 'umi';
import { ConnectState } from '@/models/connect';

interface SecurityLayoutProps extends ConnectProps {
  loginStatus?: 'ok' | 'error';
}

interface SecurityLayoutState {
  isReady: boolean;
}

class SecurityLayout extends React.Component<SecurityLayoutProps, SecurityLayoutState> {
  state: SecurityLayoutState = {
    isReady: false
  };
  
  componentDidMount() {
    const { dispatch, loginStatus } = this.props;
    if (dispatch && loginStatus !== 'ok') {
      dispatch && dispatch({
        type: 'user/fetchCurrent',
        payload: ''
      });
    }
  }
  static getDerivedStateFromProps(nextProps: any, prevState: any){
    const flag = history.location.pathname === '/user/login' && nextProps.loginStatus !== 'ok' || nextProps.loginStatus === 'ok'
    return  {
      isReady: flag
    }
  }
  render() {
    if (!this.state.isReady) {
      return <PageLoading />;
    }
    return this.props.children;
  }
}

export default connect(({ user, login }: ConnectState) => ({
  loginStatus: login.status
}))(SecurityLayout);
