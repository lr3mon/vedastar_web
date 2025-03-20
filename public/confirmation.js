// 예시로 URL 쿼리 파라미터를 통해 전달된 고객 정보를 표시하는 코드입니다.
// 실제 구현 시, 전달 방식에 따라 수정하시면 됩니다.

function getQueryParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const queries = queryString.split("&");
    queries.forEach(function(query) {
      const [key, value] = query.split("=");
      if(key) {
        params[decodeURIComponent(key)] = decodeURIComponent(value || "");
      }
    });
    return params;
  }
  
  function displayUserInfo() {
    const params = getQueryParams();
    const userInfoDiv = document.getElementById("userInfo");
    
    // 예시: 이름, 성별, 생년월일, 태어난 시간, 장소, 연락처 정보를 표시합니다.
    const infoItems = [
      { label: "이름", value: params.name || "미입력" },
      { label: "성별", value: params.gender || "미입력" },
      { label: "생년월일", value: params.birthdate || "미입력" },
      { label: "양력/음력", value: params.calendar || "미입력" },
      { label: "태어난 시간", value: params.birthtime || "미입력" },
      { label: "태어난 장소", value: params.birthplace || "미입력" },
      { label: "연락처", value: params.phone || "미입력" }
    ];
  
    let html = "<ul>";
    infoItems.forEach(item => {
      html += `<li><strong>${item.label}:</strong> ${item.value}</li>`;
    });
    html += "</ul>";
  
    userInfoDiv.innerHTML = html;
  }
  
  document.getElementById("goHome").addEventListener("click", function() {
    // 홈 페이지로 이동 (예시로 index.html로 이동)
    window.location.href = "index.html";
  });
  
  // 페이지 로드 시 고객 정보 표시
  displayUserInfo();