import { createProxyServer } from 'http-proxy';

const proxy = createProxyServer({
  target: 'http://backend:8080/hello',
  changeOrigin: true,
  ignorePath: true
});

proxy.on('proxyReq', proxyReq => {
  proxyReq.removeHeader('Cookie');
});

proxy.on('error', (err, _req, res) => {
  console.error(err);

  // NOTE: See https://tools.ietf.org/html/rfc7807
  res.writeHead(500, {
    'Content-Type': 'application/problem+json'
  });
  res.end(
    JSON.stringify({
      type: 'about:blank',
      title: 'Internal Server Error',
      status: 500,
      detail: 'Something is wrong with backend server.'
    })
  );
});

export default (req, res) => {
  if (req.method !== 'GET') return;

  proxy.web(req, res);
}

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  }
};
