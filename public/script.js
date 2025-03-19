document.addEventListener("DOMContentLoaded", function() {
  const container = document.getElementById('form-container');

  // 폼 생성
  const form = document.createElement('form');
  form.id = "personalInfoForm";
  form.classList.add("personal-info-form");

  // 폼 타이틀
  const title = document.createElement('h1');
  title.textContent = "개인정보 수집 폼";
  form.appendChild(title);

  // 입력 필드 생성 함수
  function createInputField(labelText, inputType, inputId, inputName) {
    const label = document.createElement('label');
    label.htmlFor = inputId;
    label.textContent = labelText;
    
    const input = document.createElement('input');
    input.type = inputType;
    input.id = inputId;
    input.name = inputName;
    input.required = true;
    
    form.appendChild(label);
    form.appendChild(input);
  }

  // 성
  createInputField("성:", "text", "surname", "surname");

  // 이름
  createInputField("이름:", "text", "firstname", "firstname");

  // 성별 (라디오 버튼 그룹)
  const genderLabel = document.createElement('label');
  genderLabel.textContent = "성별:";
  form.appendChild(genderLabel);

  const radioGroup = document.createElement('div');
  radioGroup.classList.add("radio-group");

  const genders = [
    { id: "male", value: "male", label: "남성" },
    { id: "female", value: "female", label: "여성" }
  ];

  genders.forEach(g => {
    const radioInput = document.createElement('input');
    radioInput.type = "radio";
    radioInput.id = g.id;
    radioInput.name = "gender";
    radioInput.value = g.value;
    radioInput.required = true;
    
    const radioLabel = document.createElement('label');
    radioLabel.htmlFor = g.id;
    radioLabel.textContent = g.label;
    
    radioGroup.appendChild(radioInput);
    radioGroup.appendChild(radioLabel);
  });
  form.appendChild(radioGroup);

  // 생년월일
  createInputField("생년월일:", "date", "birthdate", "birthdate");

  // 태어난 시간
  createInputField("태어난 시간:", "time", "birthtime", "birthtime");

  // 태어난 위치
  createInputField("태어난 위치:", "text", "birthplace", "birthplace");

  // 제출 버튼
  const submitButton = document.createElement('button');
  submitButton.type = "submit";
  submitButton.textContent = "제출";
  form.appendChild(submitButton);

  // 폼 제출 이벤트 처리
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const formData = {
      surname: document.getElementById('surname').value,
      firstname: document.getElementById('firstname').value,
      gender: document.querySelector('input[name="gender"]:checked').value,
      birthdate: document.getElementById('birthdate').value,
      birthtime: document.getElementById('birthtime').value,
      birthplace: document.getElementById('birthplace').value
    };

    // Google Apps Script 엔드포인트로 데이터 전송
    fetch('https://script.google.com/macros/s/AKfycbzGJPsf3RXm27IqndYrffC3BrhRgpLR_iHPgCFFMx0u_bUurMmhjbmzpXbPFAOwrUaa/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      console.log("응답 상태 코드:", response.status);
      if (!response.ok) {
        console.error("서버 응답 에러:", response);
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(data => {
      console.log("서버 응답:", data);
      alert(data.message);
      form.reset();
    })
    .catch(error => {
      console.error("데이터 전송 중 오류 발생:", error);
      alert("데이터 전송 중 오류가 발생했습니다. 자세한 내용은 콘솔을 확인하세요.");
    });
  }); // end of submit event listener

  container.appendChild(form);
});