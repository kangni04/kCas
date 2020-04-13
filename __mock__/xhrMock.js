const open = jest.fn();
const result = { data: 'done' };
const send = jest.fn(function() {
  this.status = 200;
  this.response = JSON.stringify(result);
  this.onload();
});
const setRequestHeader = jest.fn();
const xhrMockClass = () => ({
  open,
  send,
  setRequestHeader,
});
window.XMLHttpRequest = jest.fn(xhrMockClass);
export default xhrMockClass;
export { open, send, setRequestHeader, result };
