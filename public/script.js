// 년도 옵션 생성 (1920년부터 현재 연도까지)
const yearSelect = document.getElementById('year');
const currentYear = new Date().getFullYear();
for (let year = currentYear; year >= 1920; year--) {
  const option = document.createElement('option');
  option.value = year;
  option.textContent = `${year}`;
  yearSelect.appendChild(option);
}

// 월 옵션 생성
const monthSelect = document.getElementById('month');
for (let month = 1; month <= 12; month++) {
  const option = document.createElement('option');
  option.value = month;
  option.textContent = `${month}`;
  monthSelect.appendChild(option);
}

// 일 옵션 생성 (선택한 월의 마지막 날짜 기준)
function updateDays() {
  const daySelect = document.getElementById('day');
  const selectedYear = parseInt(yearSelect.value, 10) || currentYear;
  const selectedMonth = parseInt(monthSelect.value, 10) || 1;
  const lastDay = new Date(selectedYear, selectedMonth, 0).getDate();

  daySelect.innerHTML = '<option value="" disabled selected>Day</option>';
  for (let day = 1; day <= lastDay; day++) {
    const option = document.createElement('option');
    option.value = day;
    option.textContent = `${day}`;
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
  option.textContent = `${hour}`;
  hourSelect.appendChild(option);
}

// 분 옵션 생성 (1분 간격)
const minuteSelect = document.getElementById('minute');
for (let minute = 0; minute < 60; minute++) {
  const option = document.createElement('option');
  option.value = minute;
  option.textContent = `${minute}`;
  minuteSelect.appendChild(option);
}
// ------ 출생지 자동완성 기능 ------ 
const birthLocationInput = document.getElementById('birthLocation');
const suggestionBox = document.createElement('ul');
suggestionBox.id = 'location-suggestions';


// 스타일 바로 삽입 (불릿 제거 + 디자인)
const style = document.createElement('style');
style.textContent = `
  #location-suggestions {
    list-style-type: none;
    padding-left: 0;
    margin-top: 5px;
    background-color: #222;
    border: 1px solid #444;
    border-radius: 4px;
    color: white;
    position: absolute;
    width: 100%;
    z-index: 10;
  }
  #location-suggestions li {
    padding: 10px;
    cursor: pointer;
  }
  #location-suggestions li:hover {
    background-color: #333;
  }
`;
document.head.appendChild(style);


birthLocationInput.parentElement.style.position = 'relative';
birthLocationInput.parentElement.appendChild(suggestionBox);

let debounceTimeout = null;

birthLocationInput.addEventListener('input', function () {
  clearTimeout(debounceTimeout);
  const query = this.value.trim();
  if (query.length < 2) {
    suggestionBox.style.display = 'none';
    return;
  }

  debounceTimeout = setTimeout(() => {
    fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?limit=5&namePrefix=${query}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '72f3dc7a7emsh17ff300e26ea489p157b22jsn9231b1d4ad8c',
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
      }
    })
    .then(res => res.json())
    .then(data => {
      suggestionBox.innerHTML = '';
      if (data.data.length === 0) {
        suggestionBox.style.display = 'none';
        return;
      }
      data.data.forEach(city => {
        const li = document.createElement('li');
        li.textContent = `${city.city}, ${city.country}`;
        li.addEventListener('click', () => {
          birthLocationInput.value = li.textContent;
          suggestionBox.style.display = 'none';
        });
        suggestionBox.appendChild(li);
      });
      suggestionBox.style.display = 'block';
    })
    .catch(err => {
      console.error('자동완성 오류:', err);
    });
  }, 300);
});

document.addEventListener('click', function (e) {
  if (!birthLocationInput.contains(e.target) && !suggestionBox.contains(e.target)) {
    suggestionBox.style.display = 'none';
  }
});

// 폼 유효성 검사
// 모든 필드가 올바르게 입력되었는지 확인하는 함수
function validateForm() {
  // 입력값 앞뒤 공백 제거
  const name = document.getElementById('name').value.trim();
  const year = document.getElementById('year').value.trim();
  const month = document.getElementById('month').value.trim();
  const day = document.getElementById('day').value.trim();
  const hour = document.getElementById('hour').value.trim();
  const minute = document.getElementById('minute').value.trim();
  const birthLocation = document.getElementById('birthLocation').value.trim();
  const marriageStatus = document.querySelector('input[name="marriageStatus"]:checked');
  const email = document.getElementById('email').value.trim();

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
    name: document.getElementById('name').value.trim(),
    birthDate: `${document.getElementById('year').value}-${document.getElementById('month').value}-${document.getElementById('day').value}`, // 대문자 D 사용
    birthTime: `${document.getElementById('hour').value}:${document.getElementById('minute').value}`, // 대문자 T 사용
    birthLocation: document.getElementById('birthLocation').value.trim(),
    marriageStatus: document.querySelector('input[name="marriageStatus"]:checked') ? document.querySelector('input[name="marriageStatus"]:checked').value : '',
    email: document.getElementById('email').value.trim()
  };
  
  console.log("수집된 데이터:", JSON.stringify(formData));

  // 쿼리 스트링 생성: 각 필드를 URL 인코딩하여 추가합니다.
  const queryString = Object.keys(formData)
  .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(formData[key])}`)
  .join('&');

  // confirmation 페이지로 이동할 때 쿼리 스트링을 붙여 전달합니다.
  window.location.href = `confirmation.html?${queryString}`;
  
  // Google Apps Script 웹 앱 URL을 실제 배포된 URL로 변경하세요
  fetch('https://script.google.com/macros/s/AKfycbzp5bSntkBP-rdUK-Mmx1JtpcZowGJyA8Q6XmGMwXElyGCW6QB33B8UecaST2Iot66D/exec', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  })
  .then(response => response.text())
  .then(text => {
    try {
      const data = JSON.parse(text);
      console.log("Server response:", data);
      alert(data.message || 'Data has been successfully saved.');
    } catch (e) {
      console.error("Response parse error:", e);
      alert('Request was successful, but there was a problem processing the response.');
    }
  })
  .catch(error => {
    console.error("Error while sending data:", error);
    alert("An error occurred while sending data.");
  });
});

// PayPal 결제 폼 제출 이벤트
document.querySelector('.paypal-form').addEventListener('submit', function(event) {
  event.preventDefault();

  if (!validateForm()) return;

  const formData = {
    name: document.getElementById('name').value.trim(),
    birthDate: `${document.getElementById('year').value}-${document.getElementById('month').value}-${document.getElementById('day').value}`,
    birthTime: `${document.getElementById('hour').value}:${document.getElementById('minute').value}`,
    birthLocation: document.getElementById('birthLocation').value.trim(),
    marriageStatus: document.querySelector('input[name="marriageStatus"]:checked') ? document.querySelector('input[name="marriageStatus"]:checked').value : '',
    email: document.getElementById('email').value.trim()
  };

  console.log("PayPal 버튼 클릭 시 수집된 데이터:", JSON.stringify(formData));

  // PayPal 모달 크기 (500x700 정도의 모달 느낌 창)
  const width = 500;
  const height = 700;
  const left = (screen.width - width) / 2;
  const top = (screen.height - height) / 2;

  // 즉시 PayPal 새 창(모달 크기)을 미리 열어두기
  const paypalWindow = window.open('', 'paypalModal', `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`);

  fetch('https://0z3b4ewt1j.execute-api.ap-southeast-2.amazonaws.com/vedastar_web_proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  })
  .then(response => response.text())
  .then(text => {
    try {
      const data = JSON.parse(text);
      console.log("Server response:", data);
      alert(data.message || 'Data has been successfully saved.');
      // 데이터 전송 후 PayPal 결제 페이지로 이동
      paypalWindow.location.href = 'https://www.paypal.com/ncp/payment/GEZKSUPY9WSZ8';
    } catch (e) {
      console.error("Response parse error:", e);
      alert('Request was successful, but there was a problem processing the response.');
      paypalWindow.close();
    }
  })
  .catch(error => {
    console.error("Error while sending data:", error);
    alert("An error occurred while sending data.");
    paypalWindow.close();
  });
});

function openPayPalWindow() {
  // 원하는 크기로 팝업 창 열기
  const url = "https://www.paypal.com/ncp/payment/GEZKSUPY9WSZ8";
  const windowName = "PayPalWindow";
  const specs = "width=600,height=800,scrollbars=yes,resizable=yes";

  window.open(url, windowName, specs);
}