function getUrlVlaueByKey(key, url = window.location.href) {
  const reg = new RegExp(`${key}=([^&]*)`);
  const result = url.match(reg);
  return result && result[1];
}

function getRemoveCasKeyUrl({
  url = window.location.href,
  key = 'ticket|language|co(.?)ntry|variant',
} = {}) {
  const reg = new RegExp(`[?|&]?(${key})=([^&]*)`, 'g');
  return url.replace(reg, '');
}

function getDeviceId() {
  const s = [];
  const hexDigits = 'abcdef';
  for (let i = 0; i < 10; i += 1) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 6), 1);
  }
  const uuid = s.join('') + new Date().getTime();
  return uuid;
}

export { getDeviceId, getRemoveCasKeyUrl, getUrlVlaueByKey };
