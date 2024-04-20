import { EMAIL_REGEX, PASSWORD_REGEX } from '../common/validate.js';
import { fetchDummyMember } from '../common/utils.js';

const emailField = document.getElementById('email');
const passwordField = document.getElementById('password');
const emailHelper = document.getElementById('email-helper');
const passwordHelper = document.getElementById('password-helper');
const loginButton = document.getElementById('login-button');

emailField.addEventListener('input', emailFieldInputEvent);
passwordField.addEventListener('input', passwordFieldInputEvent);
loginButton.addEventListener('click', loginButtonClickEvent);

window.addEventListener('load', (event) => {
  checkEnableButton();
});

let fieldValidContext = {
  email: false,
  password: false,
};

// 이메일 유효성 검사
function emailFieldInputEvent(event) {
  fieldValidContext.email = false;

  const value = event.target.value;
  let helperMessage = '';

  console.log(`now input(email) => ${value}`);

  if (value.trim().length === 0) {
    helperMessage = '*이메일을 입력해주세요.';
  } else if (!EMAIL_REGEX.test(value)) {
    helperMessage = '*올바른 이메일 주소 형식을 입력해주세요. (예:example@example.com)';
  } else {
    fieldValidContext.email = true;
  }
  emailHelper.textContent = helperMessage;

  checkEnableButton();
}

// 비밀번호 유효성 검사
function passwordFieldInputEvent(event) {
  fieldValidContext.password = false;

  const value = event.target.value;
  let helperMessage = '';

  console.log(`now input(password) => ${value}`);

  if (value.trim().length === 0) {
    helperMessage = '*비밀번호를 입력해주세요.';
  } else if (!PASSWORD_REGEX.test(value)) {
    helperMessage = '*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야합니다.';
  } else {
    fieldValidContext.password = true;
  }
  passwordHelper.textContent = helperMessage;

  checkEnableButton();
}

function checkEnableButton() {
  const isAllValid = Object.values(fieldValidContext).every(valid => valid === true);
  if (!isAllValid) {
    loginButton.disabled = true;
    loginButton.style.background = '#ACA0EB';
  } else {
    loginButton.disabled = false;
    loginButton.style.background = '#7F6AEE';
  }
}

// 로그인 버튼 눌렀을 때
async function loginButtonClickEvent(event) {
  event.preventDefault();

  const email = emailField.value;
  const password = passwordField.value;

  const members = await fetchDummyMember();
  const findMember = members.find((user) =>
    user.email === email && user.password === password,
  );

  if (!findMember) {
    return alert('아이디 또는 비밀번호가 잘못되었습니다.');
  }

  // TODO: 백엔드 구현후 완료
  window.location.href = '/main';
}
