import React from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import { connect, ConnectProps, history } from 'umi';
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
  componentDidMount() {
    const { dispatch, loginStatus } = this.props;
    if (dispatch && loginStatus !== 'ok') {
      dispatch && dispatch({
        type: 'user/fetchCurrent',
        payload: ''
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
