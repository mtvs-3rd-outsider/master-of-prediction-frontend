const http = require('http');
const https = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = 3000;

const httpsOptions = {
  key: fs.readFileSync('./master-of-prediction.shop/privkey1.pem'),
  cert: fs.readFileSync('./master-of-prediction.shop/cert1.pem'),
  ca: fs.readFileSync('./master-of-prediction.shop/fullchain1.pem'),
};

// CORS 설정 미들웨어
const corsMiddleware = (req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'https://master-of-prediction.shop:8081',
  ];

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Preflight 요청에 대한 처리
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  next();
};

// 미들웨어 스타일로 요청 처리
const requestHandler = (req, res) => {
  const parsedUrl = parse(req.url, true);
  
  // CORS 미들웨어 적용 
  corsMiddleware(req, res, () => {
    handle(req, res, parsedUrl);
  });
};

app.prepare().then(() => {
  // HTTP 서버
  // http.createServer(requestHandler).listen(PORT, (err) => {
  //   if (err) throw err;
  //   console.log(`> Ready on http://localhost:${PORT}`);
  // });

  // HTTPS 서버
  https.createServer(httpsOptions, requestHandler).listen(PORT , (err) => {
    if (err) throw err;
    console.log(`> HTTPS: Ready on https://localhost:${PORT}`);
  });
});
