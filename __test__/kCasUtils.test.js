import {
  getUrlVlaueByKey,
  getRemoveCasKeyUrl,
  getDeviceId,
} from "../kCasUtils";

describe("kCasUtils test", () => {
  it("should return ticket case url includes ticket", () => {
    expect(getUrlVlaueByKey("ticket", "123")).toBe(null);
    expect(getUrlVlaueByKey("ticket", "abc")).toBe(null);
    expect(getUrlVlaueByKey("ticket", undefined)).toBe(null);
    expect(getUrlVlaueByKey("ticket", "null")).toBe(null);
    expect(getUrlVlaueByKey("ticket", "")).toBe(null);
    expect(getUrlVlaueByKey("ticket", "/")).toBe(null);
    expect(
      getUrlVlaueByKey("ticket", "https://abc?test=http://kangni-123.com/")
    ).toBe(null);
    expect(
      getUrlVlaueByKey("ticket", "https://jestjs.io/docs/en/using-matchers")
    ).toBe(null);
    expect(getUrlVlaueByKey("ticket", "http://kangni.com/?ticket=")).toBe("");
    expect(getUrlVlaueByKey("ticket", "http://kangni.com/?ticket=null")).toBe(
      "null"
    );
    expect(getUrlVlaueByKey("ticket", "http://kangni.com/?ticket=NaN")).toBe(
      "NaN"
    );
    expect(
      getUrlVlaueByKey("ticket", "http://kangni.com/?ticket=undefined")
    ).toBe("undefined");
    expect(
      getUrlVlaueByKey("ticket", "http://test.com/?ticket=1234&language=zh")
    ).toBe("1234");
  });

  it("should return url for invalid URLs", () => {
    expect(getRemoveCasKeyUrl({ url: "http://test.com/?ticket=123" })).toBe(
      "http://test.com/"
    );
    expect(getRemoveCasKeyUrl({ url: "http://test.com/&ticket=123" })).toBe(
      "http://test.com/"
    );
    expect(getRemoveCasKeyUrl({ url: "http://test.com/?country=CN" })).toBe(
      "http://test.com/"
    );
    expect(getRemoveCasKeyUrl({ url: "http://test.com/&country=CN" })).toBe(
      "http://test.com/"
    );
    expect(getRemoveCasKeyUrl({ url: "http://localhost/?language=Zh" })).toBe(
      "http://localhost/"
    );
    expect(getRemoveCasKeyUrl({ url: "http://localhost/&language=Zh" })).toBe(
      "http://localhost/"
    );
    expect(getRemoveCasKeyUrl({ url: "http://123/?variant=abc" })).toBe(
      "http://123/"
    );
    expect(getRemoveCasKeyUrl({ url: "http://123/&variant=123" })).toBe(
      "http://123/"
    );
    expect(
      getRemoveCasKeyUrl({
        url:
          "http://abc.com/?ticket=123-abc98&language=zh&country=CN&variant=hh",
      })
    ).toBe("http://abc.com/");
  });

  it("getDeviceId random function test", () => {
    getDeviceId();
  });
});
