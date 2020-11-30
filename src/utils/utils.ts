import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
import { Route } from '@/models/connect';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isDevelopmentEnv = (): boolean => {
  const { NODE_ENV } = process.env;
  return NODE_ENV === 'development';
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */
export const getAuthorityFromRouter = <T extends { path: string }>(
  router: T[] = [],
  pathname: string,
): T | undefined => {
  const authority = router.find(({ path }) => path && pathRegexp(path).exec(pathname));
  if (authority) return authority;
  return undefined;
};

export const getRouteAuthority = (path: string, routeData: Route[]) => {
  let authorities: string[] | string | undefined;
  routeData.forEach(route => {
    // match prefix
    if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
      if (route.authority) {
        authorities = route.authority;
      }
      // exact match
      if (route.path === path) {
        authorities = route.authority || authorities;
      }
      // get children authority recursively
      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};

export const getCookiesUserInfo = (): object | null => {
  const authInfoText: string | undefined = document.cookie
    .split('; ')
    .find(i => i.startsWith('authInfo='));
  // console.log(authInfoText, 'authInfoText');
  if (!authInfoText) {
    return null;
  }
  return JSON.parse(Buffer.from(authInfoText.replace('authInfo=', '').split('.')[1], 'base64').toString());
  // const authInfo = JSON.parse(Buffer.from(authInfoText.replace('authInfo=', '').split('.')[1], 'base64').toString());
  // return authInfo;
};

export const getLocalStorageUserInfo = (): object | null => {
  const authorization = window.localStorage.getItem('authorization');
  if (!authorization || authorization === 'null') {
    return null;
  }
  return JSON.parse(Buffer.from(authorization.split('.')[1], 'base64').toString());
};
