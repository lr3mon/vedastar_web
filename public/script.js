// script.js

// ------ 생년월일/시간 옵션 생성 ------
const yearSelect = document.getElementById('year');
const currentYear = new Date().getFullYear();
for (let year = currentYear; year >= 1920; year--) {
  const option = document.createElement('option');
  option.value = year;
  option.textContent = `${year}`;
  yearSelect.appendChild(option);
}

const monthSelect = document.getElementById('month');
for (let month = 1; month <= 12; month++) {
  const option = document.createElement('option');
  option.value = month;
  option.textContent = `${month}`;
  monthSelect.appendChild(option);
}

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

const hourSelect = document.getElementById('hour');
for (let hour = 0; hour < 24; hour++) {
  const option = document.createElement('option');
  option.value = hour;
  option.textContent = `${hour}`;
  hourSelect.appendChild(option);
}

const minuteSelect = document.getElementById('minute');
for (let minute = 0; minute < 60; minute++) {
  const option = document.createElement('option');
  option.value = minute;
  option.textContent = `${minute}`;
  minuteSelect.appendChild(option);
}

// 카운트다운 업데이트 함수
function updateCountdown() {
  var now = new Date();
  // 현재 해의 4월 30일 (월은 0부터 시작하므로 April은 3)
  var target = new Date(now.getFullYear(), 3, 30, 0, 0, 0);
  // 만약 오늘 날짜가 이미 4월 30일 이후라면, 내년 4월 30일로 설정
  if (now > target) {
    target = new Date(now.getFullYear() + 1, 3, 30, 0, 0, 0);
  }
  
  var diff = target - now;
  var days = Math.floor(diff / (1000 * 60 * 60 * 24));
  var hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  var minutes = Math.floor((diff / (1000 * 60)) % 60);
  var totalSeconds = diff / 1000;
  var seconds = (totalSeconds % 60).toFixed(1); // 소수점 한 자리까지 표시
  
  document.getElementById("countdown").innerHTML =
    days + "d " + hours + "h " + minutes + "m " + seconds + "s";
}

// 페이지 로드 시 바로 업데이트하고, 100ms마다 갱신
updateCountdown();
setInterval(updateCountdown, 100);

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
      if (!data || !data.data || data.data.length === 0) {
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

// ------ 스크롤 텍스트 애니메이션 ------
document.addEventListener('DOMContentLoaded', function () {
  // .scroll-text와 .scroll-image 모두 선택
  const scrollElements = document.querySelectorAll('.scroll-text, .scroll-image');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');  // 요소가 보이면 visible 클래스 추가
      }
    });
  }, { threshold: 0.1 });
  
  scrollElements.forEach(element => {
    observer.observe(element);
  });
});

// ------ 폼 유효성 검사 ------
function validateForm() {
  const name = document.getElementById('name').value.trim();
  const year = document.getElementById('year').value.trim();
  const month = document.getElementById('month').value.trim();
  const day = document.getElementById('day').value.trim();
  const hour = document.getElementById('hour').value.trim();
  const minute = document.getElementById('minute').value.trim();
  const birthLocation = document.getElementById('birthLocation').value.trim();
  const marriageStatus = document.getElementById('marriageStatus').value.trim();
  const email = document.getElementById('email').value.trim();

  if (!name || !year || !month || !day || !hour || !minute || !birthLocation || !marriageStatus || !email) {
    alert('Please fill in all fields accurately.');
    return false;
  }
  return true;
}

// 로딩 모달을 표시하는 함수
function showLoading() {
  const modal = document.getElementById('loadingModal');
  if (modal) {
    modal.style.display = 'block'; // 모달 보이기
  }
}

// 로딩 모달을 숨기는 함수
function hideLoading() {
  const modal = document.getElementById('loadingModal');
  if (modal) {
    modal.style.display = 'none'; // 모달 숨기기
  }
}

// ------ PayPal 결제 처리 함수 (AWS로 데이터 전송 후 팝업으로 PayPal 결제 창 열기) ------
function handlePayPalPayment() {
  if (!validateForm()) return;
  
  // 로딩 모달 표시
  showLoading();
  
  // 1) formData 수집
  const formData = {
    name: document.getElementById('name').value.trim(),
    // 생년월일 형식: MM/DD/YYYY (두 자리 숫자 적용)
    birthDate: `${document.getElementById('month').value.padStart(2, '0')}/${document.getElementById('day').value.padStart(2, '0')}/${document.getElementById('year').value}`,
    // 생시 형식: HH:MM (두 자리 숫자 적용)
    birthTime: `${document.getElementById('hour').value.padStart(2, '0')}:${document.getElementById('minute').value.padStart(2, '0')}`,
    birthLocation: document.getElementById('birthLocation').value.trim(),
    marriageStatus: document.getElementById('marriageStatus').value,
    email: document.getElementById('email').value.trim()
  };
  
  console.log("PayPal 버튼 클릭 시 수집된 데이터:", JSON.stringify(formData));
  
  // 2) AWS로 데이터 전송 (fetch 요청)
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
      alert(data.message || 'Data has been successfully saved.');
    } catch (e) {
      console.error("응답 파싱 오류:", e);
      alert('요청은 성공했으나 응답 처리에 문제가 있습니다.');
    }
    // 서버 응답 후 로딩 모달 숨기기 및 PayPal 팝업 열기
    hideLoading();
    openPayPalWindow();
  })
  .catch(error => {
    console.error("데이터 전송 중 오류 발생:", error);
    alert("데이터 전송 중 오류가 발생했습니다.");
    // 오류 발생 시에도 로딩 모달 숨기고 팝업 열기
    hideLoading();
    openPayPalWindow();
  });
}

// ------ PayPal 결제 폼 제출 이벤트 핸들러 ------ 
document.querySelector('.paypal-form').addEventListener('submit', function(event) {
  event.preventDefault();
  handlePayPalPayment();
});

// ------ PayPal 팝업 창 열기 함수 ------ 
function openPayPalWindow() {
  // 팝업 창의 크기 및 옵션 지정
  const url = "https://www.paypal.com/ncp/payment/GEZKSUPY9WSZ8";
  const windowName = "PayPalPopup";
  const specs = "width=600,height=800,scrollbars=yes,resizable=yes";
  window.open(url, windowName, specs);
}