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
    { label: "이름", value: params.name || "미입력" },
    { label: "생년월일", value: params.birthDate || "미입력" },
    { label: "생시", value: params.birthTime || "미입력" },
    { label: "출생지", value: params.birthLocation || "미입력" },
    { label: "결혼 여부", value: params.marriageStatus || "미입력" },
    { label: "이메일", value: params.email || "미입력" }
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