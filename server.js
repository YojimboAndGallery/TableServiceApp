// server.js
const express = require('express');
const http    = require('http');
const path    = require('path');
const { Server } = require('socket.io');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server);

// 정적 파일 제공 (index.html, styles.css, script.js 등)
app.use(express.static(path.join(__dirname, '/')));
app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 서버에서 관리할 현재 점유 테이블 집합
const occupied = new Set();

io.on('connection', socket => {
  console.log(`Client connected: ${socket.id}`);

  // 1) 새 클라이언트에 현재 점유 상태 전달
  socket.emit('initialState', Array.from(occupied));

  // 2) 테이블 선택 이벤트 처리
  socket.on('select', tableId => {
    if (!occupied.has(tableId)) {
      occupied.add(tableId);
      // 모든 클라이언트에 브로드캐스트
      io.emit('select', tableId);
    }
  });

  // 3) 테이블 해제(삭제) 이벤트 처리
  socket.on('deselect', tableId => {
    if (occupied.has(tableId)) {
      occupied.delete(tableId);
      io.emit('deselect', tableId);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// 포트 설정
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
