# kCas

## 描述

kCas 库封装了 cas 登陆的方法，用户创建一个 cas 实例，通过传参方式可以快速完成登陆和登出。

## 文件说明

```shell
├── lib
├── .kCas.js                 # 封装好的kCas类
├── .kCasUtils.js            # 工具类
├── .kHttpClient.js          # 通过Promise封装XMLHttpRequest的请求
├── .kCas.test.js            # kCas类单元测试
├── .kCasUtils.test.js       # 工具类单元测试
├── .kHttpClient.test.js     # kHttpClient单元测试
├── _mock_                   # 单元测试mock相关文件

```

## 使用指南

```bash
1、引入文件kCas.js
import kCas from './kCas';

2、初始化
const cas = new kCas({
  appKey: 'INC-OEWM-CORE-WEB',
  appSecret: 'INC-OEWM-XXX-XXXX',
  authService: '/basp',
  casService: 'http://cas.abc.com',
});

初始化后cas有以下属性
{
  appKey: 'INC-OEWM-CORE-WEB',
  appSecret: 'INC-OEWM-XXX-XXXX',
  authLogoutUrl: '/basp/user/auth/logout',
  authRolesUrl: '/basp/dev-basp-user/indexModule/queryRoles',
  authTicketUrl: '/basp/user/cas/knock',
  authTokenUrl: '/basp/gateway/check_token',
  casloginURL: 'http://cas.abc.com/cas/login',
  caslogoutURL: 'http://cas.abc.com/cas/logout',
}
(详细参数说明看对kCas类的说明)

3、调用方法
cas.login();
cas.authLogout();
```

## 文件以及文件里面的方法说明

1、 `kCas.js`

```bash

参数说明

appKey：访问不同环境（sit\par\prod）的appKey,
appSecret：访问不同环境（sit\par\prod）的appSecret,
authService：公司系统需要使用百源接口，没有传空,
casService：cas登陆域名,
casloginPath：cas登录除域名外的部分，默认"/cas/login",
caslogoutPath：cas登出除域名外的部分，默认"/cas/logout",
authTokenPath：校验token是否有效接口，默认"/gateway/check_token",
authTicketPath：获取token的接口，默认"/user/cas/knock",
authLogoutPath：退出网关接口，默认"/user/auth/logout"

注意（按需传参，适合公司所有cas登陆系统）：
authTokenUrl = authService + authTokenPath;
authTicketUrl = authService + authTicketPath;
authLogoutUrl = authService + authLogoutPath;
casloginURL = casService + casloginPath;
caslogoutURL = casService + caslogoutPath;
```

```bash
/**
 * 该方法可以根据实际复写；目前方法基本满足公司的cas登陆系统
 * cas登陆后-校验token-成功-返回userid、username
 * cas登陆后-校验token-失败-获取url的ticket,校验tiket-成功-返回userid、username
 * cas登陆后-校验token-失败-获取url的ticket,校验tiket-失败-登出-cas登录页
 */
login()

```

```bash
/**
 * 登出
 */
authLogout()

```

```bash
/**
 * 发送authTokenUrl请求校验token
 */
authCheckToken()

```

```bash
 /**
 * 发送authTicketUrl请求校验token
 * @param {string} ticket 从浏览器url截取的ticket作为参数,必传
 */
authCheckTick()

```

2、 `kHttpClient.js`

```bash
/**
 * @param {string} url,必传
 * @param {object} data = { params = {}},必传
 */
 调用 kHttpClient.get()

 /**
 * @param {string} url,必传
 * @param {object} data = {},必传
 */
 调用 kHttpClient.post()

同时兼容了表单提交

```
