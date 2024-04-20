import { NICKNAME_REGEX } from '../common/validate.js';
import { fetchDummyMember } from '../common/utils.js';

const profileField = document.getElementById('profile');
const nicknameField = document.getElementById('nickname');
const nicknameHelper = document.getElementById('nickname-helper');
const toastMessage = document.getElementById('toast-message');
const updateNicknameButton = document.getElementById('edit-nickname-button');
const updateProfileButton = document.getElementById('edit-profile-button');
const showWithdrawButton = document.getElementById('withdraw-modal');
const withdrawButton = document.getElementById('withdraw-ok');
const closeModalButton = document.getElementById('withdraw-close');

profileField.addEventListener('change', profileFieldChangeEvent);
nicknameField.addEventListener('blur', nicknameFieldInputEvent);
updateNicknameButton.addEventListener('click', updateNicknameButtonClickEvent);
updateProfileButton.addEventListener('click', updateProfileButtonClickEvent);
showWithdrawButton.addEventListener('click', showWithdrawModalEvent);
closeModalButton.addEventListener('click', closeModalButtonClickEvent);
withdrawButton.addEventListener('click', withdrawButtonClickEvent);

// 화면 로딩시 진행할 이벤트
window.addEventListener('load', (event) => {
  nicknameFieldInputEvent();
});

// 프로필 이미지
function profileFieldChangeEvent(event) {
  const preview = document.getElementById('preview');

  const file = profileField.files[0];
  if (!file) {
    console.log('파일이 없으');
    return;
  }

  const reader = new FileReader();
  reader.addEventListener('load', (event) => {
    preview.src = reader.result;
    console.log(`profileImageUrl => ${reader.result}`);
  }, false);

  reader.readAsDataURL(file);
}

// 닉네임 변경
async function nicknameFieldInputEvent() {
  updateNicknameButton.disabled = true;

  const value = nicknameField.value;
  let helperMessage = '';

  console.log(`now input(nickname) => ${value}`);

  if (value.trim().length === 0) {
    helperMessage = '*닉네임을 입력해주세요.';
  } else if (NICKNAME_REGEX.test(value)) {
    helperMessage = '*띄어쓰기를 없애주세요';
  } else if (value.length > 10) {
    helperMessage = '*닉네임은 최대 10자까지 작성 가능합니다.';
  } else if (await isExistNickname(value)) {
    helperMessage = '*중복된 닉네임 입니다.';
  } else {
    updateNicknameButton.disabled = false;
  }
  nicknameHelper.textContent = helperMessage;
}

async function isExistNickname(nickname) {
  console.log('fetch API :: request (nickname)');
  const members = await fetchDummyMember();

  let findMember = members.find((member) =>
    member.nickname === nickname,
  );
  return findMember !== undefined;
}

async function updateNicknameButtonClickEvent(event) {
  event.preventDefault();

  updateNicknameButton.disabled = true;

  // 토스트 메시지
  toastMessage.classList.add('active');
  setTimeout(() => {
    toastMessage.classList.remove('active');
  }, 1000);

  updateNicknameButton.disabled = false;
}

// TODO: 백엔드 구현 후 진행
async function updateProfileButtonClickEvent(event) {
  event.preventDefault();

  console.log('수정 완료 버튼 누름');

  history.back();
}

// 삭제 버튼 클릭 시 모달 열기
function showWithdrawModalEvent() {
  const modal = document.getElementById('withdrawModal');
  modal.style.display = 'block';
}

// 회원탈퇴 모달 닫기 버튼
function closeModalButtonClickEvent() {
  const modal = document.getElementById('withdrawModal');
  modal.style.display = 'none';
}

// 회원탈퇴 모달 외부 클릭 시 닫기
window.addEventListener('click', (event) => {
  const modal = document.getElementById('withdrawModal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

// TODO: 백엔드 회원 탈퇴 구현
function withdrawButtonClickEvent() {
  console.log('회원탈퇴 버튼 누름');

  // 변경해야함 일단 로그인 페이지로 이동
  window.location.href = '/';
}
