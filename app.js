const express = require('express');
const path = require('path');
const app = express();

// JSON 및 URL 인코딩된 데이터 파싱
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// public 폴더의 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

// POST 요청을 통한 폼 데이터 처리
app.post('/submit', (req, res) => {
  const formData = req.body;
  console.log("수신된 데이터:", formData);

  // 여기서 데이터베이스 저장 등 추가 작업을 할 수 있습니다.
  
  res.json({ success: true, message: '데이터가 성공적으로 수신되었습니다.' });
});

// 서버 시작
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});