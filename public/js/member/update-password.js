import { PASSWORD_REGEX } from '../common/validate.js';
import { putFetch } from '../common/utils.js';

const passwordField = document.getElementById('password');
const passwordConfirmField = document.getElementById('password-confirm');
const passwordHelper = document.getElementById('password-helper');
const passwordConfirmHelper = document.getElementById('password-confirm-helper');
const toastMessage = document.getElementById('toast-message');
const updatePasswordButton = document.getElementById('edit-password-button');

passwordField.addEventListener('input', passwordFieldInputEvent);
passwordConfirmField.addEventListener('input', passwordConfirmFieldEvent);
updatePasswordButton.addEventListener('click', updatePasswordButtonEvent);

window.addEventListener('load', (event) => {
  checkEnableButton();
});

let fieldValidContext = {
  password: false,
  passwordConfirm: false,
};

// 비밀번호
function passwordFieldInputEvent() {
  fieldValidContext.password = false;

  const value = passwordField.value;
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
  passwordConfirmFieldEvent();
}

// 비밀번호 확인
function passwordConfirmFieldEvent() {
  fieldValidContext.passwordConfirm = false;

  const value = passwordConfirmField.value;
  const password = passwordField.value;
  let helperMessage = '';

  console.log(`now input(passwordConfirm) => ${value}`);

  if (value.trim().length === 0) {
    helperMessage = '*비밀번호를 한번 더 입력해주세요.';
  } else if (value !== password) {
    helperMessage = '*비밀번호가 다릅니다.';
  } else {
    fieldValidContext.passwordConfirm = true;
  }
  passwordConfirmHelper.textContent = helperMessage;

  checkEnableButton();
}

// 버튼을 누를 수 있나? (모든 유효성 검사 통과?)
function checkEnableButton() {
  const isAllValid = Object.values(fieldValidContext).every(valid => valid === true);
  if (isAllValid) {
    updatePasswordButton.disabled = false;
    updatePasswordButton.style.background = '#7F6AEE';
  } else {
    updatePasswordButton.disabled = true;
    updatePasswordButton.style.background = '#ACA0EB';
  }
}

async function updatePasswordButtonEvent(event) {
  event.preventDefault();
  console.log('submit 버튼 눌림');

  updatePasswordButton.disabled = true;

  const password = passwordField.value;
  // TODO: 일단 사용자 1번 기준으로함 (인증 인가 구현 완료 후 시작)
  await putFetch('/api/v1/members/1/password', { password })
    .then(() => {
      showSuccessToastMessage();
    }).catch((e) => {
      console.log(`비밀번호 변경 실패 -> ${e}`);
    });
}

function showSuccessToastMessage() {
  return new Promise((resolve) => {
    toastMessage.classList.add('active');  // 토스트 메시지 표시
    setTimeout(() => {
      toastMessage.classList.remove('active');
      resolve(); // Promise 를 해결하여 비동기 작업 완료
    }, 1000);
  });
}
