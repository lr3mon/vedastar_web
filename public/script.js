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

// 분 옵션 생성 (5분 간격)
const minuteSelect = document.getElementById('minute');
for (let minute = 0; minute < 60; minute += 5) {
    const option = document.createElement('option');
    option.value = minute;
    option.textContent = `${minute}분`;
    minuteSelect.appendChild(option);
}

// 폼 제출 처리
document.getElementById('astrologyForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // 입력값 수집
    const name = document.getElementById('name').value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const year = document.getElementById('year').value;
    const month = document.getElementById('month').value;
    const day = document.getElementById('day').value;
    const calendar = document.querySelector('input[name="calendar"]:checked').value;
    const hour = document.getElementById('hour').value;
    const minute = document.getElementById('minute').value;
    const birthplace = document.getElementById('birthplace').value;
    const phone = document.getElementById('phone').value;

    // 필수 필드 검증
    if (!name || !year || !month || !day || !hour || !minute || !birthplace || !phone) {
        alert('모든 정보를 입력해주세요.');
        return;
    }

    // 데이터 구성
    const formData = {
        name,
        gender,
        birthdate: `${year}-${month}-${day}`,
        calendar,
        birthtime: `${hour}:${minute}`,
        birthplace,
        phone
    };

    console.log("수집된 데이터:", formData);
    alert("정보가 성공적으로 제출되었습니다. 결제 페이지로 이동합니다.");

    // 실제 구현 시 서버로 데이터를 전송하고 결제 페이지로 리디렉션 처리
    // 예: window.location.href = "payment.html";
});