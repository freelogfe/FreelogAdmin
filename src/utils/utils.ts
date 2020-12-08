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
/**
 * 
 * @param origin model
 * @param data wait to compare with model
 * @param diff  if only reserve difference set
 * delete the data's keys while they are (not) exist in origin
 */
export function compareObjects(origin: object, data: object, diff: boolean = false) {
  let otype = Object.prototype.toString.call(origin)  
  let dtype = Object.prototype.toString.call(data) 
  if(dtype === otype && otype === '[object Array]'){
    origin = {0: origin}
    data = {0: data}
  }else if (otype !== dtype || otype !== '[object Object]') {
    !['[object Array]', '[object object]'].includes(otype)  && console.error(origin + ' is not object or array');
    !['[object Array]', '[object object]'].includes(dtype)  && console.error(data + ' is not object or array');
    return
  }
  Object.keys(data).forEach((dkey:string) => { 
    // depend on whether diff
    let isDelete = !diff
    Object.keys(origin).some((okey:string):boolean => {
      if (dkey === okey) {
        isDelete = !isDelete
        if(diff){
          return true
        }
        let otype = Object.prototype.toString.call(origin[okey])
        let dtype = Object.prototype.toString.call(data[dkey])
        // loop if they are object the same time 
        if (otype === dtype && dtype === '[object Object]') {
          compareObjects(origin[okey], data[dkey], diff)
        } else if (otype === dtype && dtype === '[object Array]' && Object.prototype.toString.call(origin[dkey][0]) === '[object Object]') { 
           // if they are array the same time and origin[dkey][0] is object, 
          data[dkey].forEach((item: any) => {
            Object.prototype.toString.call(item) === '[object Array]' &&  compareObjects(origin[okey][0], item, diff)
          })
        }
        return true
      }
      return false 
    });
    isDelete && delete data[dkey]
  })
}