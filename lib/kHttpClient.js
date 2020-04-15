const kHttpClient = function(method, url, data = {}) {
  return new Promise((resolve, reject) => {
    const client = new XMLHttpRequest();
    let clientUrl = url;
    let clientData = null;
    if (method.toLowerCase() === 'get') {
      const { params = {} } = data;
      Object.keys(params).forEach((k, i) => {
        clientUrl += `${i === 0 ? '?' : '&'}${k}=${params[k]}`;
      });
    } else {
      clientData = JSON.stringify(data);
    }
    client.open(method, clientUrl);
    client.setRequestHeader('content-type', 'application/json;charset=UTF-8');
    if (typeof data === 'string') {
      client.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
      clientData = data;
    }
    // client.onprogress
    client.onload = function() {
      if (this.status === 200) {
        const { response } = this;
        resolve(response && JSON.parse(response));
      } else {
        client.onerror();
      }
    };
    client.onerror = function() {
      const { status, response } = this;
      reject({ status, response: response && JSON.parse(response) });
    };
    client.send(clientData);
    // client.onreadystatechange
  });
};

kHttpClient.get = function(url, data) {
  return kHttpClient('GET', url, data);
};
kHttpClient.post = function(url, data) {
  return kHttpClient('POST', url, data);
};
kHttpClient.put = function(url, data) {
  return kHttpClient('PUT', url, data);
};
kHttpClient.delete = function(url, data) {
  return kHttpClient('DELETE', url, data);
};

export default kHttpClient;
