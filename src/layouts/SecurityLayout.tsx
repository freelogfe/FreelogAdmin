import React from 'react';
import {connect} from 'dva';
import {PageLoading} from '@ant-design/pro-layout';
import {Redirect} from 'umi';
import {stringify} from 'querystring';
import {ConnectState, ConnectProps} from '@/models/connect';

// import { CurrentUser } from '@/models/user';

interface SecurityLayoutProps extends ConnectProps {
  loading?: boolean;
  // currentUser?: CurrentUser;
  currentUser?: any;
}

interface SecurityLayoutState {
  isReady: boolean;
}

class SecurityLayout extends React.Component<SecurityLayoutProps, SecurityLayoutState> {
  state: SecurityLayoutState = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });
    const {dispatch} = this.props;
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  }

  render() {
    const {isReady} = this.state;
    const {
      children, loading,
      // currentUser
    } = this.props;
    // console.log(currentUser, 'currentUser');
    // You can replace it to your authentication rule (such as check token exists)
    // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）
    // const isLogin = currentUser && currentUser.userId;
    const cookieUserInfo: any = Buffer.from(document.cookie.split('.')[1], 'base64').toString();
    // console.log(cookieUserInfo, 'cookieUserInfocookieUserInfo');
    const isLogin = (cookieUserInfo && JSON.parse(cookieUserInfo).email === 'support@freelog.com') || window.localStorage.getItem('authorization') !== 'null';
    const queryString = stringify({
      redirect: window.location.href,
    });

    if ((!isLogin && loading) || !isReady) {
      return <PageLoading/>;
    }
    if (!isLogin) {
      return <Redirect to={`/user/login?${queryString}`}/>;
    }
    return children;
  }
}

export default connect(({user, loading}: ConnectState) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(SecurityLayout);
