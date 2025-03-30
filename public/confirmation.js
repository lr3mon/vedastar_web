// URL 쿼리 파라미터를 파싱하는 함수
function getQueryParams() {
  const params = {};
  const queryString = window.location.search.substring(1);
  const queries = queryString.split("&");
  queries.forEach(function(query) {
    const [key, value] = query.split("=");
    if (key) {
      params[decodeURIComponent(key)] = decodeURIComponent(value || "");
    }
  });
  return params;
}
  
// 고객 정보를 페이지에 표시하는 함수
function displayUserInfo() {
  const params = getQueryParams();
  const userInfoDiv = document.getElementById("userInfo");
  
  // 예시: 이름, 생년월일, 생시, 출생지, 결혼 여부, 이메일 정보를 표시합니다.
  const infoItems = [
    { label: "Name", value: params.name || "Not provided" },
    { label: "Birth Date", value: params.birthDate || "Not provided" },
    { label: "Birth Time", value: params.birthTime || "Not provided" },
    { label: "Birth Location", value: params.birthLocation || "Not provided" },
    { label: "Marriage Status", value: params.marriageStatus || "Not provided" },
    { label: "Email", value: params.email || "Not provided" }
  ];

  let html = "<ul>";
  infoItems.forEach(item => {
    html += `<li><strong>${item.label}:</strong> ${item.value}</li>`;
  });
  html += "</ul>";

  userInfoDiv.innerHTML = html;
}
  
// "홈으로 이동" 버튼 클릭 시 index.html로 이동하는 이벤트 핸들러
document.getElementById("goHome").addEventListener("click", function() {
  window.location.href = "index.html";
});
  
// 페이지 로드 시 고객 정보를 표시
displayUserInfo();