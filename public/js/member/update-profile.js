import { NICKNAME_REGEX } from '../common/validate.js';
import { deleteFetch, getFetch, postFetch, putFetch, uploadsImage } from '../common/utils.js';

const profileField = document.getElementById('profile');
const profileEmail = document.querySelector('.profile-email');
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

// 이미지
let imageUrl;

// 화면 로딩시 진행할 이벤트
window.addEventListener('load', async (event) => {
  await nicknameFieldInputEvent();

  await getFetch('/api/v1/members')
    .then((jsonData) => {
      const preview = document.getElementById('preview');
      preview.src = jsonData.profileImage;
      profileEmail.textContent = jsonData.email;
    })
    .catch((e) => {
      console.log(e);
    });
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
  reader.addEventListener('load', async (event) => {
    try {
      imageUrl = await uploadsImage(file);
    } catch (error) {
      console.log(`이미지 업로드 실패, ${error}`);
      return;
    }

    // preview.src = reader.result;
    // console.log(`profileImageUrl => ${reader.result}`);
    preview.src = imageUrl;
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
  } else if (await isDuplicateNickname(value)) {
    helperMessage = '*중복된 닉네임 입니다.';
  } else {
    updateNicknameButton.disabled = false;
  }
  nicknameHelper.textContent = helperMessage;
}

async function isDuplicateNickname(nickname) {
  console.log('fetch API :: request (nickname)');

  return postFetch('/api/v1/members/nickname', { nickname })
    .then(() => {
      return false;
    })
    .catch((e) => {
      // TODO: 예외 처리 세분화
      console.log(e);
      return true;
    });
}

async function updateNicknameButtonClickEvent(event) {
  event.preventDefault();

  console.log('닉네임 수정 버튼 누름');
  updateNicknameButton.disabled = true;

  const nickname = nicknameField.value;
  await putFetch('/api/v1/members/nickname', { nickname })
    .then(() => {  // 닉네임 수정 성공
      showSuccessToastMessage();
    }).catch((e) => {  // 닉네임 수정 실패
      console.log(e);
      updateNicknameButton.disabled = false;
    });
}

// 수정 완료시 이벤트
function showSuccessToastMessage() {
  return new Promise((resolve) => {
    toastMessage.classList.add('active');  // 토스트 메시지 표시
    setTimeout(() => {
      toastMessage.classList.remove('active');
      resolve(); // Promise 를 해결하여 비동기 작업 완료
    }, 1000);
  });
}

// 이미지만 변경
async function updateProfileButtonClickEvent(event) {
  event.preventDefault();

  const requestBody = {
    profileImage: imageUrl,
  };
  await putFetch('/api/v1/members/profile', requestBody)
    .then(() => {
      location.href = '/main';
    })
    .catch((e) => {
      console.log(e);
    });
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
async function withdrawButtonClickEvent() {
  console.log('회원탈퇴 버튼 누름');

  await deleteFetch('/api/v1/members')  // TODO: 일단 id 1인 회원으로
    .then(() => {
      window.location.href = '/';  // 일단 로그인 페이지로 이동
    }).catch((e) => {
      console.log(`일치하는 회원이 없음 -> ${e}`);
    });

  // 변경해야함 일단 로그인 페이지로 이동
  // window.location.href = '/';
}
