import HttpClient from "../kHttpClient";
import xhrMockClass, {
  open,
  send,
  setRequestHeader,
  result,
} from "../__mock__/xhrMock";

describe("HttpClient test", () => {
  beforeEach(() => {
    window.XMLHttpRequest = jest.fn(xhrMockClass);
  });
  it("test xhr result done", () => {
    const formData = { name: "123", age: 18 };
    const formDataString = "name=123&age=18";
    HttpClient("get", "/", { params: formData }).then((res) => {
      expect(res).toEqual(result);
    });
    expect(open).toBeCalledWith("get", "/?name=123&age=18");
    expect(setRequestHeader).toBeCalledWith(
      "content-type",
      "application/json;charset=UTF-8"
    );
    HttpClient("post", "/", formDataString);
    expect(setRequestHeader).toBeCalledWith(
      "content-type",
      "application/x-www-form-urlencoded"
    );
  });
  it("test xhr result fail", () => {
    send.mockImplementationOnce(function () {
      this.status = 401;
      this.response = JSON.stringify({ msg: "error" });
      this.onload();
    });
    HttpClient("get", "/", {}).catch((error) => {
      expect(error).toEqual({ status: 401, response: { msg: "error" } });
    });
  });
  it("test post get delete put", () => {
    expect(HttpClient.get().catch(() => {})).toEqual(
      HttpClient("get").catch(() => {})
    );
    expect(HttpClient.post().catch(() => {})).toEqual(
      HttpClient("post").catch(() => {})
    );
    expect(HttpClient.delete().catch(() => {})).toEqual(
      HttpClient("delete").catch(() => {})
    );
    expect(HttpClient.put().catch(() => {})).toEqual(
      HttpClient("put").catch(() => {})
    );
  });
});
