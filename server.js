// server.js
const express = require('express');
const path    = require('path');
const app     = express();

// 정적 파일 제공 (index.html, styles.css, script.js 등)
app.use(express.static(path.join(__dirname, '/')));

// SPA나 라우팅 필요 시 모든 요청을 index.html로
app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server listening on port ${port}`));
