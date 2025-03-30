// 년도 옵션 생성 (1920년부터 현재 연도까지)
const yearSelect = document.getElementById('year');
const currentYear = new Date().getFullYear();
for (let year = currentYear; year >= 1920; year--) {
  const option = document.createElement('option');
  option.value = year;
  option.textContent = `${year}년`;
  yearSelect.appendChild(option);
}

// 월 옵션 생성
const monthSelect = document.getElementById('month');
for (let month = 1; month <= 12; month++) {
  const option = document.createElement('option');
  option.value = month;
  option.textContent = `${month}월`;
  monthSelect.appendChild(option);
}

// 일 옵션 생성 (선택한 월의 마지막 날짜 기준)
function updateDays() {
  const daySelect = document.getElementById('day');
  const selectedYear = parseInt(yearSelect.value, 10) || currentYear;
  const selectedMonth = parseInt(monthSelect.value, 10) || 1;
  const lastDay = new Date(selectedYear, selectedMonth, 0).getDate();

  daySelect.innerHTML = '<option value="" disabled selected>일</option>';
  for (let day = 1; day <= lastDay; day++) {
    const option = document.createElement('option');
    option.value = day;
    option.textContent = `${day}일`;
    daySelect.appendChild(option);
  }
}
yearSelect.addEventListener('change', updateDays);
monthSelect.addEventListener('change', updateDays);
updateDays();

// 시간 옵션 생성
const hourSelect = document.getElementById('hour');
for (let hour = 0; hour < 24; hour++) {
  const option = document.createElement('option');
  option.value = hour;
  option.textContent = `${hour}시`;
  hourSelect.appendChild(option);
}

// 분 옵션 생성 (1분 간격)
const minuteSelect = document.getElementById('minute');
for (let minute = 0; minute < 60; minute++) {
  const option = document.createElement('option');
  option.value = minute;
  option.textContent = `${minute}분`;
  minuteSelect.appendChild(option);
}

// 폼 유효성 검사
// 모든 필드가 올바르게 입력되었는지 확인하는 함수
function validateForm() {
  const name = document.getElementById('name').value;
  const year = document.getElementById('year').value;
  const month = document.getElementById('month').value;
  const day = document.getElementById('day').value;
  const hour = document.getElementById('hour').value;
  const minute = document.getElementById('minute').value;
  const birthLocation = document.getElementById('birthLocation').value;
  const marriageStatus = document.querySelector('input[name="marriageStatus"]:checked');
  const email = document.getElementById('email').value;
  
  if (!name) {
    alert('Please enter your name.');
    return false;
  }
  
  if (!year || !month || !day) {
    alert('Please select your birth date.');
    return false;
  }
  
  if (!hour || !minute) {
    alert('Please select your birth time.');
    return false;
  }
  
  if (!birthLocation) {
    alert('Please enter your birth location.');
    return false;
  }
  
  if (!marriageStatus) {
    alert('Please select your marriage status.');
    return false;
  }
  
  if (!email) {
    alert('Please enter your email.');
    return false;
  }
  
  return true;
}

// 일반 폼 제출 이벤트
document.getElementById('astrologyForm').addEventListener('submit', function(event) {
  event.preventDefault();
  
  if (!validateForm()) return;
  
  const formData = {
    name: document.getElementById('name').value,
    birthdate: `${document.getElementById('year').value}-${document.getElementById('month').value}-${document.getElementById('day').value}`,
    birthtime: `${document.getElementById('hour').value}:${document.getElementById('minute').value}`,
    birthLocation: document.getElementById('birthLocation').value,
    marriageStatus: document.querySelector('input[name="marriageStatus"]:checked').value,
    email: document.getElementById('email').value
  };
  
  console.log("수집된 데이터:", JSON.stringify(formData));
  
  // Google Apps Script 웹 앱 URL을 실제 배포된 URL로 변경하세요
  fetch('https://script.google.com/macros/s/AKfycbzKVMERFpwiWsLpocVzl9t7N9QPt6TBBL9WUOnxt0-BM8JMnXu-DuGsDgC__qtJR5ux/exec', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  })
  .then(response => response.text())
  .then(text => {
    try {
      const data = JSON.parse(text);
      console.log("서버 응답:", data);
      alert(data.message || '데이터가 성공적으로 저장되었습니다.');
    } catch (e) {
      console.error("응답 파싱 오류:", e);
      alert('요청은 성공했지만 응답을 처리하는 데 문제가 있습니다.');
    }
  })
  .catch(error => {
    console.error("데이터 전송 중 오류 발생:", error);
    alert("데이터 전송 중 오류가 발생했습니다.");
  });
});

// PayPal 결제 폼 제출 이벤트
document.querySelector('.paypal-form').addEventListener('submit', function(event) {
  event.preventDefault();
  
  if (!validateForm()) return;
  
  const formData = {
    name: document.getElementById('name').value,
    birthdate: `${document.getElementById('year').value}-${document.getElementById('month').value}-${document.getElementById('day').value}`,
    birthtime: `${document.getElementById('hour').value}:${document.getElementById('minute').value}`,
    birthLocation: document.getElementById('birthLocation').value,
    marriageStatus: document.querySelector('input[name="marriageStatus"]:checked').value,
    email: document.getElementById('email').value
  };
  
  console.log("PayPal 버튼 클릭 시 수집된 데이터:", JSON.stringify(formData));
  
  // 클릭 이벤트에서 즉시 새 창 열기 (팝업 차단 방지)
  const paypalWindow = window.open('', '_blank');
  
  fetch('https://0z3b4ewt1j.execute-api.ap-southeast-2.amazonaws.com/vedastar_web_proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  })
  .then(response => response.text())
  .then(text => {
    try {
      const data = JSON.parse(text);
      console.log("서버 응답:", data);
      alert(data.message || '데이터가 성공적으로 저장되었습니다.');
      
      // 데이터 저장 후 PayPal 결제 페이지로 이동
      paypalWindow.location.href = 'https://www.paypal.com/ncp/payment/GEZKSUPY9WSZ8';
    } catch (e) {
      console.error("응답 파싱 오류:", e);
      alert('요청은 성공했지만 응답을 처리하는 데 문제가 있습니다.');
      paypalWindow.close(); // 에러 발생 시 창 닫기
    }
  })
  .catch(error => {
    console.error("데이터 전송 중 오류 발생:", error);
    alert("데이터 전송 중 오류가 발생했습니다.");
    paypalWindow.close(); // 오류 발생 시 창 닫기
  });
});