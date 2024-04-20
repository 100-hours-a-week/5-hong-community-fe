const goBackButton = document.getElementById('go-back');

// 뒤로 가기
goBackButton.addEventListener('click', () => {
  window.history.back();
});
