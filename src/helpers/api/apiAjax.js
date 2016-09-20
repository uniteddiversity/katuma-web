import config from '../../config';

function formatUrl(path) {
  const adjustedPath = path[0] !== '/' ? '/' + path : path;
  const apiPath = `/api/${config.apiVersion}${adjustedPath}`;

  return apiPath;
}

class ApiAjax {
  constructor() {
    ['get', 'post', 'put', 'patch', 'del'].forEach((method) =>
      this[method] = (path, { data, header } = {}) => new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        const url = formatUrl(path);

        req.onload = () => {
          if (req.status === 500) {
            reject(req.response);
            return;
          }

          if (req.status === 400) {
            reject(JSON.parse(req.response));
            return;
          }

          if (req.response.length > 0) {
            resolve(JSON.parse(req.response));
            return;
          }

          resolve(null);
        };

        /**
         * Only covers network errors between the browser and the Express HTTP proxy
         */
        req.onerror = () => {
          reject(null);
        };

        req.open(method, url);
        req.setRequestHeader('Accept', 'application/json');
        req.setRequestHeader('Content-Type', 'application/json');
        if (Object.keys(header || {}).length) {
          req.setRequestHeader(header.key, header.value);
        }
        req.send(JSON.stringify(data));
      })
    );
  }
}

export default ApiAjax;
