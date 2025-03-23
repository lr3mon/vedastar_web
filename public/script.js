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

// 기존 astrologyForm 제출 이벤트 (개별적으로 데이터를 전송하는 경우)
// 필요에 따라 이 이벤트 리스너를 제거할 수도 있습니다.
document.getElementById('astrologyForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const formData = {
    name: document.getElementById('name').value,
    gender: document.querySelector('input[name="gender"]:checked').value,
    birthdate: `${document.getElementById('year').value}-${document.getElementById('month').value}-${document.getElementById('day').value}`,
    calendar: document.querySelector('input[name="calendar"]:checked').value,
    birthtime: `${document.getElementById('hour').value}:${document.getElementById('minute').value}`,
    birthplace: document.getElementById('birthplace').value,
    email: document.getElementById('email').value
  };
  console.log("수집된 데이터:", formData);
  // 예를 들어, 단순 저장만 수행하고자 할 경우 아래와 같이 할 수 있음.
  fetch('https://script.google.com/macros/s/YOUR_DEPLOYED_SCRIPT_URL/exec', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  })
  .then(response => response.json())
  .then(data => {
    console.log("서버 응답:", data);
    alert(data.message);
  })
  .catch(error => {
    console.error("데이터 전송 중 오류 발생:", error);
    alert("데이터 전송 중 오류가 발생했습니다.");
  });
});

// PayPal 결제 버튼을 포함한 폼 (클래스명: paypal-form)에 대한 이벤트 리스너
document.querySelector('.paypal-form').addEventListener('submit', function(event) {
  event.preventDefault();

  // astrologyForm에서 입력한 데이터를 수집
  const formData = {
    name: document.getElementById('name').value,
    gender: document.querySelector('input[name="gender"]:checked').value,
    birthdate: `${document.getElementById('year').value}-${document.getElementById('month').value}-${document.getElementById('day').value}`,
    calendar: document.querySelector('input[name="calendar"]:checked').value,
    birthtime: `${document.getElementById('hour').value}:${document.getElementById('minute').value}`,
    birthplace: document.getElementById('birthplace').value,
    email: document.getElementById('email').value
  };

  console.log("PayPal 버튼 클릭 시 수집된 데이터:", formData);

  // Google Apps Script 엔드포인트로 데이터 전송
  fetch('https://script.google.com/macros/s/YOUR_DEPLOYED_SCRIPT_URL/exec', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  })
  .then(response => response.json())
  .then(data => {
    console.log("서버 응답:", data);
    alert(data.message);
    // 데이터 저장 후 PayPal 결제 페이지를 새 탭에서 열기
    window.open('https://www.paypal.com/ncp/payment/GEZKSUPY9WSZ8', '_blank');
  })
  .catch(error => {
    console.error("데이터 전송 중 오류 발생:", error);
    alert("데이터 전송 중 오류가 발생했습니다.");
  });
});