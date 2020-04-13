import kHttpClient from './kHttpClient';
import kCasUtils, { getRemoveCasKeyUrl, getUrlVlaueByKey, getDeviceId } from './kCasUtils';

class kCas {
  constructor({
    appKey,
    appSecret,
    authService,
    casService,
    casloginPath = '/cas/login',
    caslogoutPath = '/cas/logout',
    authTokenPath = '/gateway/check_token',
    authTicketPath = '/user/cas/knock',
    authLogoutPath = '/user/auth/logout',
    authRolesPath = '/dev-basp-user/indexModule/queryRoles',
  }) {
    this.appKey = appKey;
    this.appSecret = appSecret;
    this.authTokenUrl = authService + authTokenPath;
    this.authTicketUrl = authService + authTicketPath;
    this.authLogoutUrl = authService + authLogoutPath;
    this.authRolesUrl = authService + authRolesPath;
    this.casloginURL = casService + casloginPath;
    this.caslogoutURL = casService + caslogoutPath;
  }

  // 修复check_token正常的情况，quryRole异步登录
  async login() {
    const url = getRemoveCasKeyUrl();
    const result = await this.casLogin();
    const rolesRes = await this.authRoles().catch(() => {
      this.authLogout();
      kCas.removeToken();
      window.location.href = `${this.casloginURL}?service=${url}`;
    });
    const { result: roles } = rolesRes || {};
    result.roles = roles;
    return result;
  }

  async casLogin() {
    const ticket = getUrlVlaueByKey('ticket');
    const url = getRemoveCasKeyUrl();
    let result = await this.authCheckToken().catch(() => {
      if (!ticket) {
        // token 失效
        this.authLogout();
        window.location.href = `${this.casloginURL}?service=${url}`;
      }
    });
    if (result) return result;
    result = await this.authCheckTick(ticket).catch(() => {
      // ticket 失效
      this.authLogout();
      window.location.href = `${this.casloginURL}?service=${url}`;
    });
    if (result && result.errorMessage) {
      //   "20200001": "appkey或appSecret不正确"
      return Promise.reject(result.errorMessage);
    }
    if (result && result.obj.token) {
      kCas.setToken(result.obj.token);
    }
    return result;
  }

  authRoles() {
    const { authRolesUrl } = this;
    return kHttpClient.get(authRolesUrl);
  }

  authCheckTick(ticket) {
    const { appKey, appSecret, authTicketUrl } = this;
    const params = {
      ticket,
      service: getRemoveCasKeyUrl(),
      appKey,
      appSecret,
      deviceId: getDeviceId(),
    };
    return kHttpClient.post(authTicketUrl, params);
  }

  authCheckToken() {
    const { authTokenUrl } = this;
    return kHttpClient.get(authTokenUrl);
  }

  authLogout() {
    const { authLogoutUrl } = this;
    return kHttpClient.get(authLogoutUrl).catch(() => {
      kCas.removeToken();
    });
  }

  // for IE11
  static setToken(token) {
    document.cookie = `token=${token}`;
  }

  static removeToken() {
    // 清除 cookie
    const keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
      for (let i = keys.length; i--; )
        document.cookie = `${keys[i]}=0;expires=${new Date(0).toUTCString()}`;
    }
  }
}

export { kCas, kHttpClient, kCasUtils };
export default kCas;
