import React from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import { connect, ConnectProps } from 'umi';
import { ConnectState } from '@/models/connect';
import frequest from '@/services/handler'

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
  async componentDidMount() {
    const { loginStatus, dispatch } = this.props;
    let res = await frequest('user.queryCurrent', [], '')
    if (dispatch) {
      loginStatus !== 'ok' && dispatch({
        type: 'login/changeLoginStatus',
        payload: res.errcode === 30 ? 'error' : 'ok'
      });
      dispatch({
        type: 'user/saveCurrentUser',
        payload: res.data
      });
    }
    this.setState({
      isReady: true
    });
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
