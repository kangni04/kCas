import { kCas } from "../lib/kCas";
import { getRemoveCasKeyUrl, getDeviceId } from "../lib/kCasUtils";
import kHttpClient from "../lib/kHttpClient";
const cas = new kCas({
  appKey: "appKey",
  appSecret: "appSecret",
  authService: "authService",
  casService: "casService"
});
const get = jest.spyOn(kHttpClient, "get");
afterAll(() => {
  get.mockRestore();
});
describe("test kCas", () => {
  beforeEach(() => {
    Object.defineProperty(window, "location", {
      value: { href: "http://localhost" },
      writable: true
    });
  });
  it("kCas authLogout test done", () => {
    get.mockImplementationOnce(() => Promise.resolve("done"));
    cas
      .authLogout()
      .then(res => {
        expect(res).toBe("done");
        expect(get).toHaveBeenCalledWith(cas.authLogoutUrl);
      })
      .catch(() => {});
  });
  it("kCas authLogout test fail", async () => {
    get.mockImplementationOnce(() => Promise.reject("error"));
    const spy = jest.spyOn(kCas, "removeToken");
    await cas.authLogout();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
  it("kCas authCheckToken test", () => {
    get.mockImplementationOnce(() => Promise.resolve("done"));
    cas
      .authCheckToken()
      .then(res => {
        expect(res).toBe("done");
        expect(get).toHaveBeenCalledWith(cas.authTokenUrl);
      })
      .catch(() => {});
  });
  it("kCas authCheckTick test", () => {
    const { appKey, appSecret } = cas;
    const params = {
      ticket: "123",
      service: getRemoveCasKeyUrl(),
      appKey,
      appSecret,
      deviceId: getDeviceId()
    };
    get.mockImplementationOnce(() => Promise.resolve("done"));
    cas
      .authCheckTick()
      .then(res => {
        expect(res).toBe("done");
        expect(get).toHaveBeenCalledWith(cas.authTokenUrl, params);
      })
      .catch(() => {});
  });
  it("kCas authRoles test", () => {
    get.mockImplementationOnce(() => Promise.resolve("done"));
    cas
      .authRoles()
      .then(res => {
        expect(res).toBe("done");
        expect(get).toHaveBeenCalledWith(cas.authRolesUrl);
      })
      .catch(() => {});
  });
  it("kCas setToken test", () => {
    kCas.setToken("123");
    expect(document.cookie).toBe("token=123");
  });
  it("kCas removeToken test", () => {
    kCas.removeToken();
    expect(document.cookie).toBe("");
  });

  it("kCas login test done", async () => {
    // window.location.href = '/';
    const spyCasLogin = jest.spyOn(cas, "casLogin");
    spyCasLogin.mockImplementation(() =>
      Promise.resolve({ userid: "01387189" })
    );
    const spyAuthRoles = jest.spyOn(cas, "authRoles");
    spyAuthRoles.mockImplementationOnce(() => Promise.resolve({ result: [] }));
    let result = await cas.login();
    expect(result.userid).toBe("01387189");
    spyAuthRoles.mockImplementationOnce(() => Promise.reject());
    result = await cas.login();
    spyCasLogin.mockRestore();
  });

  it("kCas casLogin test when authCheckToken done", async () => {
    const spyAuthCheckToken = jest.spyOn(cas, "authCheckToken");
    spyAuthCheckToken.mockImplementationOnce(() =>
      Promise.resolve({ obj: { userid: "01387189" } })
    );
    const result = await cas.casLogin();
    expect(result).toEqual({ obj: { userid: "01387189" } });
    spyAuthCheckToken.mockRestore();
  });
  it("kCas casLogin test when authCheckToken fail and authCheckTick done", async () => {
    const spyAuthCheckToken = jest.spyOn(cas, "authCheckToken");
    spyAuthCheckToken.mockImplementationOnce(() => Promise.reject());
    const spyAuthCheckTick = jest.spyOn(cas, "authCheckTick");
    const spySetToken = jest.spyOn(kCas, "setToken");
    spyAuthCheckTick.mockImplementationOnce(() =>
      Promise.resolve({ obj: { token: "123", userid: "01387189" } })
    );
    const result = await cas.casLogin();
    expect(result).toEqual({ obj: { token: "123", userid: "01387189" } });
    expect(spySetToken).toBeCalledWith("123");
    spyAuthCheckToken.mockRestore();
    spyAuthCheckTick.mockRestore();
  });
  it("kCas casLogin test when authCheckToken fail and authCheckTick fail", async () => {
    const spyAuthCheckToken = jest.spyOn(cas, "authCheckToken");
    window.location.href = "http://localhost?ticket=1234";
    spyAuthCheckToken.mockImplementation(() => Promise.reject());
    const spyAuthCheckTick = jest.spyOn(cas, "authCheckTick");
    spyAuthCheckTick.mockImplementationOnce(() =>
      Promise.resolve({ errorMessage: "error" })
    );
    await cas.casLogin().catch(error => {
      expect(error).toBe("error");
    });
    spyAuthCheckTick.mockImplementationOnce(() => Promise.reject());
    await cas.casLogin();
    spyAuthCheckToken.mockRestore();
    spyAuthCheckTick.mockRestore();
  });
});
