// TODO: 로그인 되어 있으면 프로필 네비 보여주기

import { getFetch, postFetch } from './utils.js';

const profileImage = document.getElementById('profile-image');
const goBackButton = document.getElementById('go-back');
const updateProfileButton = document.getElementById('update-profile-button');
const updatePasswordButton = document.getElementById('update-password-button');
const logoutButton = document.getElementById('logout-button');

window.addEventListener('load', async (event) => {
  if (profileImage)
    await setProfileImageOrRedirectLoginPage();

  if (goBackButton)
    goBackButton.addEventListener('click', goBackHistory);

  if (updateProfileButton)
    updateProfileButton.addEventListener('click', updateProfileButtonClickEvent);

  if (updatePasswordButton)
    updatePasswordButton.addEventListener('click', updatePasswordButtonClickEvent);

  if (logoutButton)
    logoutButton.addEventListener('click', logoutButtonClickEvent);
});

// 내 정보 불러오거나 로그인 페이지로 강제로 이동
async function setProfileImageOrRedirectLoginPage() {
  const nowMemberInfo = await getFetch('/api/v1/members')
    .catch((e) => {
      location.href = '/';
    });

  profileImage.src = nowMemberInfo.profileImage;
}

// 뒤로 가기
function goBackHistory() {
  window.history.back();
}

// 프로필 수정
function updateProfileButtonClickEvent(event) {
  location.href = '/update-profile';
}

// 비밀번호 수정
function updatePasswordButtonClickEvent(event) {
  location.href = '/update-password';
}

// 로그아웃
function logoutButtonClickEvent(event) {
  postFetch('/api/v1/members/logout', { message: '더미요' })
    .then(() => {
      location.href = '/';
    })
    .catch((e) => {
      console.log(e);
    });
}
