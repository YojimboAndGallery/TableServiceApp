const express = require('express');
const path = require('path');
const app = express();

// 정적 파일(HTML · CSS · JS) 서빙
app.use(express.static(path.join(__dirname)));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(Server running on ));
